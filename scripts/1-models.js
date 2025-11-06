// ============================================
// MODELOS - ODISEUM V2.0
// ============================================

/* === CLASE TRIPULANTE === */
class Crew {
    constructor(data) {
        // Datos básicos
        this.id = data.id;
        this.name = data.name;
        this.position = data.position;
        this.initialAge = data.age;
        this.biologicalAge = data.age;
        this.img = data.img;
        this.role = data.role;
        this.state = data.state || 'Despierto';
        this.isAlive = true;
        
        // Necesidades vitales
        this.foodNeed = 100;
        this.healthNeed = 100;
        this.wasteNeed = 0;
        this.entertainmentNeed = 100;
        this.restNeed = 100;
        
        // Sistema de edad
        this.yearsAwake = 0;
        
        // Personalidad y sistema narrativo
        this.personalityTraits = data.personality;
        this.leftBehind = data.leftBehind;
        this.fearOfDeath = data.fearOfDeath;
        this.mood = 'neutral';
        this.currentActivity = 'idle';
        this.relationships = {};
        this.personalLog = [];
        this.lastInteraction = null;
        this.autoManaging = false;

        // Sistema de eventos
        this.eventFlags = [];
        this.trauma = null;
        this.emotionalState = 'stable';
        this.skillModifier = 1.0;
        this.eventMemories = [];

        // Caché para pensamientos (evitar actualización constante en UI)
        this.lastThought = '';
        this.lastUIUpdate = 0;
        this.personalThought = null;
        this.personalThoughtExpiry = null;
    }

    getEffectiveSkillMultiplier() {
        let multiplier = this.skillModifier || 1;

        if (typeof awakeBenefitSystem !== 'undefined' && awakeBenefitSystem) {
            multiplier = awakeBenefitSystem.getCrewEfficiencyMultiplier(this, multiplier);
        }

        return multiplier;
    }

    /* === SISTEMA DE EDAD === */
    age(years) {
        if (this.state === 'Despierto' && this.isAlive) {
            this.biologicalAge += years;
            this.yearsAwake += years;
            
            // Registrar envejecimiento significativo
            if (years >= 1) {
                logbook.addEntry(
                    `${this.name} ha envejecido ${years.toFixed(1)} años. Edad biológica: ${this.biologicalAge.toFixed(1)} años`,
                    LOG_TYPES.AGE
                );
                this.addToPersonalLog(`Envejecí ${years.toFixed(1)} años. Me siento diferente...`);
            }
            
            // Muerte por vejez
            if (this.biologicalAge >= DEATH_BY_AGE_THRESHOLD && Math.random() < DEATH_BY_AGE_PROBABILITY) {
                this.die('vejez natural');
            }
        }
    }
    
    getAgeEfficiency() {
        for (let tier of AGE_EFFICIENCY) {
            if (this.biologicalAge <= tier.max) {
                return tier.efficiency;
            }
        }
        return AGE_EFFICIENCY[AGE_EFFICIENCY.length - 1].efficiency;
    }
    
    /* === SISTEMA DE MUERTE === */
    die(cause) {
        if (!this.isAlive) return;
        
        this.isAlive = false;
        this.healthNeed = 0;
        logbook.addEntry(
            `💀 ${this.name} ha fallecido por ${cause}. Edad: ${this.biologicalAge.toFixed(1)} años`,
            LOG_TYPES.DEATH
        );
        new CrewNotification(`${this.name} ha fallecido (${cause})`, NOTIFICATION_TYPES.ALERT);
        this.addToPersonalLog(`[FALLECIDO] Causa: ${cause}`);
        this.updateConsoleCrewState();
        this.updateMiniCard();
    }
    
