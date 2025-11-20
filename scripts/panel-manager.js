// ============================================
// PANEL MANAGER - Sistema de Paneles Desplegables
// Odiseum V2.0 - Papers Please Style
// ============================================

/**
 * Sistema centralizado para gestionar paneles desplegables laterales
 * Solo un panel puede estar abierto a la vez
 * Paneles: Mapa (Izquierda), Tripulación (Derecha), Control (Abajo)
 */

class PanelManager {
    constructor() {
        this.panels = {
            map: null,
            crew: null,
            control: null
        };
        this.openPanels = new Set(); // Usar Set para múltiples paneles abiertos
        this.isAnimating = false;
        this.controlPanelUpdateInterval = null;
    }

    /**
     * Inicializa el sistema de paneles
     */
    init() {
        // Obtener referencias a los paneles
        this.panels.map = document.getElementById('panel-map');
        this.panels.crew = document.getElementById('panel-crew');
        this.panels.control = document.getElementById('panel-control');

        // Mover el voyage-visualizer al panel de control
        this.moveVoyageVisualizerToPanel();

        // Configurar event listeners para los tabs
        this.setupTabListeners();

        // Configurar event listeners para los botones de cierre
        this.setupCloseListeners();

        // Cerrar panel al hacer click fuera
        this.setupOutsideClickListener();

        // Configurar controles de teclado (solo desktop)
        this.setupKeyboardListeners();

        console.log('✅ Panel Manager inicializado');
    }

    /**
     * Mueve el voyage-visualizer existente al panel de control
     */
    moveVoyageVisualizerToPanel() {
        const voyageVisualizer = document.getElementById('voyage-visualizer');
        const controlPanel = document.getElementById('panel-control');

        if (voyageVisualizer && controlPanel) {
            // Remover clases que lo hacen fijo
            voyageVisualizer.style.position = 'relative';
            voyageVisualizer.style.bottom = 'auto';
            voyageVisualizer.style.left = 'auto';
            voyageVisualizer.style.right = 'auto';

            // Mover al panel de control
            controlPanel.appendChild(voyageVisualizer);

            console.log('✅ Voyage visualizer movido al panel de control');
        }
    }

