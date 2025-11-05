// ============================================
// GESTIÓN DE UI - ODISEUM V2.0
// ============================================

/* === GESTIÓN DE Z-INDEX DE POPUPS === */
let currentZIndex = 1000;

function bringToFront(popup) {
    currentZIndex++;
    popup.style.zIndex = currentZIndex;
}

function setupPopupZIndex() {
    const popups = document.querySelectorAll('.window.interface');
    popups.forEach(popup => {
        popup.addEventListener('mousedown', () => {
            bringToFront(popup);
        });
    });
}

/* === SISTEMA DE ACORDEONES MÓVIL === */
let currentOpenAccordion = null;

function toggleMobileAccordion(section) {
    const header = event.currentTarget;
    const content = document.getElementById(`mobile-accordion-${section}`);

    // Si ya estaba abierto, cerrarlo
    if (currentOpenAccordion === section) {
        header.classList.remove('active');
        content.classList.remove('active');
        currentOpenAccordion = null;
        return;
    }

    // Cerrar el acordeón previamente abierto
    if (currentOpenAccordion) {
        const prevHeader = document.querySelector(`[onclick="toggleMobileAccordion('${currentOpenAccordion}')"]`);
        const prevContent = document.getElementById(`mobile-accordion-${currentOpenAccordion}`);
        if (prevHeader) prevHeader.classList.remove('active');
        if (prevContent) prevContent.classList.remove('active');
    }

    // Abrir el nuevo acordeón
    header.classList.add('active');
    content.classList.add('active');
    currentOpenAccordion = section;

    // Si es el mapa, moverlo al contenedor del acordeón
    if (section === 'map') {
        const mapContainer = document.getElementById('ship-map-container');
        const mapAccordion = document.getElementById('mobile-accordion-map');
        if (mapContainer && mapAccordion) {
            mapAccordion.appendChild(mapContainer);
            mapContainer.style.display = 'flex';
        }
    }
}

function initializeMobileView() {
    const isMobile = window.innerWidth <= 768;
    const mobileAccordion = document.getElementById('mobile-accordion');
    const mobileBottomBar = document.getElementById('mobile-bottom-bar');
    const mobileTitleBar = document.querySelector('.title-bar-mobile');

    if (isMobile) {
        // Mostrar elementos móviles
        if (mobileAccordion) mobileAccordion.style.display = 'flex';
        if (mobileBottomBar) mobileBottomBar.style.display = 'flex';
        if (mobileTitleBar) mobileTitleBar.style.display = 'flex';

        // Llenar acordeones
        updateMobileResources();
        updateMobileCrew();
        updateMobileLogbook();
        updateMobileTerminal();

        // Sincronizar valores con desktop
        syncMobileValues();

        // Centrar popups
        document.querySelectorAll('.window.interface').forEach(popup => {
            popup.style.position = 'fixed';
            popup.style.left = '50%';
            popup.style.top = '50%';
            popup.style.transform = 'translate(-50%, -50%)';

            // El popup de tripulante debe ser pantalla completa en móvil
            if (popup.id === 'crew-management-popup') {
                popup.style.width = '100vw';
                popup.style.height = '100vh';
                popup.style.maxWidth = '100vw';
                popup.style.maxHeight = '100vh';
                popup.style.margin = '0';
                popup.style.borderRadius = '0';
            } else {
                popup.style.maxWidth = '90vw';
                popup.style.maxHeight = '90vh';
            }

            popup.style.overflow = 'auto';
        });
    } else {
        // Ocultar elementos móviles - handled by CSS .mobile-only
        if (mobileAccordion) mobileAccordion.style.display = 'none';
        if (mobileBottomBar) mobileBottomBar.style.display = 'none';
        if (mobileTitleBar) mobileTitleBar.style.display = 'none';
    }
}

