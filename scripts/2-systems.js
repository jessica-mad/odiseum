// ============================================
// SISTEMAS - ODISEUM V2.0
// ============================================

/* === SISTEMA DE TIEMPO === */
class TimeSystem {
    constructor() {
        this.currentYear = 0;
        this.trancheCount = 0;
        this.tickCount = 0;
    }
    
    advanceTick() {
        this.tickCount++;
        this.currentYear += YEARS_PER_TICK;
    }
    
    advanceTranche() {
        this.trancheCount++;
        this.tickCount = 0;
    }
    
    getCurrentYear() {
        return this.currentYear;
    }
    
    getCurrentTranche() {
        return this.trancheCount;
    }
    
    updateCalendarUI() {
        const calendarElement = document.getElementById('calendar');
        if (calendarElement) {
            calendarElement.textContent = `Año ${this.currentYear.toFixed(1)}`;
        }
    }
}

/* === SISTEMA DE BENEFICIOS POR TRIPULANTES DESPIERTOS === */
class AwakeBenefitSystem {
    constructor() {
        this.reset();
    }

    reset() {
        this.isCaptainAwake = false;
        this.isDoctorAwake = false;
        this.isEngineerAwake = false;
        this.isNavigatorAwake = false;
        this.isChefAwake = false;
        this.awakeCrewCount = 0;
        this.nextMedicalIndex = 0;
        this.currentPatientName = null;
    }

    refreshState(crewMembers) {
        if (!Array.isArray(crewMembers)) return;

        const awakeCrew = crewMembers.filter(crew => crew.isAlive && crew.state === 'Despierto');

        this.awakeCrewCount = awakeCrew.length;
        this.isCaptainAwake = awakeCrew.some(crew => crew.role === 'commander');
        this.isDoctorAwake = awakeCrew.some(crew => crew.role === 'doctor');
        this.isEngineerAwake = awakeCrew.some(crew => crew.role === 'engineer');
        this.isNavigatorAwake = awakeCrew.some(crew => crew.role === 'scientist' || /johnson/i.test(crew.name));
        this.isChefAwake = awakeCrew.some(crew => crew.role === 'cook');

        if (!this.isDoctorAwake) {
            this.nextMedicalIndex = 0;
            this.currentPatientName = null;
            const doctor = crewMembers.find(crew => crew.role === 'doctor');
            if (doctor) {
                doctor.currentActivity = doctor.state === 'Despierto' ? 'en guardia' : doctor.currentActivity;
                doctor.updateMiniCard();
            }
        }
    }

    applyTickBenefits(crewMembers) {
        if (!this.isDoctorAwake) return;
        this.applyMedicalSupport(crewMembers);
    }

    applyMedicalSupport(crewMembers) {
        const patients = crewMembers.filter(crew => crew.isAlive && crew.healthNeed < 100);

        if (patients.length === 0) {
            this.nextMedicalIndex = 0;
            this.currentPatientName = null;
            const doctor = crewMembers.find(crew => crew.role === 'doctor');
            if (doctor) {
                doctor.currentActivity = 'en guardia';
                doctor.updateMiniCard();
            }
            return;
        }

        // Encontrar al paciente más enfermo (menor healthNeed)
        const sickestPatient = patients.reduce((sickest, current) => {
            return current.healthNeed < sickest.healthNeed ? current : sickest;
        });

        const healRate = this.isCaptainAwake ? 1.2 : 1.0;
        const patient = sickestPatient;

        patient.healthNeed = Math.min(100, patient.healthNeed + healRate);
        patient.updateConsoleCrewState();
        patient.updateMiniCard();

        this.currentPatientName = patient.name;
        const doctor = crewMembers.find(crew => crew.role === 'doctor');
        if (doctor) {
            doctor.currentActivity = `Atendiendo a ${patient.name}`;
            doctor.updateMiniCard();
        }

        if (typeof gameLoop !== 'undefined' && gameLoop) {
            gameLoop.updateCrewPopupIfOpen();
        }
    }

    getCrewEfficiencyMultiplier(crew, baseMultiplier = 1) {
        let multiplier = baseMultiplier || 1;

        if (
            crew &&
            crew.isAlive &&
            crew.state === 'Despierto' &&
            this.isCaptainAwake &&
            crew.role !== 'commander'
        ) {
            multiplier *= 1.1;
        }

        return multiplier;
    }

    getNavigatorSpeedMultiplier() {
        if (!this.isNavigatorAwake) return 1;
        return this.isCaptainAwake ? 1.05 : 1.02;
    }

    getEngineerDamageReduction() {
        if (!this.isEngineerAwake) return 0;
        return this.isCaptainAwake ? 0.25 : 0.2;
    }

    modifyFoodConsumption(amount) {
        if (!this.isChefAwake || this.awakeCrewCount <= 1) {
            return amount;
        }

        const reduction = this.isCaptainAwake ? 0.07 : 0.05;
        return Math.max(0, amount * (1 - reduction));
    }

    describeBenefitForCrew(crew) {
        if (!crew || crew.state !== 'Despierto') return '';

        switch (crew.role) {
            case 'commander':
                return 'Liderazgo activo: +10% eficiencia para la tripulación despierta.';
            case 'doctor': {
                const rate = this.isCaptainAwake ? 'x1.2' : 'x1.0';
                const target = this.currentPatientName || 'en espera de pacientes';
                return `Atención médica ${rate} • ${target}`;
            }
            case 'engineer': {
                const reduction = Math.round(this.getEngineerDamageReduction() * 100);
                return `Mantenimiento preventivo: -${reduction}% probabilidad de daños.`;
            }
            case 'scientist':
            case 'navigator': {
                const boost = Math.round((this.getNavigatorSpeedMultiplier() - 1) * 100);
                return `Trayectoria optimizada: +${boost}% a la velocidad de crucero.`;
            }
            case 'cook': {
                const savings = Math.round((this.isCaptainAwake ? 0.07 : 0.05) * 100);
                return `Raciones eficientes: ahorro del ${savings}% en comida despierta.`;
            }
            default:
                return '';
        }
    }
}

