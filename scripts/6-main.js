// ============================================
// MAIN - ODISEUM V2.0
// ============================================

/* === VARIABLES GLOBALES === */
let playerName = '';
let crewMembers = [];
let logbook;

// Recursos globales
let Energy, Food, Water, Oxygen, Medicine, Data, Fuel;

/* === TEXTO INTRODUCTORIO DE LA BITÁCORA === */
const INTRO_TEXT = `═══════════════════════════════════════════════════════
           PROYECTO GÉNESIS - MISIÓN ODISEUM
═══════════════════════════════════════════════════════

[TRANSMISIÓN URGENTE - AÑO 0]

Comandante IA {PLAYER_NAME},

La Tierra está oficialmente condenada.
(Sí, por fin lo admitieron.)

Tu nave Odiseum lleva:
- 5 humanos de dudosa estabilidad mental
- 10,000 embriones criogenizados
- Sistemas que "probablemente" funcionarán
- Destino: Kepler-442b (1,200 años luz de distancia)

Misión: Entregar la carga a la Colonia Esperanza.
(Fundada hace 100 años. Ojalá sigan vivos.)

No presión. Solo eres la última esperanza de la especie.

───────────────────────────────────────────────────────────

— Comando Central
  (Los mismos genios que causaron el apocalipsis)

PD: Antes de partir, configura tu misión.
    Al menos elige TÚ cómo condenarte.

═══════════════════════════════════════════════════════`;

/* === AUTENTICACIÓN === */
function namePlayer() {
    const input = document.getElementById('player-name-input');
    const name = input.value.trim();

    if (name === '') {
        alert('Por favor, ingrese un nombre válido');
        return;
    }

    playerName = name;
    document.getElementById('playerName').textContent = playerName;

    // Update mobile player name
    const playerNameMobile = document.getElementById('playerName-mobile');
    if (playerNameMobile) {
        playerNameMobile.textContent = playerName;
    }

    // Capturar seed si existe
    const seedInput = document.getElementById('player-seed-input');
    const seed = seedInput ? seedInput.value.trim().toUpperCase() : '';

    // Guardar seed en variable global si existe
    if (seed && seed.startsWith('KEPLER-')) {
        window.loadedSeed = seed;
        console.log('[Game] Seed detectado:', seed);
    } else {
        window.loadedSeed = null;
    }

    document.getElementById('initial-screen').style.display = 'none';

    showIntroOverlay();
}

function showIntroOverlay() {
    const overlay = document.getElementById('intro-overlay');
    if (!overlay) return;

    const introText = document.getElementById('intro-text-content');
    if (introText) {
        introText.textContent = INTRO_TEXT.replace('{PLAYER_NAME}', playerName);
    }

    overlay.style.display = 'flex';
}