    /* === SISTEMA DE NECESIDADES === */
    updateCrewNeeds() {
        if (!this.isAlive) return;

        const efficiency = this.getAgeEfficiency();
        const multiplier = 1 / efficiency;

        // Seleccionar configuración según estado
        let config;
        if (this.state === CREW_STATES.AWAKE) {
            config = NEEDS_CONFIG.awake;
        } else if (this.state === CREW_STATES.RESTING) {
            config = NEEDS_CONFIG.resting;
        } else {
            config = NEEDS_CONFIG.capsule;
        }

        // Aplicar cambios según estado
        if (this.state === CREW_STATES.AWAKE || this.state === CREW_STATES.RESTING) {
            this.foodNeed = Math.max(0, this.foodNeed + (config.food * multiplier));
            this.healthNeed = Math.max(0, this.healthNeed + (config.health * multiplier));
            this.wasteNeed = Math.min(100, this.wasteNeed + (config.waste * multiplier));
            this.entertainmentNeed = Math.max(0, this.entertainmentNeed + (config.entertainment * multiplier));
            this.restNeed = Math.max(100, this.restNeed + (config.rest * multiplier));
        } else {
            this.foodNeed = Math.max(0, this.foodNeed + config.food);
            this.healthNeed = Math.max(0, this.healthNeed + config.health);
            this.wasteNeed = Math.min(100, this.wasteNeed + config.waste);
            this.entertainmentNeed = Math.max(0, this.entertainmentNeed + config.entertainment);
            this.restNeed = Math.min(100, this.restNeed + config.rest);
        }

        // Auto-transición a estado descansando si está muy cansado
        if (this.state === CREW_STATES.AWAKE && this.restNeed < REST_THRESHOLD_FOR_RESTING) {
            this.enterRestingState();
        }

        // Salir de estado descansando si se recuperó
        if (this.state === CREW_STATES.RESTING && this.restNeed > 80) {
            this.exitRestingState();
        }

        // Muerte por inanición
        if (this.foodNeed <= 0 && Math.random() < DEATH_PROBABILITIES.starvation) {
            this.die('inanición');
        }

        // Muerte por salud crítica
        if (this.healthNeed <= 0 && Math.random() < DEATH_PROBABILITIES.health) {
            this.die('falta de atención médica');
        }
    }

    /* === GESTIÓN DE ESTADO DESCANSANDO === */
    enterRestingState() {
        if (this.state !== CREW_STATES.AWAKE) return;

        this.state = CREW_STATES.RESTING;
        this.addToPersonalLog('Entré en estado de descanso por agotamiento');
        new CrewNotification(`${this.name} ha entrado en descanso profundo`, NOTIFICATION_TYPES.INFO);
        logbook.addEntry(`${this.name} entró en estado de descanso profundo por agotamiento`, LOG_TYPES.INFO);
        this.updateMiniCard();
        this.updateConsoleCrewState();
    }

    exitRestingState() {
        if (this.state !== CREW_STATES.RESTING) return;

        this.state = CREW_STATES.AWAKE;
        this.addToPersonalLog('Salí del estado de descanso, me siento renovado');
        new CrewNotification(`${this.name} ha salido del descanso y está activo`, NOTIFICATION_TYPES.SUCCESS);
        logbook.addEntry(`${this.name} terminó su periodo de descanso`, LOG_TYPES.INFO);
        this.updateMiniCard();
        this.updateConsoleCrewState();
    }
    
    checkHunger() {
        if (this.foodNeed < 20 && this.isAlive) {
            new CrewNotification(`${this.name} tiene hambre crítica!`, NOTIFICATION_TYPES.ALERT);
        }
    }
    
    checkHealthy() {
        if (this.healthNeed < 20 && this.isAlive) {
            new CrewNotification(`${this.name} necesita atención médica!`, NOTIFICATION_TYPES.ALERT);
        }
    }
    
    checkShit() {
        if (this.wasteNeed > 80 && this.isAlive) {
            new CrewNotification(`${this.name} necesita urgentemente higiene!`, NOTIFICATION_TYPES.WARNING);
        }
    }
    
    checkEntertainment() {
        if (this.entertainmentNeed < 20 && this.isAlive && this.state === 'Despierto') {
            new CrewNotification(`${this.name} está muy aburrido`, NOTIFICATION_TYPES.WARNING);
        }
    }
    