/* === SISTEMA DE INTEGRIDAD DE LA NAVE === */
class ShipIntegritySystem {
    constructor() {
        this.baseDamageProbability = 0.12;
        this.cooldownTicks = 0;
        this.damageMessages = [
            'Análisis detecta microfracturas en el casco externo. Equipos de reparación en marcha.',
            'Sistemas secundarios reportan vibraciones inusuales. Ajustando amortiguadores.',
            'Los sensores térmicos indican sobrecarga en el núcleo auxiliar. Redirigiendo energía.',
            'Pequeños impactos de micrometeoritos registrados. Revisando placas protectoras.'
        ];
    }

    reset() {
        this.cooldownTicks = 0;
    }

    tick(benefitSystem) {
        if (this.cooldownTicks > 0) {
            this.cooldownTicks--;
            return;
        }

        if (benefitSystem && benefitSystem.awakeCrewCount === 0) {
            return;
        }

        let probability = this.baseDamageProbability;
        const reduction = benefitSystem ? benefitSystem.getEngineerDamageReduction() : 0;
        probability = Math.max(0, probability * (1 - reduction));

        if (Math.random() < probability) {
            this.raiseDamageAlert();
            this.cooldownTicks = 5;
        }
    }

    raiseDamageAlert() {
        if (!Array.isArray(this.damageMessages) || this.damageMessages.length === 0) {
            return;
        }

        const message = this.damageMessages[Math.floor(Math.random() * this.damageMessages.length)];
        new Notification(`⚙️ ${message}`, NOTIFICATION_TYPES.ALERT);
        logbook.addEntry(`Alerta de daños: ${message}`, LOG_TYPES.WARNING);
    }
}

/* === SISTEMA DE BUCLE DE JUEGO === */
class GameLoop {
    constructor() {
        this.gameState = GAME_STATES.PAUSED;
        this.gameLoopInterval = null;
        this.timerInterval = null;
        this.trancheTimeRemaining = TRANCHE_DURATION_MS;
        this.currentSpeed = 65;
        this.missionStarted = false;
        this.eventTriggeredThisTranche = false;
    }

    start() {
        if (this.gameState !== GAME_STATES.PAUSED &&
            this.gameState !== GAME_STATES.AWAITING_START) return;

        this.gameState = GAME_STATES.IN_TRANCHE;
        this.trancheTimeRemaining = TRANCHE_DURATION_MS;
        this.eventTriggeredThisTranche = false;

        // Reproducir sonido de inicio de tramo
        if (typeof playTrancheSound === 'function') {
            playTrancheSound();
        }

        // Actualizar UI de botones
        document.getElementById('start-button').style.display = 'none';
        document.getElementById('pause-button').style.display = 'inline-block';
        document.getElementById('resume-button').style.display = 'none';

        // Actualizar estado del viaje
        if (typeof updateVoyageStatus === 'function') {
            updateVoyageStatus();
        }

        // Obtener velocidad actual (antes de deshabilitar el control)
        this.currentSpeed = parseInt(document.getElementById('speed-control').value);

        // Habilitar interacciones durante el tramo (deshabilita velocidad, habilita recursos)
        if (typeof enableAllInteractions === 'function') {
            enableAllInteractions();
        }

        logbook.addEntry(`Tramo iniciado. Velocidad: ${this.currentSpeed}%`, LOG_TYPES.EVENT);
        new Notification('Tramo iniciado. Gestionando sistemas...', NOTIFICATION_TYPES.INFO);

        // Iniciar bucle de simulación (cada 2 segundos)
        this.gameLoopInterval = setInterval(() => this.tick(), SIMULATION_TICK_RATE);

        // Iniciar actualización del temporizador visual (cada 1 segundo)
        this.timerInterval = setInterval(() => this.updateTimerTick(), 1000);
    }

    updateTimerTick() {
        // Reducir tiempo del tramo (1 segundo)
        this.trancheTimeRemaining -= 1000;
        this.updateTimerUI();

        // Verificar si el tramo terminó
        if (this.trancheTimeRemaining <= 0) {
            this.endTranche();
        }
    }