function updateMobileResources() {
    const container = document.getElementById('resources-mobile-container');
    if (!container) return;

    const resources = [
        { name: 'Energía', indicator: 'indicator-energy', value: 'resource-strip-energy' },
        { name: 'Alimentos', indicator: 'indicator-food', value: 'resource-strip-food' },
        { name: 'Agua', indicator: 'indicator-water', value: 'resource-strip-water' },
        { name: 'Oxígeno', indicator: 'indicator-oxygen', value: 'resource-strip-oxygen' },
        { name: 'Medicinas', indicator: 'indicator-medicine', value: 'resource-strip-medicine' },
        { name: 'Datos', indicator: 'indicator-data', value: 'resource-strip-data' },
        { name: 'Combustible', indicator: 'indicator-fuel', value: 'resource-strip-fuel' }
    ];

    let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
    resources.forEach(resource => {
        const valueElem = document.getElementById(resource.value);
        const indicatorElem = document.getElementById(resource.indicator);
        const value = valueElem ? valueElem.textContent : '0/0';
        const indicatorClass = indicatorElem ? indicatorElem.className : 'resource-indicator full';

        html += `
            <div style="display: flex; align-items: center; gap: 12px; padding: 8px; background: rgba(0, 255, 65, 0.05); border: 1px solid rgba(0, 255, 65, 0.2); border-radius: 4px;">
                <span class="${indicatorClass}"></span>
                <span style="flex: 1; font-family: var(--font-monaco); font-size: 14px; color: var(--color-terminal-green);">${resource.name}</span>
                <span style="font-family: var(--font-monaco); font-size: 12px; color: var(--color-terminal-green);">${value}</span>
            </div>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
}

function updateMobileCrew() {
    const container = document.getElementById('crew-mobile-container');
    if (!container) return;

    const crewCardsContainer = document.getElementById('crew-cards-container');
    if (crewCardsContainer) {
        container.innerHTML = crewCardsContainer.innerHTML;
    }
}

function updateMobileLogbook() {
    const container = document.getElementById('logbook-mobile-container');
    if (!container) return;

    const logbookEntries = document.getElementById('logbook-entries');
    if (logbookEntries) {
        container.innerHTML = logbookEntries.innerHTML;
    }
}

function updateMobileTerminal() {
    const container = document.getElementById('terminal-notifications-mobile');
    if (!container) return;

    const terminalNotifications = document.getElementById('terminal-notifications');
    if (terminalNotifications) {
        container.innerHTML = terminalNotifications.innerHTML;
    }
}

function syncMobileValues() {
    // Sync timer
    const trancheTimer = document.getElementById('tranche-timer');
    const mobileTrancheTimer = document.getElementById('mobile-tranche-timer');
    if (trancheTimer && mobileTrancheTimer) {
        mobileTrancheTimer.textContent = trancheTimer.textContent;
    }

    // Sync calendar
    const calendar = document.getElementById('calendar');
    const mobileCalendar = document.getElementById('mobile-calendar');
    if (calendar && mobileCalendar) {
        mobileCalendar.textContent = calendar.textContent;
    }

    // Sync speed display (for bottom bar if needed)
    const navSpeedDisplay = document.getElementById('nav-speed-display');
    const navSpeedDisplayMobile = document.getElementById('nav-speed-display-mobile');
    if (navSpeedDisplay && navSpeedDisplayMobile) {
        navSpeedDisplayMobile.textContent = navSpeedDisplay.textContent;
    }

    // Sync speed slider
    const navSpeedSlider = document.getElementById('nav-speed-slider');
    const navSpeedSliderMobile = document.getElementById('nav-speed-slider-mobile');
    if (navSpeedSlider && navSpeedSliderMobile) {
        navSpeedSliderMobile.value = navSpeedSlider.value;
    }

    // Sync voyage progress
    const voyageProgressFill = document.getElementById('voyage-progress-fill');
    const mobileVoyageFill = document.getElementById('mobile-voyage-fill');
    if (voyageProgressFill && mobileVoyageFill) {
        mobileVoyageFill.style.width = voyageProgressFill.style.width;
    }

    // Sync tranche count (assuming it's available somewhere)
    // This will be updated by game loop, placeholder for now
    const mobileTrancheCount = document.getElementById('mobile-tranche-count');
    if (mobileTrancheCount && typeof currentTranche !== 'undefined' && typeof totalTranches !== 'undefined') {
        mobileTrancheCount.textContent = `${currentTranche}/${totalTranches}`;
    }
}

// Inicializar vista móvil al cargar y redimensionar
window.addEventListener('resize', initializeMobileView);

/* === GESTIÓN DE VENTANAS ARRASTRABLES === */
function setupDraggableWindows() {
    const windows = document.querySelectorAll('.window');
    windows.forEach(window => {
        const titleBar = window.querySelector('.title-bar');
        if (titleBar) {
            makeDraggable(window, titleBar);
        }
    });
}

function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    handle.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
        element.style.transform = 'none';
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

/* === GESTIÓN DE POPUPS === */
function openResourcesPopup() {
    document.getElementById('resources-management-popup').style.display = 'block';
    gameLoop.updateAllResources();
}

function closeResourcesPopup() {
    document.getElementById('resources-management-popup').style.display = 'none';
}

function openCrewsPopup() {
    document.getElementById('crews-management-popup').style.display = 'block';
}

function closeCrewsPopup() {
    document.getElementById('crews-management-popup').style.display = 'none';
}

function openTripPopup() {
    document.getElementById('trip-management-popup').style.display = 'block';
    gameLoop.updateTripProgress();
}

function closeTripPopup() {
    document.getElementById('trip-management-popup').style.display = 'none';
}

function openLogbookPopup() {
    document.getElementById('logbook-popup').style.display = 'block';
    logbook.updateUI();
}

function closeLogbookPopup(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    document.getElementById('logbook-popup').style.display = 'none';
}

function openCrewManagementPopup(name) {
    const crewMember = crewMembers.find(c => c.name === name);
    if (!crewMember) return;
    
    document.getElementById('crew-name').textContent = crewMember.name;
    document.getElementById('crew-age').textContent = crewMember.initialAge;
    document.getElementById('crew-bio-age').textContent = crewMember.biologicalAge.toFixed(1);
    document.getElementById('crew-position').textContent = crewMember.position;
    document.getElementById('crew-state').textContent = crewMember.state;
    document.getElementById('crew-activity').textContent = crewMember.currentActivity;
    document.getElementById('crew-mood').textContent = crewMember.mood;
    document.getElementById('crew-img').src = crewMember.img;
    document.getElementById('crew-img').alt = crewMember.name;
    
    document.getElementById('food-need-amount').textContent = Math.round(crewMember.foodNeed);
    document.getElementById('health-need-amount').textContent = Math.round(crewMember.healthNeed);
    document.getElementById('waste-need-amount').textContent = Math.round(crewMember.wasteNeed);
    document.getElementById('entertainment-need-amount').textContent = Math.round(crewMember.entertainmentNeed);
    document.getElementById('rest-need-amount').textContent = Math.round(crewMember.restNeed);

    const benefitReadout = document.getElementById('crew-benefit-readout');
    if (benefitReadout) {
        const benefitText = crewMember.getAwakeBenefitDescription();
        benefitReadout.textContent = benefitText || 'Beneficio inactivo (encapsulado).';
    }

    // Mostrar información personal
    const personalInfoContainer = document.getElementById('crew-personal-info');
    if (personalInfoContainer && crewMember.leftBehind) {
        personalInfoContainer.innerHTML = `
            <h4>💔 Información Personal</h4>
            <div class="personal-info-item">
                <strong>Dejó atrás:</strong>
                <p>${crewMember.leftBehind.family}</p>
            </div>
            <div class="personal-info-item">
                <strong>Últimas palabras:</strong>
                <p>${crewMember.leftBehind.lastWords}</p>
            </div>
            <div class="personal-info-item">
                <strong>Sueño en Nueva Tierra:</strong>
                <p>${crewMember.leftBehind.dream}</p>
            </div>
            <div class="personal-info-item">
                <strong>Actitud ante la muerte:</strong>
                <p>${crewMember.fearOfDeath}</p>
            </div>
        `;
    }
    
    // Mostrar log personal
    const logContainer = document.getElementById('crew-personal-log-content');
    logContainer.innerHTML = '';
    
    if (crewMember.personalLog.length === 0) {
        logContainer.innerHTML = '<p style="color: #999;">No hay entradas en el registro personal.</p>';
    } else {
        const recentLogs = crewMember.personalLog.slice(-10).reverse();
        recentLogs.forEach(log => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'personal-log-entry';
            if (log.entry.includes('[IA]')) {
                entryDiv.classList.add('ai-generated');
            }
            
            entryDiv.innerHTML = `
                <div class="log-day">Año ${log.year.toFixed(1)}</div>
                <div class="log-text">${log.entry}</div>
                <div class="log-metadata">Actividad: ${log.activity} | Ánimo: ${log.mood}</div>
            `;
            
            logContainer.appendChild(entryDiv);
        });
    }
    
    document.getElementById('crew-management-popup').style.display = 'block';
}

function closeCrewManagementPopup(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    document.getElementById('crew-management-popup').style.display = 'none';
}

/* === SISTEMA DE TABS === */
function switchCrewTab(tabName) {
    // Ocultar todos los contenidos de tabs
    const allTabs = document.querySelectorAll('.crew-tab-content');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Desactivar todos los botones de tabs
    const allButtons = document.querySelectorAll('.crew-tab-btn');
    allButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Activar el tab seleccionado
    const selectedTab = document.getElementById(`crew-tab-${tabName}`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Activar el botón correspondiente
    const buttons = document.querySelectorAll('.crew-tab-btn');
    buttons.forEach(btn => {
        if (btn.textContent.includes('Necesidades Vitales') && tabName === 'needs') {
            btn.classList.add('active');
        } else if (btn.textContent.includes('Información Personal') && tabName === 'personal') {
            btn.classList.add('active');
        } else if (btn.textContent.includes('Reporte') && tabName === 'report') {
            btn.classList.add('active');
        } else if (btn.textContent.includes('Historia IA') && tabName === 'story') {
            btn.classList.add('active');
        }
    });
}

/* === GENERACIÓN DE HISTORIA CON IA === */
function generateCrewStory() {
    const crewName = document.getElementById('crew-name').textContent;
    const crewMember = crewMembers.find(c => c.name === crewName);
    if (!crewMember) return;

    const storyContainer = document.getElementById('crew-ai-story-content');

    // Mostrar mensaje de carga
    storyContainer.innerHTML = '<p style="color: #666; font-style: italic;">Generando historia...</p>';

    // Simular generación con delay
    setTimeout(() => {
        const story = generateAIStory(crewMember);
        storyContainer.innerHTML = `<p>${story}</p>`;

        // Agregar al log personal
        crewMember.addToPersonalLog(`[IA] Historia generada: ${story.substring(0, 100)}...`);
    }, 1500);
}

function generateAIStory(crewMember) {
    // Aquí se generará la historia basada en los datos del tripulante
    const stories = {
        intro: [
            `${crewMember.name} recuerda el día en que tomó la decisión de unirse a la misión Odiseum.`,
            `La vida de ${crewMember.name} cambió para siempre cuando aceptó formar parte de este viaje interestelar.`,
            `${crewMember.name} nunca imaginó que su destino estaría entre las estrellas.`,
        ],
        background: [
            `Nacido(a) en una época de grandes cambios, ${crewMember.name} siempre sintió la llamada de lo desconocido.`,
            `Desde joven, ${crewMember.name} mostró una determinación inquebrantable.`,
            `La familia de ${crewMember.name} nunca entendió completamente su vocación.`,
        ],
        sacrifice: [
            `Dejó atrás ${crewMember.leftBehind?.family || 'todo lo que conocía'}, sabiendo que probablemente nunca volvería a verlos.`,
            `El sacrificio fue inmenso: ${crewMember.leftBehind?.lastWords || 'las últimas palabras aún resuenan en su mente'}.`,
            `A veces, en las noches silenciosas de la nave, piensa en lo que dejó atrás.`,
        ],
        mission: [
            `Como ${crewMember.position}, su papel es crucial para la supervivencia de toda la tripulación.`,
            `Cada día en la nave es un desafío nuevo, pero ${crewMember.name} nunca ha dudado de su misión.`,
            `La responsabilidad pesa sobre sus hombros, pero también le da propósito.`,
        ],
        dreams: [
            `Su mayor sueño es ${crewMember.leftBehind?.dream || 'ver Nueva Tierra con sus propios ojos'}.`,
            `A pesar de las dificultades, mantiene viva la esperanza de un futuro mejor.`,
            `${crewMember.fearOfDeath ? `Su actitud ante la muerte refleja: ${crewMember.fearOfDeath}` : 'Ha hecho las paces con su mortalidad.'}`,
        ],
        present: [
            `Actualmente, ${crewMember.name} se encuentra ${crewMember.state === 'Despierto' ? 'activo(a) y cumpliendo con sus deberes' : 'en criostasis, soñando con el futuro'}.`,
            `Su estado de ánimo es ${crewMember.mood}, lo que refleja el peso del viaje.`,
            `Día tras día, ${crewMember.name} contribuye al éxito de la misión con dedicación incansable.`,
        ],
        conclusion: [
            `La historia de ${crewMember.name} es una de sacrificio, esperanza y determinación inquebrantable.`,
            `En este viaje hacia lo desconocido, ${crewMember.name} representa lo mejor de la humanidad.`,
            `El legado de ${crewMember.name} vivirá en las generaciones que alcancen Nueva Tierra.`,
        ]
    };

    // Construir la historia seleccionando elementos aleatorios de cada categoría
    const storyParts = [
        stories.intro[Math.floor(Math.random() * stories.intro.length)],
        stories.background[Math.floor(Math.random() * stories.background.length)],
        stories.sacrifice[Math.floor(Math.random() * stories.sacrifice.length)],
        stories.mission[Math.floor(Math.random() * stories.mission.length)],
        stories.dreams[Math.floor(Math.random() * stories.dreams.length)],
        stories.present[Math.floor(Math.random() * stories.present.length)],
        stories.conclusion[Math.floor(Math.random() * stories.conclusion.length)]
    ];

    return storyParts.join('\n\n');
}

/* === GESTIÓN DE TRIPULACIÓN === */
function crewControlsAvailable() {
    if (typeof gameLoop === 'undefined' || !gameLoop) return false;
    if (gameLoop.gameState !== GAME_STATES.IN_TRANCHE) return false;

    if (typeof eventSystem !== 'undefined' && eventSystem && eventSystem.activeEvent) {
        return false;
    }

    return true;
}

function manageFoodNeed() {
    if (!crewControlsAvailable()) return;

    const crewName = document.getElementById('crew-name').textContent;
    const crewMember = crewMembers.find(c => c.name === crewName);

    if (!crewMember || !crewMember.isAlive) return;
    
    if (Food.quantity >= 10) {
        Food.consume(10);
        crewMember.foodNeed = Math.min(100, crewMember.foodNeed + 30);
        Food.updateResourceUI();
        crewMember.updateMiniCard();
        gameLoop.updateCrewPopupIfOpen();
        new Notification(`${crewName} ha sido alimentado`, NOTIFICATION_TYPES.INFO);
    } else {
        new Notification('No hay suficiente comida', NOTIFICATION_TYPES.ALERT);
    }
}

function manageHealthNeed() {
    if (!crewControlsAvailable()) return;

    const crewName = document.getElementById('crew-name').textContent;
    const crewMember = crewMembers.find(c => c.name === crewName);

    if (!crewMember || !crewMember.isAlive) return;
    
    if (Medicine.quantity >= 5) {
        Medicine.consume(5);
        crewMember.healthNeed = Math.min(100, crewMember.healthNeed + 25);
        Medicine.updateResourceUI();
        crewMember.updateMiniCard();
        gameLoop.updateCrewPopupIfOpen();
        new Notification(`${crewName} ha recibido atención médica`, NOTIFICATION_TYPES.INFO);
    } else {
        new Notification('No hay suficientes medicinas', NOTIFICATION_TYPES.ALERT);
    }
}

function manageWasteNeed() {
    if (!crewControlsAvailable()) return;

    const crewName = document.getElementById('crew-name').textContent;
    const crewMember = crewMembers.find(c => c.name === crewName);

    if (!crewMember || !crewMember.isAlive) return;
    
    if (Water.quantity >= 3) {
        Water.consume(3);
        crewMember.wasteNeed = Math.max(0, crewMember.wasteNeed - 40);
        Water.updateResourceUI();
        crewMember.updateMiniCard();
        gameLoop.updateCrewPopupIfOpen();
        new Notification(`${crewName} ha usado las instalaciones de higiene`, NOTIFICATION_TYPES.INFO);
    } else {
        new Notification('No hay suficiente agua', NOTIFICATION_TYPES.ALERT);
    }
}

function manageEntertainmentNeed() {
    if (!crewControlsAvailable()) return;

    const crewName = document.getElementById('crew-name').textContent;
    const crewMember = crewMembers.find(c => c.name === crewName);

    if (!crewMember || !crewMember.isAlive) return;
    
    if (Data.quantity >= 5) {
        Data.consume(5);
        crewMember.entertainmentNeed = Math.min(100, crewMember.entertainmentNeed + 35);
        Data.updateResourceUI();
        crewMember.updateMiniCard();
        gameLoop.updateCrewPopupIfOpen();
        new Notification(`${crewName} ha accedido al entretenimiento`, NOTIFICATION_TYPES.INFO);
    } else {
        new Notification('No hay suficientes datos de entretenimiento', NOTIFICATION_TYPES.ALERT);
    }
}

function manageRestNeed() {
    if (!crewControlsAvailable()) return;

    const crewName = document.getElementById('crew-name').textContent;
    const crewMember = crewMembers.find(c => c.name === crewName);

    if (!crewMember || !crewMember.isAlive) return;
    
    crewMember.restNeed = Math.min(100, crewMember.restNeed + 50);
    crewMember.updateMiniCard();
    gameLoop.updateCrewPopupIfOpen();
    new Notification(`${crewName} ha descansado`, NOTIFICATION_TYPES.INFO);
}

function updateWakeSleep(name) {
    if (!crewControlsAvailable()) return;

    const crewMember = crewMembers.find(c => c.name === name);
    if (!crewMember || !crewMember.isAlive) return;

    const oldState = crewMember.state;
    crewMember.state = crewMember.state === 'Despierto' ? 'Encapsulado' : 'Despierto';
    crewMember.updateConsoleCrewState();
    crewMember.updateMiniCard();

    if (typeof awakeBenefitSystem !== 'undefined' && awakeBenefitSystem) {
        awakeBenefitSystem.refreshState(crewMembers);
        if (typeof updateVoyageVisualizer === 'function') {
            updateVoyageVisualizer();
        }
    }

    logbook.addEntry(
        `${name} cambió de ${oldState} a ${crewMember.state}`,
        LOG_TYPES.EVENT
    );
    
    new Notification(`${name} ahora está ${crewMember.state}`, NOTIFICATION_TYPES.INFO);
}

function updateWakeSleepFromPopup() {
    const crewName = document.getElementById('crew-name').textContent;
    updateWakeSleep(crewName);
    
    const crewMember = crewMembers.find(c => c.name === crewName);
    if (crewMember) {
        document.getElementById('crew-state').textContent = crewMember.state;
    }
}

/* === SISTEMA DE SONIDO === */
let tramoAudio = null; // Variable global para controlar el audio de tramo

function playClickSound() {
    try {
        const audio = new Audio('assets/sounds/button-needs.aac');
        audio.volume = 0.3;
        audio.play().catch(err => console.log('Audio playback failed:', err));
    } catch (err) {
        console.log('Audio error:', err);
    }
}

function playTrancheSound() {
    try {
        // Detener audio anterior si existe
        if (tramoAudio) {
            tramoAudio.pause();
            tramoAudio.currentTime = 0;
        }

        tramoAudio = new Audio('assets/sounds/tramo.mp3');
        tramoAudio.volume = 0.4;
        tramoAudio.loop = true; // Loop infinito
        tramoAudio.play().catch(err => console.log('Audio playback failed:', err));
    } catch (err) {
        console.log('Audio error:', err);
    }
}

function stopTrancheSound() {
    if (tramoAudio) {
        tramoAudio.pause();
        tramoAudio.currentTime = 0;
    }
}

function playEventAlarmSound() {
    try {
        const audio = new Audio('assets/sounds/alarm-event.mp3');
        audio.volume = 0.5;
        audio.play().catch(err => console.log('Audio playback failed:', err));
    } catch (err) {
        console.log('Audio error:', err);
    }
}

/* === GESTIÓN RÁPIDA DESDE MINI-CARDS === */
function quickManage(crewName, type) {
    if (!crewControlsAvailable()) return;

    const crewMember = crewMembers.find(c => c.name === crewName);
    if (!crewMember || !crewMember.isAlive) return;

    if (type === 'food') {
        if (Food.quantity >= 10) {
            playClickSound();
            Food.consume(10);
            crewMember.foodNeed = Math.min(100, crewMember.foodNeed + 30);
            Food.updateResourceUI();
            crewMember.updateMiniCard();
            if (typeof gameLoop !== 'undefined' && gameLoop) {
                gameLoop.updateCrewPopupIfOpen();
            }
        } else {
            new Notification('No hay suficiente comida', NOTIFICATION_TYPES.ALERT);
        }
    } else if (type === 'health') {
        if (Medicine.quantity >= 5) {
            playClickSound();
            Medicine.consume(5);
            crewMember.healthNeed = Math.min(100, crewMember.healthNeed + 25);
            Medicine.updateResourceUI();
            crewMember.updateMiniCard();
            if (typeof gameLoop !== 'undefined' && gameLoop) {
                gameLoop.updateCrewPopupIfOpen();
            }
        } else {
            new Notification('No hay suficientes medicinas', NOTIFICATION_TYPES.ALERT);
        }
    }
}

/* === CONTROL DE VELOCIDAD === */
function updateSpeedDisplay() {
    const speedValue = document.getElementById('speed-control').value;
    document.getElementById('speed-value').textContent = speedValue;

    updateVoyageForecastDisplay();
}

/* === MENSAJES CUÁNTICOS === */
function closeQuantumMessages() {
    const overlay = document.getElementById('quantum-message-overlay');
    if (overlay) {
        overlay.remove();
    }
}

/* === ORDENAMIENTO === */
function onSortChange() {
    const select = document.getElementById('crew-sort-select');
    sortingSystem.applySorting(select.value);
}

/* === CONTROL DE INTERACCIONES SEGÚN ESTADO DEL JUEGO === */
function disableAllInteractions() {
    // Deshabilitar todos los botones de gestión de necesidades
    const manageButtons = document.querySelectorAll('.manage-btn');
    if (manageButtons && manageButtons.length > 0) {
        manageButtons.forEach(btn => {
            if (btn) {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
                btn.style.pointerEvents = 'none';
            }
        });
    }

    setCrewCardButtonsState(true);

    // Deshabilitar botón de cambiar estado
    const wakeSleeepBtn = document.getElementById('wake-sleep-btn');
    if (wakeSleeepBtn) {
        wakeSleeepBtn.disabled = true;
        wakeSleeepBtn.style.opacity = '0.5';
        wakeSleeepBtn.style.cursor = 'not-allowed';
        wakeSleeepBtn.style.pointerEvents = 'none';
    }

    // Deshabilitar slider de velocidad
    const speedControl = document.getElementById('speed-control');
    if (speedControl) {
        speedControl.disabled = true;
        speedControl.style.opacity = '0.5';
        speedControl.style.cursor = 'not-allowed';
    }
}

function enableInteractionsBetweenTranches() {
    // Deshabilitar botones de gestión de necesidades (NO se pueden usar entre tramos)
    const manageButtons = document.querySelectorAll('.manage-btn');
    if (manageButtons && manageButtons.length > 0) {
        manageButtons.forEach(btn => {
            if (btn) {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
                btn.style.pointerEvents = 'none';
            }
        });
    }

    setCrewCardButtonsState(true);

    // Deshabilitar botón de cambiar estado (NO se puede usar entre tramos)
    const wakeSleeepBtn = document.getElementById('wake-sleep-btn');
    if (wakeSleeepBtn) {
        wakeSleeepBtn.disabled = true;
        wakeSleeepBtn.style.opacity = '0.5';
        wakeSleeepBtn.style.cursor = 'not-allowed';
        wakeSleeepBtn.style.pointerEvents = 'none';
    }

    // HABILITAR slider de velocidad (SÍ se puede usar entre tramos)
    const speedControl = document.getElementById('speed-control');
    if (speedControl) {
        speedControl.disabled = false;
        speedControl.style.opacity = '1';
        speedControl.style.cursor = 'pointer';
        speedControl.style.pointerEvents = 'auto';
    }

    // Habilitar slider de navegación
    const navSpeedSlider = document.getElementById('nav-speed-slider');
    if (navSpeedSlider) {
        navSpeedSlider.disabled = false;
        navSpeedSlider.style.opacity = '1';
        navSpeedSlider.style.cursor = 'pointer';
        navSpeedSlider.style.pointerEvents = 'auto';
    }
}

function enableAllInteractions() {
    // Habilitar todos los botones de gestión de necesidades
    const manageButtons = document.querySelectorAll('.manage-btn');
    if (manageButtons && manageButtons.length > 0) {
        manageButtons.forEach(btn => {
            if (btn) {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                btn.style.pointerEvents = 'auto';
            }
        });
    }

    setCrewCardButtonsState(false);

    // Habilitar botón de cambiar estado
    const wakeSleeepBtn = document.getElementById('wake-sleep-btn');
    if (wakeSleeepBtn) {
        wakeSleeepBtn.disabled = false;
        wakeSleeepBtn.style.opacity = '1';
        wakeSleeepBtn.style.cursor = 'pointer';
        wakeSleeepBtn.style.pointerEvents = 'auto';
    }

    // Deshabilitar slider de velocidad (NO se puede cambiar durante el tramo)
    const speedControl = document.getElementById('speed-control');
    if (speedControl) {
        speedControl.disabled = true;
        speedControl.style.opacity = '0.5';
        speedControl.style.cursor = 'not-allowed';
        speedControl.style.pointerEvents = 'none';
    }

    // Deshabilitar slider de navegación durante tramo
    const navSpeedSlider = document.getElementById('nav-speed-slider');
    if (navSpeedSlider) {
        navSpeedSlider.disabled = true;
        navSpeedSlider.style.opacity = '0.5';
        navSpeedSlider.style.cursor = 'not-allowed';
        navSpeedSlider.style.pointerEvents = 'none';
    }
}

function setCrewCardButtonsState(disabled) {
    const quickButtons = document.querySelectorAll('.crew-card-btn');
    quickButtons.forEach(btn => {
        btn.disabled = disabled;
        btn.classList.toggle('disabled', disabled);
    });
}

function computeVoyageForecast(speedValue) {
    const speed = Number(speedValue) || 0;
    const navigatorAwake =
        typeof awakeBenefitSystem !== 'undefined' &&
        awakeBenefitSystem &&
        awakeBenefitSystem.isNavigatorAwake;

    const multiplier = navigatorAwake
        ? awakeBenefitSystem.getNavigatorSpeedMultiplier()
        : 1;

    const distancePerTick = (speed / 100) * 20 * multiplier;
    const distancePerTranche = distancePerTick * TICKS_PER_TRANCHE;
    const remainingDistance = Math.max(0, TOTAL_MISSION_DISTANCE - distanceTraveled);
    const estimatedTranches = distancePerTranche > 0
        ? Math.ceil(remainingDistance / distancePerTranche)
        : 0;

    return {
        navigatorAwake,
        multiplier,
        distancePerTranche,
        estimatedTranches
    };
}

function updateVoyageForecastDisplay() {
    const speedControl = document.getElementById('speed-control');
    const speedValue = speedControl
        ? parseInt(speedControl.value, 10)
        : (gameLoop ? gameLoop.currentSpeed : 0);

    const speedReadout = document.getElementById('voyage-speed-value');
    if (speedReadout) {
        speedReadout.textContent = `${Number.isFinite(speedValue) ? speedValue : 0}%`;
    }

    const forecastElement = document.getElementById('voyage-forecast');
    const nodesContainer = document.getElementById('voyage-node-container');
    if (!forecastElement && !nodesContainer) {
        return;
    }

    const { navigatorAwake, distancePerTranche, estimatedTranches } = computeVoyageForecast(speedValue);

    const completedTranches = typeof timeSystem !== 'undefined'
        ? timeSystem.getCurrentTranche()
        : 0;
    const missionActive = gameLoop && gameLoop.missionStarted;
    const inTranche = gameLoop && gameLoop.gameState === GAME_STATES.IN_TRANCHE;

    const nodes = [];

    for (let i = 1; i <= completedTranches; i++) {
        nodes.push(`<div class="voyage-node completed"><span class="voyage-node-label">T${i}</span></div>`);
    }

    if (missionActive) {
        const label = inTranche
            ? `T${completedTranches + 1}`
            : (completedTranches > 0 ? `T${completedTranches}` : 'Listo');
        const stateClass = inTranche ? 'active' : 'standby';
        nodes.push(`<div class="voyage-node ${stateClass}"><span class="voyage-node-label">${label}</span></div>`);
    }

    if (navigatorAwake && estimatedTranches > 0) {
        const forecastCount = Math.min(estimatedTranches, 6);
        for (let i = 1; i <= forecastCount; i++) {
            nodes.push(`<div class="voyage-node forecast"><span class="voyage-node-label">+${i}</span></div>`);
        }
    }

    if (nodes.length === 0) {
        nodes.push('<div class="voyage-node standby"><span class="voyage-node-label">Inicio</span></div>');
    }

    if (nodesContainer) {
        nodesContainer.innerHTML = nodes.join('');
    }

    if (forecastElement) {
        if (!navigatorAwake) {
            forecastElement.textContent = 'Activa a Lt. Johnson para obtener proyección de tramos.';
            forecastElement.classList.add('inactive');
        } else {
            const uaPerTranche = Math.max(0, Math.round(distancePerTranche));
            forecastElement.textContent = `Próximos ${estimatedTranches} tramos estimados • ${uaPerTranche} UA/tramo`;
            forecastElement.classList.remove('inactive');
        }
    }
}

function updateVoyageVisualizer() {
    const progressFill = document.getElementById('voyage-progress-fill');
    if (progressFill) {
        const progressPercent = TOTAL_MISSION_DISTANCE > 0
            ? Math.min(100, (distanceTraveled / TOTAL_MISSION_DISTANCE) * 100)
            : 0;
        progressFill.style.width = `${progressPercent}%`;
    }

    const distanceCurrent = document.getElementById('voyage-distance-current');
    if (distanceCurrent) {
        distanceCurrent.textContent = Math.round(distanceTraveled);
    }

    const distanceTotal = document.getElementById('voyage-distance-total');
    if (distanceTotal) {
        distanceTotal.textContent = TOTAL_MISSION_DISTANCE;
    }

    updateVoyageForecastDisplay();
}

/* === CONTROLES RÁPIDOS DE TRIPULACIÓN === */
/**
 * Encapsula a todos los tripulantes vivos
 */
function sleepAllCrew() {
    if (!crewControlsAvailable()) {
        new Notification('No se puede cambiar el estado durante el tramo', NOTIFICATION_TYPES.ALERT);
        return;
    }

    if (typeof crewMembers === 'undefined' || !crewMembers) return;

    let count = 0;
    crewMembers.forEach(crew => {
        if (crew.isAlive && crew.state === 'Despierto') {
            crew.state = 'Encapsulado';
            crew.updateConsoleCrewState();
            crew.updateMiniCard();
            count++;
        }
    });

    // Refrescar sistema de beneficios
    if (typeof awakeBenefitSystem !== 'undefined' && awakeBenefitSystem) {
        awakeBenefitSystem.refreshState(crewMembers);
        if (typeof updateVoyageVisualizer === 'function') {
            updateVoyageVisualizer();
        }
    }

    // Actualizar panel de tripulación si está abierto
    if (typeof panelManager !== 'undefined' && panelManager.isPanelOpen('crew')) {
        panelManager.updateCrewPanel();
    }

    logbook.addEntry(
        `${count} tripulantes encapsulados mediante control rápido`,
        LOG_TYPES.EVENT
    );

    new Notification(`${count} tripulantes encapsulados`, NOTIFICATION_TYPES.SUCCESS);
}

/**
 * Despierta a todos los tripulantes vivos
 */
function wakeAllCrew() {
    if (!crewControlsAvailable()) {
        new Notification('No se puede cambiar el estado durante el tramo', NOTIFICATION_TYPES.ALERT);
        return;
    }

    if (typeof crewMembers === 'undefined' || !crewMembers) return;

    let count = 0;
    crewMembers.forEach(crew => {
        if (crew.isAlive && crew.state === 'Encapsulado') {
            crew.state = 'Despierto';
            crew.updateConsoleCrewState();
            crew.updateMiniCard();
            count++;
        }
    });

    // Refrescar sistema de beneficios
    if (typeof awakeBenefitSystem !== 'undefined' && awakeBenefitSystem) {
        awakeBenefitSystem.refreshState(crewMembers);
        if (typeof updateVoyageVisualizer === 'function') {
            updateVoyageVisualizer();
        }
    }

    // Actualizar panel de tripulación si está abierto
    if (typeof panelManager !== 'undefined' && panelManager.isPanelOpen('crew')) {
        panelManager.updateCrewPanel();
    }

    logbook.addEntry(
        `${count} tripulantes despertados mediante control rápido`,
        LOG_TYPES.EVENT
    );

    new Notification(`${count} tripulantes despertados`, NOTIFICATION_TYPES.SUCCESS);
}
