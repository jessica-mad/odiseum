// ============================================
// GESTIÓN DE UI - ODISEUM V2.0
// ============================================

/* === GESTIÓN DE VENTANAS ARRASTRABLES === */
function setupDraggableWindows() {
    const windows = document.querySelectorAll('.window');
    windows.forEach(window => {
        const titleBar = window.querySelector('.title-bar');
        if (titleBar) {
            makeDraggable(window, titleBar);
        }
    });
}

function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    handle.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
        element.style.transform = 'none';
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

/* === GESTIÓN DE POPUPS === */
function openResourcesPopup() {
    document.getElementById('resources-management-popup').style.display = 'block';
    gameLoop.updateAllResources();
}

function closeResourcesPopup() {
    document.getElementById('resources-management-popup').style.display = 'none';
}

function openCrewsPopup() {
    document.getElementById('crews-management-popup').style.display = 'block';
}

function closeCrewsPopup() {
    document.getElementById('crews-management-popup').style.display = 'none';
}

function openTripPopup() {
    document.getElementById('trip-management-popup').style.display = 'block';
    gameLoop.updateTripProgress();
}

function closeTripPopup() {
    document.getElementById('trip-management-popup').style.display = 'none';
}

function openLogbookPopup() {
    document.getElementById('logbook-popup').style.display = 'block';
    logbook.updateUI();
}

function closeLogbookPopup() {
    document.getElementById('logbook-popup').style.display = 'none';
}

function openCrewManagementPopup(name) {
    const crewMember = crewMembers.find(c => c.name === name);
    if (!crewMember) return;
    
    document.getElementById('crew-name').textContent = crewMember.name;
    document.getElementById('crew-age').textContent = crewMember.initialAge;
    document.getElementById('crew-bio-age').textContent = crewMember.biologicalAge.toFixed(1);
    document.getElementById('crew-position').textContent = crewMember.position;
    document.getElementById('crew-state').textContent = crewMember.state;
    document.getElementById('crew-activity').textContent = crewMember.currentActivity;
    document.getElementById('crew-mood').textContent = crewMember.mood;
    document.getElementById('crew-img').src = crewMember.img;
    document.getElementById('crew-img').alt = crewMember.name;
    
    document.getElementById('food-need-amount').textContent = Math.round(crewMember.foodNeed);
    document.getElementById('health-need-amount').textContent = Math.round(crewMember.healthNeed);
    document.getElementById('waste-need-amount').textContent = Math.round(crewMember.wasteNeed);
    document.getElementById('entertainment-need-amount').textContent = Math.round(crewMember.entertainmentNeed);
    document.getElementById('rest-need-amount').textContent = Math.round(crewMember.restNeed);
    
    // Mostrar información personal
    const personalInfoContainer = document.getElementById('crew-personal-info');
    if (personalInfoContainer && crewMember.leftBehind) {
        personalInfoContainer.innerHTML = `
            <h4>💔 Información Personal</h4>
            <div class="personal-info-item">
                <strong>Dejó atrás:</strong>
                <p>${crewMember.leftBehind.family}</p>
            </div>
            <div class="personal-info-item">
                <strong>Últimas palabras:</strong>
                <p>${crewMember.leftBehind.lastWords}</p>
            </div>
            <div class="personal-info-item">
                <strong>Sueño en Nueva Tierra:</strong>
                <p>${crewMember.leftBehind.dream}</p>
            </div>
            <div class="personal-info-item">
                <strong>Actitud ante la muerte:</strong>
                <p>${crewMember.fearOfDeath}</p>
            </div>
        `;
    }
    
    // Mostrar log personal
    const logContainer = document.getElementById('crew-personal-log-content');
    logContainer.innerHTML = '';
    
    if (crewMember.personalLog.length === 0) {
        logContainer.innerHTML = '<p style="color: #999;">No hay entradas en el registro personal.</p>';
    } else {
        const recentLogs = crewMember.personalLog.slice(-10).reverse();
        recentLogs.forEach(log => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'personal-log-entry';
            if (log.entry.includes('[IA]')) {
                entryDiv.classList.add('ai-generated');
            }
            
            entryDiv.innerHTML = `
                <div class="log-day">Año ${log.year.toFixed(1)}</div>
                <div class="log-text">${log.entry}</div>
                <div class="log-metadata">Actividad: ${log.activity} | Ánimo: ${log.mood}</div>
            `;
            
            logContainer.appendChild(entryDiv);
        });
    }
    
    document.getElementById('crew-management-popup').style.display = 'block';
}

