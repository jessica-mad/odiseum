// ============================================
// CONFIGURACIÓN - ODISEUM V2.0
// ============================================

/* === CONSTANTES TEMPORALES === */
const TRANCHE_DURATION_MS = 30000; // 30 segundos por tramo (velocidad x2)
const SIMULATION_TICK_RATE = 1000; // 1 segundo por tick (velocidad x2)
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
    resting: {
        food: -0.8,
        health: -0.5,
        waste: 1,
        entertainment: -0.5,
        rest: 3  // Recupera descanso más rápido
    },
    capsule: {
        food: -0.5,
        health: -0.3,
        waste: 0.5,
        entertainment: -0.2,
        rest: 2
    }
};

/* === ESTADOS DE TRIPULACIÓN === */
const CREW_STATES = {
    AWAKE: 'Despierto',
    RESTING: 'Descansando',
    CAPSULE: 'Cápsula',
    DECEASED: 'Fallecido'
};

/* === UMBRALES DE ESTADO === */
const REST_THRESHOLD_FOR_RESTING = 15; // Si el descanso baja de 15, puede entrar en modo descansando

/* === CONFIGURACIÓN DE AUTO-GESTIÓN === */
const AUTO_MANAGE_CONFIG = {
    food: { threshold: 60, cost: 10, recovery: 30 },
    hygiene: { threshold: 70, cost: 3, recovery: 40 },
    entertainment: { threshold: 60, cost: 5, recovery: 35, probability: 0.3 },
    medicine: { threshold: 50, cost: 5, recovery: 25 }
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

/* === CONFIGURACIÓN DE MISIÓN PRE-PARTIDA === */

// Presupuesto total para selección de tripulación
const CREW_BUDGET = 25;

// Opciones de tripulación por rol (3 opciones por rol)
const CREW_OPTIONS = {
    comandante: {
        role: 'Comandante',
        icon: '🎖️',
        options: [
            {
                id: 'comandante-veterano',
                name: 'Chen',
                cost: 7,
                age: 45,
                benefits: '+15% eficiencia a tripulación despierta',
                drawbacks: 'Envejece más rápido por edad avanzada',
                description: 'Liderazgo probado en 3 misiones. Lástima que el cuerpo no olvide.',
                stats: { efficiencyBonus: 0.15, agingRate: 1.2 }
            },
            {
                id: 'comandante-estandar',
                name: 'Morgan',
                cost: 5,
                age: 35,
                benefits: '+10% eficiencia a tripulación despierta',
                drawbacks: 'Ninguna destacable',
                description: 'Balance entre experiencia y vitalidad. No promete milagros.',
                stats: { efficiencyBonus: 0.10, agingRate: 1.0 }
            },
            {
                id: 'comandante-promovido',
                name: 'Nova',
                cost: 3,
                age: 28,
                benefits: '+5% eficiencia, +10% suerte en eventos críticos',
                drawbacks: 'Menos autoridad que los veteranos',
                description: 'Promovida por "conexiones políticas". Ojalá sepa lo que hace.',
                stats: { efficiencyBonus: 0.05, luckBonus: 0.10, agingRate: 1.0 }
            }
        ]
    },
    doctor: {
        role: 'Doctor/a',
        icon: '⚕️',
        options: [
            {
                id: 'doctor-botanico',
                name: 'Rodriguez',
                cost: 7,
                age: 38,
                benefits: 'Cura normal + 30% producción en invernadero + puede sintetizar medicina',
                drawbacks: 'Ninguna',
                description: 'Dos doctorados. Posible fraude académico o insomnio crónico.',
                stats: { healingRate: 1.0, greenhouseBonus: 0.30, canSynthMedicine: true }
            },
            {
                id: 'doctor-estandar',
                name: 'Kim',
                cost: 5,
                age: 32,
                benefits: 'Cura a velocidad normal (1.0 HP/tick)',
                drawbacks: 'Ninguna',
                description: 'Hace su trabajo sin florituras. Juramento Hipocrático incluido.',
                stats: { healingRate: 1.0, greenhouseBonus: 0, canSynthMedicine: false }
            },
            {
                id: 'doctor-precavida',
                name: 'Santos',
                cost: 3,
                age: 29,
                benefits: 'Cura 1.5x más rápido',
                drawbacks: 'Gasta 50% más medicina',
                description: 'Eficaz pero derrochadora. "Más vale prevenir que lamentar".',
                stats: { healingRate: 1.5, medicineUsage: 1.5, greenhouseBonus: 0, canSynthMedicine: false }
            }
        ]
    },
    ingeniero: {
        role: 'Ingeniero/a',
        icon: '🔧',
        options: [
            {
                id: 'ingeniero-veterano',
                name: 'Torres',
                cost: 7,
                age: 42,
                benefits: 'Repara 1.5x más rápido, reduce degradación 40%',
                drawbacks: 'Edad avanzada',
                description: 'Ha visto de todo. Literalmente. Las pesadillas lo confirman.',
                stats: { repairRate: 1.5, degradationReduction: 0.40, agingRate: 1.1 }
            },
            {
                id: 'ingeniero-estandar',
                name: 'Patel',
                cost: 5,
                age: 34,
                benefits: 'Repara normal, reduce degradación 20%',
                drawbacks: 'Ninguna',
                description: 'Competente apretando tuercas. Nada más, nada menos.',
                stats: { repairRate: 1.0, degradationReduction: 0.20 }
            },
            {
                id: 'ingeniero-prodigio',
                name: 'Lee',
                cost: 3,
                age: 24,
                benefits: 'Puede mejorar salas (+10% capacidad permanente)',
                drawbacks: 'Repara más lento que los demás',
                description: 'Genio joven que aún no ha matado a nadie. Todavía.',
                stats: { repairRate: 0.8, canUpgradeRooms: true, upgradeBonus: 0.10 }
            }
        ]
    },
    navegante: {
        role: 'Navegante',
        icon: '🧭',
        options: [
            {
                id: 'navegante-arriesgado',
                name: 'Ramos',
                cost: 7,
                age: 36,
                benefits: 'Ruta corta (150 días, ~10 tramos)',
                drawbacks: 'Eventos 20% más difíciles, menos margen de error',
                description: 'Rápido y peligroso. Como comida mal cocinada.',
                stats: { totalTranches: 10, eventDifficulty: 1.2, fuelConsumption: 1.0 }
            },
            {
                id: 'navegante-estandar',
                name: 'Johnson',
                cost: 5,
                age: 33,
                benefits: 'Ruta media (180 días, ~12 tramos)',
                drawbacks: 'Ninguna',
                description: 'No promete nada, no decepciona (mucho).',
                stats: { totalTranches: 12, eventDifficulty: 1.0, fuelConsumption: 1.0 }
            },
            {
                id: 'navegante-conservador',
                name: 'Nakamura',
                cost: 3,
                age: 40,
                benefits: 'Ruta larga (210 días, ~15 tramos)',
                drawbacks: 'Consume más fuel, más tiempo encerrados',
                description: 'Lento pero (probablemente) seguro. Énfasis en "probablemente".',
                stats: { totalTranches: 15, eventDifficulty: 0.8, fuelConsumption: 1.2 }
            }
        ]
    },
    chef: {
        role: 'Chef',
        icon: '👨‍🍳',
        options: [
            {
                id: 'chef-eficiente',
                name: 'Dubois',
                cost: 7,
                age: 31,
                benefits: 'Crew consume -10% food, plantas producen +20%',
                drawbacks: 'Ninguna',
                description: 'Gordon Ramsay espacial sin los insultos. Solo la calidad.',
                stats: { foodConsumption: 0.90, greenhouseBonus: 0.20 }
            },
            {
                id: 'chef-estandar',
                name: 'Garcia',
                cost: 5,
                age: 28,
                benefits: 'Producción normal de food',
                drawbacks: 'Ninguna',
                description: 'Hace comida comestible. A veces hasta sabe bien.',
                stats: { foodConsumption: 1.0, greenhouseBonus: 0 }
            },
            {
                id: 'chef-creativo',
                name: 'Chen',
                cost: 3,
                age: 26,
                benefits: 'Puede convertir Water → Food en emergencias (2:1)',
                drawbacks: 'Menos eficiente en producción normal',
                description: 'Inventa recetas raras. Agua con sabor a comida es su especialidad.',
                stats: { foodConsumption: 1.1, canConvertWater: true, conversionRate: 0.5 }
            }
        ]
    }
};

// Límites y características de recursos
const RESOURCE_LIMITS = {
    energy: {
        name: 'Energía',
        icon: '⚡',
        weightPerUnit: 1,
        min: 300,
        max: 1000,
        recommended: 700,
        renewable: false,
        description: 'Sistemas vitales. Sin esto, todo falla.'
    },
    food: {
        name: 'Alimentos',
        icon: '🍕',
        weightPerUnit: 2,
        min: 100,
        max: 500,
        recommended: 300,
        renewable: true,
        description: 'Comida procesada. El invernadero ayuda, pero no es magia.'
    },
    water: {
        name: 'Agua',
        icon: '💧',
        weightPerUnit: 1,
        min: 200,
        max: 800,
        recommended: 600,
        renewable: true,
        description: 'H₂O. Bebible y reciclable (no preguntes cómo).'
    },
    oxygen: {
        name: 'Oxígeno',
        icon: '🫁',
        weightPerUnit: 0.5,
        min: 400,
        max: 1000,
        recommended: 800,
        renewable: true,
        description: 'Para respirar. Bastante importante, dicen los expertos.'
    },
    medicine: {
        name: 'Medicinas',
        icon: '💊',
        weightPerUnit: 0.5,
        min: 50,
        max: 300,
        recommended: 100,
        renewable: false,
        description: 'Primeros auxilios y analgésicos. Ojalá no los necesites.'
    },
    data: {
        name: 'Datos/Entret.',
        icon: '💾',
        weightPerUnit: 0.1,
        min: 50,
        max: 300,
        recommended: 200,
        renewable: false,
        description: 'Películas, música, libros. Para no enloquecer (tanto).'
    },
    fuel: {
        name: 'Combustible',
        icon: '🛢️',
        weightPerUnit: 1,
        min: 500,
        max: 1500,
        recommended: 1000,
        renewable: false,
        critical: true,
        description: 'Sin fuel, la nave es un ataúd flotante. No escatimes.'
    }
};

// Presets de configuración rápida
const RESOURCE_PRESETS = {
    balanceado: {
        name: 'Balanceado',
        icon: '⚖️',
        description: 'Equilibrio entre seguridad y eficiencia',
        totalWeight: 3000,
        resources: {
            energy: 700,
            food: 300,
            water: 600,
            oxygen: 800,
            medicine: 100,
            data: 200,
            fuel: 1000
        }
    },
    supervivencia: {
        name: 'Supervivencia',
        icon: '🛡️',
        description: 'Prioriza recursos vitales sobre comodidades',
        totalWeight: 2600,
        resources: {
            energy: 500,
            food: 250,
            water: 500,
            oxygen: 700,
            medicine: 80,
            data: 150,
            fuel: 900
        }
    },
    velocista: {
        name: 'Velocista',
        icon: '⚡',
        description: 'Optimizado para rutas rápidas',
        totalWeight: 2400,
        resources: {
            energy: 600,
            food: 200,
            water: 450,
            oxygen: 650,
            medicine: 120,
            data: 180,
            fuel: 800
        }
    }
};

// Peso máximo de carga
const MAX_CARGO_WEIGHT = 3000;