    tick() {
        // Actualizar progreso del viaje
        this.updateTripProgress();
        
        // Avanzar tiempo
        timeSystem.advanceTick();
        timeSystem.updateCalendarUI();
        currentYear = timeSystem.getCurrentYear();

        // Envejecer tripulantes despiertos
        crewMembers.forEach(crew => {
            crew.age(YEARS_PER_TICK);
        });
        
        // Auto-gestión y sistema social
        const awakeCrew = crewMembers.filter(c => c.isAlive && c.state === 'Despierto');

        if (typeof awakeBenefitSystem !== 'undefined' && awakeBenefitSystem) {
            awakeBenefitSystem.refreshState(crewMembers);
        }

        awakeCrew.forEach(crew => {
            crew.tryAutoManage();
        });
        
        // Interacciones sociales aleatorias
        if (awakeCrew.length >= 2 && Math.random() < 0.2) {
            const crew1 = awakeCrew[Math.floor(Math.random() * awakeCrew.length)];
            const crew2 = awakeCrew.filter(c => c.id !== crew1.id)[0];
            if (crew2) {
                crew1.interactWith(crew2);
                crew2.interactWith(crew1);
            }
        }
        
        // Actualizar tripulación
        crewMembers.forEach(crew => {
            crew.updateCrewNeeds();
            crew.checkHunger();
            crew.checkHealthy();
            crew.checkShit();
            crew.checkEntertainment();
            crew.checkRest();
            crew.updateConsoleCrewState();
            crew.updateMiniCard();
        });

        if (typeof awakeBenefitSystem !== 'undefined' && awakeBenefitSystem) {
            awakeBenefitSystem.applyTickBenefits(crewMembers);
        }

        // Intentar disparar evento crítico
        if (
            typeof eventSystem !== 'undefined' &&
            eventSystem &&
            !this.eventTriggeredThisTranche &&
            !eventSystem.activeEvent
        ) {
            eventSystem.tryTriggerEvent();
        }

        if (typeof shipIntegritySystem !== 'undefined' && shipIntegritySystem) {
            shipIntegritySystem.tick(awakeBenefitSystem);
        }

        // Actualizar recursos
        this.updateAllResources();
        
        // Consumo base de recursos
        Energy.consume(this.currentSpeed * RESOURCES_CONFIG.energy.consumeRate);
        Oxygen.consume(RESOURCES_CONFIG.oxygen.consumeRate);
        
        // Verificar recursos críticos
        Energy.checkQuantity();
        Food.checkQuantity();
        Water.checkQuantity();
        Oxygen.checkQuantity();
        Medicine.checkQuantity();
        Fuel.checkQuantity();
        
        // Actualizar popup de tripulante si está abierto
        this.updateCrewPopupIfOpen();
    }

    endTranche() {
        // Detener ambos intervalos
        clearInterval(this.gameLoopInterval);
        this.gameLoopInterval = null;
        clearInterval(this.timerInterval);
        this.timerInterval = null;

        // Detener sonido de tramo
        if (typeof stopTrancheSound === 'function') {
            stopTrancheSound();
        }

        this.gameState = GAME_STATES.PAUSED;
        this.eventTriggeredThisTranche = false;

        // Reiniciar temporizador
        this.trancheTimeRemaining = TRANCHE_DURATION_MS;
        this.updateTimerUI();

        // Avanzar tramo
        timeSystem.advanceTranche();

        // Actualizar UI de botones
        document.getElementById('start-button').style.display = 'inline-block';
        document.getElementById('pause-button').style.display = 'none';
        document.getElementById('resume-button').style.display = 'none';

        // Actualizar texto del botón según el tramo
        if (typeof updateStartButtonText === 'function') {
            updateStartButtonText();
        }

        // Actualizar estado del viaje
        if (typeof updateVoyageStatus === 'function') {
            updateVoyageStatus();
        }

        // Habilitar solo slider de velocidad entre tramos
        if (typeof enableInteractionsBetweenTranches === 'function') {
            enableInteractionsBetweenTranches();
        }

        // Registrar en bitácora
        const aliveCrew = crewMembers.filter(c => c.isAlive).length;
        logbook.addEntry(`Tramo completado. Tripulantes vivos: ${aliveCrew}/5`, LOG_TYPES.SUCCESS);

        new Notification('Tramo completado. Preparando para el siguiente tramo.', NOTIFICATION_TYPES.INFO);

        // Mostrar mensajes cuánticos si hay
        messageSystem.showMessagesForTranche(timeSystem.getCurrentTranche());
    }
    
    pause() {
        if (this.gameState !== GAME_STATES.IN_TRANCHE) return;

        // Detener ambos intervalos
        clearInterval(this.gameLoopInterval);
        this.gameLoopInterval = null;
        clearInterval(this.timerInterval);
        this.timerInterval = null;

        // Detener sonido de tramo
        if (typeof stopTrancheSound === 'function') {
            stopTrancheSound();
        }

        this.gameState = GAME_STATES.TRANCHE_PAUSED;

        document.getElementById('pause-button').style.display = 'none';
        document.getElementById('resume-button').style.display = 'inline-block';

        // Actualizar estado del viaje (sigue mostrando que estamos viajando)
        if (typeof updateVoyageStatus === 'function') {
            updateVoyageStatus();
        }

        // Deshabilitar TODAS las interacciones cuando se pausa
        if (typeof disableAllInteractions === 'function') {
            disableAllInteractions();
        }

        logbook.addEntry('Tramo pausado', LOG_TYPES.INFO);
    }

    resume() {
        if (this.gameState !== GAME_STATES.TRANCHE_PAUSED) return;

        this.gameState = GAME_STATES.IN_TRANCHE;

        // Reiniciar sonido de tramo
        if (typeof playTrancheSound === 'function') {
            playTrancheSound();
        }

        // Reiniciar ambos intervalos
        this.gameLoopInterval = setInterval(() => this.tick(), SIMULATION_TICK_RATE);
        this.timerInterval = setInterval(() => this.updateTimerTick(), 1000);

        document.getElementById('pause-button').style.display = 'inline-block';
        document.getElementById('resume-button').style.display = 'none';

        // Actualizar estado del viaje
        if (typeof updateVoyageStatus === 'function') {
            updateVoyageStatus();
        }

        // Habilitar interacciones durante el tramo (deshabilita velocidad, habilita recursos)
        if (typeof enableAllInteractions === 'function') {
            enableAllInteractions();
        }

        logbook.addEntry('Tramo reanudado', LOG_TYPES.INFO);
    }
    
    updateTimerUI() {
        const minutes = Math.floor(this.trancheTimeRemaining / 60000);
        const seconds = Math.floor((this.trancheTimeRemaining % 60000) / 1000);
        const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.getElementById('tranche-timer').textContent = display;
    }

