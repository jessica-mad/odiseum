// ============================================
// MAPA DE LA NAVE CON GRILLA - ODISEUM V2.0
// ============================================

/* === SISTEMA DE MAPA DE LA NAVE === */
class ShipMapSystem {
    constructor() {
        // Grilla 18x12 más detallada de la nave
        // B=Puente, P=Pasillo, E=Enfermería, C=Cocina, S=Cápsulas, G=Bodega, I=Ingeniería, V=Invernadero
        this.grid = [
            ['.', '.', '.', '.', '.', 'B', 'B', 'B', 'B', 'B', 'B', '.', '.', '.', '.', '.', '.', '.'],  // Fila 1
            ['.', '.', '.', '.', 'P', 'B', 'B', 'B', 'B', 'B', 'B', 'P', '.', '.', '.', '.', '.', '.'],  // Fila 2
            ['.', '.', '.', '.', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', '.', '.', '.', '.', '.', '.'],  // Fila 3
            ['E', 'E', 'E', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'C', 'C', 'C', '.', '.'],  // Fila 4
            ['E', 'E', 'E', 'P', 'I', 'I', 'I', 'P', 'P', 'P', 'V', 'V', 'P', 'C', 'C', 'C', '.', '.'],  // Fila 5
            ['E', 'E', 'E', 'P', 'I', 'I', 'I', 'P', '.', 'P', 'V', 'V', 'P', 'C', 'C', 'C', '.', '.'],  // Fila 6
            ['P', 'P', 'P', 'P', 'I', 'I', 'I', 'P', '.', 'P', 'V', 'V', 'P', 'P', 'P', 'P', 'P', 'S'],  // Fila 7
            ['.', '.', '.', 'P', 'P', 'P', 'P', 'P', '.', 'P', 'V', 'V', 'V', 'V', 'P', 'S', 'S', 'S'],  // Fila 8
            ['.', '.', '.', '.', '.', '.', '.', 'P', '.', 'P', 'P', 'P', 'P', 'P', 'P', 'S', 'S', 'S'],  // Fila 9
            ['.', '.', '.', '.', '.', '.', '.', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'S', 'S', 'S'],  // Fila 10
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', 'G', 'G', 'G', 'P', 'P', 'P', 'P', 'P', 'P'],  // Fila 11
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', 'G', 'G', 'G', '.', '.', '.', '.', '.', '.']   // Fila 12
        ];

        this.rows = 12;
        this.cols = 18;

        // Zonas y sus tiles principales
        this.zones = {
            bridge: { name: 'Puente', icon: '🎮', tiles: this.findTiles('B'), color: '#00ff41' },
            medbay: { name: 'Enfermería', icon: '🏥', tiles: this.findTiles('E'), color: '#ff4444' },
            kitchen: { name: 'Cocina', icon: '🍳', tiles: this.findTiles('C'), color: '#ffaa44' },
            capsules: { name: 'Cápsulas', icon: '🛏️', tiles: this.findTiles('S'), color: '#4488ff' },
            cargo: { name: 'Bodega', icon: '📦', tiles: this.findTiles('G'), color: '#888888' },
            engineering: { name: 'Ingeniería', icon: '⚙️', tiles: this.findTiles('I'), color: '#ff8800' },
            greenhouse: { name: 'Invernadero', icon: '🌱', tiles: this.findTiles('V'), color: '#44ff44' }
        };

        this.crewLocations = {}; // { crewId: { row, col } }
        this.crewTargets = {}; // { crewId: zone }
        this.crewPaths = {}; // { crewId: [{ row, col }, ...] }
        this.crewIcons = {
            'Cpt. Rivera': '👨‍✈️',
            'Dra. Chen': '👩‍⚕️',
            'Ing. Patel': '👨‍🔧',
            'Dr. Johnson': '👨‍🔬',
            'Chef Dubois': '👨‍🍳'
        };
    }

    findTiles(type) {
        const tiles = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.grid[row][col] === type) {
                    tiles.push({ row, col });
                }
            }
        }
        return tiles;
    }

    initialize() {
        this.createMapUI();
        this.updateCrewLocations();
        this.startAutoUpdate();
    }

    createMapUI() {
        const mapContainer = document.getElementById('ship-map-container');
        if (!mapContainer) return;

        mapContainer.innerHTML = `
            <div class="ship-map-title">
                <span>🚀 MAPA DE LA NAVE - ODISEUM</span>
            </div>
            <div class="ship-map-grid" id="ship-map-grid">
                ${this.generateGridHTML()}
            </div>
        `;
    }

    generateGridHTML() {
        let html = '';

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cellType = this.grid[row][col];
                const cellClass = this.getCellClass(cellType);
                const cellLabel = this.getCellLabel(cellType, row, col);

                html += `
                    <div class="grid-cell ${cellClass}"
                         data-row="${row}"
                         data-col="${col}"
                         data-type="${cellType}">
                        ${cellLabel ? `<span class="cell-label">${cellLabel}</span>` : ''}
                    </div>
                `;
            }
        }

        return html;
    }

    getCellClass(type) {
        const classes = {
            'B': 'cell-bridge',
            'P': 'cell-corridor',
            'E': 'cell-medbay',
            'C': 'cell-kitchen',
            'S': 'cell-capsules',
            'G': 'cell-cargo',
            'I': 'cell-engineering',
            'V': 'cell-greenhouse',
            '.': 'cell-empty'
        };
        return classes[type] || 'cell-empty';
    }

    getCellLabel(type, row, col) {
        // Solo mostrar labels en posiciones centrales de cada zona
        const labels = {
            'B': '🎮',
            'E': '🏥',
            'C': '🍳',
            'S': '🛏️',
            'G': '📦',
            'I': '⚙️',
            'V': '🌱'
        };

        // Mostrar solo en el centro aproximado de cada zona
        if (type === 'B' && row === 1 && col === 7) return labels[type];
        if (type === 'E' && row === 4 && col === 1) return labels[type];
        if (type === 'C' && row === 5 && col === 14) return labels[type];
        if (type === 'S' && row === 8 && col === 16) return labels[type];
        if (type === 'G' && row === 11 && col === 10) return labels[type];
        if (type === 'I' && row === 5 && col === 5) return labels[type];
        if (type === 'V' && row === 7 && col === 11) return labels[type];

        return '';
    }

    getCrewIcon(crew) {
        if (this.crewIcons[crew.name]) {
            return this.crewIcons[crew.name];
        }

        switch (crew.role) {
            case 'commander': return '👨‍✈️';
            case 'doctor': return '👩‍⚕️';
            case 'engineer': return '👨‍🔧';
            case 'cook': return '👨‍🍳';
            case 'scientist': return '👨‍🔬';
            default: return '👤';
        }
    }

    getTargetZoneForCrew(crew) {
        if (!crew.isAlive) return null;

        // Estado principal
        if (crew.state === 'Encapsulado') {
            return 'capsules';
        }

        // Si está operativo, analizar necesidades y actividades
        if (crew.state === 'Despierto') {
            const activity = crew.currentActivity?.toLowerCase() || '';

            // Prioridad 1: Actividades específicas
            if (activity.includes('atendiendo')) {
                return 'medbay'; // Doctora atendiendo paciente
            }

            // Prioridad 2: Necesidades críticas
            if (crew.healthNeed < 50) {
                return 'medbay'; // Necesita atención médica
            }

            if (crew.foodNeed < 40) {
                return 'kitchen'; // Tiene hambre
            }

            // Prioridad 3: Zona de trabajo según rol
            switch (crew.role) {
                case 'commander': return 'bridge';
                case 'doctor': return 'medbay';
                case 'engineer': return 'engineering';
                case 'cook': return 'kitchen';
                case 'scientist': return 'greenhouse';
                default: return 'bridge';
            }
        }

        return 'capsules';
    }

    getRandomTileInZone(zone) {
        if (!this.zones[zone] || !this.zones[zone].tiles.length) {
            return { row: 6, col: 9 };
        }

        const tiles = this.zones[zone].tiles;
        return tiles[Math.floor(Math.random() * tiles.length)];
    }

    findPath(start, end) {
        if (!start || !end) return [];
        if (start.row === end.row && start.col === end.col) return [end];

        const queue = [[start]];
        const visited = new Set();
        visited.add(`${start.row},${start.col}`);

        while (queue.length > 0) {
            const path = queue.shift();
            const current = path[path.length - 1];

            if (current.row === end.row && current.col === end.col) {
                return path;
            }

            const neighbors = [
                { row: current.row - 1, col: current.col },
                { row: current.row + 1, col: current.col },
                { row: current.row, col: current.col - 1 },
                { row: current.row, col: current.col + 1 }
            ];

            for (const neighbor of neighbors) {
                const key = `${neighbor.row},${neighbor.col}`;

                if (neighbor.row < 0 || neighbor.row >= this.rows ||
                    neighbor.col < 0 || neighbor.col >= this.cols) {
                    continue;
                }

                if (visited.has(key)) continue;

                const cellType = this.grid[neighbor.row][neighbor.col];
                if (cellType === '.') continue;

                visited.add(key);
                queue.push([...path, neighbor]);
            }
        }

        return [end];
    }

    updateCrewLocations() {
        if (!Array.isArray(crewMembers)) return;

        const gridContainer = document.getElementById('ship-map-grid');
        if (!gridContainer) return;

        crewMembers.forEach(crew => {
            const targetZone = this.getTargetZoneForCrew(crew);
            if (!targetZone) return;

            const currentPos = this.crewLocations[crew.id];
            const currentTarget = this.crewTargets[crew.id];

            // Si cambió de zona objetivo
            if (currentTarget !== targetZone) {
                this.crewTargets[crew.id] = targetZone;
                const targetPos = this.getRandomTileInZone(targetZone);

                if (!currentPos) {
                    // Primera vez, colocar directamente
                    this.crewLocations[crew.id] = targetPos;
                    this.createOrUpdateCrewMarker(crew, targetPos);
                } else {
                    // Calcular path y mover
                    const path = this.findPath(currentPos, targetPos);
                    if (path.length > 1) {
                        this.crewPaths[crew.id] = path;
                        this.animateCrewMovement(crew);
                    }
                }
            } else {
                // Actualizar marcador en posición actual
                if (currentPos) {
                    this.createOrUpdateCrewMarker(crew, currentPos);
                }
            }
        });
    }

    getZoneAtPosition(pos) {
        const cellType = this.grid[pos.row][pos.col];
        const zoneMap = {
            'B': 'bridge',
            'E': 'medbay',
            'C': 'kitchen',
            'S': 'capsules',
            'G': 'cargo',
            'I': 'engineering',
            'V': 'greenhouse'
        };
        return zoneMap[cellType] || null;
    }

    animateCrewMovement(crew) {
        const path = this.crewPaths[crew.id];
        if (!path || path.length <= 1) return;

        let stepIndex = 0;
        const moveSpeed = 400; // Más rápido: 400ms por paso

        const moveStep = () => {
            if (stepIndex >= path.length) {
                delete this.crewPaths[crew.id];
                return;
            }

            const pos = path[stepIndex];
            this.crewLocations[crew.id] = pos;
            this.createOrUpdateCrewMarker(crew, pos);

            stepIndex++;
            if (stepIndex < path.length) {
                setTimeout(moveStep, moveSpeed);
            }
        };

        moveStep();
    }

    createOrUpdateCrewMarker(crew, pos) {
        const gridContainer = document.getElementById('ship-map-grid');
        if (!gridContainer) return;

        let marker = document.getElementById(`crew-marker-${crew.id}`);

        if (!marker) {
            marker = document.createElement('div');
            marker.className = 'crew-marker-grid';
            marker.id = `crew-marker-${crew.id}`;
            marker.dataset.crewId = crew.id;
            gridContainer.appendChild(marker);
        }

        // Actualizar estado
        marker.className = 'crew-marker-grid';
        if (!crew.isAlive) {
            marker.classList.add('dead');
        } else if (crew.state === 'Encapsulado') {
            marker.classList.add('sleeping');
        } else if (crew.state === CREW_STATES.RESTING) {
            marker.classList.add('resting');
        } else {
            marker.classList.add('active');
        }

        // Actualizar posición
        marker.style.gridRow = pos.row + 1;
        marker.style.gridColumn = pos.col + 1;

        // Actualizar icono
        const icon = this.getCrewIcon(crew);
        marker.innerHTML = `
            <div class="crew-icon-grid">${icon}</div>
            <div class="crew-name-grid">${crew.name.split(' ')[0]}</div>
        `;

        // Click handler
        marker.onclick = () => {
            if (typeof openCrewManagementPopup === 'function') {
                openCrewManagementPopup(crew.name);
            }
        };

        marker.title = `${crew.name} - ${crew.position}`;
    }

    startAutoUpdate() {
        // Actualizar cada 3 segundos
        setInterval(() => {
            this.updateCrewLocations();
        }, 3000);
    }
}

// Instancia global
let shipMapSystem = new ShipMapSystem();

// Inicializar cuando el DOM esté listo
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (shipMapSystem && typeof shipMapSystem.initialize === 'function') {
                shipMapSystem.initialize();
            }
        }, 1000);
    });

    window.shipMapSystem = shipMapSystem;
}
