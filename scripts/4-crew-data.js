// ============================================
// DATOS DE TRIPULACIÓN - ODISEUM V2.0
// ============================================

const CREW_DATA = [
    {
        id: 1,
        name: 'Capitán Silva',
        position: 'Comandante',
        age: 45,
        img: 'avatar1.jpg',
        role: 'commander',
        state: 'Despierto',
        personality: {
            traits: ['leadership', 'responsible', 'strict', 'protective'],
            background: 'Ex-militar con 20 años de experiencia en misiones espaciales',
            motivation: 'Proteger a su tripulación y completar la misión'
        },
        leftBehind: {
            family: 'Esposa Elena (43) e hija Sofía (12 años)',
            lastWords: '"Papá, ¿vas a volver algún día?" - No pude mentirle. Le dije la verdad.',
            dream: 'Ver montañas reales otra vez, no simulaciones holográficas'
        },
        fearOfDeath: 'Alta - Quiere ver el resultado de su sacrificio'
    },
    {
        id: 2,
        name: 'Dra. Chen',
        position: 'Médica',
        age: 38,
        img: 'avatar2.jpg',
        role: 'doctor',
        state: 'Despierto',
        personality: {
            traits: ['empathetic', 'intelligent', 'caring', 'perfectionist'],
            background: 'Médica de emergencias espaciales, especialista en criogenia',
            motivation: 'Mantener a todos saludables hasta el final'
        },
        leftBehind: {
            family: 'Madre enferma de Alzheimer (nunca se despidieron)',
            lastWords: '"Salva a otros, ya que no pudiste salvarme" - Última conversación lúcida',
            dream: 'Ver nacer al primer bebé de los embriones en Nueva Tierra'
        },
        fearOfDeath: 'Media - Acepta riesgos calculados por los demás'
    },
    {
        id: 3,
        name: 'Ing. Rodriguez',
        position: 'Ingeniero',
        age: 32,
        img: 'avatar3.jpg',
        role: 'engineer',
        state: 'Encapsulado',
        personality: {
            traits: ['analytical', 'introverted', 'creative', 'pragmatic'],
            background: 'Ingeniero de sistemas críticos, genio con las máquinas',
            motivation: 'Mantener la nave funcionando contra todo pronóstico'
        },
        leftBehind: {
            family: 'Novio Marco (30) - Relación terminó por la misión',
            lastWords: '"Elige tu nave o elígeme a mí. No puedes tener ambos." - Última discusión',
            dream: 'Diseñar y construir la primera ciudad autosostenible en Nueva Tierra'
        },
        fearOfDeath: 'Baja - Pragmático sobre los riesgos, pero no suicida'
    },
    {
        id: 4,
        name: 'Lt. Johnson',
        position: 'Navegante',
        age: 29,
        img: 'avatar4.jpg',
        role: 'scientist',
        state: 'Despierto',
        personality: {
            traits: ['optimistic', 'social', 'adventurous', 'impulsive'],
            background: 'Joven prodigio de navegación estelar',
            motivation: 'Explorar el cosmos y ser parte de la historia'
        },
        leftBehind: {
            family: 'Padres jubilados David (68) y María (65) - Orgullosos pero devastados',
            lastWords: '"Eres nuestro orgullo, hijo. Vuela alto y llega lejos."',
            dream: 'Ser el primero en pisar Nueva Tierra y plantar la bandera de la humanidad'
        },
        fearOfDeath: 'Muy Alta - Demasiado joven, le aterra no ver el final'
    },
    {
        id: 5,
        name: 'Chef Patel',
        position: 'Cocinero/Botánico',
        age: 41,
        img: 'avatar5.jpg',
        role: 'cook',
        state: 'Encapsulado',
        personality: {
            traits: ['nurturing', 'traditional', 'patient', 'spiritual'],
            background: 'Chef de alto nivel y experto botánico espacial',
            motivation: 'Alimentar cuerpo y alma de la tripulación'
        },
        leftBehind: {
            family: 'Tres hijos adultos (22, 20, 18) y seis nietos',
            lastWords: '"Abuela va a plantar un jardín en las estrellas para ustedes"',
            dream: 'Cultivar el primer huerto real en Nueva Tierra con semillas de la Tierra'
        },
        fearOfDeath: 'Baja - Espiritual, acepta el ciclo natural pero quiere ver su obra completa'
    }
];