    /**
     * Configura los event listeners para los tabs
     */
    setupTabListeners() {
        const tabs = {
            'panel-tab-map': 'map',
            'panel-tab-crew': 'crew',
            'panel-tab-control': 'control'
        };

        Object.entries(tabs).forEach(([tabId, panelName]) => {
            const tab = document.getElementById(tabId);
            if (tab) {
                tab.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.togglePanel(panelName);
                });
            }
        });
    }

    /**
     * Configura los event listeners para los botones de cierre
     * NOTA: Ya no hay botones X, los paneles se cierran con los tabs
     */
    setupCloseListeners() {
        // Los paneles ahora se cierran solo con los tabs (toggle)
        // Esta función se mantiene por compatibilidad pero no hace nada
    }

    /**
     * Configura el listener para cerrar al hacer click fuera del panel
     */
    setupOutsideClickListener() {
        document.addEventListener('click', (e) => {
            if (this.openPanels.size === 0) return;

            // Chequear cada panel abierto
            const clickedOutside = [];
            this.openPanels.forEach(panelName => {
                const panel = this.panels[panelName];
                const tab = document.getElementById(`panel-tab-${panelName}`);

                // IMPORTANTE: Los paneles laterales (map y crew) NO deben cerrarse al hacer click fuera
                // Solo deben cerrarse cuando:
                // 1. Se hace click en su tab (togglePanel)
                // 2. Se abre el panel de control
                // 3. Termina el tramo
                // El panel de control SÍ se cierra al hacer click fuera
                if (panelName === 'map' || panelName === 'crew') {
                    return; // No cerrar paneles laterales con click fuera
                }

                // Si el click no fue dentro del panel ni en el tab
                if (panel && !panel.contains(e.target) && !tab?.contains(e.target)) {
                    // Verificar que tampoco sea un popup
                    if (!e.target.closest('.window.interface')) {
                        clickedOutside.push(panelName);
                    }
                }
            });

            // Cerrar paneles donde se hizo click fuera (solo control panel)
            clickedOutside.forEach(panelName => this.closePanel(panelName));
        });
    }

    /**
     * Configura los controles de teclado para paneles (solo desktop)
     * W/ArrowUp: Abre panel de control
     * D/ArrowRight: Abre panel de mapa
     * A/ArrowLeft: Abre panel de tripulación
     * S/ArrowDown: Cierra panel de control
     */
    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            // Solo aplicar en desktop (pantallas > 768px)
            if (window.innerWidth <= 768) return;

            // No ejecutar si hay un input o textarea enfocado
            const activeElement = document.activeElement;
            if (activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.isContentEditable) {
                return;
            }

            // No ejecutar si hay un popup abierto
            if (document.querySelector('.window.interface')) {
                return;
            }

            const key = e.key.toLowerCase();

            // W o Flecha Arriba: Abrir panel de control
            if (key === 'w' || key === 'arrowup') {
                console.log('⬆️  W/↑ presionada - Abriendo panel de control');
                e.preventDefault();
                if (!this.openPanels.has('control')) {
                    // Cerrar paneles laterales si están abiertos
                    if (this.openPanels.has('map')) this.closePanel('map');
                    if (this.openPanels.has('crew')) this.closePanel('crew');
                    this.openPanel('control');
                } else {
                    console.log('   ℹ️ Panel de control ya está abierto');
                }
            }
            // D o Flecha Derecha: Abrir panel de mapa
            else if (key === 'd' || key === 'arrowright') {
                console.log('➡️  D/→ presionada - Abriendo panel de mapa');
                e.preventDefault();
                if (!this.openPanels.has('map')) {
                    // Cerrar control si está abierto
                    if (this.openPanels.has('control')) this.closePanel('control');
                    this.openPanel('map');
                } else {
                    console.log('   ℹ️ Panel de mapa ya está abierto');
                }
            }
            // A o Flecha Izquierda: Abrir panel de tripulación
            else if (key === 'a' || key === 'arrowleft') {
                console.log('⬅️  A/← presionada - Abriendo panel de tripulación');
                e.preventDefault();
                if (!this.openPanels.has('crew')) {
                    // Cerrar control si está abierto
                    if (this.openPanels.has('control')) this.closePanel('control');
                    this.openPanel('crew');
                } else {
                    console.log('   ℹ️ Panel de crew ya está abierto');
                }
            }
            // S o Flecha Abajo: Cerrar panel de control
            else if (key === 's' || key === 'arrowdown') {
                console.log('⬇️  S/↓ presionada - Cerrando panel de control');
                e.preventDefault();
                if (this.openPanels.has('control')) {
                    this.closePanel('control');
                } else {
                    console.log('   ℹ️ Panel de control no está abierto');
                }
            }
        });

        console.log('⌨️  Controles de teclado activados: W/↑=Control, D/→=Mapa, A/←=Crew, S/↓=Cerrar');
    }

    /**
     * Alterna la visibilidad de un panel (abre/cierra)
     * @param {string} panelName - Nombre del panel (map, crew, control)
     */
    togglePanel(panelName) {
        // Si el panel ya está abierto, cerrarlo
        if (this.openPanels.has(panelName)) {
            this.closePanel(panelName);
            return;
        }

        // Si no está abierto, aplicar lógica de exclusividad
        // Control es exclusivo con los laterales
        if (panelName === 'control') {
            // Cerrar mapa y crew si están abiertos
            if (this.openPanels.has('map')) {
                this.closePanel('map');
            }
            if (this.openPanels.has('crew')) {
                this.closePanel('crew');
            }
        } else if (this.openPanels.has('control')) {
            // Si control está abierto, cerrarlo para abrir lateral
            this.closePanel('control');
        }
        // Si es map o crew, pueden coexistir entre ellos

        // Abrir el nuevo panel
        this.openPanel(panelName);
    }

    /**
     * Abre un panel específico
     * @param {string} panelName - Nombre del panel
     */
    openPanel(panelName) {
        const panel = this.panels[panelName];
        if (!panel) {
            console.error(`Panel ${panelName} no encontrado`);
            return;
        }

        // Marcar como abierto
        panel.classList.add('open');
        this.openPanels.add(panelName);

        // Actualizar el tab
        const tab = document.getElementById(`panel-tab-${panelName}`);
        if (tab) {
            tab.classList.add('active');
        }

        // Actualizar contenido del panel según el tipo
        this.updatePanelContent(panelName);

        // Si es el panel de control, iniciar actualizaciones periódicas
        if (panelName === 'control') {
            this.startControlPanelUpdates();
        }

        console.log(`📂 Panel ${panelName} abierto`, Array.from(this.openPanels));
    }

    /**
     * Cierra un panel específico
     * @param {string} panelName - Nombre del panel
     */
    closePanel(panelName) {
        const panel = this.panels[panelName];
        if (!panel || !this.openPanels.has(panelName)) return;

        // Marcar como cerrado
        panel.classList.remove('open');
        this.openPanels.delete(panelName);

        // Actualizar el tab
        const tab = document.getElementById(`panel-tab-${panelName}`);
        if (tab) {
            tab.classList.remove('active');
        }

        // Si es el panel de control, detener actualizaciones periódicas
        if (panelName === 'control') {
            this.stopControlPanelUpdates();
        }

        console.log(`📁 Panel ${panelName} cerrado`, Array.from(this.openPanels));
    }

    /**
     * Actualiza el contenido del panel según el tipo
     * @param {string} panelName - Nombre del panel
     */
    updatePanelContent(panelName) {
        switch (panelName) {
            case 'map':
                this.updateMapPanel();
                break;
            case 'crew':
                this.updateCrewPanel();
                break;
            case 'control':
                this.updateControlPanel();
                break;
        }
    }

    /**
     * Actualiza el contenido del panel de mapa
     */
    updateMapPanel() {
        // El mapa ya se actualiza automáticamente con el sistema existente
        // Solo necesitamos asegurarnos de que esté visible y actualizar ubicaciones
        if (typeof shipMapSystem !== 'undefined' && shipMapSystem) {
            // Re-inicializar el mapa si el contenedor está vacío
            const mapContainer = document.getElementById('ship-map-container');
            if (mapContainer && !mapContainer.hasChildNodes()) {
                console.log('🗺️ Re-inicializando mapa en panel');
                shipMapSystem.createMapUI();
            }
            // Actualizar ubicaciones de tripulantes
            if (typeof shipMapSystem.updateCrewLocations === 'function') {
                shipMapSystem.updateCrewLocations();
            }
            console.log('🗺️ Panel de mapa actualizado');
        }
    }

    /**
     * Actualiza el contenido del panel de tripulación (nueva estructura con tabs)
     */
    updateCrewPanel() {
        if (typeof crewMembers === 'undefined' || !crewMembers) {
            console.error('crewMembers no definido');
            return;
        }

        console.log('🔄 Actualizando panel de tripulación (nueva estructura)');

        // Poblar tabs de tripulación
        this.populateCrewTabs();

        // Poblar tabs de nave
        this.populateShipTabs();

        // Actualizar consola de logs
        this.updateConsoleLogs();
    }

    /**
     * Pobla los tabs verticales de tripulación
     */
    populateCrewTabs() {
        const sidebar = document.getElementById('crew-tabs-sidebar');
        if (!sidebar) return;

        sidebar.innerHTML = '';

        crewMembers.forEach((crew, index) => {
            const tabItem = document.createElement('div');
            tabItem.className = 'vertical-tab-item';
            if (index === 0) tabItem.classList.add('active');
            tabItem.dataset.crewId = crew.id;

            const emoji = document.createElement('div');
            emoji.className = 'vertical-tab-emoji';
            emoji.textContent = crew.emoji || '👤';

            const label = document.createElement('div');
            label.className = 'vertical-tab-label';
            label.textContent = crew.name;

            tabItem.appendChild(emoji);
            tabItem.appendChild(label);

            tabItem.addEventListener('click', () => {
                this.switchCrewTab(crew.id);
            });

            sidebar.appendChild(tabItem);
        });

        // Mostrar la ficha del primer tripulante
        if (crewMembers.length > 0) {
            this.showCrewProfile(crewMembers[0].id);
        }
    }

    /**
     * Cambia el tab de tripulante activo
     */
    switchCrewTab(crewId) {
        // Actualizar tabs activos
        document.querySelectorAll('#crew-tabs-sidebar .vertical-tab-item').forEach(tab => {
            tab.classList.remove('active');
            if (parseInt(tab.dataset.crewId) === parseInt(crewId)) {
                tab.classList.add('active');
            }
        });

        // Mostrar ficha del tripulante
        this.showCrewProfile(crewId);
    }

    /**
     * Muestra la ficha completa de un tripulante
     */
    showCrewProfile(crewId) {
        const content = document.getElementById('crew-tabs-content');
        if (!content) return;

        const crew = crewMembers.find(c => c.id === parseInt(crewId));
        if (!crew) return;

        // Usar la función existente createFullCrewProfile
        if (typeof createFullCrewProfile === 'function') {
            content.innerHTML = '';
            const profileHTML = createFullCrewProfile(crew);
            content.innerHTML = profileHTML;
        }
    }

    /**
     * Pobla los tabs verticales de habitaciones
     */
    populateShipTabs() {
        const sidebar = document.getElementById('ship-tabs-sidebar');
        if (!sidebar || typeof shipMapSystem === 'undefined') return;

        sidebar.innerHTML = '';

        const zones = Object.entries(shipMapSystem.zones);
        zones.forEach(([zoneKey, zone], index) => {
            const tabItem = document.createElement('div');
            tabItem.className = 'vertical-tab-item';
            if (index === 0) tabItem.classList.add('active');
            tabItem.dataset.zoneKey = zoneKey;

            const emoji = document.createElement('div');
            emoji.className = 'vertical-tab-emoji';
            emoji.textContent = zone.icon || '🏠';

            const label = document.createElement('div');
            label.className = 'vertical-tab-label';
            label.textContent = zone.name;

            tabItem.appendChild(emoji);
            tabItem.appendChild(label);

            tabItem.addEventListener('click', () => {
                this.switchShipTab(zoneKey);
            });

            sidebar.appendChild(tabItem);
        });

        // Mostrar la primera habitación
        if (zones.length > 0) {
            this.showShipRoom(zones[0][0]);
        }
    }

    /**
     * Cambia el tab de habitación activo
     */
    switchShipTab(zoneKey) {
        // Actualizar tabs activos
        document.querySelectorAll('#ship-tabs-sidebar .vertical-tab-item').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.zoneKey === zoneKey) {
                tab.classList.add('active');
            }
        });

        // Mostrar información de la habitación
        this.showShipRoom(zoneKey);
    }

    /**
     * Muestra la información de una habitación
     */
    showShipRoom(zoneKey) {
        const content = document.getElementById('ship-tabs-content');
        if (!content || typeof shipMapSystem === 'undefined') return;

        const zone = shipMapSystem.zones[zoneKey];
        if (!zone) return;

        const percentage = Math.round(zone.integrity);
        let colorClass = 'good';
        if (percentage < 20) colorClass = 'critical';
        else if (percentage < 50) colorClass = 'warning';

        let html = `
            <div class="room-detail-view">
                <div class="room-detail-header">
                    <span class="room-detail-icon">${zone.icon}</span>
                    <h2 class="room-detail-title">${zone.name}</h2>
                </div>

                <div class="room-detail-stats">
                    <div class="stat-item">
                        <span class="stat-label">Integridad:</span>
                        <div class="stat-bar-container">
                            <div class="stat-bar ${colorClass}" style="width: ${percentage}%"></div>
                        </div>
                        <span class="stat-value">${percentage}%</span>
                    </div>

                    ${zone.isBroken ? '<div class="room-alert">💥 AVERIADA - No funcional</div>' : ''}
                    ${zone.beingRepaired ? '<div class="room-info">🔧 Siendo reparada</div>' : ''}
                </div>

                <div class="room-detail-description">
                    <h3>Descripción</h3>
                    <p>${this.getRoomDescription(zoneKey)}</p>
                </div>

                <div class="room-detail-crew">
                    <h3>Tripulantes en esta zona</h3>
                    <div class="crew-in-room">
                        ${this.getCrewInZone(zoneKey)}
                    </div>
                </div>
            </div>
        `;

        content.innerHTML = html;
    }

    /**
     * Obtiene la descripción de una habitación
     */
    getRoomDescription(zoneKey) {
        const descriptions = {
            bridge: 'Centro de comando de la nave. Aquí el capitán puede liderar a la tripulación.',
            medbay: 'Enfermería donde el doctor puede sanar a los tripulantes heridos.',
            quarters: 'Habitaciones donde la tripulación puede descansar y recuperar energía.',
            engineering: 'Sala de máquinas. Si se daña, las reparaciones son más lentas.',
            bathroom: 'Baño de la nave. Los tripulantes vienen aquí cuando lo necesitan.',
            kitchen: 'Cocina donde el chef prepara raciones para la tripulación.',
            greenhouse: 'Invernadero donde se cultivan plantas medicinales.'
        };
        return descriptions[zoneKey] || 'Habitación de la nave.';
    }

    /**
     * Obtiene HTML de tripulantes en una zona
     */
    getCrewInZone(zoneKey) {
        if (typeof shipMapSystem === 'undefined') return '<p>No hay tripulantes aquí</p>';

        const crewInZone = [];
        crewMembers.forEach(crew => {
            const crewPos = shipMapSystem.crewLocations[crew.id];
            if (crewPos) {
                const cellType = shipMapSystem.grid[crewPos.row]?.[crewPos.col];
                const crewZone = shipMapSystem.getCellTypeToZoneName(cellType, crewPos.row, crewPos.col);
                if (crewZone === zoneKey) {
                    crewInZone.push(crew);
                }
            }
        });

        if (crewInZone.length === 0) {
            return '<p class="empty-crew">No hay tripulantes en esta zona</p>';
        }

        return crewInZone.map(crew => {
            return `<div class="crew-mini-badge">${crew.emoji} ${crew.name}</div>`;
        }).join('');
    }

    /**
     * Actualiza la consola de logs
     */
    updateConsoleLogs() {
        const container = document.getElementById('console-logs-container');
        if (!container || typeof logbook === 'undefined') return;

        // Limpiar y agregar logs (los nuevos aparecerán arriba por el flex-direction: column-reverse)
        container.innerHTML = '';

        const logs = logbook.logs || [];
        logs.forEach(log => {
            const logEntry = document.createElement('div');
            logEntry.className = `console-log-entry log-${log.type.toLowerCase()}`;

            const timestamp = document.createElement('span');
            timestamp.className = 'console-log-timestamp';
            timestamp.textContent = `[${log.time}]`;

            const message = document.createElement('span');
            message.textContent = log.text;

            logEntry.appendChild(timestamp);
            logEntry.appendChild(message);

            container.appendChild(logEntry);
        });
    }

    /**
     * Mantener por compatibilidad (ya no se usa con nueva estructura)
     * Configura drag & drop entre columnas
     */
    setupDragAndDrop(awakeContainer, asleepContainer) {
        [awakeContainer, asleepContainer].forEach(container => {
            container.ondragover = (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                container.classList.add('drag-over');
            };

            container.ondragleave = (e) => {
                if (e.target === container) {
                    container.classList.remove('drag-over');
                }
            };

            container.ondrop = (e) => {
                e.preventDefault();
                container.classList.remove('drag-over');

                const crewName = e.dataTransfer.getData('text/plain');
                const crew = crewMembers.find(c => c.name === crewName);

                if (!crew || !crew.isAlive) return;

                // Determinar nuevo estado según el contenedor
                const targetState = container.id === 'panel-crew-awake' ? 'Despierto' : 'Encapsulado';

                // Solo cambiar si es diferente
                if (crew.state !== targetState) {
                    console.log(`🔄 Cambiando ${crew.name} de ${crew.state} a ${targetState}`);

                    crew.state = targetState;
                    crew.updateConsoleCrewState();

                    // Refrescar sistema de beneficios
                    if (typeof awakeBenefitSystem !== 'undefined' && awakeBenefitSystem) {
                        awakeBenefitSystem.refreshState(crewMembers);
                        if (typeof updateVoyageVisualizer === 'function') {
                            updateVoyageVisualizer();
                        }
                    }

                    // Actualizar panel - esto recrea todas las cards
                    setTimeout(() => {
                        this.updateCrewPanel();
                    }, 50);

                    // Log y notificación
                    const action = targetState === 'Despierto' ? 'despertado' : 'encapsulado';
                    logbook.addEntry(
                        `${crew.name} ha sido ${action}`,
                        LOG_TYPES.EVENT
                    );
                    new Notification(
                        `${crew.name} ha sido ${action}`,
                        NOTIFICATION_TYPES.SUCCESS
                    );
                }
            };
        });
    }

    /**
     * Actualiza el contenido del panel de control
     * El panel de control ahora usa directamente el voyage-visualizer
     */
    updateControlPanel() {
        // El voyage-visualizer se actualiza automáticamente
        // Este método se mantiene por compatibilidad
    }

    /**
     * Cierra todos los paneles
     */
    closeAllPanels() {
        const panelsToClose = Array.from(this.openPanels);
        panelsToClose.forEach(panelName => {
            this.closePanel(panelName);
        });
    }

    /**
     * Cierra los paneles laterales (mapa y crew)
     */
    closeSidePanels() {
        this.closePanel('map');
        this.closePanel('crew');
    }

    /**
     * Verifica si hay algún panel abierto
     * @returns {boolean}
     */
    isAnyPanelOpen() {
        return this.openPanels.size > 0;
    }

    /**
     * Obtiene los paneles actualmente abiertos
     * @returns {Array<string>}
     */
    getOpenPanels() {
        return Array.from(this.openPanels);
    }

    /**
     * Verifica si un panel específico está abierto
     * @param {string} panelName - Nombre del panel
     * @returns {boolean}
     */
    isPanelOpen(panelName) {
        return this.openPanels.has(panelName);
    }

    /**
     * Inicia actualizaciones periódicas del panel de control
     */
    startControlPanelUpdates() {
        // Detener cualquier intervalo existente
        this.stopControlPanelUpdates();

        // Actualizar inmediatamente
        this.updateControlPanel();

        // Iniciar actualizaciones periódicas cada segundo
        this.controlPanelUpdateInterval = setInterval(() => {
            if (this.isPanelOpen('control')) {
                this.updateControlPanel();
            }
        }, 1000);
    }

    /**
     * Detiene las actualizaciones periódicas del panel de control
     */
    stopControlPanelUpdates() {
        if (this.controlPanelUpdateInterval) {
            clearInterval(this.controlPanelUpdateInterval);
            this.controlPanelUpdateInterval = null;
        }
    }
}

// Instancia global del Panel Manager
const panelManager = new PanelManager();

// ============================================
// FUNCIONES GLOBALES PARA TABS PRINCIPALES
// ============================================

/**
 * Cambia entre tabs principales (Consola, Tripulación, Nave)
 */
function switchMainTab(tabName) {
    // Actualizar botones de tabs
    document.querySelectorAll('.panel-main-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });

    // Actualizar contenido visible
    document.querySelectorAll('.main-tab-content').forEach(content => {
        content.classList.remove('active');
    });

    const targetContent = document.getElementById(`main-tab-content-${tabName}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }

    // Si cambiamos a la consola, actualizarla
    if (tabName === 'console' && panelManager) {
        panelManager.updateConsoleLogs();
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        panelManager.init();
    });
} else {
    panelManager.init();
}