    checkRest() {
        if (this.restNeed < 20 && this.isAlive && this.state === 'Despierto') {
            new CrewNotification(`${this.name} está exhausto`, NOTIFICATION_TYPES.WARNING);
        }
    }
    
    /* === SISTEMA DE AUTO-GESTIÓN === */
    tryAutoManage() {
        if (!this.isAlive || (this.state !== CREW_STATES.AWAKE && this.state !== CREW_STATES.RESTING)) return;

        this.autoManaging = false;
        const autoManageActions = [];
        const efficiencyMultiplier = this.getEffectiveSkillMultiplier();

        // Solo los despiertos pueden auto-gestionar (no los descansando)
        if (this.state !== CREW_STATES.AWAKE) return;

        // Auto-gestionar comida
        if (this.foodNeed < AUTO_MANAGE_CONFIG.food.threshold && Food.quantity >= AUTO_MANAGE_CONFIG.food.cost) {
            Food.consume(AUTO_MANAGE_CONFIG.food.cost);
            const recovery = AUTO_MANAGE_CONFIG.food.recovery * efficiencyMultiplier;
            this.foodNeed = Math.min(100, this.foodNeed + recovery);
            autoManageActions.push('comió');
            this.currentActivity = 'eating';
        }

        // Auto-gestionar salud (medicina)
        // Si healthNeed < 100, intentar curar hasta que esté completamente sano
        if (this.healthNeed < 100 && Medicine.quantity >= AUTO_MANAGE_CONFIG.medicine.cost) {
            Medicine.consume(AUTO_MANAGE_CONFIG.medicine.cost);

            // Bonus si la Dra. Chen está despierta
            let drChenAwake = false;
            if (typeof crewMembers !== 'undefined' && crewMembers) {
                const drChen = crewMembers.find(c => c.position === 'Médica' && c.name === 'Dra. Chen');
                if (drChen && drChen.state === 'Despierto' && drChen.isAlive) {
                    drChenAwake = true;
                }
            }

            // Recuperación base con multiplicador de eficiencia
            let recovery = AUTO_MANAGE_CONFIG.medicine.recovery * efficiencyMultiplier;

            // Bonus de +50% si la Dra. Chen está despierta
            if (drChenAwake) {
                recovery *= 1.5;
                autoManageActions.push('fue atendido por la Dra. Chen');
            } else {
                autoManageActions.push('tomó medicina');
            }

            this.healthNeed = Math.min(100, this.healthNeed + recovery);
            this.currentActivity = 'resting';
        }

        // Auto-gestionar higiene
        if (this.wasteNeed > AUTO_MANAGE_CONFIG.hygiene.threshold && Water.quantity >= AUTO_MANAGE_CONFIG.hygiene.cost) {
            Water.consume(AUTO_MANAGE_CONFIG.hygiene.cost);
            const recovery = AUTO_MANAGE_CONFIG.hygiene.recovery * efficiencyMultiplier;
            this.wasteNeed = Math.max(0, this.wasteNeed - recovery);
            autoManageActions.push('se aseó');
            this.currentActivity = 'cleaning';
        }

        // Auto-gestionar entretenimiento
        if (this.entertainmentNeed < AUTO_MANAGE_CONFIG.entertainment.threshold &&
            Data.quantity >= AUTO_MANAGE_CONFIG.entertainment.cost &&
            Math.random() < Math.min(1, AUTO_MANAGE_CONFIG.entertainment.probability * efficiencyMultiplier)) {
            Data.consume(AUTO_MANAGE_CONFIG.entertainment.cost);
            const recovery = AUTO_MANAGE_CONFIG.entertainment.recovery * efficiencyMultiplier;
            this.entertainmentNeed = Math.min(100, this.entertainmentNeed + recovery);
            autoManageActions.push('se entretuvo');
            this.currentActivity = 'socializing';
        }

        if (autoManageActions.length > 0) {
            this.autoManaging = true;
            this.addToPersonalLog(`Auto-gestión: ${autoManageActions.join(', ')}`);
        } else {
            this.currentActivity = 'working';
        }

        Food.updateResourceUI();
        Water.updateResourceUI();
        Data.updateResourceUI();
        Medicine.updateResourceUI();
    }
    
