// ============================================
// MAPA DE LA NAVE CON GRILLA - ODISEUM V2.0
// ============================================

/* === SISTEMA DE MAPA DE LA NAVE === */
class ShipMapSystem {
    constructor() {
        // Grilla 36x13 con forma específica de nave
        // c=Control/Puente, e=Enfermería, g=Ingeniería, k=Cocina, n=Invernadero, d=Cápsulas, b=Bodega, p=Pasillo, w=Baño, -=Paredes, .=Vacío
        this.grid = [
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],  // Fila 0
            ['.', '.', '.', '.', '.', '-', '-', '-', '.', '.', '.', '.', '.'],  // Fila 1
            ['.', '.', '.', '.', '-', '-', 'w', '-', '-', '.', '.', '.', '.'],  // Fila 2
            ['.', '.', '.', '.', '-', 'c', 'c', 'c', '-', '.', '.', '.', '.'],  // Fila 3
            ['.', '.', '.', '.', '-', 'c', 'c', 'c', '-', '.', '.', '.', '.'],  // Fila 4
            ['.', '.', '.', '-', 'c', 'c', 'c', 'c', 'c', '-', '.', '.', '.'],  // Fila 5
            ['.', '.', '.', '-', 'c', 'c', 'c', 'c', 'c', '-', '.', '.', '.'],  // Fila 6
            ['.', '.', '.', '-', '-', '-', 'p', '-', '-', '-', '.', '.', '.'],  // Fila 7
            ['.', '.', '-', 'd', 'p', '-', 'p', '-', 'e', 'e', '-', '.', '.'],  // Fila 8
            ['.', '.', '-', '-', 'p', '-', 'p', '-', 'e', 'e', '-', '.', '.'],  // Fila 9
            ['.', '.', '-', 'd', 'p', '-', 'p', 'p', 'e', '-', '-', '.', '.'],  // Fila 10
            ['.', '.', '-', '-', 'p', '-', 'p', 'p', 'n', 'n', '-', '.', '.'],  // Fila 11
            ['.', '.', '-', 'd', 'p', '-', 'p', 'p', 'n', 'n', '-', '.', '.'],  // Fila 12
            ['.', '.', '-', '-', 'p', 'p', 'p', 'p', 'n', 'n', '-', '.', '.'],  // Fila 13
            ['.', '.', '-', 'd', 'p', '-', 'p', 'p', 'k', '-', '-', '.', '.'],  // Fila 14
            ['.', '.', '-', '-', 'p', '-', 'p', 'p', 'k', 'k', '-', '.', '.'],  // Fila 15
            ['.', '.', '-', 'w', 'p', '-', 'p', '-', 'k', 'k', '-', '.', '.'],  // Fila 16
            ['.', '.', '.', '-', 'p', '-', 'p', '-', 'k', '-', '.', '.', '.'],  // Fila 17
            ['.', '.', '.', '.', '-', '-', 'p', '-', '-', '.', '.', '.', '.'],  // Fila 18
            ['.', '.', '.', '.', '.', '-', 'p', '-', '.', '.', '.', '.', '.'],  // Fila 19
            ['.', '.', '.', '.', '.', '-', 'p', '-', '.', '.', '.', '.', '.'],  // Fila 20
            ['.', '.', '.', '.', '-', '-', 'p', '-', '-', '.', '.', '.', '.'],  // Fila 21
            ['.', '.', '.', '-', '.', '-', 'p', '-', '.', '-', '.', '.', '.'],  // Fila 22
            ['.', '.', '-', '.', '.', '-', 'p', '-', '.', '.', '-', '.', '.'],  // Fila 23
            ['.', '-', '.', '.', '.', '-', 'p', '-', '.', '.', '.', '-', '.'],  // Fila 24
            ['.', '-', '.', '.', '-', 'g', 'g', 'g', '-', '.', '.', '-', '.'],  // Fila 25
            ['.', '-', '.', '.', '-', 'g', 'g', 'g', '-', '.', '.', '-', '.'],  // Fila 26
            ['.', '-', '.', '.', '-', 'g', 'g', 'g', '-', '.', '.', '-', '.'],  // Fila 27
            ['.', '-', '.', '-', '.', '-', 'g', '-', '.', '-', '.', '-', '.'],  // Fila 28
            ['.', '-', '-', '.', '.', '-', 'p', '-', '.', '.', '-', '-', '.'],  // Fila 29
            ['.', '-', '.', '.', '.', '-', 'p', '-', '.', '.', '.', '-', '.'],  // Fila 30
            ['.', '.', '.', '.', '-', 'b', 'b', 'b', '-', '.', '.', '.', '.'],  // Fila 31
            ['.', '.', '.', '.', '-', 'b', 'b', 'b', '-', '.', '.', '.', '.'],  // Fila 32
            ['.', '.', '.', '.', '.', '-', 'b', '-', '.', '.', '.', '.', '.'],  // Fila 33
            ['.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.'],  // Fila 34
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.']   // Fila 35
        ];

        this.rows = 36;
        this.cols = 13;