    updateTripProgress() {
        const inTranche = this.gameState === GAME_STATES.IN_TRANCHE;
        const speedControl = document.getElementById('speed-control');
        const referenceSpeed = inTranche
            ? this.currentSpeed
            : (speedControl ? parseInt(speedControl.value, 10) : this.currentSpeed);

        let distancePerTick = (referenceSpeed / 100) * 20;

        if (typeof awakeBenefitSystem !== 'undefined' && awakeBenefitSystem) {
            distancePerTick *= awakeBenefitSystem.getNavigatorSpeedMultiplier();
        }

        if (inTranche) {
            distanceTraveled += distancePerTick;

            const fuelConsumption = (this.currentSpeed / 100) * RESOURCES_CONFIG.fuel.consumeRate;
            Fuel.consume(fuelConsumption);
            Fuel.updateResourceUI();

            // GAME OVER: Sin combustible
            if (Fuel.quantity <= 0) {
                this.gameOverNoFuel();
                return;
            }
        }

        const progress = (distanceTraveled / TOTAL_MISSION_DISTANCE) * 100;
        const progressBar = document.getElementById('trip-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }

        const distanceTraveledEl = document.getElementById('distance-traveled');
        const totalDistanceEl = document.getElementById('total-distance');
        if (distanceTraveledEl) distanceTraveledEl.textContent = Math.round(distanceTraveled);
        if (totalDistanceEl) totalDistanceEl.textContent = TOTAL_MISSION_DISTANCE;

        if (typeof updateVoyageVisualizer === 'function') {
            updateVoyageVisualizer();
        }

        if (inTranche && distanceTraveled >= TOTAL_MISSION_DISTANCE) {
            this.endMission();
        }
    }
    
    gameOverNoFuel() {
        // Detener ambos intervalos
        clearInterval(this.gameLoopInterval);
        this.gameLoopInterval = null;
        clearInterval(this.timerInterval);
        this.timerInterval = null;

        this.gameState = GAME_STATES.PAUSED;

        logbook.addEntry('COMBUSTIBLE AGOTADO. La nave deriva sin control.', LOG_TYPES.CRITICAL);
        logbook.addEntry('Los sistemas de soporte vital fallan. La tripulación no puede sobrevivir.', LOG_TYPES.DEATH);
        logbook.addEntry('GAME OVER: La misión ha fracasado.', LOG_TYPES.CRITICAL);

        new Notification('COMBUSTIBLE AGOTADO - GAME OVER', NOTIFICATION_TYPES.ALERT);

        // Mostrar pantalla de Game Over (0 sobrevivientes)
        victorySystem.showVictoryScreen(0);
    }

    endMission() {
        clearInterval(this.gameLoopInterval);
        this.gameState = GAME_STATES.PAUSED;

        const aliveCrew = crewMembers.filter(c => c.isAlive).length;
        logbook.addEntry(`¡MISIÓN COMPLETADA! Llegada a ${DESTINATION_NAME}.`, LOG_TYPES.SUCCESS);
        logbook.addEntry(`Tripulantes sobrevivientes: ${aliveCrew}/5`, LOG_TYPES.SUCCESS);

        // Mostrar pantalla de victoria
        victorySystem.showVictoryScreen(aliveCrew);
    }
    
    updateAllResources() {
        Energy.updateResourceUI();
        Food.updateResourceUI();
        Water.updateResourceUI();
        Oxygen.updateResourceUI();
        Medicine.updateResourceUI();
        Data.updateResourceUI();
        Fuel.updateResourceUI();
    }
    
    updateCrewPopupIfOpen() {
        const popup = document.getElementById('crew-management-popup');
        if (popup && popup.style.display === 'block') {
            const crewName = document.getElementById('crew-name').textContent;
            const crewMember = crewMembers.find(c => c.name === crewName);
            
            if (crewMember) {
                document.getElementById('crew-bio-age').textContent = crewMember.biologicalAge.toFixed(1);
                document.getElementById('food-need-amount').textContent = Math.round(crewMember.foodNeed);
                document.getElementById('health-need-amount').textContent = Math.round(crewMember.healthNeed);
                document.getElementById('waste-need-amount').textContent = Math.round(crewMember.wasteNeed);
                document.getElementById('entertainment-need-amount').textContent = Math.round(crewMember.entertainmentNeed);
                document.getElementById('rest-need-amount').textContent = Math.round(crewMember.restNeed);
                const activityElement = document.getElementById('crew-activity');
                if (activityElement) {
                    activityElement.textContent = crewMember.currentActivity;
                }

                const benefitReadout = document.getElementById('crew-benefit-readout');
                if (benefitReadout) {
                    const benefitText = crewMember.getAwakeBenefitDescription();
                    benefitReadout.textContent = benefitText || 'Beneficio inactivo (encapsulado).';
                }
            }
        }
    }
}

/* === SISTEMA DE EVENTOS CRÍTICOS === */
class EventSystem {
    constructor() {
        this.availableEvents = Array.isArray(EVENTS_POOL) ? [...EVENTS_POOL] : [];
        this.triggeredEvents = new Set();
        this.globalFlags = [];
        this.activeEvent = null;
        this.currentOverlay = null;
        this.currentPopup = null;
        this.pendingChainEvents = new Set();
        this.resolvingEvent = false;
    }

    tryTriggerEvent() {
        if (this.activeEvent) return;

        const currentTranche = timeSystem.getCurrentTranche();
        const candidates = this.availableEvents.filter(event => {
            if (this.triggeredEvents.has(event.id)) return false;
            return this.checkEventConditions(event, currentTranche);
        });

        if (candidates.length === 0) return;

        const prioritized = this.prioritizeEvents(candidates);

        let selectedEvent = null;

        for (const event of prioritized) {
            if (!selectedEvent) {
                selectedEvent = event;
            }

            const rawProbability = event.trigger?.probability;
            const normalizedProbability = typeof rawProbability === 'number'
                ? Math.min(Math.max(rawProbability, 0), 1)
                : 1;

            const guaranteedTrigger = normalizedProbability === 0;

            if (guaranteedTrigger || Math.random() <= normalizedProbability) {
                selectedEvent = event;
                break;
            }
        }

        if (selectedEvent) {
            this.displayEvent(selectedEvent);
            if (this.pendingChainEvents.has(selectedEvent.id)) {
                this.pendingChainEvents.delete(selectedEvent.id);
            }
        }
    }