    /* === SISTEMA DE RELACIONES === */
    initializeRelationships(allCrew) {
        allCrew.forEach(other => {
            if (other.id !== this.id) {
                this.relationships[other.id] = this.calculateInitialRelationship(other);
            }
        });
    }
    
    calculateInitialRelationship(other) {
        const compatibleRoles = {
            'commander': ['doctor', 'engineer'],
            'doctor': ['commander', 'cook'],
            'engineer': ['commander', 'scientist'],
            'scientist': ['engineer', 'cook'],
            'cook': ['doctor', 'scientist']
        };
        
        if (compatibleRoles[this.role]?.includes(other.role)) {
            return Math.floor(Math.random() * 20) + 60;
        }
        return Math.floor(Math.random() * 30) + 40;
    }
    
    interactWith(other) {
        if (!this.isAlive || !other.isAlive) return;
        if (this.state !== 'Despierto' || other.state !== 'Despierto') return;
        
        const relationshipChange = Math.random() < 0.5 ? 1 : -1;
        this.relationships[other.id] = Math.max(0, Math.min(100, 
            (this.relationships[other.id] || 50) + relationshipChange
        ));
        
        this.lastInteraction = {
            with: other.name,
            when: currentYear,
            type: 'conversation'
        };
        
        this.addToPersonalLog(`Interacción con ${other.name} (relación: ${this.relationships[other.id]})`);
    }
    
    /* === LOG PERSONAL === */
    addToPersonalLog(entry) {
        this.personalLog.push({
            year: currentYear,
            entry: entry,
            mood: this.mood,
            activity: this.currentActivity
        });
        
        if (this.personalLog.length > 50) {
            this.personalLog.shift();
        }
    }
    
    /* === ESTADO GENERAL === */
    getOverallStatus() {
        if (!this.isAlive) return 'dead';
        
        const critical = this.foodNeed < 20 || this.healthNeed < 20 || this.wasteNeed > 80;
        const warning = this.foodNeed < 40 || this.healthNeed < 40 || this.wasteNeed > 60;
        const caution = this.foodNeed < 60 || this.healthNeed < 60 || this.wasteNeed > 40;
        
        if (critical) return 'danger';
        if (warning) return 'critical';
        if (caution) return 'warning';
        return 'ok';
    }
    
    /* === ACTUALIZACIÓN DE UI === */
    addRow() {
        const crewList = document.getElementById('crew-list');
        const row = document.createElement('tr');
        row.id = `crew-row-${this.id}`;
        row.innerHTML = `
            <td><span id="status-${this.id}">${this.isAlive ? '❤️' : '💀'}</span></td>
            <td>${this.name}</td>
            <td>${this.position}</td>
            <td><span id="age-display-${this.id}">${this.initialAge} → ${this.biologicalAge.toFixed(1)}</span></td>
            <td id="state-${this.id}">${this.state}</td>
            <td><button onclick="openCrewManagementPopup('${this.name}')">Gestionar</button></td>
        `;
        crewList.appendChild(row);
    }
    
    updateConsoleCrewState() {
        const statusElement = document.getElementById(`status-${this.id}`);
        if (statusElement) {
            statusElement.textContent = this.isAlive ? '❤️' : '💀';
        }
        
        const stateElement = document.getElementById(`state-${this.id}`);
        if (stateElement) {
            stateElement.textContent = this.state;
        }
        
        const ageElement = document.getElementById(`age-display-${this.id}`);
        if (ageElement) {
            ageElement.textContent = `${this.initialAge} → ${this.biologicalAge.toFixed(1)}`;
        }
    }
    