function closeCrewManagementPopup() {
    document.getElementById('crew-management-popup').style.display = 'none';
}

/* === SISTEMA DE TABS === */
function switchCrewTab(tabName) {
    // Ocultar todos los contenidos de tabs
    const allTabs = document.querySelectorAll('.crew-tab-content');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Desactivar todos los botones de tabs
    const allButtons = document.querySelectorAll('.crew-tab-btn');
    allButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Activar el tab seleccionado
    const selectedTab = document.getElementById(`crew-tab-${tabName}`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Activar el botón correspondiente
    const buttons = document.querySelectorAll('.crew-tab-btn');
    buttons.forEach(btn => {
        if (btn.textContent.includes('Necesidades Vitales') && tabName === 'needs') {
            btn.classList.add('active');
        } else if (btn.textContent.includes('Información Personal') && tabName === 'personal') {
            btn.classList.add('active');
        } else if (btn.textContent.includes('Reporte') && tabName === 'report') {
            btn.classList.add('active');
        } else if (btn.textContent.includes('Historia IA') && tabName === 'story') {
            btn.classList.add('active');
        }
    });
}

/* === GENERACIÓN DE HISTORIA CON IA === */
function generateCrewStory() {
    const crewName = document.getElementById('crew-name').textContent;
    const crewMember = crewMembers.find(c => c.name === crewName);
    if (!crewMember) return;

    const storyContainer = document.getElementById('crew-ai-story-content');

    // Mostrar mensaje de carga
    storyContainer.innerHTML = '<p style="color: #666; font-style: italic;">Generando historia...</p>';

    // Simular generación con delay
    setTimeout(() => {
        const story = generateAIStory(crewMember);
        storyContainer.innerHTML = `<p>${story}</p>`;

        // Agregar al log personal
        crewMember.addToPersonalLog(`[IA] Historia generada: ${story.substring(0, 100)}...`);
    }, 1500);
}

function generateAIStory(crewMember) {
    // Aquí se generará la historia basada en los datos del tripulante
    const stories = {
        intro: [
            `${crewMember.name} recuerda el día en que tomó la decisión de unirse a la misión Odiseum.`,
            `La vida de ${crewMember.name} cambió para siempre cuando aceptó formar parte de este viaje interestelar.`,
            `${crewMember.name} nunca imaginó que su destino estaría entre las estrellas.`,
        ],
        background: [
            `Nacido(a) en una época de grandes cambios, ${crewMember.name} siempre sintió la llamada de lo desconocido.`,
            `Desde joven, ${crewMember.name} mostró una determinación inquebrantable.`,
            `La familia de ${crewMember.name} nunca entendió completamente su vocación.`,
        ],
        sacrifice: [
            `Dejó atrás ${crewMember.leftBehind?.family || 'todo lo que conocía'}, sabiendo que probablemente nunca volvería a verlos.`,
            `El sacrificio fue inmenso: ${crewMember.leftBehind?.lastWords || 'las últimas palabras aún resuenan en su mente'}.`,
            `A veces, en las noches silenciosas de la nave, piensa en lo que dejó atrás.`,
        ],
        mission: [
            `Como ${crewMember.position}, su papel es crucial para la supervivencia de toda la tripulación.`,
            `Cada día en la nave es un desafío nuevo, pero ${crewMember.name} nunca ha dudado de su misión.`,
            `La responsabilidad pesa sobre sus hombros, pero también le da propósito.`,
        ],
        dreams: [
            `Su mayor sueño es ${crewMember.leftBehind?.dream || 'ver Nueva Tierra con sus propios ojos'}.`,
            `A pesar de las dificultades, mantiene viva la esperanza de un futuro mejor.`,
            `${crewMember.fearOfDeath ? `Su actitud ante la muerte refleja: ${crewMember.fearOfDeath}` : 'Ha hecho las paces con su mortalidad.'}`,
        ],
        present: [
            `Actualmente, ${crewMember.name} se encuentra ${crewMember.state === 'Despierto' ? 'activo(a) y cumpliendo con sus deberes' : 'en criostasis, soñando con el futuro'}.`,
            `Su estado de ánimo es ${crewMember.mood}, lo que refleja el peso del viaje.`,
            `Día tras día, ${crewMember.name} contribuye al éxito de la misión con dedicación incansable.`,
        ],
        conclusion: [
            `La historia de ${crewMember.name} es una de sacrificio, esperanza y determinación inquebrantable.`,
            `En este viaje hacia lo desconocido, ${crewMember.name} representa lo mejor de la humanidad.`,
            `El legado de ${crewMember.name} vivirá en las generaciones que alcancen Nueva Tierra.`,
        ]
    };

    // Construir la historia seleccionando elementos aleatorios de cada categoría
    const storyParts = [
        stories.intro[Math.floor(Math.random() * stories.intro.length)],
        stories.background[Math.floor(Math.random() * stories.background.length)],
        stories.sacrifice[Math.floor(Math.random() * stories.sacrifice.length)],
        stories.mission[Math.floor(Math.random() * stories.mission.length)],
        stories.dreams[Math.floor(Math.random() * stories.dreams.length)],
        stories.present[Math.floor(Math.random() * stories.present.length)],
        stories.conclusion[Math.floor(Math.random() * stories.conclusion.length)]
    ];

    return storyParts.join('\n\n');
}

/* === GESTIÓN DE TRIPULACIÓN === */
function manageFoodNeed() {
    const crewName = document.getElementById('crew-name').textContent;
    const crewMember = crewMembers.find(c => c.name === crewName);
    
    if (!crewMember || !crewMember.isAlive) return;
    
    if (Food.quantity >= 10) {
        Food.consume(10);
        crewMember.foodNeed = Math.min(100, crewMember.foodNeed + 30);
        Food.updateResourceUI();
        crewMember.updateMiniCard();
        gameLoop.updateCrewPopupIfOpen();
        new Notification(`${crewName} ha sido alimentado`, NOTIFICATION_TYPES.INFO);
    } else {
        new Notification('No hay suficiente comida', NOTIFICATION_TYPES.ALERT);
    }
}

function manageHealthNeed() {
    const crewName = document.getElementById('crew-name').textContent;
    const crewMember = crewMembers.find(c => c.name === crewName);
    
    if (!crewMember || !crewMember.isAlive) return;
    
    if (Medicine.quantity >= 5) {
        Medicine.consume(5);
        crewMember.healthNeed = Math.min(100, crewMember.healthNeed + 25);
        Medicine.updateResourceUI();
        crewMember.updateMiniCard();
        gameLoop.updateCrewPopupIfOpen();
        new Notification(`${crewName} ha recibido atención médica`, NOTIFICATION_TYPES.INFO);
    } else {
        new Notification('No hay suficientes medicinas', NOTIFICATION_TYPES.ALERT);
    }
}

function manageWasteNeed() {
    const crewName = document.getElementById('crew-name').textContent;
    const crewMember = crewMembers.find(c => c.name === crewName);
    
    if (!crewMember || !crewMember.isAlive) return;
    
    if (Water.quantity >= 3) {
        Water.consume(3);
        crewMember.wasteNeed = Math.max(0, crewMember.wasteNeed - 40);
        Water.updateResourceUI();
        crewMember.updateMiniCard();
        gameLoop.updateCrewPopupIfOpen();
        new Notification(`${crewName} ha usado las instalaciones de higiene`, NOTIFICATION_TYPES.INFO);
    } else {
        new Notification('No hay suficiente agua', NOTIFICATION_TYPES.ALERT);
    }
}

function manageEntertainmentNeed() {
    const crewName = document.getElementById('crew-name').textContent;
    const crewMember = crewMembers.find(c => c.name === crewName);
    
    if (!crewMember || !crewMember.isAlive) return;
    
    if (Data.quantity >= 5) {
        Data.consume(5);
        crewMember.entertainmentNeed = Math.min(100, crewMember.entertainmentNeed + 35);
        Data.updateResourceUI();
        crewMember.updateMiniCard();
        gameLoop.updateCrewPopupIfOpen();
        new Notification(`${crewName} ha accedido al entretenimiento`, NOTIFICATION_TYPES.INFO);
    } else {
        new Notification('No hay suficientes datos de entretenimiento', NOTIFICATION_TYPES.ALERT);
    }
}

function manageRestNeed() {
    const crewName = document.getElementById('crew-name').textContent;
    const crewMember = crewMembers.find(c => c.name === crewName);
    
    if (!crewMember || !crewMember.isAlive) return;
    
    crewMember.restNeed = Math.min(100, crewMember.restNeed + 50);
    crewMember.updateMiniCard();
    gameLoop.updateCrewPopupIfOpen();
    new Notification(`${crewName} ha descansado`, NOTIFICATION_TYPES.INFO);
}

function updateWakeSleep(name) {
    const crewMember = crewMembers.find(c => c.name === name);
    if (!crewMember || !crewMember.isAlive) return;
    
    const oldState = crewMember.state;
    crewMember.state = crewMember.state === 'Despierto' ? 'Encapsulado' : 'Despierto';
    crewMember.updateConsoleCrewState();
    crewMember.updateMiniCard();
    
    logbook.addEntry(
        `${name} cambió de ${oldState} a ${crewMember.state}`,
        LOG_TYPES.EVENT
    );
    
    new Notification(`${name} ahora está ${crewMember.state}`, NOTIFICATION_TYPES.INFO);
}

function updateWakeSleepFromPopup() {
    const crewName = document.getElementById('crew-name').textContent;
    updateWakeSleep(crewName);
    
    const crewMember = crewMembers.find(c => c.name === crewName);
    if (crewMember) {
        document.getElementById('crew-state').textContent = crewMember.state;
    }
}

/* === GESTIÓN RÁPIDA DESDE MINI-CARDS === */
function quickManage(crewName, type) {
    const crewMember = crewMembers.find(c => c.name === crewName);
    if (!crewMember || !crewMember.isAlive) return;
    
    if (type === 'food') {
        if (Food.quantity >= 10) {
            Food.consume(10);
            crewMember.foodNeed = Math.min(100, crewMember.foodNeed + 30);
            Food.updateResourceUI();
            crewMember.updateMiniCard();
        } else {
            new Notification('No hay suficiente comida', NOTIFICATION_TYPES.ALERT);
        }
    } else if (type === 'health') {
        if (Medicine.quantity >= 5) {
            Medicine.consume(5);
            crewMember.healthNeed = Math.min(100, crewMember.healthNeed + 25);
            Medicine.updateResourceUI();
            crewMember.updateMiniCard();
        } else {
            new Notification('No hay suficientes medicinas', NOTIFICATION_TYPES.ALERT);
        }
    }
}

/* === CONTROL DE VELOCIDAD === */
function updateSpeedDisplay() {
    const speedValue = document.getElementById('speed-control').value;
    document.getElementById('speed-value').textContent = speedValue;
}

/* === MENSAJES CUÁNTICOS === */
function closeQuantumMessages() {
    const overlay = document.getElementById('quantum-message-overlay');
    if (overlay) {
        overlay.remove();
    }
}

/* === ORDENAMIENTO === */
function onSortChange() {
    const select = document.getElementById('crew-sort-select');
    sortingSystem.applySorting(select.value);
}
