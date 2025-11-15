// ============================================
// CONFIGURADOR DE MISIÓN - ODISEUM V2.0
// ============================================

/* === OBJETO PRINCIPAL DEL CONFIGURADOR === */
const missionConfigurator = {
    // Estado actual
    currentStep: 1,
    selectedCrew: {},
    selectedResources: {},
    currentBudget: 0,
    currentWeight: 0,

    /* === INICIALIZACIÓN === */
    init() {
        console.log('[Configurador] Inicializando...');

        // Resetear estado
        this.currentStep = 1;
        this.selectedCrew = {};
        this.selectedResources = this.getDefaultResources();
        this.currentBudget = 0;
        this.currentWeight = 0;

        // Verificar si hay un seed cargado
        if (window.loadedSeed) {
            this.showSeedLoadedMessage(window.loadedSeed);
        }

        // Generar UI de selección de crew (paso 1)
        this.generateCrewSelection();

        // Generar UI de sliders de recursos (paso 2)
        this.generateResourceSliders();

        // Configurar listeners de presets
        this.setupPresetButtons();

        // Configurar botón de copiar seed
        this.setupSeedCopyButton();

        console.log('[Configurador] Inicialización completa');
    },

    /* === MOSTRAR MENSAJE DE SEED CARGADO === */
    showSeedLoadedMessage(seed) {
        console.log('[Configurador] NOTA: Seed detectado:', seed);
        console.log('[Configurador] La carga de configuración desde seed será implementada en una futura versión.');
        console.log('[Configurador] Por ahora, procede a configurar tu misión manualmente.');

        // Mostrar mensaje visual
        const configHeader = document.querySelector('.configurator-header');
        if (configHeader) {
            const message = document.createElement('div');
            message.className = 'seed-loaded-notice';
            message.innerHTML = `
                <span class="notice-icon">ℹ️</span>
                <span class="notice-text">Seed detectado: ${seed}</span>
                <span class="notice-hint">(Configuración manual requerida por ahora)</span>
            `;
            configHeader.appendChild(message);

            // Auto-ocultar después de 10 segundos
            setTimeout(() => {
                message.style.opacity = '0';
                setTimeout(() => message.remove(), 500);
            }, 10000);
        }
    },

    /* === RECURSOS POR DEFECTO === */
    getDefaultResources() {
        const resources = {};
        for (const [key, config] of Object.entries(RESOURCE_LIMITS)) {
            resources[key] = config.recommended;
        }
        return resources;
    },

    /* === GENERACIÓN DE SELECCIÓN DE CREW === */
    generateCrewSelection() {
        const container = document.getElementById('config-crew-container');
        if (!container) return;

        container.innerHTML = '';

        // Crear secciones para cada rol
        for (const [roleKey, roleData] of Object.entries(CREW_OPTIONS)) {
            const section = document.createElement('div');
            section.className = 'crew-role-section';

            // Header del rol
            const header = document.createElement('div');
            header.className = 'crew-role-header';
            header.innerHTML = `
                <span class="crew-role-icon">${roleData.icon}</span>
                <span class="crew-role-title">${roleData.role.toUpperCase()}</span>
            `;
            section.appendChild(header);

            // Grid de opciones
            const optionsGrid = document.createElement('div');
            optionsGrid.className = 'crew-options-grid';

            roleData.options.forEach(option => {
                const card = this.createCrewCard(roleKey, option);
                optionsGrid.appendChild(card);
            });

            section.appendChild(optionsGrid);
            container.appendChild(section);
        }

        // Actualizar budget inicial
        this.updateBudgetDisplay();
    },

    /* === CREAR CARD DE TRIPULANTE === */
    createCrewCard(roleKey, option) {
        const card = document.createElement('div');
        card.className = 'crew-option-card';
        card.dataset.roleKey = roleKey;
        card.dataset.optionId = option.id;
        card.dataset.cost = option.cost;

        card.innerHTML = `
            <div class="crew-card-header">
                <span class="crew-card-name">${option.name}</span>
                <span class="crew-card-cost">${option.cost} pts</span>
            </div>
            <div class="crew-card-info">
                <div class="crew-card-age">Edad: ${option.age} años</div>
            </div>
            <div class="crew-card-benefits">
                <div class="crew-card-label">✓ Beneficios:</div>
                <div class="crew-card-text">${option.benefits}</div>
            </div>
            <div class="crew-card-drawbacks">
                <div class="crew-card-label">✗ Desventajas:</div>
                <div class="crew-card-text">${option.drawbacks}</div>
            </div>
            <div class="crew-card-description">
                "${option.description}"
            </div>
        `;

        // Event listener para selección
        card.addEventListener('click', () => {
            this.selectCrewMember(roleKey, option, card);
        });

        return card;
    },

    /* === SELECCIONAR TRIPULANTE === */
    selectCrewMember(roleKey, option, card) {
        // Verificar si ya está seleccionado
        const previousSelection = this.selectedCrew[roleKey];

        // Si es la misma opción, deseleccionar
        if (previousSelection && previousSelection.id === option.id) {
            delete this.selectedCrew[roleKey];
            card.classList.remove('selected');
            this.currentBudget -= option.cost;
            this.updateBudgetDisplay();
            this.validateStep1();
            return;
        }

        // Calcular nuevo budget
        const previousCost = previousSelection ? previousSelection.cost : 0;
        const newBudget = this.currentBudget - previousCost + option.cost;

        // Validar presupuesto
        if (newBudget > CREW_BUDGET) {
            this.showBudgetAlert('Presupuesto excedido. Debes estar exactamente en 25 puntos.');
            return;
        }

        // Deseleccionar opción anterior del mismo rol
        if (previousSelection) {
            const previousCard = document.querySelector(
                `[data-role-key="${roleKey}"][data-option-id="${previousSelection.id}"]`
            );
            if (previousCard) {
                previousCard.classList.remove('selected');
            }
        }

        // Seleccionar nueva opción
        this.selectedCrew[roleKey] = option;
        card.classList.add('selected');
        this.currentBudget = newBudget;

        // Actualizar UI
        this.updateBudgetDisplay();
        this.validateStep1();

        console.log('[Configurador] Crew seleccionado:', roleKey, option.name, 'Budget:', this.currentBudget);
    },

    /* === ACTUALIZAR DISPLAY DE BUDGET === */
    updateBudgetDisplay() {
        const usedEl = document.getElementById('crew-budget-used');
        const fillEl = document.getElementById('crew-budget-fill');

        if (usedEl) {
            usedEl.textContent = this.currentBudget;
        }

        if (fillEl) {
            const percentage = (this.currentBudget / CREW_BUDGET) * 100;
            fillEl.style.width = `${percentage}%`;

            // Cambiar color según estado
            fillEl.classList.remove('budget-warning', 'budget-danger', 'budget-perfect');

            if (this.currentBudget === CREW_BUDGET) {
                fillEl.classList.add('budget-perfect');
            } else if (this.currentBudget > CREW_BUDGET * 0.8) {
                fillEl.classList.add('budget-warning');
            } else if (this.currentBudget > CREW_BUDGET) {
                fillEl.classList.add('budget-danger');
            }
        }
    },

    /* === MOSTRAR ALERTA DE BUDGET === */
    showBudgetAlert(message) {
        // Crear alerta temporal
        const alert = document.createElement('div');
        alert.className = 'config-alert';
        alert.textContent = message;

        const budgetBar = document.querySelector('.config-budget-bar');
        if (budgetBar) {
            budgetBar.appendChild(alert);

            setTimeout(() => {
                alert.remove();
            }, 3000);
        }
    },

    /* === VALIDAR PASO 1 === */
    validateStep1() {
        const nextBtn = document.querySelector('#config-step-1 .config-btn-next');
        if (!nextBtn) return;

        // Verificar que todos los roles estén seleccionados y budget = 25
        const allRolesSelected = Object.keys(CREW_OPTIONS).every(
            roleKey => this.selectedCrew[roleKey]
        );
        const budgetExact = this.currentBudget === CREW_BUDGET;

        if (allRolesSelected && budgetExact) {
            nextBtn.disabled = false;
            nextBtn.classList.remove('disabled');
        } else {
            nextBtn.disabled = true;
            nextBtn.classList.add('disabled');
        }
    },

    /* === GENERACIÓN DE SLIDERS DE RECURSOS === */
    generateResourceSliders() {
        const container = document.getElementById('config-resources-container');
        if (!container) return;

        container.innerHTML = '';

        for (const [key, config] of Object.entries(RESOURCE_LIMITS)) {
            const sliderSection = this.createResourceSlider(key, config);
            container.appendChild(sliderSection);
        }

        // Actualizar peso inicial
        this.updateWeightDisplay();
    },

    /* === CREAR SLIDER DE RECURSO === */
    createResourceSlider(key, config) {
        const section = document.createElement('div');
        section.className = 'resource-slider-section';
        if (config.critical) {
            section.classList.add('critical-resource');
        }

        const currentValue = this.selectedResources[key] || config.recommended;
        const weight = currentValue * config.weightPerUnit;

        section.innerHTML = `
            <div class="resource-slider-header">
                <div class="resource-slider-title">
                    <span class="resource-icon">${config.icon}</span>
                    <span class="resource-name">${config.name}</span>
                    ${config.critical ? '<span class="critical-badge">CRÍTICO</span>' : ''}
                </div>
                <div class="resource-slider-values">
                    <span class="resource-value" id="resource-value-${key}">${currentValue}</span>
                    <span class="resource-weight" id="resource-weight-${key}">${weight.toFixed(1)} kg</span>
                </div>
            </div>
            <div class="resource-slider-container">
                <input
                    type="range"
                    class="resource-slider"
                    id="slider-${key}"
                    min="${config.min}"
                    max="${config.max}"
                    value="${currentValue}"
                    step="10"
                    data-resource-key="${key}"
                >
                <div class="resource-slider-markers">
                    <span class="marker marker-min">${config.min}</span>
                    <span class="marker marker-rec" style="left: ${((config.recommended - config.min) / (config.max - config.min)) * 100}%">
                        ${config.recommended}
                    </span>
                    <span class="marker marker-max">${config.max}</span>
                </div>
            </div>
            <div class="resource-slider-info">
                <span class="resource-renewable">${config.renewable ? '♻️ Renovable' : '⚠️ No renovable'}</span>
                <span class="resource-description">${config.description}</span>
            </div>
        `;

        // Event listener para el slider
        const slider = section.querySelector('.resource-slider');
        slider.addEventListener('input', (e) => {
            this.updateResourceValue(key, parseInt(e.target.value));
        });

        return section;
    },

    /* === ACTUALIZAR VALOR DE RECURSO === */
    updateResourceValue(key, value) {
        const config = RESOURCE_LIMITS[key];

        // Actualizar valor
        this.selectedResources[key] = value;

        // Calcular peso
        const weight = value * config.weightPerUnit;

        // Actualizar displays
        const valueEl = document.getElementById(`resource-value-${key}`);
        const weightEl = document.getElementById(`resource-weight-${key}`);

        if (valueEl) valueEl.textContent = value;
        if (weightEl) weightEl.textContent = `${weight.toFixed(1)} kg`;

        // Recalcular peso total
        this.updateWeightDisplay();
        this.validateStep2();

        console.log('[Configurador] Recurso actualizado:', key, value);
    },

    /* === ACTUALIZAR DISPLAY DE PESO === */
    updateWeightDisplay() {
        // Calcular peso total
        this.currentWeight = 0;
        for (const [key, value] of Object.entries(this.selectedResources)) {
            const config = RESOURCE_LIMITS[key];
            this.currentWeight += value * config.weightPerUnit;
        }

        // Actualizar UI
        const usedEl = document.getElementById('cargo-weight-used');
        const fillEl = document.getElementById('cargo-weight-fill');

        if (usedEl) {
            usedEl.textContent = Math.round(this.currentWeight);
        }

        if (fillEl) {
            const percentage = (this.currentWeight / MAX_CARGO_WEIGHT) * 100;
            fillEl.style.width = `${percentage}%`;

            // Cambiar color según estado
            fillEl.classList.remove('weight-ok', 'weight-warning', 'weight-danger');

            if (this.currentWeight <= MAX_CARGO_WEIGHT * 0.8) {
                fillEl.classList.add('weight-ok');
            } else if (this.currentWeight <= MAX_CARGO_WEIGHT) {
                fillEl.classList.add('weight-warning');
            } else {
                fillEl.classList.add('weight-danger');
            }
        }
    },

    /* === VALIDAR PASO 2 === */
    validateStep2() {
        const nextBtn = document.querySelector('#config-step-2 .config-btn-next');
        if (!nextBtn) return;

        // Verificar que peso <= 3000
        const weightOk = this.currentWeight <= MAX_CARGO_WEIGHT;

        // Verificar que todos los recursos estén > 0
        const allResourcesSet = Object.values(this.selectedResources).every(val => val > 0);

        if (weightOk && allResourcesSet) {
            nextBtn.disabled = false;
            nextBtn.classList.remove('disabled');
        } else {
            nextBtn.disabled = true;
            nextBtn.classList.add('disabled');
        }
    },

    /* === CONFIGURAR BOTONES DE PRESETS === */
    setupPresetButtons() {
        const presetButtons = document.querySelectorAll('.preset-btn');

        presetButtons.forEach((btn, index) => {
            const presetKeys = Object.keys(RESOURCE_PRESETS);
            const presetKey = presetKeys[index];

            if (presetKey) {
                btn.addEventListener('click', () => {
                    this.applyPreset(presetKey);
                });
            }
        });
    },

    /* === APLICAR PRESET === */
    applyPreset(presetKey) {
        const preset = RESOURCE_PRESETS[presetKey];
        if (!preset) return;

        console.log('[Configurador] Aplicando preset:', presetKey);

        // Aplicar valores del preset
        this.selectedResources = { ...preset.resources };

        // Actualizar todos los sliders
        for (const [key, value] of Object.entries(preset.resources)) {
            const slider = document.getElementById(`slider-${key}`);
            if (slider) {
                slider.value = value;
            }

            const valueEl = document.getElementById(`resource-value-${key}`);
            const weightEl = document.getElementById(`resource-weight-${key}`);
            const config = RESOURCE_LIMITS[key];
            const weight = value * config.weightPerUnit;

            if (valueEl) valueEl.textContent = value;
            if (weightEl) weightEl.textContent = `${weight.toFixed(1)} kg`;
        }

        // Actualizar peso total
        this.updateWeightDisplay();
        this.validateStep2();

        // Feedback visual
        this.showPresetFeedback(preset.name);
    },

    /* === MOSTRAR FEEDBACK DE PRESET === */
    showPresetFeedback(presetName) {
        const feedback = document.createElement('div');
        feedback.className = 'preset-feedback';
        feedback.textContent = `✓ Preset "${presetName}" aplicado`;

        const presetsDiv = document.querySelector('.config-presets');
        if (presetsDiv) {
            presetsDiv.appendChild(feedback);

            setTimeout(() => {
                feedback.remove();
            }, 2000);
        }
    },

    /* === GENERAR RESUMEN === */
    generateSummary() {
        console.log('[Configurador] Generando resumen...');

        // Resumen de tripulación
        const crewSummary = document.getElementById('summary-crew');
        if (crewSummary) {
            let html = '<div class="summary-crew-list">';

            for (const [roleKey, option] of Object.entries(this.selectedCrew)) {
                const roleData = CREW_OPTIONS[roleKey];
                html += `
                    <div class="summary-crew-item">
                        <span class="summary-crew-icon">${roleData.icon}</span>
                        <span class="summary-crew-role">${roleData.role}:</span>
                        <span class="summary-crew-name">${option.name}</span>
                        <span class="summary-crew-cost">(${option.cost} pts, ${option.age} años)</span>
                    </div>
                `;
            }

            html += `</div>
                <div class="summary-total">Total presupuesto: ${this.currentBudget}/${CREW_BUDGET} pts</div>
            `;

            crewSummary.innerHTML = html;
        }

        // Resumen de recursos
        const resourcesSummary = document.getElementById('summary-resources');
        if (resourcesSummary) {
            let html = '<div class="summary-resources-list">';

            for (const [key, value] of Object.entries(this.selectedResources)) {
                const config = RESOURCE_LIMITS[key];
                const weight = value * config.weightPerUnit;

                html += `
                    <div class="summary-resource-item">
                        <span class="summary-resource-icon">${config.icon}</span>
                        <span class="summary-resource-name">${config.name}:</span>
                        <span class="summary-resource-value">${value} unidades</span>
                        <span class="summary-resource-weight">(${weight.toFixed(1)} kg)</span>
                    </div>
                `;
            }

            html += `</div>
                <div class="summary-total">Peso total: ${Math.round(this.currentWeight)}/${MAX_CARGO_WEIGHT} kg</div>
            `;

            resourcesSummary.innerHTML = html;
        }

        // Generar y mostrar seed
        this.generateAndDisplaySeed();
    },

    /* === GENERAR Y MOSTRAR SEED === */
    generateAndDisplaySeed() {
        const seed = this.generateSeed();
        const seedInput = document.getElementById('mission-seed');

        if (seedInput) {
            seedInput.value = seed;
        }
    },

    /* === GENERAR SEED === */
    generateSeed() {
        // Crear objeto de configuración
        const config = {
            crew: this.selectedCrew,
            resources: this.selectedResources,
            timestamp: Date.now()
        };

        // Convertir a JSON string
        const configStr = JSON.stringify(config);

        // Generar hash simple
        let hash = 0;
        for (let i = 0; i < configStr.length; i++) {
            const char = configStr.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }

        // Convertir a alfanumérico de 6 caracteres
        const hashStr = Math.abs(hash).toString(36).toUpperCase().padStart(6, '0').slice(0, 6);

        // Formato: KEPLER-XXXXXX
        return `KEPLER-${hashStr}`;
    },

    /* === CONFIGURAR BOTÓN DE COPIAR SEED === */
    setupSeedCopyButton() {
        const copyBtn = document.querySelector('.seed-copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                this.copySeed();
            });
        }
    },

    /* === COPIAR SEED === */
    copySeed() {
        const seedInput = document.getElementById('mission-seed');
        if (!seedInput) return;

        // Copiar al portapapeles
        seedInput.select();
        document.execCommand('copy');

        // Feedback visual
        const copyBtn = document.querySelector('.seed-copy-btn');
        if (copyBtn) {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓';
            copyBtn.style.backgroundColor = 'var(--color-terminal-green)';
            copyBtn.style.color = 'var(--color-terminal-bg)';

            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = '';
                copyBtn.style.color = '';
            }, 1500);
        }

        console.log('[Configurador] Seed copiado:', seedInput.value);
    },

    /* === CONFIRMAR Y COMENZAR === */
    confirmAndStart() {
        console.log('[Configurador] Confirmando configuración...');

        // Crear objeto de configuración final
        const gameConfiguration = {
            crew: this.selectedCrew,
            resources: this.selectedResources,
            seed: this.generateSeed(),
            timestamp: Date.now()
        };

        // Guardar en variable global
        window.gameConfiguration = gameConfiguration;

        console.log('[Configurador] Configuración guardada:', gameConfiguration);

        // Llamar a la función de inicio del juego
        if (typeof startGameWithConfiguration === 'function') {
            startGameWithConfiguration(gameConfiguration);
        } else {
            console.error('[Configurador] Función startGameWithConfiguration no encontrada');
        }
    }
};