    createMiniCard() {
        const card = document.createElement('div');
        card.className = `crew-mini-card ${this.getOverallStatus()}`;
        card.id = `mini-card-${this.id}`;

        // Hacer la card arrastrable
        card.draggable = true;
        card.ondragstart = (e) => {
            e.dataTransfer.setData('text/plain', this.name);
            e.dataTransfer.effectAllowed = 'move';
            card.classList.add('dragging');
        };
        card.ondragend = (e) => {
            card.classList.remove('dragging');
        };

        if (!this.isAlive) {
            card.onclick = null;
            card.innerHTML = `
                <div class="crew-card-header">
                    <span class="crew-card-name">${this.name}</span>
                    <span class="crew-card-status">💀</span>
                </div>
                <div class="crew-card-state deceased">FALLECIDO</div>
            `;
            return card;
        }

        card.onclick = () => openCrewManagementPopup(this.name);

        try {
            // DESPIERTOS: mostrar beneficio, ubicación y pensamiento
            if (this.state === 'Despierto') {
                console.log(`🎨 Creando card DESPIERTO para ${this.name}`);
                const benefit = this.getAwakeBenefitDescription();
                const location = this.getCurrentLocation();
                const thought = this.getCurrentThought();
                console.log(`  Benefit: "${benefit}", Location: "${location}", Thought: "${thought}"`);

                card.innerHTML = `
                    <div class="crew-card-header">
                        <span class="crew-card-name">${this.name}</span>
                        <span class="crew-card-age">${this.biologicalAge.toFixed(0)} años</span>
                    </div>
                    ${benefit ? `<div class="crew-card-benefit-mini">⚡ ${benefit}</div>` : ''}
                    <div class="crew-card-location">
                        📍 ${location}
                    </div>
                    <div class="crew-card-thought">
                        <div class="thought-marquee">${thought}</div>
                    </div>
                `;
                console.log(`  ✅ HTML generado correctamente, longitud: ${card.innerHTML.length}`);
            } else {
                // ENCAPSULADOS: mostrar necesidades con barras
                console.log(`🎨 Creando card ENCAPSULADO para ${this.name}`);
                card.innerHTML = `
                    <div class="crew-card-header">
                        <span class="crew-card-name">${this.name}</span>
                        <span class="crew-card-age">${this.biologicalAge.toFixed(0)} años</span>
                    </div>
                    <div class="crew-card-needs-advanced" id="mini-needs-${this.id}">
                        ${this.generateAdvancedNeedBars()}
                    </div>
                `;
            }
        } catch (error) {
            console.error(`❌ ERROR creando card para ${this.name}:`, error);
            // Crear una card de fallback básica
            card.innerHTML = `
                <div class="crew-card-header">
                    <span class="crew-card-name">${this.name}</span>
                    <span class="crew-card-age">${this.biologicalAge.toFixed(0)} años</span>
                </div>
                <div class="crew-card-state">${this.state}</div>
            `;
        }

        return card;
    }

    getCurrentLocation() {
        try {
            // Obtener la ubicación actual del tripulante en el mapa
            if (typeof shipMapSystem !== 'undefined' && shipMapSystem) {
                const location = shipMapSystem.getCrewLocation(this.id);
                if (location) {
                    // Si está en un pasillo entre secciones
                    if (location.type === 'moving') {
                        return 'Desplazándose...';
                    }
                    return location.name || 'Ubicación desconocida';
                }
            }
            // Ubicación por defecto según especialidad
            const defaultLocations = {
                'Navegante': 'Puente de Mando',
                'Ingeniera': 'Sala de Máquinas',
                'Doctora': 'Enfermería',
                'Botánica': 'Invernadero',
                'Geóloga': 'Laboratorio'
            };
            return defaultLocations[this.position] || 'Nave';
        } catch (error) {
            console.warn(`⚠️ Error obteniendo ubicación para ${this.name}:`, error);
            return 'Nave';
        }
    }

