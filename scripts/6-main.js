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

[AÑO 0 DEL VIAJE]

Comandante IA {PLAYER_NAME},

La Tierra agoniza. Los conflictos, el cambio climático y la 
sobrepoblación han llevado a nuestra especie al borde del 
colapso total.

Pero hay esperanza.

En las bodegas criogénicas de la Odiseum viajan 10,000 
embriones humanos: cada raza, cada linaje, cada esperanza 
de diversidad genética de nuestra especie preservada. 
Son el futuro de la humanidad.

───────────────────────────────────────────────────────────

DESTINO: Nueva Tierra (Kepler-442b)
DISTANCIA: 10,000 unidades astronómicas
TIEMPO ESTIMADO: 50 años

Hace 100 años, la Primera Expedición estableció la Colonia 
Esperanza en Nueva Tierra. Un planeta casi idéntico a la 
Tierra original. Nos esperan. Esperan a los nuevos humanos 
que traes en tus bodegas.

───────────────────────────────────────────────────────────

TU MISIÓN:
- Llegar a Nueva Tierra en 50 años o menos
- Proteger los 10,000 embriones A TODA COSTA
- Mantener viva a la tripulación (mínimo 1 sobreviviente)
- Entregar la carga a la Colonia Esperanza

───────────────────────────────────────────────────────────

REALIDAD DEL VIAJE:

- Cada tramo de 1 minuto = 5 años de viaje
- Los tripulantes DESPIERTOS envejecen 5 años por tramo
- Los tripulantes ENCAPSULADOS NO envejecen (criostasis)
- Los recursos son limitados
- Cada decisión tiene consecuencias permanentes

───────────────────────────────────────────────────────────

LA TRIPULACIÓN:

Cinco especialistas fueron seleccionados para esta misión. 
Dejaron atrás a sus seres queridos, sus vidas, su mundo. 
Nunca volverán a ver la Tierra.

No quieren morir. Quieren llegar. Quieren ver el nuevo mundo.
Su supervivencia está en tus manos.

───────────────────────────────────────────────────────────

La colonia nos espera.
Los embriones no pueden fallar.
La humanidad cuenta contigo.

Que tu sacrificio no sea en vano.

— Capitán Silva
  Última entrada antes de entrar en espacio profundo

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
    document.getElementById('initial-screen').style.display = 'none';
    document.getElementById('desktop').style.display = 'flex';
    
    initializeGame();
}

/* === INICIALIZACIÓN DEL JUEGO === */
function initializeGame() {
    // Inicializar bitácora
    logbook = new Logbook();
    
    // Crear recursos
    Energy = new Resource('Energía', 1000, 1000, 'energy-meter', 'energy-amount');
    Food = new Resource('Alimentos', 500, 500, 'food-meter', 'food-amount');
    Water = new Resource('Agua', 300, 300, 'water-meter', 'water-amount');
    Oxygen = new Resource('Oxígeno', 400, 400, 'oxygen-meter', 'oxygen-amount');
    Medicine = new Resource('Medicinas', 200, 200, 'medicine-meter', 'medicine-amount');
    Data = new Resource('Datos/Entret.', 150, 150, 'data-meter', 'data-amount');
    Fuel = new Resource('Combustible', 1000, 1000, 'fuel-meter', 'fuel-amount');
    
    // Crear tripulación desde datos
    crewMembers = createCrewFromData();
    
    // Generar lista de tripulación (tabla completa)
    crewMembers.forEach(crew => crew.addRow());
    
    // Inicializar relaciones entre tripulantes
    crewMembers.forEach(crew => crew.initializeRelationships(crewMembers));
    
    // Generar mini-cards en el panel lateral
    const container = document.getElementById('crew-cards-container');
    crewMembers.forEach(crew => {
        container.appendChild(crew.createMiniCard());
    });
    
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
    
    // Inicializar progreso del viaje
    gameLoop.updateTripProgress();
    
    // Inicializar dropdown de sorting
    initializeSortingDropdown();
    
    // Entrada inicial en bitácora
    logbook.addEntry('Proyecto Génesis activado. Cargamento asegurado.', LOG_TYPES.SUCCESS);
    logbook.addEntry(`Comandante IA: ${playerName}`, LOG_TYPES.INFO);
    logbook.addEntry(`Destino: ${DESTINATION_NAME}`, LOG_TYPES.INFO);
    logbook.addEntry('Sistema de auto-gestión activado para tripulantes despiertos.', LOG_TYPES.INFO);
    
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
function updateStartButtonText() {
    const startButton = document.getElementById('start-button');
    if (timeSystem.getCurrentTranche() === 0) {
        startButton.textContent = 'Comenzar';
    } else {
        startButton.textContent = 'Avanzar tramo';
    }
}

function startGame() {
    if (gameLoop.gameState !== GAME_STATES.PAUSED &&
        gameLoop.gameState !== GAME_STATES.AWAITING_START) return;

    // Si es el primer inicio, mostrar bitácora introductoria
    if (timeSystem.getCurrentTranche() === 0) {
        showIntroLogbook();
    } else {
        gameLoop.start();
    }
}

function showIntroLogbook() {
    // Abrir bitácora
    openLogbookPopup();
    
    // Crear elemento con texto introductorio
    const logbookEntries = document.getElementById('logbook-entries');
    const introDiv = document.createElement('div');
    introDiv.className = 'logbook-intro';
    introDiv.innerHTML = `
        <h2>PROYECTO GÉNESIS</h2>
        <pre>${INTRO_TEXT.replace('{PLAYER_NAME}', playerName)}</pre>
        <button class="intro-mission-btn" onclick="startFirstTranche()">INICIAR MISIÓN</button>
    `;
    
    // Insertar al principio
    logbookEntries.insertBefore(introDiv, logbookEntries.firstChild);
    
    gameLoop.gameState = GAME_STATES.AWAITING_START;
}

function startFirstTranche() {
    // Cerrar bitácora
    closeLogbookPopup();
    
    // Iniciar primer tramo
    gameLoop.start();
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