        // Zonas y sus tiles principales (con sistema de averías mejorado)
        // Tasas aumentadas x2 para coincidir con velocidad x2 del juego
        this.zones = {
            bridge: {
                name: 'Control', icon: '🎮', tiles: this.findTiles('c'), color: '#00ff41',
                integrity: 100, maxIntegrity: 100, degradationRate: 3.0, isBroken: false,
                repairProgress: 0, beingRepaired: false, repairTimeNeeded: 0
            },
            medbay: {
                name: 'Enfermería', icon: '🏥', tiles: this.findTiles('e'), color: '#ff4444',
                integrity: 100, maxIntegrity: 100, degradationRate: 2.4, isBroken: false,
                repairProgress: 0, beingRepaired: false, repairTimeNeeded: 0
            },
            engineering: {
                name: 'Ingeniería', icon: '⚙️', tiles: this.findTiles('g'), color: '#ffaa00',
                integrity: 100, maxIntegrity: 100, degradationRate: 1.6, isBroken: false,
                repairProgress: 0, beingRepaired: false, repairTimeNeeded: 0
            },
            kitchen: {
                name: 'Cocina', icon: '🍳', tiles: this.findTiles('k'), color: '#ff8844',
                integrity: 100, maxIntegrity: 100, degradationRate: 3.6, isBroken: false,
                repairProgress: 0, beingRepaired: false, repairTimeNeeded: 0
            },
            greenhouse: {
                name: 'Invernadero', icon: '🌱', tiles: this.findTiles('n'), color: '#44ff44',
                integrity: 100, maxIntegrity: 100, degradationRate: 2.0, isBroken: false,
                repairProgress: 0, beingRepaired: false, repairTimeNeeded: 0,
                // Sistema de cooldown para cosecha
                cooldownProgress: 100, // 0-100, cuando llega a 100 está listo para cosechar
                cooldownDuration: 150, // 150 ticks = 5 tramos (30 ticks por tramo)
                waterConsumptionPerTick: 0.5, // Agua consumida por tick durante cooldown
                isReady: true, // Inicia listo para cosechar
                lastHarvestType: null // 'food' o 'medicine'
            },
            capsules: {
                name: 'Cápsulas Sueño', icon: '🛏️', tiles: this.findTiles('d'), color: '#4488ff',
                integrity: 100, maxIntegrity: 100, degradationRate: 1.0, isBroken: false,
                repairProgress: 0, beingRepaired: false, repairTimeNeeded: 0
            },
            cargo: {
                name: 'Bodega', icon: '📦', tiles: this.findTiles('b'), color: '#888888',
                integrity: 100, maxIntegrity: 100, degradationRate: 0.8, isBroken: false,
                repairProgress: 0, beingRepaired: false, repairTimeNeeded: 0
            },
            bathroom: {
                name: 'Baño', icon: '🚽', tiles: this.findTiles('w'), color: '#44aaff',
                integrity: 100, maxIntegrity: 100, degradationRate: 0.6, isBroken: false,
                repairProgress: 0, beingRepaired: false, repairTimeNeeded: 0,
                isOccupied: false, currentUser: null, queue: [], arrivalOrder: {}
            }
        };

        this.crewLocations = {};
        this.crewTargets = {};
        this.crewPaths = {};
        this.lastSubtleMove = {}; // Rastrear último movimiento sutil
        // Íconos por ROL (no por nombre)
        this.crewIconsByRole = {
            'captain': '👨‍✈️',
            'doctor': '👩‍⚕️',
            'engineer': '👨‍🔧',
            'navigator': '👨‍🚀',
            'cook': '👨‍🍳'
        };

        this.isVisible = false; // Mapa oculto por defecto
        this.zoomLevel = 1; // 1 = 100%, 0.5 = 50%, 2 = 200%
        this.minZoom = 0.5;
        this.maxZoom = 3;

        // Card flotante
        this.activeCrewCard = null; // ID del tripulante con card activa

        // Sistema de pan/drag
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
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
        // DEBUG: Verificar que las zonas tienen tiles
        console.log('🗺️ Inicializando mapa de la nave...');
        Object.entries(this.zones).forEach(([zoneKey, zone]) => {
            console.log(`  ${zone.icon} ${zone.name}: ${zone.tiles.length} tiles`);
            if (zone.tiles.length === 0) {
                console.error(`  ❌ ZONA ${zone.name} NO TIENE TILES`);
            }
        });

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