    getCurrentThought() {
        try {
            // 1. MÁXIMA PRIORIDAD: Pensamiento personalizado de eventos (si existe y no ha expirado)
            if (this.personalThought && this.personalThoughtExpiry && Date.now() < this.personalThoughtExpiry) {
                return `💭 ${this.personalThought}`;
            } else if (this.personalThought && this.personalThoughtExpiry && Date.now() >= this.personalThoughtExpiry) {
                // Limpiar pensamiento expirado
                this.personalThought = null;
                this.personalThoughtExpiry = null;
            }

            // 2. SEGUNDA PRIORIDAD: Pensamientos según necesidades críticas
            let priorityThought = null;
            if (this.foodNeed < 30) {
                priorityThought = '💭 Tengo tanta hambre... Necesito comer algo pronto.';
            } else if (this.healthNeed < 30) {
                priorityThought = '💭 No me siento bien... Necesito atención médica.';
            } else if (this.wasteNeed > 80) {
                priorityThought = '💭 Necesito ir al baño urgentemente...';
            }

            // Si hay pensamiento prioritario, devolverlo y actualizarlo en caché
            if (priorityThought) {
                this.lastThought = priorityThought;
                return priorityThought;
            }

            // Si ya tenemos un pensamiento cacheado reciente, devolverlo (no cambiar constantemente)
            const currentTime = Date.now();
            // Cambiar pensamiento solo cada 30 segundos (30000 ms)
            if (this.lastThought && (currentTime - this.lastUIUpdate) < 30000) {
                return this.lastThought;
            }

            // Generar nuevo pensamiento aleatorio
            const thoughts = {
                'Capitán': [
                    '💭 Los cálculos de trayectoria están perfectos hoy.',
                    '💭 Me pregunto qué encontraremos en la Nueva Tierra.',
                    '💭 Mantener el rumbo es mi responsabilidad.'
                ],
                'Médica': [
                    '💭 Todos parecen estar en buena salud.',
                    '💭 Espero no tener que usar el quirófano.',
                    '💭 La medicina preventiva es clave en el espacio.'
                ],
                'Ingeniero': [
                    '💭 Los sistemas están funcionando óptimamente.',
                    '💭 Debería revisar los conductos de ventilación.',
                    '💭 Esta nave es una maravilla de ingeniería.'
                ],
                'Navegante': [
                    '💭 Los cálculos de navegación son precisos.',
                    '💭 Me encanta estudiar las estrellas.',
                    '💭 Cada día más cerca del destino.'
                ],
                'Chef': [
                    '💭 Las plantas están creciendo bien este ciclo.',
                    '💭 Debería preparar algo especial hoy.',
                    '💭 Me encanta cuidar del invernadero.'
                ]
            };

            const crewThoughts = thoughts[this.position] || ['💭 Todo va bien.'];
            const newThought = crewThoughts[Math.floor(Math.random() * crewThoughts.length)];

            // Actualizar caché
            this.lastThought = newThought;
            this.lastUIUpdate = currentTime;

            return newThought;
        } catch (error) {
            console.warn(`⚠️ Error obteniendo pensamiento para ${this.name}:`, error);
            return '💭 Todo va bien.';
        }
    }

    generateAdvancedNeedBars() {
        // Las 4 necesidades visibles para encapsulados
        const needs = [
            { icon: '🍲', label: 'alimentación', value: this.foodNeed, max: 100 },
            { icon: '❤️', label: 'salud', value: this.healthNeed, max: 100 },
            { icon: '🚽', label: 'higiene', value: this.wasteNeed, max: 100, inverse: true },
            { icon: '🎮', label: 'entretenimiento', value: this.entertainmentNeed, max: 100 }
        ];

        return needs.map(need => {
            const percentage = (need.value / need.max) * 100;
            let colorClass = 'good';

            if (need.inverse) {
                if (percentage > 80) colorClass = 'critical';
                else if (percentage > 60) colorClass = 'warning';
            } else {
                if (percentage < 20) colorClass = 'critical';
                else if (percentage < 40) colorClass = 'warning';
            }

            return `
                <div class="need-bar-advanced">
                    <button class="need-bar-icon-btn" onclick="event.stopPropagation(); quickManage('${this.name}', '${need.label}')">
                        ${need.icon}
                    </button>
                    <div class="need-bar-track">
                        <div class="need-bar-fill-advanced ${colorClass}" style="width: ${percentage}%"></div>
                    </div>
                    <span class="need-bar-percent">${Math.round(percentage)}%</span>
                </div>
            `;
        }).join('');
    }

