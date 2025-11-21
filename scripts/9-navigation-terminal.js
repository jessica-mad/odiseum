// ============================================
// NAVIGATION CONTROLS & TERMINAL SYSTEM
// ============================================

/* === TERMINAL DE NOTIFICACIONES === */
class TerminalNotificationSystem {
    constructor() {
        this.terminalContent = document.getElementById('terminal-notifications');
        this.terminalTime = document.getElementById('terminal-time');
        this.maxLines = 100;
        this.startTime = Date.now();
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        this.terminalTime.textContent = timeString;

        const summaryClock = document.getElementById('summary-terminal-time');
        if (summaryClock) {
            summaryClock.textContent = timeString;
        }
    }

    addLine(message, type = 'info') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;

        const timestamp = new Date().toLocaleTimeString('es-ES');

        // Procesar el mensaje para detectar nombres de tripulantes
        const processedMessage = this.processCrewLinks(message);

        // Usar innerHTML para permitir links
        line.innerHTML = `[${timestamp}] > ${processedMessage}`;

        this.terminalContent.appendChild(line);

        // Mantener solo las últimas líneas
        while (this.terminalContent.children.length > this.maxLines) {
            this.terminalContent.removeChild(this.terminalContent.firstChild);
        }

        // Auto-scroll al final
        this.terminalContent.scrollTop = this.terminalContent.scrollHeight;
    }

    /**
     * Procesa el mensaje para convertir nombres de tripulantes en links clickeables
     * @param {string} message - Mensaje a procesar
     * @returns {string} - Mensaje con links HTML
     */
    processCrewLinks(message) {
        // Si no hay tripulantes definidos, retornar el mensaje sin cambios
        if (typeof crewMembers === 'undefined' || !crewMembers || crewMembers.length === 0) {
            return this.escapeHtml(message);
        }

        let processedMessage = this.escapeHtml(message);

        // Iterar sobre todos los tripulantes
        crewMembers.forEach(crew => {
            const name = crew.name;
            const crewId = crew.id;
            // Crear un patrón regex que detecte el nombre completo
            // Usamos word boundaries para evitar coincidencias parciales
            const regex = new RegExp(`\\b${this.escapeRegex(name)}\\b`, 'g');

            // Reemplazar el nombre con un link clickeable que abre su tab en el terminal
            processedMessage = processedMessage.replace(regex,
                `<span class="crew-link" onclick="switchTerminalTab('crew-${crewId}')" style="color: var(--color-terminal-green); text-decoration: underline; cursor: pointer;">${name}</span>`
            );
        });

        return processedMessage;
    }

    /**
     * Escapa caracteres HTML para prevenir XSS
     * @param {string} text - Texto a escapar
     * @returns {string} - Texto escapado
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Escapa caracteres especiales de regex
     * @param {string} text - Texto a escapar
     * @returns {string} - Texto escapado
     */
    escapeRegex(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    info(message) {
        this.addLine(message, 'info');
    }

    warning(message) {
        this.addLine(message, 'warning');
    }

    alert(message) {
        this.addLine(message, 'alert');
    }

    success(message) {
        this.addLine(message, 'success');
    }
}

// Instancia global del terminal
let terminal = null;

// Inicializar terminal cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    terminal = new TerminalNotificationSystem();
    terminal.info('Sistema de navegación Odiseum V2.0 iniciado');
    terminal.info('Esperando inicialización de misión...');
});

/* === CONTROLES DE NAVEGACIÓN === */
class NavigationControls {
    constructor() {
        this.speedSlider = document.getElementById('nav-speed-slider');
        this.speedDisplay = document.getElementById('nav-speed-display');

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.speedSlider) {
            this.speedSlider.addEventListener('input', (e) => {
                const speed = e.target.value;
                this.speedDisplay.textContent = `${speed}%`;
                this.updateGameSpeed(speed);
            });
        }
    }

    updateGameSpeed(speed) {
        // Sincronizar con el slider del popup de trip management
        const speedControl = document.getElementById('speed-control');
        if (speedControl) {
            speedControl.value = speed;
        }

        // Actualizar display del popup
        const speedValue = document.getElementById('speed-value');
        if (speedValue) {
            speedValue.textContent = speed;
        }

        // Sincronizar con controles móviles
        const mobileSlider = document.getElementById('nav-speed-slider-mobile');
        const mobileDisplay = document.getElementById('nav-speed-display-mobile');
        if (mobileSlider) {
            mobileSlider.value = speed;
        }
        if (mobileDisplay) {
            mobileDisplay.textContent = `${speed}%`;
        }

        // Actualizar pronóstico de viaje
        if (typeof updateVoyageForecastDisplay === 'function') {
            updateVoyageForecastDisplay();
        }

        if (terminal) {
            terminal.info(`Velocidad de nave ajustada a ${speed}%`);
        }
    }
}