        // Setup pan/drag controls
        this.setupPanControls();
    }

    generateRoomsStatusHTML() {
        let html = '<h4 class="rooms-status-title">ESTADO DE LA NAVE</h4><div class="rooms-status-grid">';

        // Verificar disponibilidad del ingeniero
        const engineer = crewMembers.find(c =>
            c.position && c.position.includes('Ingenier') && c.isAlive
        );
        const engineerAvailable = engineer && engineer.state === 'Despierto';

        Object.entries(this.zones).forEach(([zoneKey, zone]) => {
            const percentage = Math.round((zone.integrity / zone.maxIntegrity) * 100);
            let statusClass = 'good';
            if (percentage < 20) statusClass = 'critical';
            else if (percentage < 50) statusClass = 'warning';

            // Obtener tripulantes en esta zona
            const crewInZone = this.getCrewInZone(zoneKey);
            let crewActivityHTML = '';
            if (crewInZone.length > 0) {
                crewActivityHTML = crewInZone.map(c => {
                    const firstName = c.name.split(' ')[0];
                    const icon = this.getCrewIcon(c);
                    const activity = c.currentActivity || 'Idle';
                    return `${icon} ${firstName} - ${activity}`;
                }).join('<br>');
            } else {
                crewActivityHTML = 'Sin tripulantes';
            }

            // INVERNADERO: diseño especial
            if (zoneKey === 'greenhouse') {
                const cooldownPercent = zone.cooldownProgress || 0;
                const isReady = zone.isReady || cooldownPercent >= 100;

                // Verificar si hay doctor o chef despierto
                const doctor = crewMembers.find(c => c.role === 'doctor' && c.isAlive && c.state === 'Despierto');
                const chef = crewMembers.find(c => c.role === 'cook' && c.isAlive && c.state === 'Despierto');

                const foodBtnDisabled = isReady && chef ? '' : 'disabled';
                const medicineBtnDisabled = isReady && doctor ? '' : 'disabled';

                html += `
                    <div class="room-card-compact ${zone.isBroken ? 'broken' : ''}" data-zone="${zoneKey}">
                        <div class="room-card-header">
                            <span>${zone.icon} ${zone.name}</span>
                        </div>
                        <div class="room-card-status">
                            <div class="room-status-row">
                                <button class="greenhouse-harvest-btn-inline" ${foodBtnDisabled} onclick="shipMapSystem.harvestGreenhouse('food')" title="Chef cosecha alimentos">🍕</button>
                                <button class="greenhouse-harvest-btn-inline" ${medicineBtnDisabled} onclick="shipMapSystem.harvestGreenhouse('medicine')" title="Doctor cosecha medicina">❤️</button>
                                <div class="room-status-bar-inline">
                                    <div class="room-status-fill ${statusClass}" style="width: ${percentage}%"></div>
                                </div>
                                <span class="room-percentage">${percentage}%</span>
                            </div>
                            <div class="greenhouse-cooldown-mini">
                                <div class="greenhouse-cooldown-fill-mini" style="width: ${cooldownPercent}%"></div>
                                <span class="greenhouse-cooldown-text">${Math.round(cooldownPercent)}% listo</span>
                            </div>
                        </div>
                        <div class="room-card-crew">
                            ${crewActivityHTML}
                        </div>
                        ${zone.isBroken ? '<div class="room-card-alert">⚠️ AVERIADA</div>' : ''}
                        ${engineerAvailable && percentage < 100 ? (zone.beingRepaired ? '<div class="room-card-alert repairing" onclick="shipMapSystem.startRepair(\''+zoneKey+'\')">❌ Cancelar</div>' : '<div class="room-card-alert repair" onclick="shipMapSystem.startRepair(\''+zoneKey+'\')">⚙️ Reparar</div>') : ''}
                    </div>
                `;
            } else {
                // HABITACIONES NORMALES: diseño compacto
                let buttonHTML = '';
                if (engineerAvailable && percentage < 100) {
                    if (zone.beingRepaired) {
                        buttonHTML = `<button class="room-action-btn cancel" onclick="shipMapSystem.startRepair('${zoneKey}')">❌</button>`;
                    } else {
                        buttonHTML = `<button class="room-action-btn repair" onclick="shipMapSystem.startRepair('${zoneKey}')">⚙️</button>`;
                    }
                }

                html += `
                    <div class="room-card-compact ${zone.isBroken ? 'broken' : ''} ${zone.beingRepaired ? 'repairing' : ''}" data-zone="${zoneKey}">
                        <div class="room-card-header">
                            <span>${zone.icon} ${zone.name}</span>
                        </div>
                        <div class="room-card-status">
                            <div class="room-status-row">
                                ${buttonHTML}
                                <div class="room-status-bar-inline">
                                    <div class="room-status-fill ${statusClass}" style="width: ${percentage}%"></div>
                                </div>
                                <span class="room-percentage">${percentage}%</span>
                            </div>
                        </div>
                        <div class="room-card-crew">
                            ${crewActivityHTML}
                        </div>
                        ${zone.isBroken ? '<div class="room-card-alert">⚠️ AVERIADA</div>' : ''}
                    </div>
                `;
            }
        });

        html += '</div>';
        return html;
    }

    /**
     * Obtiene la lista de tripulantes que están en una zona específica
     */
    getCrewInZone(zoneKey) {
        const crew = [];

        crewMembers.forEach(c => {
            if (!c.isAlive) return;

            const pos = this.crewLocations[c.id];
            if (!pos) return;

            const cellType = this.grid[pos.row]?.[pos.col];
            const currentZone = this.getCellTypeToZoneName(cellType);

            if (currentZone === zoneKey) {
                crew.push(c);
            }
        });

        return crew;
    }

    setupZoomControls() {
        const zoomInBtn = document.getElementById('zoom-in-btn');
        const zoomOutBtn = document.getElementById('zoom-out-btn');
        const zoomResetBtn = document.getElementById('zoom-reset-btn');

        if (zoomInBtn) {
            // Desktop
            zoomInBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.zoomIn();
            });
            // Mobile
            zoomInBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            zoomInBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.zoomIn();
            });
        }

        if (zoomOutBtn) {
            // Desktop
            zoomOutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.zoomOut();
            });
            // Mobile
            zoomOutBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            zoomOutBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.zoomOut();
            });
        }

        if (zoomResetBtn) {
            // Desktop
            zoomResetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.resetZoom();
            });
            // Mobile
            zoomResetBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            zoomResetBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.resetZoom();
            });
        }

        console.log('✅ Controles de zoom configurados (desktop y mobile)');
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

    setupPanControls() {
        const container = document.querySelector('.ship-map-square-container');
        if (!container) {
            console.warn('⚠️ No se encontró .ship-map-square-container para pan');
            return;
        }

        // Mouse events
        container.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragStartX = e.clientX - this.panX;
            this.dragStartY = e.clientY - this.panY;
            container.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;

            this.panX = e.clientX - this.dragStartX;
            this.panY = e.clientY - this.dragStartY;
            this.applyPan();
        });

        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                const container = document.querySelector('.ship-map-square-container');
                if (container) container.style.cursor = 'grab';
            }
        });

        // Touch events for mobile
        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.isDragging = true;
                this.dragStartX = e.touches[0].clientX - this.panX;
                this.dragStartY = e.touches[0].clientY - this.panY;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (!this.isDragging || e.touches.length !== 1) return;

            this.panX = e.touches[0].clientX - this.dragStartX;
            this.panY = e.touches[0].clientY - this.dragStartY;
            this.applyPan();
        });

        document.addEventListener('touchend', () => {
            this.isDragging = false;
        });

        console.log('✅ Controles de pan/drag configurados');
    }

    applyPan() {
        const grid = document.getElementById('ship-map-grid');
        const overlay = document.getElementById('ship-map-crew-overlay');

        if (grid) {
            grid.style.transform = `translate(${this.panX}px, ${this.panY}px)`;
        }

        if (overlay) {
            overlay.style.transform = `translate(${this.panX}px, ${this.panY}px)`;
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
            'c': 'cell-bridge',       // Control
            'e': 'cell-medbay',       // Enfermería
            'g': 'cell-engineering',  // Ingeniería
            'k': 'cell-kitchen',      // Cocina
            'n': 'cell-greenhouse',   // Invernadero
            'd': 'cell-capsules',     // Cápsulas
            'b': 'cell-cargo',        // Bodega
            'w': 'cell-bathroom',     // Baño
            'p': 'cell-corridor',     // Pasillo
            '-': 'cell-wall',         // Paredes
            '.': 'cell-empty'
        };
        return classes[type] || 'cell-empty';
    }

    getCellLabel(type, row, col) {
        const labels = {
            'c': '🎮',  // Control
            'e': '🏥',  // Enfermería
            'g': '⚙️',  // Ingeniería
            'k': '🍳',  // Cocina
            'n': '🌱',  // Invernadero
            'd': '🛏️',  // Cápsulas
            'b': '📦',  // Bodega
            'w': '🚽'   // Baño
        };

        // Mostrar solo en el centro de cada zona (aproximado para nuevo mapa 36x13)
        if (type === 'c' && row === 5 && col === 6) return labels[type];   // Control
        if (type === 'e' && row === 9 && col === 9) return labels[type];    // Enfermería
        if (type === 'g' && row === 26 && col === 6) return labels[type];   // Ingeniería
        if (type === 'k' && row === 15 && col === 8) return labels[type];  // Cocina
        if (type === 'n' && row === 12 && col === 9) return labels[type];  // Invernadero
        if (type === 'b' && row === 32 && col === 6) return labels[type];  // Bodega
        // No mostramos labels en cápsulas individuales ni en baños (son muy pequeños)

        return '';
    }

    /**
     * Convierte el tipo de celda en nombre de zona legible
     */
    getZoneNameFromCell(cellType) {
        const zoneNames = {
            'c': 'Control',
            'e': 'Enfermería',
            'g': 'Ingeniería',
            'k': 'Cocina',
            'n': 'Invernadero',
            'd': 'Cápsulas Sueño',
            'b': 'Bodega',
            'w': 'Baño',
            'p': 'Pasillo'
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
        if (cellType === 'p' && this.crewPaths[crewId]) {
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

    /**
     * Obtiene la lista de tripulantes que están en una zona específica
     * @param {string} zoneKey - Clave de la zona (bridge, medbay, etc.)
     * @returns {Array} - Array de tripulantes en la zona
     */
    getCrewInZone(zoneKey) {
        const crew = [];

        crewMembers.forEach(c => {
            if (!c.isAlive) return;

            const pos = this.crewLocations[c.id];
            if (!pos) return;

            const cellType = this.grid[pos.row]?.[pos.col];
            const currentZone = this.getCellTypeToZoneName(cellType);

            if (currentZone === zoneKey) {
                crew.push(c);
            }
        });

        return crew;
    }

    getCrewIcon(crew) {
        // Si está muerto, mostrar calavera
        if (!crew.isAlive) {
            return '💀';
        }

        // Usar rol en lugar de nombre
        if (this.crewIconsByRole[crew.role]) {
            return this.crewIconsByRole[crew.role];
        }

        // Fallback por si acaso
        switch (crew.role) {
            case 'captain': return '👨‍✈️';
            case 'doctor': return '👩‍⚕️';
            case 'engineer': return '👨‍🔧';
            case 'cook': return '👨‍🍳';
            case 'navigator': return '👨‍🚀';
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
            const role = crew.role || '';

            // MÁXIMA PRIORIDAD: Si el ingeniero está reparando o viajando a reparar
            if (role === 'engineer') {
                // Buscar si hay alguna zona siendo reparada
                for (const [zoneKey, zone] of Object.entries(this.zones)) {
                    if (zone.beingRepaired) {
                        console.log(`🔧 Ingeniero debe ir a ${zone.name} (${zoneKey}) para reparar`);
                        return zoneKey;
                    }
                }
            }

            // PRIORIDAD 1: Higiene (wasteNeed < 70%)
            if (crew.wasteNeed < 70) {
                return 'bathroom';
            }

            // PRIORIDAD 2: Salud (healthNeed < 50%) - ir a enfermería
            if (crew.healthNeed < 50) {
                return 'medbay';
            }

            // PRIORIDAD 3: Alimentación (foodNeed entre 45-70%)
            if (crew.foodNeed >= 45 && crew.foodNeed < 70) {
                return 'kitchen';
            }

            // Mapeo de ROLES a zonas de trabajo

            // Chef necesita ir al invernadero por provisiones de alimentos (cuando foodNeed > 80%)
            if (role === 'cook' && crew.foodNeed > 80) {
                return 'greenhouse';
            }

            // Doctor necesita ir al invernadero por medicina (cuando healthNeed > 80%)
            if (role === 'doctor' && crew.healthNeed > 80) {
                return 'greenhouse';
            }

            // Navigator/Navegante -> Puente de Mando (bridge)
            if (role === 'navigator') {
                return 'bridge';
            }

            // Captain -> Puente de Mando (bridge)
            if (role === 'captain') {
                return 'bridge';
            }

            // Doctor -> Enfermería (medbay)
            if (role === 'doctor') {
                return 'medbay';
            }

            // Engineer -> Ingeniería (engineering) - SOLO si no está reparando
            if (role === 'engineer') {
                return 'engineering';
            }

            // Cook -> Cocina (kitchen)
            if (role === 'cook') {
                return 'kitchen';
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
        if (!this.zones[zone]) {
            console.error(`⚠️ Zona ${zone} no existe`);
            return { row: 13, col: 6 }; // Fallback a pasillo central
        }

        if (!this.zones[zone].tiles || !this.zones[zone].tiles.length) {
            console.error(`⚠️ Zona ${zone} no tiene tiles. Total zonas:`, Object.keys(this.zones));
            console.error(`Tiles de la zona ${zone}:`, this.zones[zone].tiles);
            return { row: 13, col: 6 }; // Fallback a pasillo central
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
                // No se puede transitar por vacío (.) ni paredes (-)
                if (cellType === '.' || cellType === '-') continue;

                visited.add(key);
                queue.push([...path, neighbor]);
            }
        }

        return [end];
    }

    updateCrewLocations() {
        if (!Array.isArray(crewMembers)) {
            console.warn('⚠️ crewMembers no es un array');
            return;
        }

        const gridContainer = document.getElementById('ship-map-grid');
        if (!gridContainer) {
            console.warn('⚠️ No se encontró ship-map-grid');
            return;
        }

        console.log(`👥 Actualizando ubicación de ${crewMembers.length} tripulantes`);

        crewMembers.forEach(crew => {
            const targetZone = this.getTargetZoneForCrew(crew);
            if (!targetZone) {
                console.warn(`⚠️ ${crew.name} no tiene zona objetivo`);
                return;
            }

            const currentPos = this.crewLocations[crew.id];
            const currentTarget = this.crewTargets[crew.id];

            if (currentTarget !== targetZone) {
                console.log(`🎯 ${crew.name} va a ${targetZone} (antes: ${currentTarget || 'ninguno'})`);
                this.crewTargets[crew.id] = targetZone;
                const targetPos = this.getRandomTileInZone(targetZone, crew.id);
                console.log(`  📍 Posición asignada: [${targetPos.row}, ${targetPos.col}]`);

                if (!currentPos) {
                    this.crewLocations[crew.id] = targetPos;
                    this.createOrUpdateCrewMarker(crew, targetPos);
                    console.log(`  ✅ ${crew.name} posicionado en [${targetPos.row}, ${targetPos.col}]`);
                } else {
                    const path = this.findPath(currentPos, targetPos);
                    if (path.length > 1) {
                        this.crewPaths[crew.id] = path;
                        this.animateCrewMovement(crew);
                    }
                }
                this.lastSubtleMove[crew.id] = Date.now();
            } else {
                // Tripulante ya está en su zona objetivo
                if (currentPos) {
                    // NO MOVER ENCAPSULADOS - deben quedarse quietos
                    const isEncapsulated = crew.state === 'Encapsulado';

                    if (isEncapsulated) {
                        // Los encapsulados NO se mueven
                        this.createOrUpdateCrewMarker(crew, currentPos);
                    } else {
                        // Movimiento sutil: Cada 30-60 segundos, moverse a otra tile en la misma zona
                        const lastMove = this.lastSubtleMove[crew.id] || 0;
                        const timeSinceLastMove = Date.now() - lastMove;
                        const isMoving = this.crewPaths[crew.id] && this.crewPaths[crew.id].length > 0;

                        // Solo mover si no está en movimiento y han pasado 30+ segundos
                        if (!isMoving && timeSinceLastMove > 30000 && Math.random() < 0.3) {
                            const newPos = this.getRandomTileInZone(targetZone, crew.id);
                            // Solo mover si la nueva posición es diferente
                            if (newPos.row !== currentPos.row || newPos.col !== currentPos.col) {
                                const path = this.findPath(currentPos, newPos);
                                if (path.length > 1) {
                                    this.crewPaths[crew.id] = path;
                                    this.animateCrewMovement(crew);
                                    this.lastSubtleMove[crew.id] = Date.now();
                                }
                            }
                        } else {
                            this.createOrUpdateCrewMarker(crew, currentPos);
                        }
                    }
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
        let isNewMarker = false;

        if (!marker) {
            marker = document.createElement('div');
            marker.className = 'crew-marker-overlay';
            marker.id = `crew-marker-${crew.id}`;
            marker.dataset.crewId = crew.id;
            overlay.appendChild(marker);
            isNewMarker = true;
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

        // Obtener pensamiento actual del tripulante
        let thoughtHTML = '';
        if (crew.isAlive && crew.state === 'Despierto' && crew.currentThought) {
            const thought = crew.currentThought.substring(0, 50); // Limitar longitud
            thoughtHTML = `<div class="crew-thought-bubble">${thought}${crew.currentThought.length > 50 ? '...' : ''}</div>`;
        }

        marker.innerHTML = `
            ${thoughtHTML}
            <div class="crew-icon-grid">${icon}</div>
            <div class="crew-name-grid">${crew.name.split(' ')[0]}</div>
        `;

        // Establecer event listener solo una vez para nuevos marcadores
        if (isNewMarker) {
            marker.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevenir propagación del evento
                console.log(`🖱️ Clic en tripulante: ${crew.name}`);
                this.showFloatingCrewCard(crew.id);
            });
        }

        marker.title = `${crew.name} - ${crew.position}`;

        // Si hay una card activa para este tripulante, actualizarla
        if (this.activeCrewCard === crew.id) {
            this.updateFloatingCrewCardPosition(crew.id);
        }
    }

    /**
     * Muestra una card flotante siguiendo al tripulante
     */
    showFloatingCrewCard(crewId) {
        const crew = crewMembers.find(c => c.id === crewId);
        if (!crew) return;

        // Si ya hay una card, cerrarla
        this.closeFloatingCrewCard();

        // Crear contenedor de la card
        const cardContainer = document.createElement('div');
        cardContainer.id = 'floating-crew-card';
        cardContainer.className = 'floating-crew-card';

        // Generar contenido similar a la card del panel
        let cardContent = '';

        if (!crew.isAlive) {
            cardContent = `
                <div class="floating-card-close" onclick="shipMapSystem.closeFloatingCrewCard()">×</div>
                <div class="crew-card-header">
                    <span class="crew-card-name">${crew.name}</span>
                    <span class="crew-card-status">💀</span>
                </div>
                <div class="crew-card-state deceased">FALLECIDO</div>
            `;
        } else if (crew.state === 'Despierto') {
            const benefit = crew.getAwakeBenefitDescription?.() || '';
            const location = crew.getCurrentLocation?.() || 'Nave';
            const thought = crew.getCurrentThought?.() || '';

            cardContent = `
                <div class="floating-card-close" onclick="shipMapSystem.closeFloatingCrewCard()">×</div>
                <div class="crew-card-header">
                    <span class="crew-card-name">${crew.name}</span>
                    <span class="crew-card-age">${crew.biologicalAge.toFixed(0)} años</span>
                </div>
                ${benefit ? `<div class="crew-card-benefit-mini">⚡ ${benefit}</div>` : ''}
                <div class="crew-card-location">
                    📍 ${location}
                </div>
                <div class="crew-card-thought">
                    <div class="thought-marquee">${thought}</div>
                </div>
            `;
        } else {
            // Encapsulado
            cardContent = `
                <div class="floating-card-close" onclick="shipMapSystem.closeFloatingCrewCard()">×</div>
                <div class="crew-card-header">
                    <span class="crew-card-name">${crew.name}</span>
                    <span class="crew-card-age">${crew.biologicalAge.toFixed(0)} años</span>
                </div>
                <div class="crew-card-needs-advanced">
                    ${crew.generateAdvancedNeedBars?.() || '<div class="crew-card-state">Encapsulado</div>'}
                </div>
            `;
        }

        cardContainer.innerHTML = cardContent;

        // Agregar al mapa
        const mapContainer = document.getElementById('ship-map-container');
        if (mapContainer) {
            mapContainer.appendChild(cardContainer);
            this.activeCrewCard = crewId;
            this.updateFloatingCrewCardPosition(crewId);
        }
    }

    /**
     * Actualiza la posición de la card flotante para seguir al tripulante
     */
    updateFloatingCrewCardPosition(crewId) {
        const cardContainer = document.getElementById('floating-crew-card');
        if (!cardContainer || this.activeCrewCard !== crewId) return;

        const pos = this.crewLocations[crewId];
        if (!pos) return;

        const marker = document.getElementById(`crew-marker-${crewId}`);
        if (!marker) return;

        // Calcular posición basada en el marcador del tripulante
        const topPercent = (pos.row / this.rows) * 100;
        const leftPercent = (pos.col / this.cols) * 100;

        // Posicionar la card al lado del tripulante (derecha o izquierda según espacio)
        const gridElement = document.getElementById('ship-map-grid');
        if (gridElement) {
            const gridRect = gridElement.getBoundingClientRect();
            const markerLeft = (leftPercent / 100) * gridRect.width;

            // Si está en la mitad derecha, mostrar card a la izquierda
            if (leftPercent > 50) {
                cardContainer.style.left = 'auto';
                cardContainer.style.right = `${100 - leftPercent + 2}%`;
            } else {
                cardContainer.style.left = `${leftPercent + 10}%`;
                cardContainer.style.right = 'auto';
            }

            cardContainer.style.top = `${topPercent}%`;
        }
    }

    /**
     * Cierra la card flotante activa
     */
    closeFloatingCrewCard() {
        const cardContainer = document.getElementById('floating-crew-card');
        if (cardContainer) {
            cardContainer.remove();
        }
        this.activeCrewCard = null;
    }

    /**
     * Sistema de cola del baño - FIFO: Primero en llegar, primero en usar
     */
    processBathroomQueue() {
        const bathroom = this.zones.bathroom;
        if (!bathroom) return;

        // Obtener tripulantes que están en la zona del baño
        const crewInBathroom = crewMembers.filter(crew => {
            if (!crew.isAlive || crew.state !== 'Despierto') return false;
            const pos = this.crewLocations[crew.id];
            if (!pos) return false;
            const cellType = this.grid[pos.row]?.[pos.col];
            return cellType === 'w';
        });

        // Registrar tiempo de llegada para nuevos tripulantes
        const currentTime = Date.now();
        crewInBathroom.forEach(crew => {
            if (!bathroom.arrivalOrder[crew.id]) {
                bathroom.arrivalOrder[crew.id] = currentTime;
            }
        });

        // Limpiar tripulantes que ya no están en el baño
        Object.keys(bathroom.arrivalOrder).forEach(crewId => {
            if (!crewInBathroom.find(c => c.id == crewId)) {
                delete bathroom.arrivalOrder[crewId];
            }
        });

        // Si el baño está ocupado, procesar uso
        if (bathroom.isOccupied && bathroom.currentUser) {
            const user = crewMembers.find(c => c.id === bathroom.currentUser);
            if (user && user.isAlive && user.state === 'Despierto') {
                // Verificar que el usuario sigue en el baño
                const stillInBathroom = crewInBathroom.find(c => c.id === user.id);
                if (stillInBathroom) {
                    // Aumentar wasteNeed por tick (5 puntos por tick)
                    user.wasteNeed = Math.min(100, user.wasteNeed + 5);
                    user.currentActivity = '🚽 Usando el baño';

                    // Si ya terminó (wasteNeed >= 100), liberar baño
                    if (user.wasteNeed >= 100) {
                        this.releaseBathroom();
                    }
                } else {
                    // Usuario salió del baño, liberar
                    this.releaseBathroom();
                }
            } else {
                // Usuario ya no es válido, liberar baño
                this.releaseBathroom();
            }
        }

        // Si el baño no está ocupado, asignar al PRIMERO EN LLEGAR
        if (!bathroom.isOccupied && crewInBathroom.length > 0) {
            // Ordenar por tiempo de llegada (FIFO)
            const sortedByArrival = crewInBathroom.sort((a, b) => {
                return bathroom.arrivalOrder[a.id] - bathroom.arrivalOrder[b.id];
            });

            const nextUser = sortedByArrival[0];
            bathroom.isOccupied = true;
            bathroom.currentUser = nextUser.id;
            nextUser.currentActivity = '🚽 Usando el baño';
        }

        // Actualizar cola visual (tripulantes esperando)
        bathroom.queue = crewInBathroom
            .filter(c => c.id !== bathroom.currentUser)
            .map(c => c.id);

        // Actualizar actividad de los que esperan
        bathroom.queue.forEach(crewId => {
            const crew = crewMembers.find(c => c.id === crewId);
            if (crew) {
                crew.currentActivity = '⏳ Esperando baño';
            }
        });
    }

    /**
     * Libera el baño para el siguiente usuario
     */
    releaseBathroom() {
        const bathroom = this.zones.bathroom;
        if (!bathroom) return;

        const user = crewMembers.find(c => c.id === bathroom.currentUser);
        if (user) {
            user.currentActivity = 'Trabajando';
        }

        bathroom.isOccupied = false;
        bathroom.currentUser = null;
    }

    /**
     * Sistema de averías - Degrada las zonas basándose en el uso
     */
    degradeZones() {
        // Solo degradar si hay un tramo activo
        if (typeof gameLoop === 'undefined' || !gameLoop || gameLoop.gameState !== GAME_STATES.IN_TRANCHE) {
            console.log('⏸️ Degradación pausada: no hay tramo activo');
            return;
        }

        // Verificar estado del ingeniero
        const engineer = crewMembers.find(c =>
            c.position && c.position.includes('Ingenier') && c.isAlive
        );

        let engineerModifier = 1.0;
        if (engineer) {
            if (engineer.state === 'Despierto') {
                // Ingeniero despierto reduce degradación en 40%
                engineerModifier = 0.6;
                console.log('⚙️ Ingeniero despierto: degradación reducida (-40%)');
            } else if (engineer.state === 'Encapsulado') {
                // Ingeniero encapsulado aumenta degradación en 50%
                engineerModifier = 1.5;
                console.log('💤 Ingeniero encapsulado: degradación aumentada (+50%)');
            }
        }

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
                // Degradación base + degradación por uso + modificador de ingeniero
                const degradation = zone.degradationRate * (1 + crewCount * 0.3) * engineerModifier;
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

        // Actualizar panel de estado cada vez que se degradan las zonas
        this.updateRoomsStatus();
    }

    /**
     * Convierte tipo de celda a nombre de zona para el sistema de averías
     */
    getCellTypeToZoneName(cellType) {
        const mapping = {
            'c': 'bridge',
            'e': 'medbay',
            'g': 'engineering',
            'k': 'kitchen',
            'n': 'greenhouse',
            'd': 'capsules',
            'b': 'cargo',
            'w': 'bathroom'
        };
        return mapping[cellType];
    }

    /**
     * Marca visualmente una zona como averiada y aplica consecuencias
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

        // Aplicar consecuencias específicas por zona
        this.applyBreakdownConsequences(zoneKey);
        this.updateRoomsStatus();
    }

    /**
     * Aplica consecuencias cuando una zona se avería
     */
    applyBreakdownConsequences(zoneKey) {
        switch(zoneKey) {
            case 'capsules':
                // Despertar a todos los encapsulados
                console.warn('🛏️ ¡Cápsulas averiadas! Despertando a todos los encapsulados');
                crewMembers.forEach(crew => {
                    if (crew.state === 'Encapsulado' && crew.isAlive) {
                        crew.state = 'Despierto';
                    }
                });
                if (typeof panelManager !== 'undefined' && panelManager.isPanelOpen('crew')) {
                    panelManager.updateCrewPanel();
                }
                break;

            case 'kitchen':
                console.warn('🍳 ¡Cocina averiada! Los tripulantes no podrán comer');
                break;

            case 'bridge':
                console.warn('🎮 ¡Puente de Mando averiado! La nave no puede avanzar');
                break;

            case 'medbay':
                console.warn('🏥 ¡Enfermería averiada! Los tripulantes no podrán curarse');
                break;

            case 'greenhouse':
                console.warn('🌱 ¡Invernadero averiado! No se pueden producir alimentos');
                break;

            case 'engineering':
                console.warn('⚙️ ¡Ingeniería averiada! Las reparaciones serán más lentas');
                break;
        }
    }

    /**
     * Actualiza el panel de estado de salas
     */
    updateRoomsStatus() {
        const statusContainer = document.getElementById('ship-map-rooms-status');
        if (!statusContainer) return;

        statusContainer.innerHTML = this.generateRoomsStatusHTML();
    }

    /**
     * Inicia la reparación de una zona (nueva versión progresiva)
     */
    startRepair(zoneKey) {
        const zone = this.zones[zoneKey];
        if (!zone) {
            console.warn(`Zona ${zoneKey} no encontrada`);
            return false;
        }

        // Verificar que el ingeniero esté vivo y despierto
        const engineer = crewMembers.find(c =>
            c.position && c.position.includes('Ingenier') && c.isAlive
        );

        if (!engineer) {
            if (typeof Notification !== 'undefined') {
                new Notification('No hay ingeniero disponible', 'ALERT');
            }
            return false;
        }

        if (engineer.state !== 'Despierto') {
            if (typeof Notification !== 'undefined') {
                new Notification('El ingeniero debe estar despierto para reparar', 'ALERT');
            }
            return false;
        }

        // Si ya está reparando, cancelar
        if (zone.beingRepaired) {
            console.log(`🔧 Cancelando reparación de ${zone.name}`);
            zone.beingRepaired = false;
            zone.repairProgress = 0;
            zone.repairTimeNeeded = 0;
            engineer.currentActivity = 'idle';
            if (typeof panelManager !== 'undefined' && panelManager.isPanelOpen('crew')) {
                panelManager.updateCrewPanel();
            }
            return false;
        }

        // Calcular tiempo de reparación basado en daño
        // Daño completo (0% integridad) = 100 ticks = ~16 minutos
        // Daño parcial se escala proporcionalmente
        const damagePercent = 100 - zone.integrity;
        zone.repairTimeNeeded = Math.ceil(damagePercent); // 1 tick por cada 1% de daño
        zone.repairProgress = 0;
        zone.beingRepaired = true;

        engineer.currentActivity = `Reparando ${zone.name}`;

        console.log(`🔧 ${engineer.name} inicia reparación de ${zone.name} (${damagePercent.toFixed(0)}% daño, ${zone.repairTimeNeeded} ticks)`);
        if (typeof Notification !== 'undefined') {
            new Notification(`${engineer.name} comienza reparación de ${zone.name}`, 'INFO');
        }

        // Actualizar panel de tripulación
        if (typeof panelManager !== 'undefined' && panelManager.isPanelOpen('crew')) {
            panelManager.updateCrewPanel();
        }

        this.updateRoomsStatus();
        return true;
    }

    /**
     * Procesa un tick de reparación (llamado cada 10 segundos)
     */
    processRepairTick() {
        const engineer = crewMembers.find(c =>
            c.position && c.position.includes('Ingenier') && c.isAlive && c.state === 'Despierto'
        );

        // Si no hay ingeniero disponible, cancelar todas las reparaciones
        if (!engineer) {
            Object.values(this.zones).forEach(zone => {
                if (zone.beingRepaired) {
                    zone.beingRepaired = false;
                    zone.repairProgress = 0;
                    zone.repairTimeNeeded = 0;
                }
            });
            return;
        }

        // Procesar cada zona que esté siendo reparada
        Object.entries(this.zones).forEach(([zoneKey, zone]) => {
            if (!zone.beingRepaired) return;

            // Verificar si el ingeniero está en la zona
            const engineerPos = this.crewLocations[engineer.id];
            if (!engineerPos) {
                engineer.currentActivity = `Viajando a ${zone.name}`;
                this.updateRoomsStatus();
                return;
            }

            const cellType = this.grid[engineerPos.row]?.[engineerPos.col];
            const engineerZone = this.getCellTypeToZoneName(cellType);

            // Si el ingeniero no está en la zona correcta, está viajando
            if (engineerZone !== zoneKey) {
                engineer.currentActivity = `Viajando a ${zone.name}`;
                console.log(`🚶 ${engineer.name} está viajando a ${zone.name} (actualmente en ${engineerZone || 'pasillo'})`);
                this.updateRoomsStatus();
                // Actualizar panel de tripulación para mostrar el estado de viaje
                if (typeof panelManager !== 'undefined' && panelManager.isPanelOpen('crew')) {
                    panelManager.updateCrewPanel();
                }
                return;
            }

            // El ingeniero está en la zona, actualizar actividad
            engineer.currentActivity = `Reparando ${zone.name}`;

            // Calcular velocidad de reparación (más lento si Ingeniería está averiada)
            const repairSpeedMultiplier = this.zones.engineering?.isBroken ? 0.5 : 1.0;
            const repairIncrement = 1 * repairSpeedMultiplier;

            zone.repairProgress += repairIncrement;

            // Calcular restauración de integridad progresiva
            const progressPercent = Math.min(100, (zone.repairProgress / zone.repairTimeNeeded) * 100);
            const targetIntegrity = zone.maxIntegrity;
            const startIntegrity = targetIntegrity - zone.repairTimeNeeded; // Integridad al inicio
            zone.integrity = Math.min(targetIntegrity, startIntegrity + (zone.repairTimeNeeded * (progressPercent / 100)));

            console.log(`🔧 Reparando ${zone.name}: ${progressPercent.toFixed(0)}% completo (${zone.integrity.toFixed(1)}/${zone.maxIntegrity})`);

            // Verificar si la reparación está completa
            if (zone.repairProgress >= zone.repairTimeNeeded) {
                zone.integrity = zone.maxIntegrity;
                zone.isBroken = false;
                zone.beingRepaired = false;
                zone.repairProgress = 0;
                zone.repairTimeNeeded = 0;

                // Quitar marcas visuales
                zone.tiles.forEach(tile => {
                    const cell = document.querySelector(
                        `.grid-cell[data-row="${tile.row}"][data-col="${tile.col}"]`
                    );
                    if (cell) {
                        cell.classList.remove('cell-broken');
                    }
                });

                console.log(`✅ ${engineer.name} completó reparación de ${zone.name}`);
                if (typeof Notification !== 'undefined') {
                    new Notification(`${zone.icon} ${zone.name} reparada completamente`, 'SUCCESS');
                }

                engineer.currentActivity = 'idle';

                // Actualizar panel de tripulación
                if (typeof panelManager !== 'undefined' && panelManager.isPanelOpen('crew')) {
                    panelManager.updateCrewPanel();
                }
            }

            this.updateRoomsStatus();
            // Actualizar panel de tripulación durante la reparación
            if (typeof panelManager !== 'undefined' && panelManager.isPanelOpen('crew')) {
                panelManager.updateCrewPanel();
            }
        });
    }

    /**
     * Cosechar recursos del invernadero
     */
    harvestGreenhouse(type) {
        const greenhouse = this.zones.greenhouse;
        if (!greenhouse || !greenhouse.isReady || greenhouse.cooldownProgress < 100) {
            console.warn('🌱 Invernadero no está listo para cosechar');
            return;
        }

        // Verificar que hay tripulante apropiado despierto
        const doctor = crewMembers.find(c => c.role === 'doctor' && c.isAlive && c.state === 'Despierto');
        const chef = crewMembers.find(c => c.role === 'cook' && c.isAlive && c.state === 'Despierto');

        if (type === 'food' && !chef) {
            console.warn('🌱 No hay chef despierto para cosechar alimentos');
            return;
        }

        if (type === 'medicine' && !doctor) {
            console.warn('🌱 No hay doctor despierto para cosechar medicina');
            return;
        }

        // Obtener bonus del tripulante si tiene
        let bonus = 0;
        let baseCantidad = 0;

        if (type === 'food') {
            baseCantidad = 50;
            if (chef && chef.configStats && chef.configStats.greenhouseBonus) {
                bonus = chef.configStats.greenhouseBonus;
            }
        } else if (type === 'medicine') {
            baseCantidad = 30;
            if (doctor && doctor.configStats && doctor.configStats.greenhouseBonus) {
                bonus = doctor.configStats.greenhouseBonus;
            }
        }

        const cantidad = Math.round(baseCantidad * (1 + bonus));

        // Añadir recursos
        if (typeof resourcesManager !== 'undefined') {
            if (type === 'food') {
                resourcesManager.addResource('food', cantidad);
                console.log(`🌱 Chef cosechó ${cantidad} de alimentos del invernadero`);
            } else if (type === 'medicine') {
                resourcesManager.addResource('medicine', cantidad);
                console.log(`🌱 Doctor cosechó ${cantidad} de medicina del invernadero`);
            }
        }

        // Reiniciar cooldown
        greenhouse.cooldownProgress = 0;
        greenhouse.isReady = false;
        greenhouse.lastHarvestType = type;

        // Actualizar UI
        this.updateRoomsStatus();
    }

    /**
     * Procesar cooldown del invernadero (llamado cada tick)
     */
    processGreenhouseCooldown() {
        const greenhouse = this.zones.greenhouse;
        if (!greenhouse) return;

        // Si ya está listo, no hacer nada
        if (greenhouse.isReady && greenhouse.cooldownProgress >= 100) return;

        // Verificar si hay suficiente agua para el tick
        const waterNeeded = greenhouse.waterConsumptionPerTick;
        const hasWater = typeof resourcesManager !== 'undefined' && resourcesManager.resources.water >= waterNeeded;

        if (hasWater) {
            // Consumir agua
            if (typeof resourcesManager !== 'undefined') {
                resourcesManager.consumeResource('water', waterNeeded);
            }

            // Incrementar progreso del cooldown
            const incrementPerTick = 100 / greenhouse.cooldownDuration;
            greenhouse.cooldownProgress = Math.min(100, greenhouse.cooldownProgress + incrementPerTick);

            // Si llegó a 100, marcar como listo
            if (greenhouse.cooldownProgress >= 100) {
                greenhouse.isReady = true;
                console.log('🌱 Invernadero listo para cosechar');
            }
        }
        // Si no hay agua, el cooldown no avanza (pero tampoco retrocede)
    }

    startAutoUpdate() {
        // Actualizar posiciones cada 1.5 segundos (velocidad x2)
        setInterval(() => {
            this.updateCrewLocations();
        }, 1500);

        // Degradar zonas y gestionar baño cada 5 segundos (velocidad x2)
        setInterval(() => {
            this.degradeZones();
            this.processBathroomQueue();
        }, 5000);

        // REPARACIONES E INVERNADERO: Procesar cada tick del juego (ahora cada 1 segundo)
        setInterval(() => {
            this.processRepairTick();
            this.processGreenhouseCooldown();
        }, 1000); // Cada 1 segundo = cada tick

        // También actualizar cada vez que cambie algo relevante
        if (typeof addEventListener === 'function') {
            // Escuchar cambios en el estado de los tripulantes
            document.addEventListener('crewStateChanged', () => {
                this.updateCrewLocations();
            });
        }

        console.log('✅ Auto-actualización del mapa iniciada (cada 1.5 segundos - velocidad x2)');
        console.log('⚙️ Sistema de averías activado (degradación cada 5 segundos, reparación cada 1 segundo - velocidad x2)');
        console.log('🌱 Sistema de invernadero activado (cooldown cada 1 segundo)');
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
