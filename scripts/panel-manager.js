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
        this.currentOpenPanel = null;
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

        // Configurar event listeners para los tabs
        this.setupTabListeners();

        // Configurar event listeners para los botones de cierre
        this.setupCloseListeners();

        // Cerrar panel al hacer click fuera
        this.setupOutsideClickListener();

        console.log('✅ Panel Manager inicializado');
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
     */
    setupCloseListeners() {
        Object.keys(this.panels).forEach(panelName => {
            const panel = this.panels[panelName];
            if (panel) {
                const closeBtn = panel.querySelector('.panel-close-btn');
                if (closeBtn) {
                    closeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.closePanel(panelName);
                    });
                }
            }
        });
    }

    /**
     * Configura el listener para cerrar al hacer click fuera del panel
     */
    setupOutsideClickListener() {
        document.addEventListener('click', (e) => {
            if (!this.currentOpenPanel) return;

            const panel = this.panels[this.currentOpenPanel];
            const tab = document.getElementById(`panel-tab-${this.currentOpenPanel}`);

            // Si el click no fue dentro del panel ni en el tab
            if (panel && !panel.contains(e.target) && !tab?.contains(e.target)) {
                // Verificar que tampoco sea un popup
                if (!e.target.closest('.window.interface')) {
                    this.closePanel(this.currentOpenPanel);
                }
            }
        });
    }

    /**
     * Alterna la visibilidad de un panel (abre/cierra)
     * @param {string} panelName - Nombre del panel (map, crew, control)
     */
    togglePanel(panelName) {
        if (this.isAnimating) return;

        // Si el panel ya está abierto, cerrarlo
        if (this.currentOpenPanel === panelName) {
            this.closePanel(panelName);
        } else {
            // Si hay otro panel abierto, cerrarlo primero
            if (this.currentOpenPanel) {
                this.closePanel(this.currentOpenPanel);
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
        this.currentOpenPanel = panelName;

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
        if (!panel) return;

        this.isAnimating = true;

        // Marcar como cerrado
        panel.classList.remove('open');

        // Actualizar el tab
        const tab = document.getElementById(`panel-tab-${panelName}`);
        if (tab) {
            tab.classList.remove('active');
        }

        // Si es el panel de control, detener actualizaciones periódicas
        if (panelName === 'control') {
            this.stopControlPanelUpdates();
        }

        // Solo actualizar currentOpenPanel si es el que está abierto
        if (this.currentOpenPanel === panelName) {
            this.currentOpenPanel = null;
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
     * Actualiza el contenido del panel de tripulación
     */
    updateCrewPanel() {
        const container = document.getElementById('panel-crew-cards-container');
        if (!container) return;

        // El contenido ya se actualiza automáticamente con el sistema existente
        // Este método puede ser usado para forzar una actualización si es necesario
        if (typeof crewMembers !== 'undefined') {
            // El sistema de crew cards ya se maneja en otros archivos
            // Solo actualizamos si hay cambios pendientes
        }
    }

    /**
     * Actualiza el contenido del panel de control
     */
    updateControlPanel() {
        // Actualizar velocidad
        const speedControl = document.getElementById('speed-control') ||
                            document.getElementById('nav-speed-slider');
        const panelSpeedDisplay = document.getElementById('panel-speed-display');
        if (speedControl && panelSpeedDisplay) {
            const speedValue = speedControl.value;
            panelSpeedDisplay.textContent = `${speedValue}%`;
        }

        // Actualizar combustible
        const panelFuelDisplay = document.getElementById('panel-fuel-display');
        if (panelFuelDisplay && typeof Fuel !== 'undefined') {
            panelFuelDisplay.textContent = `${Fuel.quantity}/${Fuel.maxCapacity} UA`;
        }

        // Actualizar progreso
        const panelProgressDisplay = document.getElementById('panel-progress-display');
        if (panelProgressDisplay && typeof distanceTraveled !== 'undefined' && typeof TOTAL_MISSION_DISTANCE !== 'undefined') {
            const progressPercent = TOTAL_MISSION_DISTANCE > 0
                ? Math.min(100, (distanceTraveled / TOTAL_MISSION_DISTANCE) * 100)
                : 0;
            panelProgressDisplay.textContent = `${progressPercent.toFixed(1)}%`;
        }

        // Actualizar distancia
        const panelDistanceDisplay = document.getElementById('panel-distance-display');
        if (panelDistanceDisplay && typeof distanceTraveled !== 'undefined') {
            panelDistanceDisplay.textContent = `${Math.round(distanceTraveled)} UA`;
        }

        // Actualizar distancia total
        const panelTotalDistanceDisplay = document.getElementById('panel-total-distance-display');
        if (panelTotalDistanceDisplay && typeof TOTAL_MISSION_DISTANCE !== 'undefined') {
            panelTotalDistanceDisplay.textContent = `${TOTAL_MISSION_DISTANCE} UA`;
        }

        // Actualizar tiempo
        const panelTimeDisplay = document.getElementById('panel-time-display');
        const calendar = document.getElementById('calendar');
        if (panelTimeDisplay && calendar) {
            panelTimeDisplay.textContent = calendar.textContent;
        }
    }

    /**
     * Cierra todos los paneles
     */
    closeAllPanels() {
        Object.keys(this.panels).forEach(panelName => {
            if (this.panels[panelName]) {
                this.closePanel(panelName);
            }
        });
    }

    /**
     * Verifica si hay algún panel abierto
     * @returns {boolean}
     */
    isAnyPanelOpen() {
        return this.currentOpenPanel !== null;
    }

    /**
     * Obtiene el panel actualmente abierto
     * @returns {string|null}
     */
    getCurrentPanel() {
        return this.currentOpenPanel;
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
            if (this.currentOpenPanel === 'control') {
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