// Instancia global de controles de navegación
let navControls = null;

// Inicializar controles cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    navControls = new NavigationControls();
    setupMobileControls();
});

/* === CONTROLES MÓVILES === */
function setupMobileControls() {
    const mobileToggle = document.getElementById('mobile-crew-toggle');
    const crewSidebar = document.getElementById('crew-sidebar');

    // Setup mobile speed slider
    const mobileSlider = document.getElementById('nav-speed-slider-mobile');
    const mobileDisplay = document.getElementById('nav-speed-display-mobile');
    if (mobileSlider && mobileDisplay) {
        mobileSlider.addEventListener('input', (e) => {
            const speed = e.target.value;
            mobileDisplay.textContent = `${speed}%`;

            // Sync with desktop controls
            const desktopSlider = document.getElementById('nav-speed-slider');
            const desktopDisplay = document.getElementById('nav-speed-display');
            if (desktopSlider) {
                desktopSlider.value = speed;
            }
            if (desktopDisplay) {
                desktopDisplay.textContent = `${speed}%`;
            }

            // Update game speed through nav controls
            if (navControls) {
                navControls.updateGameSpeed(speed);
            }
        });
    }

    // Mostrar/ocultar botón toggle según tamaño de pantalla
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            if (mobileToggle) mobileToggle.style.display = 'block';
        } else {
            if (mobileToggle) mobileToggle.style.display = 'none';
            if (crewSidebar) crewSidebar.classList.remove('mobile-visible');
        }
    }

    // Verificar al cargar y al redimensionar
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
}

function toggleMobileCrew() {
    const crewSidebar = document.getElementById('crew-sidebar');
    const mobileToggle = document.getElementById('mobile-crew-toggle');

    if (crewSidebar) {
        const isVisible = crewSidebar.classList.toggle('mobile-visible');

        // Actualizar texto del botón
        if (mobileToggle) {
            mobileToggle.textContent = isVisible ? '❌ CERRAR' : '👥 TRIPULACIÓN';
        }
    }
}

// Hacer función globalmente accesible
window.toggleMobileCrew = toggleMobileCrew;

/* === INTEGRACIÓN CON LOGBOOK === */
// Función para agregar entradas del logbook al terminal
function addLogbookEntryToTerminal(message, logType) {
    if (!terminal) return;

    let type = 'info';

    // Mapear tipos de log a tipos de terminal
    if (logType === LOG_TYPES.CRITICAL || logType === LOG_TYPES.EVENT_CRITICAL || logType === LOG_TYPES.DEATH) {
        type = 'alert';
    } else if (logType === LOG_TYPES.WARNING || logType === LOG_TYPES.EVENT) {
        type = 'warning';
    } else if (logType === LOG_TYPES.SUCCESS) {
        type = 'success';
    }

    terminal.addLine(message, type);
}

// Hacer la función globalmente accesible
window.addLogbookEntryToTerminal = addLogbookEntryToTerminal;

/* === INTEGRACIÓN CON NOTIFICACIONES === */
// Override del sistema de notificaciones para usar el terminal
if (typeof Notification !== 'undefined') {
    const originalNotificationInit = Notification.prototype.constructor;

    // Interceptar las notificaciones y enviarlas al terminal
    window.addEventListener('DOMContentLoaded', () => {
        // Observar el panel de notificaciones antiguo
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList && node.classList.contains('notification')) {
                        const text = node.textContent;
                        let type = 'info';

                        if (node.classList.contains('alert')) {
                            type = 'alert';
                        } else if (node.classList.contains('warning')) {
                            type = 'warning';
                        } else if (node.classList.contains('success')) {
                            type = 'success';
                        }

                        if (terminal) {
                            terminal.addLine(text, type);
                        }

                        // Remover la notificación flotante (usamos solo el terminal)
                        setTimeout(() => {
                            if (node.parentNode) {
                                node.parentNode.removeChild(node);
                            }
                        }, 100);
                    }
                });
            });
        });

        const notificationsPanel = document.getElementById('notifications');
        if (notificationsPanel) {
            observer.observe(notificationsPanel, { childList: true });
        }
    });
}
