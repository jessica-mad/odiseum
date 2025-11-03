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
        this.terminalTime.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    addLine(message, type = 'info') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;

        const timestamp = new Date().toLocaleTimeString('es-ES');
        line.textContent = `[${timestamp}] > ${message}`;

        this.terminalContent.appendChild(line);

        // Mantener solo las últimas líneas
        while (this.terminalContent.children.length > this.maxLines) {
            this.terminalContent.removeChild(this.terminalContent.firstChild);
        }

        // Auto-scroll al final
        this.terminalContent.scrollTop = this.terminalContent.scrollHeight;
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
        this.trancheNumber = document.getElementById('nav-tranche-number');
        this.trancheTime = document.getElementById('nav-tranche-time');
        this.totalTime = document.getElementById('nav-total-time');
        this.prevBtn = document.getElementById('nav-prev-tranche');
        this.nextBtn = document.getElementById('nav-next-tranche');

        this.currentTranche = 0;
        this.totalTranches = 0;
        this.totalElapsedSeconds = 0;

        this.setupEventListeners();
        this.startTimeCounter();
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
        // Esta función será llamada cuando se implemente el sistema de velocidad
        if (terminal) {
            terminal.info(`Velocidad de nave ajustada a ${speed}%`);
        }
    }

    setTrancheInfo(current, total) {
        this.currentTranche = current;
        this.totalTranches = total;
        if (this.trancheNumber) {
            this.trancheNumber.textContent = `${current} / ${total}`;
        }

        // Habilitar/deshabilitar botones
        if (this.prevBtn) {
            this.prevBtn.disabled = current <= 1;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = current >= total;
        }
    }

    updateTrancheTime(seconds) {
        if (this.trancheTime) {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            this.trancheTime.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
    }

    startTimeCounter() {
        setInterval(() => {
            this.totalElapsedSeconds++;
            this.updateTotalTime();
        }, 1000);
    }

    updateTotalTime() {
        if (this.totalTime) {
            const hours = Math.floor(this.totalElapsedSeconds / 3600);
            const minutes = Math.floor((this.totalElapsedSeconds % 3600) / 60);
            const seconds = this.totalElapsedSeconds % 60;
            this.totalTime.textContent = `${String(hours).padStart(3, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }
}

// Instancia global de controles de navegación
let navControls = null;

// Inicializar controles cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    navControls = new NavigationControls();
});

/* === FUNCIONES DE TRAMOS === */
function previousTranche() {
    if (navControls && navControls.currentTranche > 1) {
        if (terminal) {
            terminal.info('Navegación: No se puede retroceder en el tiempo');
            terminal.warning('Función de tramo anterior no disponible durante el viaje');
        }
    }
}

function nextTranche() {
    if (navControls) {
        if (terminal) {
            terminal.info('Avanzando al siguiente tramo...');
        }
        // Esta función será implementada en el sistema de game loop
    }
}

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
