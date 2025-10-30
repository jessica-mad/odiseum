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

/* === SISTEMA DE BUCLE DE JUEGO === */
class GameLoop {
    constructor() {
        this.gameState = GAME_STATES.PAUSED;
        this.gameLoopInterval = null;
        this.trancheTimeRemaining = TRANCHE_DURATION_MS;
        this.currentSpeed = 50;
    }
    
    start() {
        if (this.gameState !== GAME_STATES.PAUSED) return;
        
        this.gameState = GAME_STATES.IN_TRANCHE;
        this.trancheTimeRemaining = TRANCHE_DURATION_MS;
        
        // Actualizar UI de botones
        document.getElementById('start-button').style.display = 'none';
        document.getElementById('pause-button').style.display = 'inline-block';
        document.getElementById('resume-button').style.display = 'none';
        
        // Bloquear slider de velocidad
        document.getElementById('speed-control').disabled = true;
        
        // Obtener velocidad actual
        this.currentSpeed = parseInt(document.getElementById('speed-control').value);
        
        logbook.addEntry(`Tramo iniciado. Velocidad: ${this.currentSpeed}%`, LOG_TYPES.EVENT);
        new Notification('Tramo iniciado. Gestionando sistemas...', NOTIFICATION_TYPES.INFO);
        
        // Iniciar bucle de simulación
        this.gameLoopInterval = setInterval(() => this.tick(), SIMULATION_TICK_RATE);
    }
    
    tick() {
        // Reducir tiempo del tramo
        this.trancheTimeRemaining -= SIMULATION_TICK_RATE;
        this.updateTimerUI();
        
        // Actualizar progreso del viaje
        this.updateTripProgress();
        
        // Avanzar tiempo
        timeSystem.advanceTick();
        timeSystem.updateCalendarUI();
        
        // Envejecer tripulantes despiertos
        crewMembers.forEach(crew => {
            crew.age(YEARS_PER_TICK);
        });
        
        // Auto-gestión y sistema social
        const awakeCrew = crewMembers.filter(c => c.isAlive && c.state === 'Despierto');
        
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
        
        // Verificar fin del tramo
        if (this.trancheTimeRemaining <= 0) {
            this.endTranche();
        }
    }
    
    endTranche() {
        clearInterval(this.gameLoopInterval);
        this.gameLoopInterval = null;
        this.gameState = GAME_STATES.PAUSED;
        
        // Reiniciar temporizador
        this.trancheTimeRemaining = TRANCHE_DURATION_MS;
        this.updateTimerUI();
        
        // Actualizar UI de botones
        document.getElementById('start-button').style.display = 'inline-block';
        document.getElementById('pause-button').style.display = 'none';
        document.getElementById('resume-button').style.display = 'none';
        
        // Desbloquear slider de velocidad
        document.getElementById('speed-control').disabled = false;
        
        // Avanzar tramo
        timeSystem.advanceTranche();
        
        // Registrar en bitácora
        const aliveCrew = crewMembers.filter(c => c.isAlive).length;
        logbook.addEntry(`Tramo completado. Tripulantes vivos: ${aliveCrew}/5`, LOG_TYPES.SUCCESS);
        
        new Notification('Tramo completado. Preparando para el siguiente tramo.', NOTIFICATION_TYPES.INFO);
        
        // Mostrar mensajes cuánticos si hay
        messageSystem.showMessagesForTranche(timeSystem.getCurrentTranche());
    }
    
    pause() {
        if (this.gameState !== GAME_STATES.IN_TRANCHE) return;
        
        clearInterval(this.gameLoopInterval);
        this.gameLoopInterval = null;
        this.gameState = GAME_STATES.TRANCHE_PAUSED;
        
        document.getElementById('pause-button').style.display = 'none';
        document.getElementById('resume-button').style.display = 'inline-block';
        
        logbook.addEntry('Tramo pausado', LOG_TYPES.INFO);
    }
    
    resume() {
        if (this.gameState !== GAME_STATES.TRANCHE_PAUSED) return;
        
        this.gameState = GAME_STATES.IN_TRANCHE;
        this.gameLoopInterval = setInterval(() => this.tick(), SIMULATION_TICK_RATE);
        
        document.getElementById('pause-button').style.display = 'inline-block';
        document.getElementById('resume-button').style.display = 'none';
        
        logbook.addEntry('Tramo reanudado', LOG_TYPES.INFO);
    }
    
    updateTimerUI() {
        const minutes = Math.floor(this.trancheTimeRemaining / 60000);
        const seconds = Math.floor((this.trancheTimeRemaining % 60000) / 1000);
        const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.getElementById('tranche-timer').textContent = display;
    }
    
    updateTripProgress() {
        const distancePerTick = (this.currentSpeed / 100) * 10;
        distanceTraveled += distancePerTick;
        
        const fuelConsumption = (this.currentSpeed / 100) * RESOURCES_CONFIG.fuel.consumeRate;
        Fuel.consume(fuelConsumption);
        Fuel.updateResourceUI();
        
        const progress = (distanceTraveled / TOTAL_MISSION_DISTANCE) * 100;
        const progressBar = document.getElementById('trip-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
        
        const distanceTraveledEl = document.getElementById('distance-traveled');
        const totalDistanceEl = document.getElementById('total-distance');
        if (distanceTraveledEl) distanceTraveledEl.textContent = Math.round(distanceTraveled);
        if (totalDistanceEl) totalDistanceEl.textContent = TOTAL_MISSION_DISTANCE;
        
        if (distanceTraveled >= TOTAL_MISSION_DISTANCE) {
            this.endMission();
        }
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
            }
        }
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
let gameLoop = new GameLoop();
let messageSystem = new MessageSystem();
let sortingSystem = new SortingSystem();
let victorySystem = new VictorySystem();

// Variable global del estado del juego (para compatibilidad)
let gameState = GAME_STATES.PAUSED;
let currentYear = 0;
let distanceTraveled = 0;