function startMissionFromIntro() {
    if (typeof gameLoop !== 'undefined' && gameLoop.missionStarted) {
        return;
    }

    const overlay = document.getElementById('intro-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }

    // Mostrar el configurador en lugar de iniciar el juego directamente
    showConfigurator();
}

function showConfigurator() {
    const configurator = document.getElementById('mission-configurator');
    if (configurator) {
        configurator.style.display = 'flex';
        // Mostrar el primer paso
        showConfigStep(1);

        // Inicializar el configurador si existe el objeto
        if (typeof missionConfigurator !== 'undefined') {
            missionConfigurator.init();
        }
    }
}

function showConfigStep(stepNumber) {
    // Ocultar todos los pasos
    for (let i = 1; i <= 3; i++) {
        const step = document.getElementById(`config-step-${i}`);
        if (step) {
            step.style.display = 'none';
        }
    }

    // Mostrar el paso actual
    const currentStep = document.getElementById(`config-step-${stepNumber}`);
    if (currentStep) {
        currentStep.style.display = 'block';
    }

    // Actualizar el indicador de paso
    const stepIndicator = document.getElementById('config-step-indicator');
    if (stepIndicator) {
        stepIndicator.textContent = `PASO ${stepNumber}/3`;
    }
}

function nextConfigStep(currentStep) {
    if (currentStep < 3) {
        showConfigStep(currentStep + 1);
    }
}

function prevConfigStep(currentStep) {
    if (currentStep > 1) {
        showConfigStep(currentStep - 1);
    }
}

function startGameWithConfiguration(config) {
    console.log('=== [MAIN] startGameWithConfiguration RECIBIDO ===');
    console.log('[MAIN] Config recibido:', config);
    console.log('[MAIN] Config.crew:', config?.crew);
    console.log('[MAIN] Config.resources:', config?.resources);

    // Ocultar el configurador
    const configurator = document.getElementById('mission-configurator');
    if (configurator) {
        configurator.style.display = 'none';
    }

    // Mostrar el desktop
    const desktop = document.getElementById('desktop');
    if (desktop) {
        desktop.style.display = 'flex';
    }

    // Aplicar la configuración al juego
    console.log('[MAIN] Llamando a initializeGame con config...');
    initializeGame(config);
    ensureIntroEntryInLogbook(false);
    startFirstTranche();
}

function ensureIntroEntryInLogbook(includeButton = false) {
    const logbookEntries = document.getElementById('logbook-entries');
    if (!logbookEntries) return;

    let introDiv = logbookEntries.querySelector('.logbook-intro');
    if (!introDiv) {
        introDiv = document.createElement('div');
        introDiv.className = 'logbook-intro';
        logbookEntries.insertBefore(introDiv, logbookEntries.firstChild);
    }

    const buttonHtml = includeButton
        ? '<button class="intro-mission-btn" onclick="startFirstTranche()">INICIAR MISIÓN</button>'
        : '';

    introDiv.innerHTML = `
        <h2>PROYECTO GÉNESIS</h2>
        <pre>${INTRO_TEXT.replace('{PLAYER_NAME}', playerName)}</pre>
        ${buttonHtml}
    `;
}

/* === INICIALIZACIÓN DEL JUEGO === */
function initializeGame(config) {
    console.log('=== [INITIALIZE GAME] INICIANDO ===');

    // Guardar configuración en variable global
    window.missionConfig = config || null;

    console.log('[initializeGame] Config recibida:', config);
    console.log('[initializeGame] Config es objeto?', typeof config === 'object');
    console.log('[initializeGame] Config.crew existe?', !!config?.crew);
    console.log('[initializeGame] Config.resources existe?', !!config?.resources);

    // Inicializar bitácora PRIMERO (antes de cualquier log)
    logbook = new Logbook();

    if (typeof awakeBenefitSystem !== 'undefined' && awakeBenefitSystem) {
        awakeBenefitSystem.reset();
    }

    if (typeof shipIntegritySystem !== 'undefined' && shipIntegritySystem) {
        shipIntegritySystem.reset();
    }

    // Configurar duración de misión basada en el navegante
    if (config && config.crew && config.crew.navegante) {
        const navigatorOption = config.crew.navegante;
        if (navigatorOption.stats && navigatorOption.stats.totalTranches) {
            // El navegante ajusta cuántos tranches tomará la misión
            // Misión base: 12 tranches a 3000 UA
            // Ajustar distancia proporcionalmente
            const baseTranches = 12;
            const configuredTranches = navigatorOption.stats.totalTranches;
            const missionLengthMultiplier = configuredTranches / baseTranches;

            // Almacenar el multiplicador globalmente para que el sistema de eventos lo use
            window.missionLengthMultiplier = missionLengthMultiplier;
            window.configuredMissionTranches = configuredTranches;

            // Almacenar modificador de dificultad de eventos si existe
            if (navigatorOption.stats.eventDifficulty !== undefined) {
                window.eventDifficultyModifier = navigatorOption.stats.eventDifficulty;
            }

            // Log de configuración (ahora el logbook ya existe)
            if (configuredTranches < baseTranches) {
                logbook.addEntry(`${navigatorOption.name} (Navegante Arriesgado): Ruta rápida configurada (${configuredTranches} tranches estimados)`, LOG_TYPES.WARNING);
            } else if (configuredTranches > baseTranches) {
                logbook.addEntry(`${navigatorOption.name} (Navegante Conservador): Ruta segura configurada (${configuredTranches} tranches estimados)`, LOG_TYPES.INFO);
            } else {
                logbook.addEntry(`${navigatorOption.name} (Navegante Estándar): Ruta estándar configurada (${configuredTranches} tranches estimados)`, LOG_TYPES.INFO);
            }
        }
    }

    // Valores por defecto de recursos (si no hay config)
    const defaultResources = {
        energy: 1000,
        food: 500,
        water: 300,
        oxygen: 400,
        medicine: 200,
        data: 150,
        fuel: 1000
    };

    // Usar recursos de config si existen, sino usar defaults
    const resources = config && config.resources ? config.resources : defaultResources;

    console.log('[initializeGame] Usando recursos de config?', config && config.resources ? 'SÍ' : 'NO (defaults)');
    console.log('[initializeGame] Recursos seleccionados:', resources);

    // Crear recursos con valores personalizados o por defecto
    Energy = new Resource('Energía', resources.energy, resources.energy, 'energy-meter', 'energy-amount', 'resource-strip-energy');
    Food = new Resource('Alimentos', resources.food, resources.food, 'food-meter', 'food-amount', 'resource-strip-food');
    Water = new Resource('Agua', resources.water, resources.water, 'water-meter', 'water-amount', 'resource-strip-water');
    Oxygen = new Resource('Oxígeno', resources.oxygen, resources.oxygen, 'oxygen-meter', 'oxygen-amount', 'resource-strip-oxygen');
    Medicine = new Resource('Medicinas', resources.medicine, resources.medicine, 'medicine-meter', 'medicine-amount', 'resource-strip-medicine');
    Data = new Resource('Datos/Entret.', resources.data, resources.data, 'data-meter', 'data-amount', 'resource-strip-data');
    Fuel = new Resource('Combustible', resources.fuel, resources.fuel, 'fuel-meter', 'fuel-amount', 'resource-strip-fuel');

    console.log('[initializeGame] Recursos creados - Energy:', Energy.quantity, 'Food:', Food.quantity, 'Water:', Water.quantity);

    // Inicializar sistema de eventos
    eventSystem = new EventSystem();

    // Crear tripulación desde datos (con config si existe)
    console.log('=== [CREW] CREANDO TRIPULACIÓN ===');
    console.log('[initializeGame] Pasando config a createCrewFromData:', config);
    console.log('[initializeGame] Config.crew:', config?.crew);
    crewMembers = createCrewFromData(config);
    console.log('[initializeGame] Tripulación creada - Total:', crewMembers.length);
    crewMembers.forEach((c, i) => {
        console.log(`[initializeGame] Crew[${i}]:`, c.name, 'Edad:', c.initialAge, 'Role:', c.role, 'ConfigStats:', c.configStats);
    });

    if (typeof awakeBenefitSystem !== 'undefined' && awakeBenefitSystem) {
        awakeBenefitSystem.refreshState(crewMembers);
    }

    // Generar lista de tripulación (tabla completa)
    crewMembers.forEach(crew => crew.addRow());
    
    // Inicializar relaciones entre tripulantes
    crewMembers.forEach(crew => crew.initializeRelationships(crewMembers));

    // Las mini-cards se generan automáticamente cuando se abre el panel de tripulación
    // No necesitamos llenar el contenedor aquí

    // Generar tabs de tripulantes en el terminal
    if (typeof generateCrewTabs === 'function') {
        console.log('[initializeGame] Generando tabs de tripulantes...');
        generateCrewTabs();
    }

    // Cargar mensajes cuánticos
    loadQuantumMessages();
    
    // Actualizar UI de recursos
    gameLoop.updateAllResources();
    
    // Inicializar calendario
    timeSystem.updateCalendarUI();
    
    // Inicializar temporizador
    gameLoop.updateTimerUI();
    
    // Configurar ventanas arrastrables
    setupDraggableWindows();

    // Configurar z-index de popups
    setupPopupZIndex();

    // Inicializar vista móvil/escritorio
    initializeMobileView();

    // Inicializar progreso del viaje
    gameLoop.updateTripProgress();
    
    // Inicializar dropdown de sorting
    initializeSortingDropdown();
    
    // Entrada inicial en bitácora
    logbook.addEntry('Proyecto Génesis activado. Cargamento asegurado.', LOG_TYPES.SUCCESS);
    logbook.addEntry(`Comandante IA: ${playerName}`, LOG_TYPES.INFO);
    logbook.addEntry(`Destino: ${DESTINATION_NAME}`, LOG_TYPES.INFO);
    logbook.addEntry('Sistema de auto-gestión activado para tripulantes despiertos.', LOG_TYPES.INFO);

    // Configurar estado inicial de interacciones (antes de iniciar misión, solo velocidad)
    if (typeof enableInteractionsBetweenTranches === 'function') {
        enableInteractionsBetweenTranches();
    }

    new Notification('Sistema inicializado. Listo para comenzar el viaje.', NOTIFICATION_TYPES.INFO);
}

/* === INICIALIZAR SORTING DROPDOWN === */
function initializeSortingDropdown() {
    const select = document.getElementById('crew-sort-select');
    if (!select) return;
    
    select.innerHTML = '';
    SORT_OPTIONS.forEach(option => {
        const optionEl = document.createElement('option');
        optionEl.value = option.id;
        optionEl.textContent = `${option.icon} ${option.label}`;
        select.appendChild(optionEl);
    });
}

/* === CONTROL DEL JUEGO === */
function isLastTranche() {
    // Calcular distancia restante
    const remainingDistance = TOTAL_MISSION_DISTANCE - distanceTraveled;

    // Estimar distancia que se recorrerá en el próximo tramo
    // (asumimos velocidad actual)
    const currentSpeed = parseInt(document.getElementById('speed-control').value);
    const distancePerTick = (currentSpeed / 100) * 10;
    const distancePerTranche = distancePerTick * TICKS_PER_TRANCHE;

    // Si la distancia restante es menor o igual a la distancia de un tramo, es el último
    return remainingDistance <= distancePerTranche;
}

function updateStartButtonText() {
    const startButton = document.getElementById('start-button');

    if (!gameLoop.missionStarted) {
        // Antes de iniciar la misión
        startButton.textContent = 'Comenzar';
    } else if (timeSystem.getCurrentTranche() === 0) {
        // Misión iniciada, primer tramo
        startButton.textContent = 'Iniciar tramo';
    } else if (isLastTranche()) {
        // Último tramo
        startButton.textContent = 'Iniciar último tramo';
    } else {
        // Tramos siguientes
        startButton.textContent = 'Iniciar siguiente tramo';
    }
}

function updateVoyageStatus() {
    const voyageStatus = document.getElementById('voyage-status');

    // Si el elemento no existe, simplemente retornar sin hacer nada
    if (!voyageStatus) {
        console.log('[updateVoyageStatus] Elemento voyage-status no encontrado, ignorando...');
        return;
    }

    const currentTranche = timeSystem.getCurrentTranche();

    if (gameLoop.gameState === GAME_STATES.IN_TRANCHE) {
        voyageStatus.style.display = 'block';
        voyageStatus.textContent = `Estamos viajando tramo ${currentTranche}`;
    } else if (gameLoop.gameState === GAME_STATES.TRANCHE_PAUSED) {
        voyageStatus.style.display = 'block';
        voyageStatus.textContent = `Estamos viajando tramo ${currentTranche}`;
    } else if (gameLoop.missionStarted && currentTranche > 0) {
        voyageStatus.style.display = 'block';
        voyageStatus.textContent = `Hemos viajado el tramo ${currentTranche - 1}`;
    } else {
        voyageStatus.style.display = 'none';
    }
}

function startGame() {
    if (gameLoop.gameState !== GAME_STATES.PAUSED &&
        gameLoop.gameState !== GAME_STATES.AWAITING_START) return;

    // Si la misión NO ha sido iniciada y es el tramo 0, mostrar bitácora introductoria
    if (!gameLoop.missionStarted && timeSystem.getCurrentTranche() === 0) {
        showIntroLogbook();
    } else {
        // En cualquier otro caso, iniciar el tramo
        gameLoop.start();
    }
}

function showIntroLogbook() {
    // Abrir bitácora
    openLogbookPopup();

    ensureIntroEntryInLogbook(true);

    gameLoop.gameState = GAME_STATES.AWAITING_START;
}

function startFirstTranche() {
    // Cerrar bitácora
    closeLogbookPopup();

    // Marcar la misión como iniciada
    gameLoop.missionStarted = true;

    // Actualizar estado del juego a PAUSED (listo para iniciar tramo)
    gameLoop.gameState = GAME_STATES.PAUSED;

    // Actualizar texto del botón a "Iniciar tramo"
    updateStartButtonText();

    // Actualizar estado del viaje
    updateVoyageStatus();

    // Configurar interacciones entre tramos (solo velocidad habilitado)
    if (typeof enableInteractionsBetweenTranches === 'function') {
        enableInteractionsBetweenTranches();
    }

    // Mostrar el botón de inicio de tramo
    document.getElementById('start-button').style.display = 'inline-block';

    // Registro en bitácora
    logbook.addEntry('Misión iniciada. Preparado para comenzar el primer tramo de viaje.', LOG_TYPES.SUCCESS);
    new Notification('Misión iniciada. Presiona "Iniciar tramo" para comenzar el viaje.', NOTIFICATION_TYPES.INFO);
}

function pauseGame() {
    gameLoop.pause();
}

function resumeGame() {
    gameLoop.resume();
}

/* === INICIALIZACIÓN AL CARGAR LA PÁGINA === */
window.addEventListener('load', () => {
    console.log('Odiseum V2.0 - REFACTORIZADO - Cargado correctamente');
    console.log('Archivos organizados:');
    console.log('- 0-config.js: Constantes');
    console.log('- 1-models.js: Crew, Resource, Logbook, Notification');
    console.log('- 2-systems.js: GameLoop, TimeSystem, MessageSystem, SortingSystem, VictorySystem');
    console.log('- 3-ui-managers.js: Popups, ventanas, gestión');
    console.log('- 4-crew-data.js: Datos de tripulación');
    console.log('- 5-messages-data.js: Mensajes cuánticos');
    console.log('- 6-main.js: Inicialización y eventos');
});
