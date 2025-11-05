// ============================================
// MAPA DE LA NAVE CON GRILLA - ODISEUM V2.0
// ============================================

/* === SISTEMA DE MAPA DE LA NAVE === */
class ShipMapSystem {
    constructor() {
        // Grilla 18x12 con forma específica de nave
        // PM=Puente, ENF=Enfermería, COC=Cocina, SUE=Cápsulas, BOD=Bodega, P=Pasillo, .=Vacío
        this.grid = [
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'C', 'C', '.', '.', '.', '.'],  // Fila 1
            ['.', '.', '.', '.', '.', '.', 'P', '.', '.', '.', '.', '.', 'C', 'C', '.', '.', '.', '.'],  // Fila 2
            ['.', '.', '.', 'E', 'E', '.', 'P', '.', '.', '.', '.', '.', '.', 'B', 'B', 'B', '.', '.'],  // Fila 3
            ['.', '.', '.', 'E', 'E', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'B', 'B', 'B', '.', '.'],  // Fila 4
            ['.', '.', '.', '.', '.', '.', 'P', '.', '.', '.', '.', '.', '.', '.', 'P', '.', '.', '.'],  // Fila 5
            ['.', '.', '.', '.', '.', '.', 'P', '.', '.', '.', '.', '.', '.', 'S', 'S', 'S', '.', '.'],  // Fila 6
            ['.', '.', '.', '.', '.', 'P', 'P', 'P', 'P', 'P', 'P', 'P', '.', 'S', 'S', 'S', '.', '.'],  // Fila 7
            ['.', 'G', 'G', 'P', 'P', 'P', 'P', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 8
            ['.', 'G', 'G', 'P', '.', '.', 'P', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 9
            ['.', 'G', 'G', '.', '.', '.', 'P', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 10
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 11
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.']   // Fila 12
        ];

        this.rows = 12;
        this.cols = 18;

        // Zonas y sus tiles principales
        this.zones = {
            bridge: { name: 'Puente de Mando', icon: '🎮', tiles: this.findTiles('B'), color: '#00ff41' },
            medbay: { name: 'Enfermería', icon: '🏥', tiles: this.findTiles('E'), color: '#ff4444' },
            kitchen: { name: 'Cocina', icon: '🍳', tiles: this.findTiles('C'), color: '#ffaa44' },
            capsules: { name: 'Cápsulas Sueño', icon: '🛏️', tiles: this.findTiles('S'), color: '#4488ff' },
            cargo: { name: 'Bodega', icon: '📦', tiles: this.findTiles('G'), color: '#888888' }
        };

        this.crewLocations = {};
        this.crewTargets = {};
        this.crewPaths = {};
        this.crewIcons = {
            'Cpt. Rivera': '👨‍✈️',
            'Dra. Chen': '👩‍⚕️',
            'Ing. Patel': '👨‍🔧',
            'Dr. Johnson': '👨‍🔬',
            'Chef Dubois': '👨‍🍳'
        };

        this.isVisible = false; // Mapa oculto por defecto
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

    toggleVisibility() {
        this.isVisible = !this.isVisible;
        const container = document.getElementById('ship-map-container');
        if (container) {
            container.style.display = this.isVisible ? 'flex' : 'none';
        }

        // Actualizar botón
        const button = document.getElementById('toggle-map-btn');
        if (button) {
            button.textContent = this.isVisible ? '🗺️ Ocultar Mapa' : '🗺️ Ver Mapa';
        }
    }

    initialize() {
        this.createMapUI();
        this.updateCrewLocations();
        this.startAutoUpdate();

        // Ocultar por defecto
        const container = document.getElementById('ship-map-container');
        if (container) {
            container.style.display = 'none';
        }
    }

    createMapUI() {
        const mapContainer = document.getElementById('ship-map-container');
        if (!mapContainer) return;

        mapContainer.innerHTML = `
            <div class="ship-map-title">
                <span>🚀 MAPA DE LA NAVE - ODISEUM</span>
                <button class="map-close-btn" onclick="shipMapSystem.toggleVisibility()">×</button>
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
            '.': 'cell-empty'
        };
        return classes[type] || 'cell-empty';
    }

    getCellLabel(type, row, col) {
        const labels = {
            'B': '🎮',
            'E': '🏥',
            'C': '🍳',
            'S': '🛏️',
            'G': '📦'
        };

        // Mostrar solo en el centro de cada zona
        if (type === 'B' && row === 3 && col === 14) return labels[type];
        if (type === 'E' && row === 3 && col === 4) return labels[type];
        if (type === 'C' && row === 1 && col === 12) return labels[type];
        if (type === 'S' && row === 6 && col === 14) return labels[type];
        if (type === 'G' && row === 8 && col === 2) return labels[type];

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

        if (crew.state === 'Encapsulado') {
            return 'capsules';
        }

        if (crew.state === 'Despierto') {
            const activity = crew.currentActivity?.toLowerCase() || '';

            if (activity.includes('atendiendo')) {
                return 'medbay';
            }

            if (crew.healthNeed < 50) {
                return 'medbay';
            }

            if (crew.foodNeed < 40) {
                return 'kitchen';
            }

            // Mapeo de roles a zonas disponibles
            switch (crew.role) {
                case 'commander': return 'bridge';
                case 'doctor': return 'medbay';
                case 'engineer': return 'cargo'; // Ingeniería → Bodega (más cercano disponible)
                case 'cook': return 'kitchen';
                case 'scientist': return 'cargo'; // Invernadero → Bodega
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

            if (currentTarget !== targetZone) {
                this.crewTargets[crew.id] = targetZone;
                const targetPos = this.getRandomTileInZone(targetZone);

                if (!currentPos) {
                    this.crewLocations[crew.id] = targetPos;
                    this.createOrUpdateCrewMarker(crew, targetPos);
                } else {
                    const path = this.findPath(currentPos, targetPos);
                    if (path.length > 1) {
                        this.crewPaths[crew.id] = path;
                        this.animateCrewMovement(crew);
                    }
                }
            } else {
                if (currentPos) {
                    this.createOrUpdateCrewMarker(crew, currentPos);
                }
            }
        });
    }

    animateCrewMovement(crew) {
        const path = this.crewPaths[crew.id];
        if (!path || path.length <= 1) return;

        let stepIndex = 0;
        const moveSpeed = 400;

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

        marker.style.gridRow = pos.row + 1;
        marker.style.gridColumn = pos.col + 1;

        const icon = this.getCrewIcon(crew);
        marker.innerHTML = `
            <div class="crew-icon-grid">${icon}</div>
            <div class="crew-name-grid">${crew.name.split(' ')[0]}</div>
        `;

        marker.onclick = () => {
            if (typeof openCrewManagementPopup === 'function') {
                openCrewManagementPopup(crew.name);
            }
        };

        marker.title = `${crew.name} - ${crew.position}`;
    }

    startAutoUpdate() {
        setInterval(() => {
            if (this.isVisible) {
                this.updateCrewLocations();
            }
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
