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
        this.crewIcons = {
            'Cpt. Rivera': '👨‍✈️',
            'Dra. Chen': '👩‍⚕️',
            'Ing. Patel': '👨‍🔧',
            'Dr. Johnson': '👨‍🔬',
            'Chef Dubois': '👨‍🍳'
        };
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
                <span>🚀 MAPA DE LA NAVE - ODISEUM</span>
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

    getCrewIcon(crew) {
        // Primero intentar obtener el icono personalizado
        if (this.crewIcons[crew.name]) {
            return this.crewIcons[crew.name];
        }

        // Fallback según el rol
        switch (crew.role) {
            case 'commander':
                return '👨‍✈️';
            case 'doctor':
                return '👩‍⚕️';
            case 'engineer':
                return '👨‍🔧';
            case 'cook':
                return '👨‍🍳';
            case 'scientist':
                return '👨‍🔬';
            default:
                return '👤';
        }
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

        // Actualizar o crear marcadores
        crewMembers.forEach(crew => {
            const zone = this.getCrewZone(crew);
            if (!zone || !this.zones[zone]) return;

            const oldZone = this.crewLocations[crew.id];
            this.crewLocations[crew.id] = zone;

            // Buscar marcador existente
            let marker = document.getElementById(`crew-marker-${crew.id}`);

            if (!marker) {
                // Crear nuevo marcador
                marker = this.createCrewMarker(crew, zone);
                markersContainer.appendChild(marker);
            } else {
                // Actualizar marcador existente
                this.updateCrewMarker(marker, crew, zone, oldZone);
            }
        });

        // Limpiar marcadores de tripulantes que ya no existen
        const allMarkers = markersContainer.querySelectorAll('.crew-marker');
        allMarkers.forEach(marker => {
            const crewId = parseInt(marker.dataset.crewId);
            const exists = crewMembers.some(c => c.id === crewId);
            if (!exists) {
                marker.remove();
            }
        });
    }

    createCrewMarker(crew, zone) {
        const marker = document.createElement('div');
        marker.className = 'crew-marker';
        marker.id = `crew-marker-${crew.id}`;
        marker.dataset.crewId = crew.id;
        marker.title = `${crew.name} - ${crew.position}`;

        // Añadir estado visual
        this.setMarkerState(marker, crew);

        // Posicionar en la zona con offset aleatorio
        this.positionMarker(marker, zone);

        // Contenido del marcador - ICONO en lugar de punto
        const icon = this.getCrewIcon(crew);
        marker.innerHTML = `
            <div class="crew-marker-icon">${icon}</div>
            <div class="crew-marker-label">${crew.name.split(' ')[0]}</div>
        `;

        // Click para abrir ficha
        marker.onclick = () => {
            if (typeof openCrewManagementPopup === 'function') {
                openCrewManagementPopup(crew.name);
            }
        };

        return marker;
    }

    updateCrewMarker(marker, crew, zone, oldZone) {
        // Actualizar estado visual
        this.setMarkerState(marker, crew);

        // Actualizar icono
        const iconElement = marker.querySelector('.crew-marker-icon');
        if (iconElement) {
            iconElement.textContent = this.getCrewIcon(crew);
        }

        // Si cambió de zona, animar movimiento
        if (oldZone && oldZone !== zone && crew.isAlive) {
            marker.classList.add('moving');
            setTimeout(() => marker.classList.remove('moving'), 1000);
        }

        // Actualizar posición con transición suave
        this.positionMarker(marker, zone);
    }

    setMarkerState(marker, crew) {
        // Limpiar clases de estado
        marker.classList.remove('active', 'sleeping', 'resting', 'dead');

        // Añadir clase según estado
        if (!crew.isAlive) {
            marker.classList.add('dead');
        } else if (crew.state === 'Encapsulado') {
            marker.classList.add('sleeping');
        } else if (crew.state === CREW_STATES.RESTING) {
            marker.classList.add('resting');
        } else {
            marker.classList.add('active');
        }
    }

    positionMarker(marker, zone) {
        const zoneData = this.zones[zone];

        // Offset aleatorio pero consistente (usar ID del marcador como seed)
        const crewId = parseInt(marker.dataset.crewId);
        const seed = crewId * 123.456; // Simple seed
        const offsetX = (Math.sin(seed) * 8); // -8 a +8
        const offsetY = (Math.cos(seed) * 8);

        marker.style.left = `${zoneData.x + offsetX}%`;
        marker.style.top = `${zoneData.y + offsetY}%`;
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