    prioritizeEvents(events) {
        const chainEvents = [];
        const flaggedEvents = [];
        const generalEvents = [];

        events.forEach(event => {
            if (this.pendingChainEvents.has(event.id)) {
                chainEvents.push(event);
            } else if ((event.trigger?.requiredFlags || []).length > 0) {
                flaggedEvents.push(event);
            } else {
                generalEvents.push(event);
            }
        });

        return [...chainEvents, ...flaggedEvents, ...generalEvents];
    }

    checkEventConditions(event, currentTranche = timeSystem.getCurrentTranche()) {
        const trigger = event.trigger || {};

        if (typeof trigger.minTranche === 'number' && currentTranche < trigger.minTranche) return false;
        if (typeof trigger.maxTranche === 'number' && currentTranche > trigger.maxTranche) return false;

        if (!this.validateCrewState(trigger.requiredAlive, crew => crew.isAlive)) return false;
        if (!this.validateCrewState(trigger.requiredAwake, crew => crew.isAlive && crew.state === 'Despierto')) return false;
        if (!this.validateCrewState(trigger.requiredAsleep, crew => crew.isAlive && crew.state !== 'Despierto')) return false;

        if (!this.validateResourceThreshold(trigger.resourceMin, (resource, value) => resource.quantity >= value)) return false;
        if (!this.validateResourceThreshold(trigger.resourceMax, (resource, value) => resource.quantity <= value)) return false;

        const accumulatedFlags = new Set(this.globalFlags);
        if (Array.isArray(crewMembers)) {
            crewMembers.forEach(crew => {
                (crew.eventFlags || []).forEach(flag => accumulatedFlags.add(flag));
            });
        }

        if (Array.isArray(trigger.requiredFlags)) {
            const missing = trigger.requiredFlags.some(flag => !accumulatedFlags.has(flag));
            if (missing) return false;
        }

        if (Array.isArray(trigger.blockedByFlags)) {
            const blocked = trigger.blockedByFlags.some(flag => accumulatedFlags.has(flag));
            if (blocked) return false;
        }

        return true;
    }

    validateCrewState(names, predicate) {
        if (!Array.isArray(names) || names.length === 0) return true;
        return names.every(name => {
            const crew = this.getCrewByName(name);
            return crew ? predicate(crew) : false;
        });
    }

    validateResourceThreshold(config, comparator) {
        if (!config || typeof config !== 'object') return true;
        return Object.entries(config).every(([key, value]) => {
            const resource = this.getResourceByKey(key);
            if (!resource) return false;
            return comparator(resource, value);
        });
    }

    displayEvent(event) {
        if (this.activeEvent) return;

        this.activeEvent = event;
        this.resolvingEvent = false;
        gameLoop.eventTriggeredThisTranche = true;

        if (gameLoop.gameState === GAME_STATES.IN_TRANCHE) {
            gameLoop.pause();
        }

        // Reproducir sonido de alarma 2 segundos antes del popup
        if (typeof playEventAlarmSound === 'function') {
            playEventAlarmSound();
        }

        // Esperar 2 segundos antes de mostrar el popup
        setTimeout(() => {
            this.showEventPopup(event);
        }, 2000);
    }

    showEventPopup(event) {
        const overlay = document.createElement('div');
        overlay.className = 'event-overlay';
        overlay.id = 'event-overlay';

        const popup = document.createElement('div');
        popup.className = 'event-popup';

        const header = document.createElement('div');
        header.className = 'event-header';
        header.innerHTML = `
            <div class="event-header-icon">${event.icon || '⚠️'}</div>
            <div class="event-header-meta">
                <h2>${event.title || ''}</h2>
                <div class="event-header-details">${event.character || ''} • Año ${timeSystem.getCurrentYear().toFixed(1)}</div>
            </div>
        `;

        const description = document.createElement('div');
        description.className = 'event-description';
        description.textContent = event.description || '';

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'event-options';

        const optionAButton = this.createOptionButton(event, event.optionA);
        const optionBButton = this.createOptionButton(event, event.optionB);

        optionsContainer.appendChild(optionAButton);
        optionsContainer.appendChild(optionBButton);

        popup.appendChild(header);
        popup.appendChild(description);
        popup.appendChild(optionsContainer);

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        this.currentOverlay = overlay;
        this.currentPopup = popup;
    }

    createOptionButton(event, option) {
        const button = document.createElement('button');
        button.className = 'event-option-button';
        button.textContent = option?.label || '';

        const { ok, reason } = this.evaluateOptionRequirements(option);
        if (!ok) {
            button.classList.add('disabled');
            if (reason) {
                button.title = reason;
            }
        }

        button.addEventListener('click', () => {
            if (button.classList.contains('disabled') || this.resolvingEvent) return;
            this.selectOption(event, option);
        });

        return button;
    }