/* === FUNCIÓN HELPER PARA CREAR TRIPULACIÓN === */
function createCrewFromData(config) {
    console.log('=== [createCrewFromData] INICIANDO ===');
    console.log('[createCrewFromData] Config recibido:', config);
    console.log('[createCrewFromData] Config.crew:', config?.crew);

    // Si no hay config, usar tripulación por defecto
    if (!config || !config.crew) {
        console.log('[createCrewFromData] NO HAY CONFIG - Usando tripulación por defecto');
        return CREW_DATA.map(data => new Crew(data));
    }

    console.log('[createCrewFromData] SÍ HAY CONFIG - Creando tripulación personalizada');

    // Mapeo de roles del configurador a roles internos
    const roleMapping = {
        'comandante': { role: 'commander', position: 'Comandante', img: 'avatar1.jpg', baseId: 1 },
        'doctor': { role: 'doctor', position: 'Médica', img: 'avatar2.jpg', baseId: 2 },
        'ingeniero': { role: 'engineer', position: 'Ingeniero', img: 'avatar3.jpg', baseId: 3 },
        'navegante': { role: 'scientist', position: 'Navegante', img: 'avatar4.jpg', baseId: 4 },
        'chef': { role: 'cook', position: 'Cocinero/Botánico', img: 'avatar5.jpg', baseId: 5 }
    };

    // Crear tripulación desde configuración
    const customCrew = [];
    let idCounter = 1;

    for (const [roleKey, roleInfo] of Object.entries(roleMapping)) {
        console.log(`[createCrewFromData] Procesando rol: ${roleKey}`);
        const selectedOption = config.crew[roleKey];

        if (selectedOption) {
            console.log(`[createCrewFromData] ${roleKey} encontrado:`, selectedOption.name);
            console.log(`[createCrewFromData] ${roleKey} stats:`, selectedOption.stats);

            // Crear datos de tripulante basados en la opción seleccionada
            const crewData = {
                id: idCounter++,
                name: selectedOption.name,
                position: roleInfo.position,
                age: selectedOption.age,
                img: roleInfo.img,
                role: roleInfo.role,
                state: 'Despierto', // Todos empiezan despiertos
                personality: {
                    traits: [],
                    background: selectedOption.description,
                    motivation: selectedOption.benefits
                },
                leftBehind: {
                    family: 'Clasificado',
                    lastWords: 'Registros no disponibles',
                    dream: 'Llegar a destino'
                },
                fearOfDeath: 'Media',
                // Guardar stats especiales del configurador
                configStats: selectedOption.stats || {},
                configBenefits: selectedOption.benefits,
                configDrawbacks: selectedOption.drawbacks
            };

            console.log(`[createCrewFromData] crewData creado para ${selectedOption.name}:`, crewData);
            console.log(`[createCrewFromData] crewData.configStats:`, crewData.configStats);

            const crewMember = new Crew(crewData);
            console.log(`[createCrewFromData] Crew object creado - Name:`, crewMember.name, 'configStats:', crewMember.configStats);

            customCrew.push(crewMember);
        } else {
            console.error(`[createCrewFromData] ERROR: ${roleKey} NO ENCONTRADO en config.crew!`);
        }
    }

    console.log('[createCrewFromData] Total tripulantes creados:', customCrew.length);

    // Si no se crearon todos los tripulantes, usar los por defecto faltantes
    if (customCrew.length < 5) {
        console.warn('[createCrewFromData] Solo se crearon', customCrew.length, 'tripulantes. Usando defaults');
        return CREW_DATA.map(data => new Crew(data));
    }

    console.log('[createCrewFromData] Tripulación personalizada completa:', customCrew.map(c => c.name));
    return customCrew;
}
