// ============================================
// SISTEMAS - ODISEUM V2.0
// ============================================

/* === SISTEMA DE TIEMPO === */
class TimeSystem {
    constructor() {
        this.currentYear = 0;
        this.trancheCount = 0;
        this.tickCount = 0;
        this.globalTickCounter = 0; // Contador global de ticks (nunca se reinicia)
        this.fastTickCounter = 0; // Contador de fast ticks (nunca se reinicia)
    }

    advanceTick() {
        this.tickCount++;
        this.globalTickCounter++;
        this.currentYear += YEARS_PER_TICK;
    }

    advanceFastTick() {
        this.fastTickCounter++;
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

    // Calcula la fecha real basada en el tiempo de viaje
    getCurrentDate() {
        const yearsElapsed = this.currentYear;
        const daysElapsed = yearsElapsed * 365.25; // Incluir años bisiestos
        const currentDate = new Date(MISSION_START_DATE);
        currentDate.setDate(currentDate.getDate() + Math.floor(daysElapsed));
        return currentDate;
    }

    // Formatea la fecha en formato legible
    getFormattedDate() {
        const date = this.getCurrentDate();
        const day = date.getDate();
        const month = date.getMonth() + 1; // 0-indexed
        const year = date.getFullYear();
        return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    }

    updateCalendarUI() {
        const yearsDisplay = `Año ${this.currentYear.toFixed(1)}`;
        const dateDisplay = this.getFormattedDate();
        const combinedDisplay = `${yearsDisplay} (${dateDisplay})`;

        // Actualizar calendario desktop
        const desktopCalendar = document.getElementById('calendar');
        if (desktopCalendar) {
            desktopCalendar.textContent = combinedDisplay;
        }

        // Actualizar calendario móvil (footer)
        const mobileCalendar = document.getElementById('mobile-calendar');
        if (mobileCalendar) {
            mobileCalendar.textContent = combinedDisplay;
        }

        // Actualizar año en top bar 2 móvil
        const mobileYearDisplay = document.getElementById('mobile-year-display');
        if (mobileYearDisplay) {
            mobileYearDisplay.textContent = `${yearsDisplay} (${dateDisplay})`;
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
        // Almacenar referencias a tripulantes para acceder a configStats
        this.captain = null;
        this.doctor = null;
        this.engineer = null;
        this.navigator = null;
        this.chef = null;
    }

    refreshState(crewMembers) {
        if (!Array.isArray(crewMembers)) return;

        const awakeCrew = crewMembers.filter(crew => crew.isAlive && crew.state === 'Despierto');

        this.awakeCrewCount = awakeCrew.length;

        // Guardar referencias a los tripulantes (despiertos o no)
        this.captain = crewMembers.find(crew => crew.role === 'commander') || null;
        this.doctor = crewMembers.find(crew => crew.role === 'doctor') || null;
        this.engineer = crewMembers.find(crew => crew.role === 'engineer') || null;
        this.navigator = crewMembers.find(crew => crew.role === 'scientist') || null;
        this.chef = crewMembers.find(crew => crew.role === 'cook') || null;

        // Verificar quiénes están despiertos
        this.isCaptainAwake = this.captain && this.captain.isAlive && this.captain.state === 'Despierto';
        this.isDoctorAwake = this.doctor && this.doctor.isAlive && this.doctor.state === 'Despierto';
        this.isEngineerAwake = this.engineer && this.engineer.isAlive && this.engineer.state === 'Despierto';
        this.isNavigatorAwake = this.navigator && this.navigator.isAlive && this.navigator.state === 'Despierto';
        this.isChefAwake = this.chef && this.chef.isAlive && this.chef.state === 'Despierto';

        if (!this.isDoctorAwake) {
            this.nextMedicalIndex = 0;
            this.currentPatientName = null;
            if (this.doctor) {
                this.doctor.currentActivity = this.doctor.state === 'Despierto' ? 'en guardia' : this.doctor.currentActivity;
                this.doctor.updateMiniCard();
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
            if (this.doctor) {
                this.doctor.currentActivity = 'en guardia';
                this.doctor.updateMiniCard();
            }
            return;
        }

        // Encontrar al paciente más enfermo (menor healthNeed)
        const sickestPatient = patients.reduce((sickest, current) => {
            return current.healthNeed < sickest.healthNeed ? current : sickest;
        });

        // Obtener velocidad de curación del doctor (desde configStats si existe)
        let healRate = this.isCaptainAwake ? 1.2 : 1.0;
        if (this.doctor && this.doctor.configStats && this.doctor.configStats.healingRate) {
            healRate = this.doctor.configStats.healingRate;
        }

        const patient = sickestPatient;
        patient.healthNeed = Math.min(100, patient.healthNeed + healRate);
        patient.updateConsoleCrewState();
        patient.updateMiniCard();

        this.currentPatientName = patient.name;
        if (this.doctor) {
            this.doctor.currentActivity = `Atendiendo a ${patient.name}`;
            this.doctor.updateMiniCard();
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
            // Usar efficiencyBonus del capitán si existe en configStats
            let efficiencyBonus = 0.10; // Default 10%
            if (this.captain && this.captain.configStats && this.captain.configStats.efficiencyBonus) {
                efficiencyBonus = this.captain.configStats.efficiencyBonus;
            }
            multiplier *= (1 + efficiencyBonus);
        }

        return multiplier;
    }

    getNavigatorSpeedMultiplier() {
        if (!this.isNavigatorAwake) return 1;
        return this.isCaptainAwake ? 1.05 : 1.02;
    }

    getEngineerDamageReduction() {
        if (!this.isEngineerAwake) return 0;

        // Usar degradationReduction del ingeniero si existe en configStats
        let reduction = this.isCaptainAwake ? 0.25 : 0.20; // Default
        if (this.engineer && this.engineer.configStats && this.engineer.configStats.degradationReduction) {
            reduction = this.engineer.configStats.degradationReduction;
        }

        return reduction;
    }

    modifyFoodConsumption(amount) {
        if (!this.isChefAwake || this.awakeCrewCount <= 1) {
            return amount;
        }

        // Usar foodConsumption del chef si existe en configStats
        // foodConsumption es un multiplicador: 0.90 = -10%, 1.0 = normal, 1.1 = +10%
        let multiplier = this.isCaptainAwake ? 0.93 : 0.95; // Default
        if (this.chef && this.chef.configStats && typeof this.chef.configStats.foodConsumption !== 'undefined') {
            multiplier = this.chef.configStats.foodConsumption;
        }

        return Math.max(0, amount * multiplier);
    }

    describeBenefitForCrew(crew) {
        if (!crew || crew.state !== 'Despierto') return '';

        switch (crew.role) {
            case 'commander': {
                let efficiencyBonus = 10; // Default 10%
                if (this.captain && this.captain.configStats && this.captain.configStats.efficiencyBonus) {
                    efficiencyBonus = Math.round(this.captain.configStats.efficiencyBonus * 100);
                }
                return `Liderazgo activo: +${efficiencyBonus}% eficiencia para la tripulación despierta.`;
            }
            case 'doctor': {
                let healRate = this.isCaptainAwake ? 1.2 : 1.0;
                if (this.doctor && this.doctor.configStats && this.doctor.configStats.healingRate) {
                    healRate = this.doctor.configStats.healingRate;
                }
                const target = this.currentPatientName || 'en espera de pacientes';
                return `Atención médica x${healRate.toFixed(1)} • ${target}`;
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
                let multiplier = this.isCaptainAwake ? 0.93 : 0.95;
                if (this.chef && this.chef.configStats && typeof this.chef.configStats.foodConsumption !== 'undefined') {
                    multiplier = this.chef.configStats.foodConsumption;
                }
                const percentChange = Math.round((1 - multiplier) * 100);
                if (percentChange > 0) {
                    return `Raciones eficientes: ahorro del ${percentChange}% en comida despierta.`;
                } else if (percentChange < 0) {
                    return `Raciones creativas: gasto adicional del ${Math.abs(percentChange)}% en comida.`;
                } else {
                    return `Producción normal de alimentos.`;
                }
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
        this.fastTickInterval = null;
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

        // Actualizar UI de botones desktop
        document.getElementById('start-button').style.display = 'none';
        document.getElementById('pause-button').style.display = 'inline-block';
        document.getElementById('resume-button').style.display = 'none';

        // Actualizar botones móviles
        if (typeof updateMobileButtons === 'function') {
            updateMobileButtons('playing');
        }

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

        // Iniciar bucle de simulación normal (cada 1 segundo - velocidad x2)
        this.gameLoopInterval = setInterval(() => this.tick(), SIMULATION_TICK_RATE);

        // Iniciar bucle de simulación veloz (cada 0.5 segundos - el doble de rápido)
        this.fastTickInterval = setInterval(() => this.fastTick(), FAST_TICK_RATE);

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

        // Degradar zonas del mapa de la nave
        if (typeof shipMapSystem !== 'undefined' && shipMapSystem) {
            shipMapSystem.degradeZones();
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

    fastTick() {
        // Este tick se ejecuta cada 0.5 segundos (el doble de rápido que el tick normal)
        // Contiene operaciones que necesitan actualizarse más frecuentemente

        // Avanzar contador de fast ticks
        timeSystem.advanceFastTick();

        // Actualizar posiciones de tripulantes en el mapa
        if (typeof shipMapSystem !== 'undefined' && shipMapSystem) {
            shipMapSystem.updateCrewLocations();
        }

        // Procesar reparaciones de zonas
        if (typeof shipMapSystem !== 'undefined' && shipMapSystem) {
            shipMapSystem.processRepairTick();
        }

        // Procesar cooldown del invernadero
        if (typeof shipMapSystem !== 'undefined' && shipMapSystem) {
            shipMapSystem.processGreenhouseCooldown();
        }

        // Procesar cola del baño (FIFO) - Cada 500ms para descargar más rápido
        if (typeof shipMapSystem !== 'undefined' && shipMapSystem) {
            shipMapSystem.processBathroomQueue();
        }

        // Actualizar popup de tripulante si está abierto (UI más responsive)
        this.updateCrewPopupIfOpen();

        // Actualizar panel de tripulación si está abierto
        if (typeof panelManager !== 'undefined' && panelManager && panelManager.isPanelOpen('crew')) {
            panelManager.updateCrewPanel();
        }
    }

    endTranche() {
        // Detener todos los intervalos
        clearInterval(this.gameLoopInterval);
        this.gameLoopInterval = null;
        clearInterval(this.fastTickInterval);
        this.fastTickInterval = null;
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

        // Actualizar UI de botones desktop
        document.getElementById('start-button').style.display = 'inline-block';
        document.getElementById('pause-button').style.display = 'none';
        document.getElementById('resume-button').style.display = 'none';

        // Actualizar botones móviles
        if (typeof updateMobileButtons === 'function') {
            updateMobileButtons('stopped');
        }

        // Actualizar contador de tramos móvil
        if (typeof updateMobileTrancheCount === 'function') {
            updateMobileTrancheCount();
        }

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

        // Cerrar paneles laterales y abrir panel de control
        setTimeout(() => {
            if (typeof panelManager !== 'undefined' && panelManager) {
                // Cerrar todos los paneles primero
                panelManager.closeAllPanels();

                // Esperar un poco y abrir el panel de control
                setTimeout(() => {
                    panelManager.openPanel('control');
                    console.log('🎮 Panel de control abierto automáticamente');
                }, 100);
            }
        }, 500);

        // Mostrar mensajes cuánticos si hay
        messageSystem.showMessagesForTranche(timeSystem.getCurrentTranche());
    }
    
    pause() {
        if (this.gameState !== GAME_STATES.IN_TRANCHE) return;

        // Detener todos los intervalos
        clearInterval(this.gameLoopInterval);
        this.gameLoopInterval = null;
        clearInterval(this.fastTickInterval);
        this.fastTickInterval = null;
        clearInterval(this.timerInterval);
        this.timerInterval = null;

        // Detener sonido de tramo
        if (typeof stopTrancheSound === 'function') {
            stopTrancheSound();
        }

        this.gameState = GAME_STATES.TRANCHE_PAUSED;

        // Actualizar botones desktop
        document.getElementById('pause-button').style.display = 'none';
        document.getElementById('resume-button').style.display = 'inline-block';

        // Actualizar botones móviles
        if (typeof updateMobileButtons === 'function') {
            updateMobileButtons('paused');
        }

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

        // Reiniciar todos los intervalos
        this.gameLoopInterval = setInterval(() => this.tick(), SIMULATION_TICK_RATE);
        this.fastTickInterval = setInterval(() => this.fastTick(), FAST_TICK_RATE);
        this.timerInterval = setInterval(() => this.updateTimerTick(), 1000);

        // Actualizar botones desktop
        document.getElementById('pause-button').style.display = 'inline-block';
        document.getElementById('resume-button').style.display = 'none';

        // Actualizar botones móviles
        if (typeof updateMobileButtons === 'function') {
            updateMobileButtons('playing');
        }

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

        // Actualizar timer desktop
        const desktopTimer = document.getElementById('tranche-timer');
        if (desktopTimer) {
            desktopTimer.textContent = display;
        }

        // Actualizar timer móvil
        const mobileTimer = document.getElementById('mobile-tranche-timer');
        if (mobileTimer) {
            mobileTimer.textContent = display;
        }
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
        // Detener todos los intervalos
        clearInterval(this.gameLoopInterval);
        this.gameLoopInterval = null;
        clearInterval(this.fastTickInterval);
        this.fastTickInterval = null;
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

        // Actualizar recursos en versión móvil
        if (typeof updateMobileResources === 'function') {
            updateMobileResources();
        }
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

        // Reproducir sonido de alarma 1 segundo antes del popup (velocidad x2)
        if (typeof playEventAlarmSound === 'function') {
            playEventAlarmSound();
        }

        // Esperar 1 segundo antes de mostrar el popup (velocidad x2)
        setTimeout(() => {
            this.showEventPopup(event);
        }, 1000);
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

        // Usar directamente el result como clave (gamble, safe, good, bad, repress, etc.)
        const outcomeKey = option.result || 'bad';
        const outcome = event.outcomes?.[outcomeKey];

        const actualOutcome = this.applyOutcome(event, outcome, outcomeKey);
        this.showOutcome(event, actualOutcome, outcomeKey);
    }

    applyOutcome(event, outcome, outcomeKey) {
        if (!outcome) return outcome;

        // Manejar outcomes probabilísticos (successRate)
        let actualOutcome = outcome;
        if (typeof outcome.successRate === 'number' && outcome.success && outcome.failure) {
            const roll = Math.random();
            if (roll <= outcome.successRate) {
                actualOutcome = outcome.success;
                console.log(`Evento ${event.id}: Éxito probabilístico (${(outcome.successRate * 100).toFixed(0)}%)`);
            } else {
                actualOutcome = outcome.failure;
                console.log(`Evento ${event.id}: Fallo probabilístico (${((1 - outcome.successRate) * 100).toFixed(0)}%)`);
            }
        }

        if (actualOutcome.flag && !this.globalFlags.includes(actualOutcome.flag)) {
            this.globalFlags.push(actualOutcome.flag);
        }

        if (!this.globalFlags.includes(event.id)) {
            this.globalFlags.push(event.id);
        }

        this.triggeredEvents.add(event.id);

        if (Array.isArray(this.availableEvents)) {
            this.availableEvents = this.availableEvents.filter(e => e.id !== event.id);
        }

        const affectedCrew = actualOutcome.affectedCrew || {};

        // Manejar ALL_CREW primero
        if (affectedCrew.ALL_CREW) {
            const allCrewChanges = affectedCrew.ALL_CREW;
            crewMembers.forEach(crew => {
                if (!crew || !crew.isAlive) return;
                this.applyCrewChanges(crew, allCrewChanges, event, actualOutcome, outcomeKey);
            });
        }

        // Luego manejar tripulantes individuales
        Object.entries(affectedCrew).forEach(([name, changes]) => {
            if (name === 'ALL_CREW') return; // Ya procesado
            const crew = this.getCrewByName(name);
            if (!crew) return;
            this.applyCrewChanges(crew, changes, event, actualOutcome, outcomeKey);
        });

        // Manejar cambios en recursos (resourceDeltas)
        if (actualOutcome.resourceDeltas && typeof actualOutcome.resourceDeltas === 'object') {
            Object.entries(actualOutcome.resourceDeltas).forEach(([key, delta]) => {
                const resource = this.getResourceByKey(key);
                if (resource && typeof delta === 'number') {
                    if (delta >= 0) {
                        // Ganancia de recursos
                        resource.quantity = Math.min(resource.limiteStock, resource.quantity + delta);
                    } else {
                        // Pérdida de recursos
                        resource.consume(Math.abs(delta));
                    }
                    resource.updateResourceUI();
                }
            });
        }

        if (actualOutcome.chainEvent) {
            this.pendingChainEvents.add(actualOutcome.chainEvent);
        }

        const entryText = `${event.icon || '⚠️'} ${event.title || 'Evento crítico'} — ${actualOutcome.narrative || ''}`.trim();
        logbook.addEntry(entryText, LOG_TYPES.EVENT_CRITICAL);

        if (typeof gameLoop.updateCrewPopupIfOpen === 'function') {
            gameLoop.updateCrewPopupIfOpen();
        }

        return actualOutcome;
    }

    applyCrewChanges(crew, changes, event, outcome, outcomeKey) {
        if (!crew || !changes) return;

        currentYear = timeSystem.getCurrentYear();

        // Aplicar cambios en stats de necesidades básicas
        if (typeof changes.healthDelta === 'number') {
            crew.healthNeed = Math.max(0, Math.min(100, crew.healthNeed + changes.healthDelta));
        }
        if (typeof changes.foodDelta === 'number') {
            crew.foodNeed = Math.max(0, Math.min(100, crew.foodNeed + changes.foodDelta));
        }
        if (typeof changes.restDelta === 'number') {
            crew.restNeed = Math.max(0, Math.min(100, crew.restNeed + changes.restDelta));
        }
        if (typeof changes.wasteDelta === 'number') {
            crew.wasteNeed = Math.max(0, Math.min(100, crew.wasteNeed + changes.wasteDelta));
        }
        if (typeof changes.entertainmentDelta === 'number') {
            crew.entertainmentNeed = Math.max(0, Math.min(100, crew.entertainmentNeed + changes.entertainmentDelta));
        }

        if (changes.hasOwnProperty('trauma')) {
            crew.trauma = changes.trauma;
        }

        if (changes.emotionalState) {
            crew.emotionalState = changes.emotionalState;
        }

        if (typeof changes.skillModifier === 'number') {
            crew.skillModifier = changes.skillModifier;
        }

        // Guardar pensamiento personalizado del evento
        if (changes.personalThought) {
            crew.personalThought = changes.personalThought;
            crew.personalThoughtExpiry = timeSystem.globalTickCounter + 60; // Dura 60 ticks (1 minuto de juego)
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
    }

    determineOutcomeClass(outcome, outcomeKey) {
        // Outcomes explícitamente buenos
        if (outcomeKey === 'good' || outcomeKey === 'success') return 'good';
        // Outcomes explícitamente malos
        if (outcomeKey === 'bad' || outcomeKey === 'failure') return 'bad';

        // Analizar el contenido del outcome para determinar si es positivo o negativo
        if (!outcome) return 'bad';

        let hasTrauma = false;
        let hasNegativeModifier = false;
        let hasPositiveResources = false;
        let hasNegativeResources = false;

        // Revisar si hay trauma en affectedCrew
        if (outcome.affectedCrew) {
            Object.values(outcome.affectedCrew).forEach(changes => {
                if (changes.trauma) hasTrauma = true;
                if (typeof changes.skillModifier === 'number' && changes.skillModifier < 1) {
                    hasNegativeModifier = true;
                }
            });
        }

        // Revisar resourceDeltas
        if (outcome.resourceDeltas) {
            Object.values(outcome.resourceDeltas).forEach(delta => {
                if (delta > 0) hasPositiveResources = true;
                if (delta < 0) hasNegativeResources = true;
            });
        }

        // Si hay trauma, definitivamente es malo
        if (hasTrauma) return 'bad';

        // Si hay recursos positivos y no hay modificadores negativos, es bueno
        if (hasPositiveResources && !hasNegativeModifier && !hasNegativeResources) return 'good';

        // Si es 'safe' o 'repress' sin trauma, considerarlo neutro (mostrar como malo pero menos severo)
        if (outcomeKey === 'safe' || outcomeKey === 'repress') {
            return hasNegativeResources || hasNegativeModifier ? 'bad' : 'neutral';
        }

        // Por defecto, malo
        return 'bad';
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
        // Determinar si el resultado es bueno o malo analizando el outcome
        const resultClass = this.determineOutcomeClass(outcome, outcomeKey);
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

        // PRIORIDAD 1: Buscar por nombre exacto
        // Esto permite eventos personalizados para tripulantes específicos del configurador
        // Ejemplo: Si hay un evento para "Morgan" (comandante específico), lo encontrará directamente
        let crew = crewMembers.find(c => c.name === name);
        if (crew) return crew;

        // PRIORIDAD 2: Mapear nombres antiguos (eventos genéricos) a roles
        // Esto hace que eventos legacy como "Capitán Silva" funcionen con cualquier capitán
        // Ejemplo: "Capitán Silva" → busca role='captain' → encuentra a Morgan/cualquier capitán
        const nameToRole = {
            'Capitán Silva': 'captain',
            'Dra. Chen': 'doctor',
            'Ing. Rodriguez': 'engineer',
            'Lt. Johnson': 'navigator',
            'Chef Patel': 'cook'
        };

        const role = nameToRole[name];
        if (role) {
            crew = crewMembers.find(c => c.role === role);
            if (crew) return crew;
        }

        // No se encontró ni por nombre exacto ni por rol
        return null;
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
        // Actualizar usando el panel manager si está disponible
        if (typeof panelManager !== 'undefined' && panelManager) {
            panelManager.updateCrewPanel();
        }
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

/* === SISTEMA DE HABILIDADES ESPECIALES === */
class SpecialAbilitiesSystem {
    constructor() {
        this.cooldowns = {};
    }

    // Verificar si un tripulante tiene una habilidad específica
    hasAbility(crewMember, abilityName) {
        if (!crewMember || !crewMember.isAlive || crewMember.state !== 'Despierto') {
            return false;
        }
        return crewMember.configStats && crewMember.configStats[abilityName] === true;
    }

    // Obtener tripulante con habilidad específica
    getCrewWithAbility(abilityName) {
        if (typeof crewMembers === 'undefined' || !crewMembers) return null;
        return crewMembers.find(crew => this.hasAbility(crew, abilityName));
    }

    // Doctor Botánico: Síntesis de medicina (10 Data + 20 Water → 15 Medicine)
    medicineSynthesis() {
        const doctor = this.getCrewWithAbility('canSynthMedicine');
        if (!doctor) {
            new Notification('No hay doctor con habilidad de síntesis disponible', NOTIFICATION_TYPES.ALERT);
            return false;
        }

        const dataCost = 10;
        const waterCost = 20;
        const medicineGain = 15;

        if (Data.quantity < dataCost) {
            new Notification('Datos insuficientes para síntesis (necesita 10)', NOTIFICATION_TYPES.ALERT);
            return false;
        }

        if (Water.quantity < waterCost) {
            new Notification('Agua insuficiente para síntesis (necesita 20)', NOTIFICATION_TYPES.ALERT);
            return false;
        }

        // Consumir recursos
        Data.consume(dataCost);
        Water.consume(waterCost);

        // Producir medicina
        Medicine.quantity = Math.min(Medicine.limiteStock, Medicine.quantity + medicineGain);

        // Actualizar UI
        Data.updateResourceUI();
        Water.updateResourceUI();
        Medicine.updateResourceUI();

        // Notificaciones
        new Notification(`${doctor.name} sintetizó ${medicineGain} unidades de medicina`, NOTIFICATION_TYPES.SUCCESS);
        logbook.addEntry(`${doctor.name} utilizó conocimientos botánicos para sintetizar ${medicineGain} medicina (costo: ${dataCost} datos, ${waterCost} agua)`, LOG_TYPES.SUCCESS);

        return true;
    }

    // Ingeniero Prodigio: Mejora de sala (50 Energy + 20 Data → +10% capacidad de un recurso)
    roomUpgrade(resourceName) {
        const engineer = this.getCrewWithAbility('canUpgradeRooms');
        if (!engineer) {
            new Notification('No hay ingeniero con habilidad de mejora disponible', NOTIFICATION_TYPES.ALERT);
            return false;
        }

        const energyCost = 50;
        const dataCost = 20;
        const capacityIncrease = 0.10; // 10%

        if (Energy.quantity < energyCost) {
            new Notification('Energía insuficiente para mejora (necesita 50)', NOTIFICATION_TYPES.ALERT);
            return false;
        }

        if (Data.quantity < dataCost) {
            new Notification('Datos insuficientes para mejora (necesita 20)', NOTIFICATION_TYPES.ALERT);
            return false;
        }

        // Mapeo de nombres de recursos
        const resourceMap = {
            'Energy': Energy,
            'Food': Food,
            'Water': Water,
            'Oxygen': Oxygen,
            'Medicine': Medicine,
            'Data': Data,
            'Fuel': Fuel
        };

        const targetResource = resourceMap[resourceName];
        if (!targetResource) {
            new Notification('Recurso no válido', NOTIFICATION_TYPES.ALERT);
            return false;
        }

        // Consumir recursos
        Energy.consume(energyCost);
        Data.consume(dataCost);

        // Aumentar capacidad del recurso
        const increase = Math.round(targetResource.limiteStock * capacityIncrease);
        targetResource.limiteStock += increase;

        // Actualizar UI
        Energy.updateResourceUI();
        Data.updateResourceUI();
        targetResource.updateResourceUI();

        // Notificaciones
        new Notification(`${engineer.name} mejoró la capacidad de ${targetResource.resourceName} (+${increase})`, NOTIFICATION_TYPES.SUCCESS);
        logbook.addEntry(`${engineer.name} mejoró el almacenamiento de ${targetResource.resourceName}, aumentando capacidad en ${increase} unidades`, LOG_TYPES.SUCCESS);

        return true;
    }

    // Chef Creativo: Conversión de agua a comida (30 Water → 10 Food)
    waterToFood() {
        const chef = this.getCrewWithAbility('canConvertWater');
        if (!chef) {
            new Notification('No hay chef con habilidad de conversión disponible', NOTIFICATION_TYPES.ALERT);
            return false;
        }

        const waterCost = 30;
        const foodGain = 10;

        if (Water.quantity < waterCost) {
            new Notification('Agua insuficiente para conversión (necesita 30)', NOTIFICATION_TYPES.ALERT);
            return false;
        }

        // Consumir agua
        Water.consume(waterCost);

        // Producir comida
        Food.quantity = Math.min(Food.limiteStock, Food.quantity + foodGain);

        // Actualizar UI
        Water.updateResourceUI();
        Food.updateResourceUI();

        // Notificaciones
        new Notification(`${chef.name} convirtió ${waterCost} agua en ${foodGain} comida`, NOTIFICATION_TYPES.SUCCESS);
        logbook.addEntry(`${chef.name} usó recetas creativas para producir ${foodGain} comida usando ${waterCost} agua`, LOG_TYPES.SUCCESS);

        return true;
    }

    // Obtener lista de habilidades disponibles
    getAvailableAbilities() {
        const abilities = [];

        if (this.getCrewWithAbility('canSynthMedicine')) {
            abilities.push({
                id: 'medicineSynthesis',
                name: 'Síntesis de Medicina',
                description: '10 Datos + 20 Agua → 15 Medicina',
                icon: '💊',
                crew: this.getCrewWithAbility('canSynthMedicine').name
            });
        }

        if (this.getCrewWithAbility('canUpgradeRooms')) {
            abilities.push({
                id: 'roomUpgrade',
                name: 'Mejora de Almacenamiento',
                description: '50 Energía + 20 Datos → +10% capacidad',
                icon: '🔧',
                crew: this.getCrewWithAbility('canUpgradeRooms').name
            });
        }

        if (this.getCrewWithAbility('canConvertWater')) {
            abilities.push({
                id: 'waterToFood',
                name: 'Receta de Emergencia',
                description: '30 Agua → 10 Comida',
                icon: '🍲',
                crew: this.getCrewWithAbility('canConvertWater').name
            });
        }

        return abilities;
    }
}

// Instancias globales de los sistemas
let timeSystem = new TimeSystem();
let awakeBenefitSystem = new AwakeBenefitSystem();
let shipIntegritySystem = new ShipIntegritySystem();
let specialAbilities = new SpecialAbilitiesSystem();
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