    evaluateOptionRequirements(option) {
        if (!option || !option.requires) return { ok: true, reason: '' };

        const requires = option.requires;

        if (Array.isArray(requires.crewAlive)) {
            for (const name of requires.crewAlive) {
                const crew = this.getCrewByName(name);
                if (!crew || !crew.isAlive) {
                    return { ok: false, reason: `${name} debe estar vivo` };
                }
            }
        }

        if (Array.isArray(requires.crewAwake)) {
            for (const name of requires.crewAwake) {
                const crew = this.getCrewByName(name);
                if (!crew || crew.state !== 'Despierto') {
                    return { ok: false, reason: `${name} debe estar despierto` };
                }
            }
        }

        if (Array.isArray(requires.crewAsleep)) {
            for (const name of requires.crewAsleep) {
                const crew = this.getCrewByName(name);
                if (!crew || crew.state === 'Despierto') {
                    return { ok: false, reason: `${name} debe estar encapsulado` };
                }
            }
        }

        if (requires.minResources && typeof requires.minResources === 'object') {
            for (const [key, value] of Object.entries(requires.minResources)) {
                const resource = this.getResourceByKey(key);
                if (!resource || resource.quantity < value) {
                    return { ok: false, reason: `Requiere ${key}: ${value}` };
                }
            }
        }

        return { ok: true, reason: '' };
    }

    selectOption(event, option) {
        if (!option) return;
        const { ok, reason } = this.evaluateOptionRequirements(option);
        if (!ok) {
            new Notification(reason || 'Requisitos no cumplidos', NOTIFICATION_TYPES.WARNING);
            return;
        }

        this.resolvingEvent = true;

        if (option.costs && typeof option.costs === 'object') {
            Object.entries(option.costs).forEach(([key, value]) => {
                const resource = this.getResourceByKey(key);
                if (resource) {
                    if (value >= 0) {
                        resource.consume(value);
                    } else {
                        resource.quantity = Math.min(resource.limiteStock, resource.quantity + Math.abs(value));
                    }
                    resource.updateResourceUI();
                }
            });
        }

        if (Array.isArray(option.wakeUp)) {
            option.wakeUp.forEach(name => {
                const crew = this.getCrewByName(name);
                if (crew && crew.isAlive) {
                    crew.state = 'Despierto';
                    crew.updateConsoleCrewState();
                    crew.updateMiniCard();
                }
            });
        }

        const outcomeKey = option.result === 'good' ? 'good' : 'bad';
        const outcome = event.outcomes?.[outcomeKey];

        this.applyOutcome(event, outcome, outcomeKey);
        this.showOutcome(event, outcome, outcomeKey);
    }

    applyOutcome(event, outcome, outcomeKey) {
        if (!outcome) return;

        if (outcome.flag && !this.globalFlags.includes(outcome.flag)) {
            this.globalFlags.push(outcome.flag);
        }

        if (!this.globalFlags.includes(event.id)) {
            this.globalFlags.push(event.id);
        }

        this.triggeredEvents.add(event.id);

        if (Array.isArray(this.availableEvents)) {
            this.availableEvents = this.availableEvents.filter(e => e.id !== event.id);
        }

        const affectedCrew = outcome.affectedCrew || {};
        Object.entries(affectedCrew).forEach(([name, changes]) => {
            const crew = this.getCrewByName(name);
            if (!crew) return;

            currentYear = timeSystem.getCurrentYear();

            if (changes.hasOwnProperty('trauma')) {
                crew.trauma = changes.trauma;
            }

            if (changes.emotionalState) {
                crew.emotionalState = changes.emotionalState;
            }

            if (typeof changes.skillModifier === 'number') {
                crew.skillModifier = changes.skillModifier;
            }

            if (changes.relationships && typeof changes.relationships === 'object') {
                Object.entries(changes.relationships).forEach(([otherName, delta]) => {
                    const otherCrew = this.getCrewByName(otherName);
                    if (!otherCrew) return;
                    const currentValue = crew.relationships?.[otherCrew.id] ?? 50;
                    const newValue = Math.max(0, Math.min(100, currentValue + delta));
                    crew.relationships[otherCrew.id] = newValue;
                });
            }

            if (outcome.flag && !crew.eventFlags.includes(outcome.flag)) {
                crew.eventFlags.push(outcome.flag);
            }

            if (!crew.eventFlags.includes(event.id)) {
                crew.eventFlags.push(event.id);
            }

            crew.eventMemories.push({
                eventId: event.id,
                outcome: outcomeKey,
                narrative: outcome.narrative || '',
                year: timeSystem.getCurrentYear()
            });

            if (crew.eventMemories.length > 20) {
                crew.eventMemories.shift();
            }

            crew.addToPersonalLog(`[EVENTO CRÍTICO] ${event.title || ''}: ${outcome.narrative || ''}`);
            crew.updateConsoleCrewState();
            crew.updateMiniCard();
        });

        if (outcome.chainEvent) {
            this.pendingChainEvents.add(outcome.chainEvent);
        }

        const entryText = `${event.icon || '⚠️'} ${event.title || 'Evento crítico'} — ${outcome.narrative || ''}`.trim();
        logbook.addEntry(entryText, LOG_TYPES.EVENT_CRITICAL);

        if (typeof gameLoop.updateCrewPopupIfOpen === 'function') {
            gameLoop.updateCrewPopupIfOpen();
        }
    }

