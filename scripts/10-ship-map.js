// ============================================
// MAPA DE LA NAVE - ODISEUM V2.0
// ============================================

/* === SISTEMA DE MAPA DE LA NAVE === */
class ShipMapSystem {
    constructor() {
        this.zones = {
            capsules: { name: 'Cápsulas', icon: '🛏️', x: 15, y: 20 },
            cockpit: { name: 'Control', icon: '🎮', x: 50, y: 10 },
            engineering: { name: 'Ingeniería', icon: '⚙️', x: 85, y: 20 },
            medbay: { name: 'Enfermería', icon: '🏥', x: 20, y: 50 },
            kitchen: { name: 'Cocina', icon: '🍳', x: 50, y: 50 },
            greenhouse: { name: 'Invernadero', icon: '🌱', x: 80, y: 50 },
            ops: { name: 'Operaciones', icon: '📊', x: 50, y: 80 }
        };

        this.crewLocations = {};
        this.movingCrew = new Map(); // Para animaciones de movimiento
    }

    initialize() {
        this.createMapUI();
        this.updateCrewLocations();
    }

    createMapUI() {
        const mapContainer = document.getElementById('ship-map-container');
        if (!mapContainer) return;

        mapContainer.innerHTML = `
            <div class="ship-map-title">
                <span>🚀 MAPA DE LA NAVE</span>
            </div>
            <div class="ship-map-canvas" id="ship-map-canvas">
                <svg class="ship-outline" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <!-- Casco de la nave -->
                    <path d="M 50 5 L 90 30 L 90 70 L 50 95 L 10 70 L 10 30 Z"
                          fill="none"
                          stroke="var(--color-terminal-green)"
                          stroke-width="0.5"
                          opacity="0.3"/>

                    <!-- Líneas internas de secciones -->
                    <line x1="10" y1="35" x2="90" y2="35"
                          stroke="var(--color-terminal-green)"
                          stroke-width="0.3"
                          opacity="0.2"/>
                    <line x1="10" y1="65" x2="90" y2="65"
                          stroke="var(--color-terminal-green)"
                          stroke-width="0.3"
                          opacity="0.2"/>
                    <line x1="33" y1="10" x2="33" y2="90"
                          stroke="var(--color-terminal-green)"
                          stroke-width="0.3"
                          opacity="0.2"/>
                    <line x1="67" y1="10" x2="67" y2="90"
                          stroke="var(--color-terminal-green)"
                          stroke-width="0.3"
                          opacity="0.2"/>
                </svg>
                <div class="ship-zones" id="ship-zones">
                    ${this.generateZonesHTML()}
                </div>
                <div class="ship-crew-markers" id="ship-crew-markers">
                    <!-- Se generan dinámicamente -->
                </div>
            </div>
        `;
    }

    generateZonesHTML() {
        return Object.entries(this.zones).map(([key, zone]) => `
            <div class="ship-zone"
                 data-zone="${key}"
                 style="left: ${zone.x}%; top: ${zone.y}%;"
                 title="${zone.name}">
                <div class="zone-icon">${zone.icon}</div>
                <div class="zone-label">${zone.name}</div>
            </div>
        `).join('');
    }

    getCrewZone(crew) {
        if (!crew.isAlive) return null;

        // Si está encapsulado, está en las cápsulas
        if (crew.state === 'Encapsulado') {
            return 'capsules';
        }

        // Si está en estado de descanso profundo, también en cápsulas
        if (crew.state === CREW_STATES.RESTING) {
            return 'capsules';
        }

        // Si está operativo, determinar zona por rol y actividad
        if (crew.state === 'Despierto') {
            // Primero verificar actividad actual
            const activity = crew.currentActivity?.toLowerCase() || '';

            // Actividades específicas
            if (activity.includes('atendiendo') || activity === 'resting') {
                return 'medbay';
            }
            if (activity.includes('eating') || activity === 'eating') {
                return 'kitchen';
            }
            if (activity.includes('cleaning')) {
                return 'ops';
            }
            if (activity.includes('socializing')) {
                return Math.random() > 0.5 ? 'kitchen' : 'ops';
            }

            // Zona por defecto según el rol
            switch (crew.role) {
                case 'commander':
                    return 'cockpit';
                case 'doctor':
                    return 'medbay';
                case 'engineer':
                    return 'engineering';
                case 'cook':
                    return 'kitchen';
                case 'scientist':
                    return Math.random() > 0.5 ? 'greenhouse' : 'ops';
                default:
                    return 'ops';
            }
        }

        return 'ops'; // Fallback
    }

    updateCrewLocations() {
        if (!Array.isArray(crewMembers)) return;

        const markersContainer = document.getElementById('ship-crew-markers');
        if (!markersContainer) return;

        // Limpiar marcadores anteriores
        markersContainer.innerHTML = '';

        // Crear nuevos marcadores
        crewMembers.forEach(crew => {
            const zone = this.getCrewZone(crew);
            if (!zone || !this.zones[zone]) return;

            const oldZone = this.crewLocations[crew.id];
            this.crewLocations[crew.id] = zone;

            // Crear marcador
            const marker = document.createElement('div');
            marker.className = 'crew-marker';
            marker.id = `crew-marker-${crew.id}`;
            marker.dataset.crewId = crew.id;
            marker.title = `${crew.name} - ${crew.position}`;

            // Añadir estado visual
            if (!crew.isAlive) {
                marker.classList.add('dead');
            } else if (crew.state === 'Encapsulado') {
                marker.classList.add('sleeping');
            } else if (crew.state === CREW_STATES.RESTING) {
                marker.classList.add('resting');
            } else {
                marker.classList.add('active');
            }

            // Posicionar en la zona
            const zoneData = this.zones[zone];
            const offsetX = (Math.random() - 0.5) * 8; // Desplazamiento aleatorio
            const offsetY = (Math.random() - 0.5) * 8;

            marker.style.left = `${zoneData.x + offsetX}%`;
            marker.style.top = `${zoneData.y + offsetY}%`;

            // Contenido del marcador
            marker.innerHTML = `
                <div class="crew-marker-dot"></div>
                <div class="crew-marker-label">${crew.name.split(' ')[0]}</div>
            `;

            // Click para abrir ficha
            marker.onclick = () => {
                if (typeof openCrewManagementPopup === 'function') {
                    openCrewManagementPopup(crew.name);
                }
            };

            // Animar si cambió de zona
            if (oldZone && oldZone !== zone && crew.isAlive) {
                marker.classList.add('moving');
                setTimeout(() => marker.classList.remove('moving'), 1000);
            }

            markersContainer.appendChild(marker);
        });
    }

    // Actualizar el mapa periódicamente
    startAutoUpdate() {
        setInterval(() => {
            this.updateCrewLocations();
        }, 3000); // Actualizar cada 3 segundos
    }
}

// Instancia global
let shipMapSystem = new ShipMapSystem();

// Inicializar cuando el DOM esté listo
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // Esperar un poco para asegurar que todo esté cargado
        setTimeout(() => {
            if (shipMapSystem && typeof shipMapSystem.initialize === 'function') {
                shipMapSystem.initialize();
                shipMapSystem.startAutoUpdate();
            }
        }, 1000);
    });

    // Exponer globalmente para debugging
    window.shipMapSystem = shipMapSystem;
}
