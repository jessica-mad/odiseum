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

                // Si el click no fue dentro del panel ni en el tab
                if (panel && !panel.contains(e.target) && !tab?.contains(e.target)) {
                    // Verificar que tampoco sea un popup
                    if (!e.target.closest('.window.interface')) {
                        clickedOutside.push(panelName);
                    }
                }
            });

            // Cerrar paneles donde se hizo click fuera
            clickedOutside.forEach(panelName => this.closePanel(panelName));
        });
    }

    /**
     * Alterna la visibilidad de un panel (abre/cierra)
     * @param {string} panelName - Nombre del panel (map, crew, control)
     */
    togglePanel(panelName) {
        if (this.isAnimating) return;

        // Si el panel ya está abierto, cerrarlo
        if (this.openPanels.has(panelName)) {
            this.closePanel(panelName);
        } else {
            // Mapa y Crew pueden convivir, pero Control es exclusivo
            if (panelName === 'control') {
                // Cerrar mapa y crew si están abiertos
                this.closePanel('map');
                this.closePanel('crew');
            } else if (this.openPanels.has('control')) {
                // Si control está abierto, cerrarlo para abrir lateral
                this.closePanel('control');
            }

            // Abrir el nuevo panel
            this.openPanel(panelName);
        }
    }

    /**
     * Abre un panel específico
     * @param {string} panelName - Nombre del panel
     */
    openPanel(panelName) {
        if (this.isAnimating) return;

        const panel = this.panels[panelName];
        if (!panel) {
            console.error(`Panel ${panelName} no encontrado`);
            return;
        }

        this.isAnimating = true;

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

        // Esperar a que termine la animación
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);

        console.log(`📂 Panel ${panelName} abierto`);
    }

    /**
     * Cierra un panel específico
     * @param {string} panelName - Nombre del panel
     */
    closePanel(panelName) {
        if (this.isAnimating) return;

        const panel = this.panels[panelName];
        if (!panel || !this.openPanels.has(panelName)) return;

        this.isAnimating = true;

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

        // Esperar a que termine la animación
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);

        console.log(`📁 Panel ${panelName} cerrado`);
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
        // Solo necesitamos asegurarnos de que esté visible
        if (typeof shipMapSystem !== 'undefined' && shipMapSystem) {
            shipMapSystem.updateAllSections();
        }
    }

    /**
     * Actualiza el contenido del panel de tripulación (dos columnas)
     */
    updateCrewPanel() {
        const awakeContainer = document.getElementById('panel-crew-awake');
        const asleepContainer = document.getElementById('panel-crew-asleep');

        if (!awakeContainer || !asleepContainer) return;
        if (typeof crewMembers === 'undefined' || !crewMembers) return;

        // Limpiar contenedores
        awakeContainer.innerHTML = '';
        asleepContainer.innerHTML = '';

        // Separar tripulantes por estado
        crewMembers.forEach(crew => {
            const miniCard = crew.createMiniCard();

            if (crew.state === 'Despierto') {
                awakeContainer.appendChild(miniCard);
            } else {
                asleepContainer.appendChild(miniCard);
            }
        });

        // Configurar drag & drop en los contenedores
        this.setupDragAndDrop(awakeContainer, asleepContainer);
    }

    /**
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
                    crew.state = targetState;
                    crew.updateConsoleCrewState();

                    // Refrescar sistema de beneficios
                    if (typeof awakeBenefitSystem !== 'undefined' && awakeBenefitSystem) {
                        awakeBenefitSystem.refreshState(crewMembers);
                        if (typeof updateVoyageVisualizer === 'function') {
                            updateVoyageVisualizer();
                        }
                    }

                    // Actualizar panel
                    this.updateCrewPanel();

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

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        panelManager.init();
    });
} else {
    panelManager.init();
}