/* === INTEGRACIÓN CON FUNCIONES GLOBALES === */

// Override de nextConfigStep para incluir lógica del configurador
window.nextConfigStep = function(currentStep) {
    console.log('[Configurador] Siguiente paso desde:', currentStep);

    // Validaciones por paso
    if (currentStep === 1) {
        const allRolesSelected = Object.keys(CREW_OPTIONS).every(
            roleKey => missionConfigurator.selectedCrew[roleKey]
        );
        const budgetExact = missionConfigurator.currentBudget === CREW_BUDGET;

        if (!allRolesSelected) {
            missionConfigurator.showBudgetAlert('Debes seleccionar un tripulante para cada rol');
            return;
        }

        if (!budgetExact) {
            missionConfigurator.showBudgetAlert(`Presupuesto debe ser exactamente 25 pts (actual: ${missionConfigurator.currentBudget})`);
            return;
        }
    }

    if (currentStep === 2) {
        if (missionConfigurator.currentWeight > MAX_CARGO_WEIGHT) {
            alert(`Peso excedido: ${Math.round(missionConfigurator.currentWeight)} / ${MAX_CARGO_WEIGHT} kg`);
            return;
        }

        // Generar resumen al pasar al paso 3
        missionConfigurator.generateSummary();
    }

    // Avanzar al siguiente paso
    if (currentStep < 3) {
        showConfigStep(currentStep + 1);
        missionConfigurator.currentStep = currentStep + 1;
    }
};

// NOTA: La función startGameWithConfiguration está definida en scripts/6-main.js
// y se encarga de aplicar la configuración correctamente.

/* === INICIALIZACIÓN AUTOMÁTICA === */
window.addEventListener('load', () => {
    console.log('[Configurador] Script cargado');
});