    getAwakeBenefitDescription() {
        try {
            if (!this.isAlive) return '';
            if (this.state !== 'Despierto') return '';
            if (typeof awakeBenefitSystem === 'undefined' || !awakeBenefitSystem) return '';

            const benefit = awakeBenefitSystem.describeBenefitForCrew(this);
            return benefit || '';
        } catch (error) {
            console.warn(`⚠️ Error obteniendo beneficio para ${this.name}:`, error);
            return '';
        }
    }

    generateNeedBars() {
        const needs = [
            { icon: '🍕', value: this.foodNeed, max: 100 },
            { icon: '❤️', value: this.healthNeed, max: 100 },
            { icon: '🚽', value: this.wasteNeed, max: 100, inverse: true }
        ];
        
        return needs.map(need => {
            const percentage = (need.value / need.max) * 100;
            let colorClass = 'good';
            
            if (need.inverse) {
                if (percentage > 80) colorClass = 'critical';
                else if (percentage > 60) colorClass = 'warning';
            } else {
                if (percentage < 20) colorClass = 'critical';
                else if (percentage < 40) colorClass = 'warning';
            }
            
            return `
                <div class="need-bar">
                    <span class="need-bar-icon">${need.icon}</span>
                    <div class="need-bar-fill">
                        <div class="need-bar-progress ${colorClass}" style="width: ${percentage}%"></div>
                    </div>
                    <span class="need-bar-value">${Math.round(need.value)}%</span>
                </div>
            `;
        }).join('');
    }
    