    showOutcome(event, outcome, outcomeKey) {
        if (!this.currentPopup) return;

        this.currentPopup.innerHTML = '';

        const header = document.createElement('div');
        header.className = 'event-header';
        header.innerHTML = `
            <div class="event-header-icon">${event.icon || '⚠️'}</div>
            <div class="event-header-meta">
                <h2>${event.title || ''}</h2>
                <div class="event-header-details">${event.character || ''} • Año ${timeSystem.getCurrentYear().toFixed(1)}</div>
            </div>
        `;

        const resultContainer = document.createElement('div');
        const resultClass = outcomeKey === 'good' ? 'good' : 'bad';
        resultContainer.className = `event-result ${resultClass}`;

        const narrative = document.createElement('p');
        narrative.textContent = outcome?.narrative || '';

        const changesList = document.createElement('ul');
        changesList.className = 'event-result-changes';

        if (outcome && outcome.affectedCrew) {
            Object.entries(outcome.affectedCrew).forEach(([name, changes]) => {
                const item = document.createElement('li');
                const parts = [];
                if (changes.trauma) parts.push(`Trauma: ${changes.trauma}`);
                if (changes.emotionalState) parts.push(`Estado: ${changes.emotionalState}`);
                if (typeof changes.skillModifier === 'number') parts.push(`Modificador: ${changes.skillModifier}`);
                if (changes.relationships) {
                    Object.entries(changes.relationships).forEach(([otherName, delta]) => {
                        const symbol = delta >= 0 ? '+' : '';
                        parts.push(`Relación con ${otherName}: ${symbol}${delta}`);
                    });
                }
                item.textContent = `${name}: ${parts.join(' | ')}`;
                changesList.appendChild(item);
            });
        }

        const continueButton = document.createElement('button');
        continueButton.className = 'event-option-button';
        continueButton.textContent = 'CONTINUAR';
        continueButton.addEventListener('click', () => this.closeEvent());

        resultContainer.appendChild(narrative);
        if (changesList.childElementCount > 0) {
            resultContainer.appendChild(changesList);
        }
        resultContainer.appendChild(continueButton);

        this.currentPopup.appendChild(header);
        this.currentPopup.appendChild(resultContainer);
    }

    closeEvent() {
        if (this.currentOverlay && this.currentOverlay.parentNode) {
            this.currentOverlay.parentNode.removeChild(this.currentOverlay);
        }

        this.activeEvent = null;
        this.currentOverlay = null;
        this.currentPopup = null;
        this.resolvingEvent = false;

        if (gameLoop.gameState === GAME_STATES.TRANCHE_PAUSED) {
            gameLoop.resume();
        }
    }

    getCrewByName(name) {
        if (!Array.isArray(crewMembers)) return null;
        return crewMembers.find(crew => crew.name === name) || null;
    }

    getResourceByKey(key) {
        const map = {
            energy: Energy,
            food: Food,
            water: Water,
            oxygen: Oxygen,
            medicine: Medicine,
            data: Data,
            fuel: Fuel
        };
        return map[key] || null;
    }
}

/* === SISTEMA DE MENSAJES CUÁNTICOS === */
class MessageSystem {
    constructor() {
        this.messages = [];
        this.shownMessages = new Set();
    }
    
    addMessage(tranche, type, recipient, text) {
        this.messages.push({
            tranche: tranche,
            type: type,
            recipient: recipient,
            text: text
        });
    }
    
    showMessagesForTranche(tranche) {
        const trancheMessages = this.messages.filter(m => 
            m.tranche === tranche && !this.shownMessages.has(`${m.tranche}-${m.recipient}`)
        );
        
        if (trancheMessages.length === 0) return;
        
        this.displayMessagesPopup(trancheMessages, tranche);
        
        // Marcar como mostrados
        trancheMessages.forEach(m => {
            this.shownMessages.add(`${m.tranche}-${m.recipient}`);
        });
    }
    
    displayMessagesPopup(messages, tranche) {
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'quantum-message-overlay';
        overlay.id = 'quantum-message-overlay';
        
        // Crear popup
        const popup = document.createElement('div');
        popup.className = 'quantum-message-popup';
        
        // Header
        const header = document.createElement('div');
        header.className = 'quantum-message-header';
        header.innerHTML = `
            <h2>📡 COMUNICACIONES RECIBIDAS</h2>
            <div class="year">[Fin del Tramo ${tranche} - Año ${timeSystem.getCurrentYear().toFixed(1)}]</div>
        `;
        popup.appendChild(header);
        
        // Content
        const content = document.createElement('div');
        content.className = 'quantum-message-content';
        
        messages.forEach(msg => {
            const messageBox = document.createElement('div');
            messageBox.className = `message-box ${msg.type === 'earth' ? 'from-earth' : 'from-new-earth'}`;
            
            const icon = msg.type === 'earth' ? '🌍' : '🌟';
            const source = msg.type === 'earth' ? 'TIERRA VIEJA' : 'NUEVA TIERRA - COLONIA ESPERANZA';
            
            messageBox.innerHTML = `
                <div class="message-header">
                    <span class="message-icon">${icon}</span>
                    <div>
                        <div class="message-to">${source}</div>
                        <div style="font-size: 10px; color: #666;">Para: ${msg.recipient}</div>
                    </div>
                </div>
                <div class="message-text">${msg.text}</div>
            `;
            
            content.appendChild(messageBox);
            
            // Agregar a bitácora
            logbook.addEntry(`📡 Mensaje de ${source} para ${msg.recipient}`, LOG_TYPES.MESSAGE);
        });
        
        popup.appendChild(content);
        
        // Footer con botón
        const footer = document.createElement('div');
        footer.className = 'quantum-message-footer';
        footer.innerHTML = `
            <button class="continue-btn" onclick="closeQuantumMessages()">CONTINUAR AL SIGUIENTE TRAMO</button>
        `;
        popup.appendChild(footer);
        
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    }
}

/* === SISTEMA DE ORDENAMIENTO === */
class SortingSystem {
    constructor() {
        this.currentSortMode = 'default';
    }
    
