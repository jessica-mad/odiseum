// ============================================
// MAPA DE LA NAVE CON GRILLA - ODISEUM V2.0
// ============================================

/* === SISTEMA DE MAPA DE LA NAVE === */
class ShipMapSystem {
    constructor() {
        // Grilla 25x25 con forma específica de nave
        // C=Control/Puente, E=Enfermería, G=Ingeniería, K=Cocina, N=Invernadero, D=Cápsulas, B=Bodega, P=Pasillo, .=Vacío
        this.grid = [
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 1
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'C', 'C', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 2
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'C', 'C', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 3
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', 'C', 'C', 'C', 'C', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 4
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', 'C', 'C', 'C', 'C', 'C', 'C', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 5
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'P', 'P', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 6
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'P', 'P', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 7
            ['.', '.', '.', '.', '.', '.', '.', '.', 'E', 'E', 'E', 'P', 'P', 'G', 'G', 'G', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 8
            ['.', '.', '.', '.', '.', '.', '.', 'E', 'E', 'E', 'E', 'P', 'P', 'G', 'G', 'G', 'G', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 9
            ['.', '.', '.', '.', '.', '.', 'E', 'E', 'E', '.', '.', 'P', 'P', '.', '.', 'G', 'G', 'G', '.', '.', '.', '.', '.', '.', '.'],  // Fila 10
            ['.', '.', '.', '.', '.', '.', '.', 'D', 'D', '.', '.', 'P', 'P', '.', '.', 'K', 'K', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 11
            ['.', '.', '.', '.', '.', '.', '.', 'D', 'D', '.', '.', 'P', 'P', '.', '.', 'K', 'K', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 12
            ['.', '.', '.', '.', '.', '.', '.', 'D', 'D', 'P', 'P', 'P', 'P', 'P', 'P', 'K', 'K', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 13
            ['.', '.', '.', '.', '.', '.', '.', 'D', 'D', '.', '.', 'P', 'P', '.', '.', 'N', 'N', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 14
            ['.', '.', '.', '.', '.', '.', '.', 'D', 'D', '.', '.', 'P', 'P', '.', '.', 'N', 'N', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 15
            ['.', '.', '.', '.', '.', '.', '.', 'D', 'D', '.', '.', 'P', 'P', '.', '.', 'N', 'N', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 16
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'P', 'P', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 17
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'P', 'P', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 18
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'P', 'P', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 19
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'P', 'P', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 20
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'B', 'B', 'B', 'B', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 21
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'B', 'B', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 22
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 23
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 24
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.']   // Fila 25
        ];

        this.rows = 25;
        this.cols = 25;

        // Zonas y sus tiles principales (con sistema de averías)
        this.zones = {
            bridge: {
                name: 'Control', icon: '🎮', tiles: this.findTiles('C'), color: '#00ff41',
                integrity: 100, maxIntegrity: 100, degradationRate: 0.5, isBroken: false
            },
            medbay: {
                name: 'Enfermería', icon: '🏥', tiles: this.findTiles('E'), color: '#ff4444',
                integrity: 100, maxIntegrity: 100, degradationRate: 0.7, isBroken: false
            },
            engineering: {
                name: 'Ingeniería', icon: '⚙️', tiles: this.findTiles('G'), color: '#ffaa00',
                integrity: 100, maxIntegrity: 100, degradationRate: 0.4, isBroken: false
            },
            kitchen: {
                name: 'Cocina', icon: '🍳', tiles: this.findTiles('K'), color: '#ff8844',
                integrity: 100, maxIntegrity: 100, degradationRate: 0.6, isBroken: false
            },
            greenhouse: {
                name: 'Invernadero', icon: '🌱', tiles: this.findTiles('N'), color: '#44ff44',
                integrity: 100, maxIntegrity: 100, degradationRate: 0.5, isBroken: false
            },
            capsules: {
                name: 'Cápsulas Sueño', icon: '🛏️', tiles: this.findTiles('D'), color: '#4488ff',
                integrity: 100, maxIntegrity: 100, degradationRate: 0.3, isBroken: false
            },
            cargo: {
                name: 'Bodega', icon: '📦', tiles: this.findTiles('B'), color: '#888888',
                integrity: 100, maxIntegrity: 100, degradationRate: 0.2, isBroken: false
            }
        };

        this.crewLocations = {};
        this.crewTargets = {};
        this.crewPaths = {};
        this.crewIcons = {
            'Capitán Silva': '👨‍✈️',
            'Dra. Chen': '👩‍⚕️',
            'Ing. Rodriguez': '👨‍🔧',
            'Lt. Johnson': '👨‍🚀',
            'Chef Patel': '👨‍🍳'
        };

        this.isVisible = false; // Mapa oculto por defecto
        this.zoomLevel = 1; // 1 = 100%, 0.5 = 50%, 2 = 200%
        this.minZoom = 0.5;
        this.maxZoom = 3;
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
        const sidebar = document.getElementById('ship-map-sidebar');
        if (sidebar) {
            if (this.isVisible) {
                sidebar.classList.add('visible');
            } else {
                sidebar.classList.remove('visible');
            }
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
        // El mapa inicia oculto por CSS (sin clase 'visible')
    }

    createMapUI() {
        const mapContainer = document.getElementById('ship-map-container');
        if (!mapContainer) return;

        mapContainer.innerHTML = `
            <div class="ship-map-layout">
                <div class="ship-map-zoom-controls">
                    <button class="zoom-btn" id="zoom-in-btn" title="Acercar (Zoom In)">
                        <span class="zoom-icon">+</span>
                    </button>
                    <button class="zoom-btn" id="zoom-reset-btn" title="Restablecer Zoom">
                        <span class="zoom-icon">⊙</span>
                    </button>
                    <button class="zoom-btn" id="zoom-out-btn" title="Alejar (Zoom Out)">
                        <span class="zoom-icon">−</span>
                    </button>
                </div>
                <div class="ship-map-zoom-wrapper" id="ship-map-zoom-wrapper">
                    <div class="ship-map-wrapper" id="ship-map-wrapper-inner">
                        <div class="ship-map-square-container">
                            <div class="ship-map-grid" id="ship-map-grid">
                                ${this.generateGridHTML()}
                            </div>
                            <div class="ship-map-crew-overlay" id="ship-map-crew-overlay">
                                <!-- Los tripulantes se renderizan aquí -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ship-map-rooms-status" id="ship-map-rooms-status">
                    ${this.generateRoomsStatusHTML()}
                </div>
            </div>
        `;

        // Setup zoom controls
        this.setupZoomControls();
    }

    generateRoomsStatusHTML() {
        let html = '<h4 class="rooms-status-title">ESTADO DE LA NAVE</h4><div class="rooms-status-grid">';

        Object.entries(this.zones).forEach(([zoneKey, zone]) => {
            const percentage = Math.round((zone.integrity / zone.maxIntegrity) * 100);
            let statusClass = 'good';
            if (percentage < 20) statusClass = 'critical';
            else if (percentage < 50) statusClass = 'warning';

            html += `
                <div class="room-status-card ${zone.isBroken ? 'broken' : ''}" data-zone="${zoneKey}">
                    <div class="room-status-header">
                        <span class="room-status-icon">${zone.icon}</span>
                        <span class="room-status-name">${zone.name}</span>
                    </div>
                    <div class="room-status-bar">
                        <div class="room-status-fill ${statusClass}" style="width: ${percentage}%"></div>
                    </div>
                    <div class="room-status-value">${percentage}%</div>
                    ${zone.isBroken ? '<div class="room-status-broken">⚠️ AVERIADA</div>' : ''}
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    setupZoomControls() {
        const zoomInBtn = document.getElementById('zoom-in-btn');
        const zoomOutBtn = document.getElementById('zoom-out-btn');
        const zoomResetBtn = document.getElementById('zoom-reset-btn');

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => this.zoomIn());
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => this.zoomOut());
        }

        if (zoomResetBtn) {
            zoomResetBtn.addEventListener('click', () => this.resetZoom());
        }
    }

    zoomIn() {
        if (this.zoomLevel < this.maxZoom) {
            this.zoomLevel += 0.25;
            this.applyZoom();
        }
    }

    zoomOut() {
        if (this.zoomLevel > this.minZoom) {
            this.zoomLevel -= 0.25;
            this.applyZoom();
        }
    }

    resetZoom() {
        this.zoomLevel = 1;
        this.applyZoom();
    }

    applyZoom() {
        const wrapper = document.getElementById('ship-map-wrapper-inner');
        if (wrapper) {
            wrapper.style.transform = `scale(${this.zoomLevel})`;
            wrapper.style.transformOrigin = 'center center';
            console.log(`🔍 Zoom aplicado: ${(this.zoomLevel * 100).toFixed(0)}%`);
        }
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
            'C': 'cell-bridge',       // Control
            'E': 'cell-medbay',       // Enfermería
            'G': 'cell-engineering',  // Ingeniería
            'K': 'cell-kitchen',      // Cocina
            'N': 'cell-greenhouse',   // Invernadero
            'D': 'cell-capsules',     // Cápsulas
            'B': 'cell-cargo',        // Bodega
            'P': 'cell-corridor',     // Pasillo
            '.': 'cell-empty'
        };
        return classes[type] || 'cell-empty';
    }

    getCellLabel(type, row, col) {
        const labels = {
            'C': '🎮',  // Control
            'E': '🏥',  // Enfermería
            'G': '⚙️',  // Ingeniería
            'K': '🍳',  // Cocina
            'N': '🌱',  // Invernadero
            'D': '🛏️',  // Cápsulas
            'B': '📦'   // Bodega
        };

        // Mostrar solo en el centro de cada zona (aproximado)
        if (type === 'C' && row === 3 && col === 11) return labels[type];   // Control
        if (type === 'E' && row === 8 && col === 8) return labels[type];    // Enfermería
        if (type === 'G' && row === 8 && col === 14) return labels[type];   // Ingeniería
        if (type === 'K' && row === 11 && col === 15) return labels[type];  // Cocina
        if (type === 'N' && row === 14 && col === 15) return labels[type];  // Invernadero
        if (type === 'D' && row === 12 && col === 7) return labels[type];   // Cápsulas
        if (type === 'B' && row === 20 && col === 11) return labels[type];  // Bodega

        return '';
    }

    /**
     * Convierte el tipo de celda en nombre de zona legible
     */
    getZoneNameFromCell(cellType) {
        const zoneNames = {
            'C': 'Puente de Mando',
            'E': 'Enfermería',
            'G': 'Sala de Máquinas',
            'K': 'Cocina',
            'N': 'Invernadero',
            'D': 'Cápsulas de Sueño',
            'B': 'Bodega',
            'P': 'Pasillo'
        };
        return zoneNames[cellType] || null;
    }

    /**
     * Obtiene la ubicación actual de un tripulante por su ID
     * @param {number} crewId - ID del tripulante
     * @returns {object|null} - Objeto con {name: 'Nombre de la Zona', type: 'moving'/'static'}
     */
    getCrewLocation(crewId) {
        const position = this.crewLocations[crewId];
        if (!position) return null;

        const { row, col } = position;
        const cellType = this.grid[row]?.[col];

        if (!cellType || cellType === '.') return null;

        // Si está en un pasillo y tiene un camino activo, está moviéndose
        if (cellType === 'P' && this.crewPaths[crewId]) {
            return {
                name: 'Desplazándose...',
                type: 'moving'
            };
        }

        // Devolver el nombre de la zona
        const zoneName = this.getZoneNameFromCell(cellType);
        return zoneName ? {
            name: zoneName,
            type: 'static'
        } : null;
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

            // Prioridad: atención médica
            if (activity.includes('atendiendo')) {
                return 'medbay';
            }

            if (crew.healthNeed < 50) {
                return 'medbay';
            }

            // Prioridad: alimentación
            if (crew.foodNeed < 40) {
                return 'kitchen';
            }

            // Mapeo de posiciones a zonas de trabajo
            const position = crew.position || '';

            // Navegante -> Puente de Mando (bridge)
            if (position.includes('Navegante')) {
                return 'bridge';
            }

            // Doctora -> Enfermería (medbay)
            if (position.includes('Doctor') || position.includes('Doctora')) {
                return 'medbay';
            }

            // Ingeniera -> Ingeniería (engineering)
            if (position.includes('Ingenier')) {
                return 'engineering';
            }

            // Botánica -> Invernadero (greenhouse)
            if (position.includes('Botánic')) {
                return 'greenhouse';
            }

            // Geóloga -> Alterna entre Bodega y Laboratorio
            // (usamos bodega como laboratorio)
            if (position.includes('Geólog')) {
                return Math.random() < 0.7 ? 'cargo' : 'bridge';
            }

            // Por defecto, van a su zona correspondiente o al puente
            return 'bridge';
        }

        return 'capsules';
    }

    /**
     * Verifica si una celda está ocupada por otro tripulante
     */
    isCellOccupied(row, col, excludeCrewId = null) {
        for (const [crewId, position] of Object.entries(this.crewLocations)) {
            if (excludeCrewId && crewId == excludeCrewId) continue;
            if (position.row === row && position.col === col) {
                return true;
            }
        }
        return false;
    }

    /**
     * Obtiene una celda aleatoria libre en una zona (sin colisiones)
     */
    getRandomTileInZone(zone, excludeCrewId = null) {
        if (!this.zones[zone] || !this.zones[zone].tiles.length) {
            return { row: 6, col: 9 };
        }

        const tiles = this.zones[zone].tiles;
        const availableTiles = tiles.filter(tile =>
            !this.isCellOccupied(tile.row, tile.col, excludeCrewId)
        );

        // Si no hay tiles disponibles, devolver uno aleatorio (fallback)
        if (availableTiles.length === 0) {
            console.warn(`⚠️ Zona ${zone} llena, usando tile aleatorio`);
            return tiles[Math.floor(Math.random() * tiles.length)];
        }

        return availableTiles[Math.floor(Math.random() * availableTiles.length)];
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
                const targetPos = this.getRandomTileInZone(targetZone, crew.id);

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
        const overlay = document.getElementById('ship-map-crew-overlay');
        if (!overlay) return;

        let marker = document.getElementById(`crew-marker-${crew.id}`);

        if (!marker) {
            marker = document.createElement('div');
            marker.className = 'crew-marker-overlay';
            marker.id = `crew-marker-${crew.id}`;
            marker.dataset.crewId = crew.id;
            overlay.appendChild(marker);
        }

        marker.className = 'crew-marker-overlay';
        if (!crew.isAlive) {
            marker.classList.add('dead');
        } else if (crew.state === 'Encapsulado') {
            marker.classList.add('sleeping');
        } else if (crew.state === CREW_STATES.RESTING) {
            marker.classList.add('resting');
        } else {
            marker.classList.add('active');
        }

        // Posicionar usando porcentajes basados en la posición del grid
        const topPercent = (pos.row / this.rows) * 100;
        const leftPercent = (pos.col / this.cols) * 100;
        const widthPercent = (1 / this.cols) * 100;
        const heightPercent = (1 / this.rows) * 100;

        marker.style.top = `${topPercent}%`;
        marker.style.left = `${leftPercent}%`;
        marker.style.width = `${widthPercent}%`;
        marker.style.height = `${heightPercent}%`;

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

    /**
     * Sistema de averías - Degrada las zonas basándose en el uso
     */
    degradeZones() {
        // Contar tripulantes activos por zona
        const crewCountByZone = {};

        crewMembers.forEach(crew => {
            if (!crew.isAlive || crew.state !== 'Despierto') return;

            const position = this.crewLocations[crew.id];
            if (!position) return;

            const cellType = this.grid[position.row]?.[position.col];
            const zoneName = this.getCellTypeToZoneName(cellType);

            if (zoneName) {
                crewCountByZone[zoneName] = (crewCountByZone[zoneName] || 0) + 1;
            }
        });

        // Degradar cada zona según el número de tripulantes
        Object.keys(this.zones).forEach(zoneKey => {
            const zone = this.zones[zoneKey];
            const crewCount = crewCountByZone[zoneKey] || 0;

            if (!zone.isBroken) {
                // Degradación base + degradación por uso
                const degradation = zone.degradationRate * (1 + crewCount * 0.3);
                zone.integrity = Math.max(0, zone.integrity - degradation);

                // Marcar como averiada si llega a 0
                if (zone.integrity <= 0) {
                    zone.isBroken = true;
                    console.warn(`💥 ¡${zone.name} se ha averiado!`);
                    if (typeof Notification !== 'undefined') {
                        new Notification(`¡${zone.name} averiada! Necesita reparación`, 'ALERT');
                    }
                    this.markZoneAsBroken(zoneKey);
                }
            }
        });
    }

    /**
     * Convierte tipo de celda a nombre de zona para el sistema de averías
     */
    getCellTypeToZoneName(cellType) {
        const mapping = {
            'C': 'bridge',
            'E': 'medbay',
            'G': 'engineering',
            'K': 'kitchen',
            'N': 'greenhouse',
            'D': 'capsules',
            'B': 'cargo'
        };
        return mapping[cellType];
    }

    /**
     * Marca visualmente una zona como averiada
     */
    markZoneAsBroken(zoneKey) {
        const zone = this.zones[zoneKey];
        if (!zone) return;

        zone.tiles.forEach(tile => {
            const cell = document.querySelector(
                `.grid-cell[data-row="${tile.row}"][data-col="${tile.col}"]`
            );
            if (cell) {
                cell.classList.add('cell-broken');
            }
        });
    }

    /**
     * Repara una zona cuando el ingeniero pasa por ella
     */
    repairZone(zoneKey) {
        const zone = this.zones[zoneKey];
        if (!zone || !zone.isBroken) return false;

        // Requiere que el ingeniero esté en la zona
        const engineer = crewMembers.find(c =>
            c.position && c.position.includes('Ingenier') && c.isAlive
        );

        if (!engineer) return false;

        const engineerPos = this.crewLocations[engineer.id];
        if (!engineerPos) return false;

        const cellType = this.grid[engineerPos.row]?.[engineerPos.col];
        const engineerZone = this.getCellTypeToZoneName(cellType);

        if (engineerZone === zoneKey) {
            // Reparar
            zone.integrity = zone.maxIntegrity;
            zone.isBroken = false;

            // Quitar marcas visuales
            zone.tiles.forEach(tile => {
                const cell = document.querySelector(
                    `.grid-cell[data-row="${tile.row}"][data-col="${tile.col}"]`
                );
                if (cell) {
                    cell.classList.remove('cell-broken');
                }
            });

            console.log(`🔧 ${engineer.name} ha reparado ${zone.name}`);
            if (typeof Notification !== 'undefined') {
                new Notification(`${engineer.name} reparó ${zone.name}`, 'INFO');
            }

            return true;
        }

        return false;
    }

    /**
     * Verifica y repara zonas automáticamente si el ingeniero está en ellas
     */
    checkAndRepairZones() {
        Object.keys(this.zones).forEach(zoneKey => {
            if (this.zones[zoneKey].isBroken) {
                this.repairZone(zoneKey);
            }
        });
    }

    startAutoUpdate() {
        // Actualizar posiciones cada 5 segundos
        setInterval(() => {
            this.updateCrewLocations();
            this.checkAndRepairZones(); // Verificar y reparar zonas
        }, 5000);

        // Degradar zonas cada 10 segundos
        setInterval(() => {
            this.degradeZones();
        }, 10000);

        // También actualizar cada vez que cambie algo relevante
        if (typeof addEventListener === 'function') {
            // Escuchar cambios en el estado de los tripulantes
            document.addEventListener('crewStateChanged', () => {
                this.updateCrewLocations();
            });
        }

        console.log('✅ Auto-actualización del mapa iniciada (cada 5 segundos)');
        console.log('⚙️ Sistema de averías activado (degradación cada 10 segundos)');
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