    updateMiniCard() {
        const card = document.getElementById(`mini-card-${this.id}`);
        if (!card) return;

        // Para actualizaciones, simplemente actualizar la clase de estado
        card.className = `crew-mini-card ${this.getOverallStatus()}`;

        if (!this.isAlive) {
            card.onclick = null;
            card.innerHTML = `
                <div class="crew-card-header">
                    <span class="crew-card-name">${this.name}</span>
                    <span class="crew-card-status">💀</span>
                </div>
                <div class="crew-card-state deceased">FALLECIDO</div>
            `;
            return;
        }

        card.onclick = () => openCrewManagementPopup(this.name);

        // USAR EL MISMO DISEÑO QUE createMiniCard()
        // DESPIERTOS: mostrar beneficio, ubicación y pensamiento
        if (this.state === 'Despierto') {
            const benefit = this.getAwakeBenefitDescription();
            const location = this.getCurrentLocation();
            const thought = this.getCurrentThought();

            card.innerHTML = `
                <div class="crew-card-header">
                    <span class="crew-card-name">${this.name}</span>
                    <span class="crew-card-age">${this.biologicalAge.toFixed(0)} años</span>
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
            // ENCAPSULADOS: mostrar necesidades con barras
            card.innerHTML = `
                <div class="crew-card-header">
                    <span class="crew-card-name">${this.name}</span>
                    <span class="crew-card-age">${this.biologicalAge.toFixed(0)} años</span>
                </div>
                <div class="crew-card-needs-advanced" id="mini-needs-${this.id}">
                    ${this.generateAdvancedNeedBars()}
                </div>
            `;
        }
    }
}

/* === CLASE RECURSO === */
class Resource {
    constructor(resourceName, quantity, limiteStock, id, amount, stripId = null) {
        this.resourceName = resourceName;
        this.quantity = quantity;
        this.limiteStock = limiteStock;
        this.id = id;
        this.amount = amount;
        this.stripId = stripId;
    }

    consume(amount) {
        if (typeof amount !== 'number' || amount <= 0) {
            return;
        }

        let effectiveAmount = amount;

        if (
            this.resourceName === 'Alimentos' &&
            typeof awakeBenefitSystem !== 'undefined' &&
            awakeBenefitSystem
        ) {
            effectiveAmount = awakeBenefitSystem.modifyFoodConsumption(amount);
        }

        this.quantity = Math.max(0, this.quantity - effectiveAmount);
    }
    
    checkQuantity() {
        const threshold = this.limiteStock * 0.2;
        if (this.quantity < threshold && this.quantity > 0) {
            new ResourceNotification(`⚠️ ${this.resourceName} bajo: ${Math.round(this.quantity)}/${this.limiteStock}`, NOTIFICATION_TYPES.WARNING);
        }
    }
    
    updateResourceUI() {
        const meter = document.getElementById(this.id);
        const amountSpan = document.getElementById(this.amount);

        if (meter) {
            meter.value = this.quantity;
            meter.max = this.limiteStock;
        }

        if (amountSpan) {
            amountSpan.textContent = `${Math.round(this.quantity)}/${this.limiteStock}`;
        }

        if (this.stripId) {
            const stripSpan = document.getElementById(this.stripId);
            if (stripSpan) {
                stripSpan.textContent = `${Math.round(this.quantity)}/${this.limiteStock}`;
            }

            // Actualizar indicador de color (old system, still needed for mobile accordion)
            const indicatorId = this.stripId.replace('resource-strip-', 'indicator-');
            const indicator = document.getElementById(indicatorId);
            const percentage = (this.quantity / this.limiteStock) * 100;

            let colorClass = 'full';
            if (percentage < 15) {
                colorClass = 'critical';
            } else if (percentage < 40) {
                colorClass = 'low';
            } else if (percentage < 70) {
                colorClass = 'medium';
            }

            if (indicator) {
                indicator.className = 'resource-indicator ' + colorClass;
            }

            // Actualizar color del resource chip (new system)
            const chipId = this.stripId.replace('resource-strip-', 'resource-chip-');
            const chip = document.getElementById(chipId);
            if (chip) {
                chip.className = 'resource-chip ' + colorClass;
            }
        }
    }
}

/* === CLASE BITÁCORA === */
class Logbook {
    constructor() {
        this.entries = [];
    }
    
    addEntry(text, type = LOG_TYPES.INFO) {
        const entry = {
            year: currentYear,
            text: text,
            type: type,
            timestamp: new Date().toLocaleTimeString()
        };
        this.entries.push(entry);
        this.updateUI();

        // Enviar también al terminal de consola
        if (typeof window.addLogbookEntryToTerminal === 'function') {
            window.addLogbookEntryToTerminal(text, type);
        }
    }
    
    updateUI() {
        const container = document.getElementById('logbook-entries');
        if (!container) return;
        
        container.innerHTML = '';
        
        const sortedEntries = [...this.entries].reverse();
        
        sortedEntries.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.className = `logbook-entry ${entry.type}`;
            
            const icon = LOG_ICONS[entry.type] || LOG_ICONS.info;
            
            entryDiv.innerHTML = `
                <div class="logbook-entry-date">[AÑO ${entry.year.toFixed(1)}] ${entry.timestamp}</div>
                <div class="logbook-entry-text"><span class="logbook-entry-icon">${icon}</span>${entry.text}</div>
            `;
            
            container.appendChild(entryDiv);
        });
    }
}

/* === CLASES DE NOTIFICACIÓN === */
class Notification {
    constructor(message, type = NOTIFICATION_TYPES.INFO) {
        this.message = message;
        this.type = type;
        if (Notification.activeMessages.has(this.message)) {
            return;
        }
        this.display();
    }

    display() {
        const notificationsPanel = document.getElementById('notifications');
        if (!notificationsPanel) {
            return;
        }

        Notification.activeMessages.add(this.message);

        const notifDiv = document.createElement('div');
        notifDiv.className = `notification ${this.type}`;
        notifDiv.textContent = this.message;
        notifDiv.dataset.message = this.message;
        notificationsPanel.appendChild(notifDiv);

        setTimeout(() => {
            Notification.activeMessages.delete(this.message);
            notifDiv.remove();
        }, 5000);
    }
}

class CrewNotification extends Notification {
    constructor(message, type) {
        super(`👤 ${message}`, type);
    }
}

class ResourceNotification extends Notification {
    constructor(message, type) {
        super(`📦 ${message}`, type);
    }
}

Notification.activeMessages = new Set();