    applySorting(mode) {
        this.currentSortMode = mode;
        
        let sorted = [...crewMembers];
        
        switch(mode) {
            case 'age-asc':
                sorted.sort((a, b) => a.biologicalAge - b.biologicalAge);
                break;
            case 'age-desc':
                sorted.sort((a, b) => b.biologicalAge - a.biologicalAge);
                break;
            case 'food':
                sorted.sort((a, b) => a.foodNeed - b.foodNeed);
                break;
            case 'health':
                sorted.sort((a, b) => a.healthNeed - b.healthNeed);
                break;
            case 'rest':
                sorted.sort((a, b) => a.restNeed - b.restNeed);
                break;
            case 'hygiene':
                sorted.sort((a, b) => b.wasteNeed - a.wasteNeed);
                break;
            default:
                sorted.sort((a, b) => a.id - b.id);
        }
        
        this.rebuildCrewSidebar(sorted);
    }
    
    rebuildCrewSidebar(sortedCrew) {
        const container = document.getElementById('crew-cards-container');
        container.innerHTML = '';
        
        sortedCrew.forEach(crew => {
            container.appendChild(crew.createMiniCard());
        });
    }
}

/* === SISTEMA DE VICTORIA === */
class VictorySystem {
    constructor() {
        this.finalStats = null;
    }
    
    calculateRank(aliveCrew) {
        if (aliveCrew === 0) return 'GAME-OVER';
        
        if (aliveCrew === 5) {
            const avgAge = crewMembers.reduce((sum, c) => sum + c.biologicalAge, 0) / 5;
            if (avgAge < 60) return 'S-RANK';
        }
        
        if (aliveCrew >= 3) return 'A-RANK';
        return 'B-RANK';
    }
    
    showVictoryScreen(aliveCrew) {
        const rank = this.calculateRank(aliveCrew);
        const rankData = VICTORY_RANKS[rank];
        
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'victory-overlay';
        overlay.id = 'victory-overlay';
        
        // Crear popup
        const popup = document.createElement('div');
        popup.className = 'victory-popup';
        
        // Header con ranking
        const header = document.createElement('div');
        header.className = 'victory-header';
        header.innerHTML = `
            <div class="victory-rank ${rank}">${rank}</div>
            <div class="victory-title">${rankData.title}</div>
            <div style="font-size: 12px; color: #666;">${rankData.requirements}</div>
        `;
        popup.appendChild(header);
        
        // Stats
        const stats = document.createElement('div');
        stats.className = 'victory-stats';
        
        const survivors = crewMembers.filter(c => c.isAlive);
        const avgAge = survivors.length > 0 
            ? (survivors.reduce((sum, c) => sum + c.biologicalAge, 0) / survivors.length).toFixed(1)
            : 'N/A';
        
        stats.innerHTML = `
            <div class="stat-item">
                <span>Tripulantes sobrevivientes:</span>
                <strong>${aliveCrew}/5</strong>
            </div>
            <div class="stat-item">
                <span>Edad promedio final:</span>
                <strong>${avgAge} años</strong>
            </div>
            <div class="stat-item">
                <span>Años totales del viaje:</span>
                <strong>${timeSystem.getCurrentYear().toFixed(1)} años</strong>
            </div>
            <div class="stat-item">
                <span>Distancia recorrida:</span>
                <strong>${Math.round(distanceTraveled)} UA</strong>
            </div>
            <div class="stat-item">
                <span>Recursos restantes:</span>
                <strong>Fuel: ${Math.round(Fuel.quantity)}, Food: ${Math.round(Food.quantity)}</strong>
            </div>
        `;
        
        // Sobrevivientes detalle
        if (survivors.length > 0) {
            const survivorsList = document.createElement('div');
            survivorsList.style.cssText = 'margin-top: 20px; padding-top: 20px; border-top: 2px solid #000;';
            survivorsList.innerHTML = '<h4 style="margin-bottom: 10px;">Sobrevivientes:</h4>';
            
            survivors.forEach(crew => {
                const crewDiv = document.createElement('div');
                crewDiv.className = 'stat-item';
                crewDiv.innerHTML = `
                    <span>${crew.name} (${crew.position})</span>
                    <strong>${crew.initialAge} → ${crew.biologicalAge.toFixed(1)} años</strong>
                `;
                survivorsList.appendChild(crewDiv);
            });
            
            stats.appendChild(survivorsList);
        }
        
        popup.appendChild(stats);
        
        // Narrativa
        const narrative = document.createElement('div');
        narrative.className = 'victory-narrative';
        narrative.textContent = rankData.narrative;
        popup.appendChild(narrative);
        
        // Footer
        const footer = document.createElement('div');
        footer.className = 'victory-footer';
        footer.innerHTML = `
            <button onclick="location.reload()" style="padding: 10px 30px; font-size: 14px;">
                NUEVA MISIÓN
            </button>
        `;
        popup.appendChild(footer);
        
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    }
}

// Instancias globales de los sistemas
let timeSystem = new TimeSystem();
let awakeBenefitSystem = new AwakeBenefitSystem();
let shipIntegritySystem = new ShipIntegritySystem();
let gameLoop = new GameLoop();
let messageSystem = new MessageSystem();
let sortingSystem = new SortingSystem();
let victorySystem = new VictorySystem();

if (typeof window !== 'undefined') {
    window.forceEvent = (eventId) => {
        const event = Array.isArray(EVENTS_POOL)
            ? EVENTS_POOL.find(e => e.id === eventId)
            : null;
        if (eventSystem && event && !eventSystem.activeEvent) {
            eventSystem.displayEvent(event);
        }
    };

    window.showFlags = () => {
        console.log('Global:', eventSystem ? eventSystem.globalFlags : []);
        if (Array.isArray(crewMembers)) {
            crewMembers.forEach(crew => console.log(crew.name, crew.eventFlags));
        }
    };
}

// Variable global del estado del juego (para compatibilidad)
let gameState = GAME_STATES.PAUSED;
let currentYear = 0;
let distanceTraveled = 0;
