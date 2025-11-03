// ============================================
// CONFIGURACIÓN - ODISEUM V2.0
// ============================================

/* === CONSTANTES TEMPORALES === */
const TRANCHE_DURATION_MS = 60000; // 1 minuto por tramo
const SIMULATION_TICK_RATE = 2000; // 2 segundos por tick
const TICKS_PER_TRANCHE = 30; // 30 ticks por tramo
const YEARS_PER_TRANCHE = 5; // 5 años narrativos por tramo
const YEARS_PER_TICK = YEARS_PER_TRANCHE / TICKS_PER_TRANCHE; // ~0.167 años por tick

/* === CONSTANTES DE MISIÓN === */
const TOTAL_MISSION_DISTANCE = 3000; // UA
const DESTINATION_NAME = "Nueva Tierra (Kepler-442b)";
const DESTINATION_SYSTEM = "Kepler-442";

/* === ESTADOS DEL JUEGO === */
const GAME_STATES = {
    PAUSED: 'PAUSED',
    IN_TRANCHE: 'IN_TRANCHE',
    TRANCHE_PAUSED: 'TRANCHE_PAUSED',
    AWAITING_START: 'AWAITING_START'
};

/* === TIPOS DE NOTIFICACIÓN === */
const NOTIFICATION_TYPES = {
    INFO: 'info',
    WARNING: 'warning',
    ALERT: 'alert',
    SUCCESS: 'success'
};

/* === TIPOS DE ENTRADA DE BITÁCORA === */
const LOG_TYPES = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    CRITICAL: 'critical',
    EVENT: 'event',
    EVENT_CRITICAL: 'event_critical',
    DEATH: 'death',
    AGE: 'age',
    MESSAGE: 'message'
};

/* === ICONOS POR TIPO DE LOG === */
const LOG_ICONS = {
    'info': 'ℹ️',
    'success': '✔',
    'warning': '⚠️',
    'critical': '🚨',
    'event': '📌',
    'event_critical': '🛑',
    'death': '💀',
    'age': '👴',
    'message': '📡'
};

/* === OPCIONES DE ORDENAMIENTO === */
const SORT_OPTIONS = [
    { id: 'default', label: 'Orden Original', icon: '📋' },
    { id: 'age-asc', label: 'Edad ⬆️ (Menor a Mayor)', icon: '👶' },
    { id: 'age-desc', label: 'Edad ⬇️ (Mayor a Menor)', icon: '👴' },
    { id: 'food', label: 'Hambre 🍕 (Más hambriento)', icon: '🍕' },
    { id: 'health', label: 'Salud ❤️ (Peor salud)', icon: '❤️' },
    { id: 'rest', label: 'Descanso 😴 (Más cansado)', icon: '😴' },
    { id: 'hygiene', label: 'Higiene 🚽 (Más sucio)', icon: '🚽' }
];

/* === RANKINGS DE VICTORIA === */
const VICTORY_RANKS = {
    'S-RANK': {
        title: 'Esperanza Completa',
        requirements: 'Tripulantes vivos: 5/5, Edad promedio < 60 años',
        narrative: `Has logrado lo imposible. Los cinco tripulantes llegan vivos y en buenas condiciones.
        
La Colonia Esperanza los recibe con lágrimas de alegría. Los 10,000 embriones están intactos.

Tu gestión fue perfecta. Equilibraste el sacrificio con la preservación. La humanidad tiene un futuro brillante gracias a ti.

Los cinco héroes que trajeron la esperanza serán recordados por todas las generaciones venideras.`
    },
    'A-RANK': {
        title: 'Sacrificio Medido',
        requirements: 'Tripulantes vivos: 3-4/5',
        narrative: `No todos sobrevivieron, pero la misión fue un éxito.
        
Los sobrevivientes entregan los embriones con orgullo y dolor. Honran a sus compañeros caídos.

La Colonia Esperanza construirá un monumento a los que dieron sus vidas por el futuro de la humanidad.

Tu gestión fue sabia. Entendiste que algunos sacrificios son necesarios para un bien mayor.`
    },
    'B-RANK': {
        title: 'Victoria Pírrica',
        requirements: 'Tripulantes vivos: 1-2/5',
        narrative: `La victoria tiene un sabor amargo.
        
El o los sobrevivientes llegan exhaustos, envejecidos, marcados por la pérdida de sus compañeros.

Pero los embriones están a salvo. La humanidad vivirá.

"Lo logramos... finalmente..." susurra el sobreviviente antes de colapsar.

La misión fue un éxito, pero el costo fue terrible.`
    },
    'GAME-OVER': {
        title: 'El Silencio Eterno',
        requirements: 'Tripulantes vivos: 0/5',
        narrative: `La nave Odiseum deriva silenciosa en el vacío del espacio.
        
Los sistemas de criogenia de los embriones fallan uno a uno.

La Colonia Esperanza espera en vano. Las transmisiones cesan.

La humanidad esperó... pero nadie llegó.

Los sacrificios no fueron suficientes. La esperanza se perdió entre las estrellas.`
    }
};

/* === CONFIGURACIÓN DE RECURSOS === */
const RESOURCES_CONFIG = {
    energy: { name: 'Energía', initial: 1000, max: 1000, consumeRate: 0.2 },
    food: { name: 'Alimentos', initial: 500, max: 500, consumeRate: 10 },
    water: { name: 'Agua', initial: 300, max: 300, consumeRate: 3 },
    oxygen: { name: 'Oxígeno', initial: 400, max: 400, consumeRate: 0.5 },
    medicine: { name: 'Medicinas', initial: 200, max: 200, consumeRate: 5 },
    data: { name: 'Datos/Entret.', initial: 150, max: 150, consumeRate: 5 },
    fuel: { name: 'Combustible', initial: 1000, max: 1000, consumeRate: 1.5 }
};

/* === CONFIGURACIÓN DE NECESIDADES === */
const NEEDS_CONFIG = {
    awake: {
        food: -2,
        health: -1,
        waste: 3,
        entertainment: -2,
        rest: -1.5
    },
    capsule: {
        food: -0.5,
        health: -0.3,
        waste: 0.5,
        entertainment: -0.2,
        rest: 2
    }
};

/* === CONFIGURACIÓN DE AUTO-GESTIÓN === */
const AUTO_MANAGE_CONFIG = {
    food: { threshold: 60, cost: 10, recovery: 30 },
    hygiene: { threshold: 70, cost: 3, recovery: 40 },
    entertainment: { threshold: 60, cost: 5, recovery: 35, probability: 0.3 }
};

/* === EDAD Y EFICIENCIA === */
const AGE_EFFICIENCY = [
    { max: 40, efficiency: 1.0 },
    { max: 55, efficiency: 0.9 },
    { max: 65, efficiency: 0.75 },
    { max: 75, efficiency: 0.6 },
    { max: Infinity, efficiency: 0.4 }
];

const DEATH_BY_AGE_THRESHOLD = 80;
const DEATH_BY_AGE_PROBABILITY = 0.1;

/* === PROBABILIDADES DE MUERTE === */
const DEATH_PROBABILITIES = {
    starvation: 0.05,
    health: 0.03
};

/* === SISTEMA DE EVENTOS (REFERENCIA GLOBAL) === */
let eventSystem = null;
