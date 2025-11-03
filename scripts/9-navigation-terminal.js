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
        // Esta función será llamada cuando se implemente el sistema de velocidad
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
});

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
