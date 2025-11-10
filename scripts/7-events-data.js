// ============================================
// EVENTOS CRÍTICOS - ODISEUM V2.0
// ============================================

const EVENTS_POOL = [
    // EVENTO 1: CAPITÁN SILVA
    {
        id: 'silva_event_01',
        character: 'Capitán Silva',
        icon: '⚡',
        title: 'La Apuesta del Capitán',
        trigger: {
            minTranche: 2,
            maxTranche: 6,
            requiredAlive: ['Capitán Silva'],
            requiredAwake: ['Capitán Silva'],
            requiredAsleep: [],
            resourceMin: { fuel: 300, energy: 200 },
            resourceMax: {},
            requiredFlags: [],
            blockedByFlags: ['silva_fuel_gamble'],
            probability: 0.45
        },
        description: `Silva detecta una anomalía gravitacional a 3 horas de distancia.

"Comandante IA, los sensores muestran un campo de asteroides con alta concentración de helio-3. Podríamos recolectar combustible para meses."

Rodriguez (por radio): "Capitán, esa zona tiene micrometeoritos. Riesgo alto de daño al casco."

Silva mira el medidor de combustible y suspira.

"Dos opciones: Jugamos a la ruleta espacial y posiblemente ganamos combustible gratis, o tomamos la ruta segura y aburrida."

"20 años en el espacio me enseñaron que la suerte favorece a los audaces... o los mata."`,

        optionA: {
            label: '🎰 Atravesar el campo - Riesgo alto, recompensa alta',
            requires: {
                energy: 100,
                fuel: 50
            },
            costs: {
                energy: 100,
                fuel: 50
            },
            wakeUp: ['Ing. Rodriguez'],
            result: 'good'
        },

        optionB: {
            label: '🛡️ Ruta segura - Consumo normal, cero riesgo',
            requires: {},
            costs: {
                fuel: 100,
                energy: 50
            },
            wakeUp: [],
            result: 'bad'
        },

        outcomes: {
            good: {
                successRate: 0.65,
                success: {
                    flag: 'silva_successful_gamble',
                    resourceDeltas: {
                        fuel: 300,
                        energy: 150,
                        data: 100
                    },
                    affectedCrew: {
                        'Capitán Silva': {
                            trauma: null,
                            emotionalState: 'confident_leader',
                            skillModifier: 1.1,
                            relationships: {
                                'Ing. Rodriguez': 15,
                                'Lt. Johnson': 10,
                                'Dra. Chen': -5
                            }
                        },
                        'Ing. Rodriguez': {
                            trauma: null,
                            emotionalState: 'adrenaline_rush',
                            skillModifier: 1.0,
                            relationships: {
                                'Capitán Silva': 10
                            }
                        }
                    },
                    narrative: `Silva (manos en los controles): "Rodriguez, ¿listo?"
Rodriguez (recién despierto): "¿Para qué me despert—"
[IMPACTO]
Rodriguez: "¡¿QUÉ MIERDA?!"

Silva esquiva asteroides como en un videojuego de los 90.

30 minutos después...

✅ +300 Combustible (¡Jackpot espacial!)
✅ +150 Energía (Recolección de helio-3)
✅ +100 Datos científicos (Muestras de asteroides)
✅ Silva: +10% eficiencia (confianza reforzada)
✅ Rodriguez ahora confía ciegamente en Silva

Johnson: "Capitán, eres un loco."
Silva: "Un loco con combustible para 3 meses extra."

**Bitácora de Silva:** "Elena, Sofía... papá todavía sabe pilotar. 20 años no fueron en vano."`,
                    chainEvent: null
                },
                failure: {
                    flag: 'silva_failed_gamble',
                    resourceDeltas: {
                        fuel: -200,
                        energy: -250,
                        oxygen: -50,
                        water: -30
                    },
                    affectedCrew: {
                        'Capitán Silva': {
                            trauma: 'failed_leader',
                            emotionalState: 'doubting_self',
                            skillModifier: 0.85,
                            healthDelta: -10,
                            relationships: {
                                'Dra. Chen': -10,
                                'Lt. Johnson': -10,
                                'Chef Patel': -10
                            }
                        },
                        'Ing. Rodriguez': {
                            trauma: null,
                            emotionalState: 'shaken',
                            skillModifier: 1.0,
                            restDelta: -20,
                            relationships: {
                                'Capitán Silva': -10
                            }
                        },
                        'Dra. Chen': {
                            trauma: null,
                            emotionalState: 'angry',
                            skillModifier: 1.0,
                            relationships: {
                                'Capitán Silva': -10
                            }
                        },
                        'Lt. Johnson': {
                            trauma: null,
                            emotionalState: 'disappointed',
                            skillModifier: 1.0,
                            relationships: {
                                'Capitán Silva': -10
                            }
                        },
                        'Chef Patel': {
                            trauma: null,
                            emotionalState: 'worried',
                            skillModifier: 1.0,
                            relationships: {
                                'Capitán Silva': -10
                            }
                        }
                    },
                    narrative: `[CRASH CRASH CRASH]

Silva (esquivando): "¡Mierda!"
Rodriguez: "¡ESCUDOS AL 20%!"
[IMPACTO MAYOR]

Sistema: "CASCO DAÑADO. FUGA EN SECCIÓN 7."

❌ -200 Combustible (gastado en reparaciones de emergencia)
❌ -250 Energía (sistemas de reparación)
❌ -50 Oxígeno (fuga)
❌ -30 Agua (sellado de emergencia)
⚠️ Silva: Trauma (failed_leader), -15% eficiencia
⚠️ Rodriguez: -20 Descanso (despertado para un desastre)
❌ TODAS las relaciones con Silva: -10

Chen (furiosa): "¡¿En qué estabas pensando?!"
Silva (en silencio): "..."
Johnson: "Casi nos mata a todos..."

**Bitácora de Silva:** "Aposté mal. Puse en riesgo a todos. ¿Qué diría Elena?"

[Silva empieza a dudar de cada decisión...]`,
                    chainEvent: 'silva_event_02_redemption'
                }
            },

            bad: {
                flag: 'silva_played_safe',
                resourceDeltas: {
                    fuel: -100,
                    energy: -50
                },
                affectedCrew: {
                    'Capitán Silva': {
                        trauma: null,
                        emotionalState: 'cautious_boring',
                        skillModifier: 0.95,
                        relationships: {
                            'Lt. Johnson': -5,
                            'Dra. Chen': 5
                        }
                    }
                },
                narrative: `Silva observa el campo de asteroides alejarse por el monitor.

Silva: "Ruta segura. No vale la pena el riesgo."
Johnson: "Capitán... ¿desde cuándo eres tan... cauteloso?"
Silva: "Desde que tengo 10,000 bebés congelados y 4 idiotas que proteger."
Johnson: "Ouch."

❌ -100 Combustible (ruta larga)
❌ -50 Energía (ruta larga)
⚠️ Silva: -5% eficiencia (jugar demasiado seguro atrofia instintos)
⚠️ Johnson: -5 relación (lo ve menos "cool")
✅ Chen: +5 relación (aprueba la prudencia)
✅ Cero riesgo, cero drama

Rodriguez (por radio): "Capitán, hay una diferencia entre ser cuidadoso y ser aburrido."
Silva: "Prefiero aburrido y vivo."

**Bitácora de Silva:** "Elena me diría que hice bien. ¿Verdad?"

Pero Silva sabe la verdad: Está envejeciendo. Está perdiendo su filo.

La pregunta lo persigue: ¿Es prudencia o es miedo?`,
                chainEvent: 'silva_event_02_risk'
            }
        }
    },

    // EVENTO 2: DRA. CHEN
    {
        id: 'chen_event_01',
        character: 'Dra. Chen',
        icon: '💉',
        title: 'Dilema de Hipócrates (o no)',
        trigger: {
            minTranche: 4,
            maxTranche: 9,
            requiredAlive: ['Dra. Chen'],
            requiredAwake: ['Dra. Chen'],
            requiredAsleep: [],
            resourceMin: { medicine: 50 },
            resourceMax: {},
            requiredFlags: [],
            blockedByFlags: ['chen_medical_crisis'],
            probability: 0.35
        },
        description: `Alarma a las 3 AM. Las cámaras criogénicas están fallando.

Dra. Chen, en pijama y con café frío de ayer, mira los datos:

"Genial. Puedo salvar a los 10,000 bebés congelados apagando TODO en la nave, o usar mi protocolo experimental que 'probablemente' funcione."

"¿Matar de frío a mis amigos o jugar a la lotería con el futuro de la humanidad?"

"Mamá nunca me preparó para esto."`,

        optionA: {
            label: '❄️ Apagar todo. Los bebés primero. (Tripulación = 🧊)',
            requires: { energy: 200 },
            costs: { energy: 200, oxygen: 50, water: 30 },
            wakeUp: [],
            result: 'good'
        },

        optionB: {
            label: '🎲 YOLO científico. ¿Qué puede salir mal? (60% éxito)',
            requires: { medicine: 100 },
            costs: { medicine: 100, energy: 50, data: 30 },
            wakeUp: ['Ing. Rodriguez'],
            result: 'bad'
        },

        outcomes: {
            good: {
                flag: 'chen_froze_everyone',
                affectedCrew: {
                    'Dra. Chen': {
                        trauma: 'guilt_complex',
                        emotionalState: 'conflicted',
                        skillModifier: 1.05,
                        relationships: {
                            'Capitán Silva': -15,
                            'Lt. Johnson': -20,
                            'Chef Patel': 10
                        }
                    },
                    'ALL_CREW': {
                        trauma: null,
                        emotionalState: 'hypothermic',
                        skillModifier: 0.85,
                        healthDelta: -30,
                        restDelta: -20,
                        relationships: {}
                    }
                },
                narrative: `48 horas después...

✅ 10,000 embriones: Perfectos
❌ Tripulación: Congelados, enojados, con hipotermia

Johnson (temblando): "C-casi m-muero..."
Silva (furioso): "¿Y SI MORÍAN TODOS?"
Chen: "Pero no murieron. De nada."
Patel (preparando té): "Entiendo tu decisión."

**Bitácora de Chen:** "Salvé el futuro. Todos me odian. Balance perfecto."

**RESULTADO:**
- Embriones: 100% salvados
- Tripulación: -30 Salud, -20 Descanso, -15% eficiencia x2 tramos
- Chen ahora come sola en el comedor`,
                chainEvent: 'chen_event_02_redemption'
            },

            bad: {
                successRate: 0.6,
                success: {
                    flag: 'chen_experimental_hero',
                    resourceDeltas: {
                        data: 150,
                        medicine: 50
                    },
                    affectedCrew: {
                        'Dra. Chen': {
                            trauma: null,
                            emotionalState: 'smug',
                            skillModifier: 1.15,
                            relationships: {
                                'Capitán Silva': 15,
                                'Ing. Rodriguez': 20,
                                'Lt. Johnson': 10
                            }
                        },
                        'Ing. Rodriguez': {
                            trauma: null,
                            emotionalState: 'tired_but_impressed',
                            skillModifier: 1.0,
                            relationships: { 'Dra. Chen': 15 }
                        }
                    },
                    narrative: `90 minutos de Chen y Rodriguez improvisando como en MacGyver.

Rodriguez: "¿Segura que esto funciona?"
Chen: "Matemáticamente... sí. Empíricamente... primera vez."
Rodriguez: "Genial."

[Funciona perfectamente]

Silva (sorprendido): "¿Cómo...?"
Chen (sonriendo): "Ciencia, bebé."

✅ 10,000 embriones salvos
✅ +150 Datos científicos
✅ +50 Medicina extra
✅ Chen es oficialmente un genio
✅ Rodriguez ahora la ama (platónicamente)

**Bitácora de Chen:** "Mamá, soy una rockstar espacial."`,
                    chainEvent: null
                },
                failure: {
                    flag: 'chen_experimental_failure',
                    affectedCrew: {
                        'Dra. Chen': {
                            trauma: 'guilt_major',
                            emotionalState: 'devastated',
                            skillModifier: 0.75,
                            healthDelta: -20,
                            restDelta: -30,
                            relationships: {
                                'Capitán Silva': -10
                            }
                        },
                        'Ing. Rodriguez': {
                            trauma: null,
                            emotionalState: 'sympathetic',
                            skillModifier: 1.0,
                            restDelta: -10,
                            relationships: { 'Dra. Chen': 5 }
                        }
                    },
                    narrative: `[Beep... beep... beeeeeeeeee...]

Chen (pálida): "No... no no no..."
Rodriguez: "¿Cuántos?"
Chen: "2,000... perdí 2,000 bebés."

❌ 8,000 salvados / 2,000 perdidos
❌ Chen: Trauma severo, -25% eficiencia
❌ Chen: -20 Salud, -30 Descanso (insomnio)
❌ Rodriguez despertado para nada (-10 Descanso)

Silva (suspirando): "Al menos salvaste 8,000..."
Chen (llorando): "Maté a 2,000."

**Bitácora de Chen:** "Nunca me perdonaré."

[Chen empieza a hacer cosas raras con los embriones restantes...]`,
                    chainEvent: 'chen_event_02_breakdown'
                }
            }
        }
    },

    // EVENTO 3: ING. RODRIGUEZ
    {
        id: 'rodriguez_event_01',
        character: 'Ing. Rodriguez',
        icon: '⚙️',
        title: 'Perfeccionista hasta la Muerte',
        trigger: {
            minTranche: 2,
            maxTranche: 7,
            requiredAlive: ['Ing. Rodriguez'],
            requiredAwake: ['Ing. Rodriguez'],
            requiredAsleep: [],
            resourceMin: { energy: 100 },
            resourceMax: {},
            requiredFlags: [],
            blockedByFlags: ['rodriguez_reactor_crisis'],
            probability: 0.45
        },
        description: `Rodriguez irrumpe a las 4 AM con cara de no haber dormido en 3 días.

"Comandante, el reactor está fallando. Funciona al 60%.
Perdemos energía como si tuviéramos un agujero en el tanque."

"Opción 1: Parche rápido. Dura 3 meses. Es feo pero funciona.
Opción 2: Rediseño total. Podría hacerlo 120% eficiente...
o explotarlo todo."

"Mi ex Marco me decía: 'No todo necesita ser perfecto, Rodriguez.'
Y yo le decía: 'Entonces por qué arreglé nuestra relación 47 veces?'"

"Spoiler: No funcionó. Pero este reactor sí tiene solución."`,

        optionA: {
            label: '🔧 Rápido, feo, y temporal. Como todas mis relaciones.',
            requires: {},
            costs: { energy: 50, data: 30 },
            wakeUp: [],
            result: 'safe'
        },

        optionB: {
            label: '⚡ Voy a hacer esto PERFECTO o nos vamos todos al carajo.',
            requires: { energy: 100, data: 50 },
            costs: { energy: 100, data: 50 },
            wakeUp: ['Dra. Chen'],
            result: 'gamble'
        },

        outcomes: {
            safe: {
                flag: 'rodriguez_duct_tape',
                resourceDeltas: { energy: -50, data: -30 },
                affectedCrew: {
                    'Ing. Rodriguez': {
                        trauma: null,
                        emotionalState: 'ashamed',
                        skillModifier: 0.9,
                        personalThought: 'Marco tenía razón. Soy mediocre.',
                        relationships: {
                            'Lt. Johnson': -5
                        }
                    }
                },
                narrative: `Rodriguez pone cinta adhesiva cuántica.

Silva: "¿Eso es... cinta?"
Rodriguez: "Cinta ESPACIAL."

✅ Reactor funciona 3 meses más
⚠️ Sigue al 60% (ineficiente)
⚠️ Rodriguez: -10% eficiencia
Johnson: "Mi abuela repararía mejor."`,
                chainEvent: null
            },
            gamble: {
                successRate: 0.5,
                success: {
                    flag: 'rodriguez_genius',
                    resourceDeltas: { energy: 200 },
                    affectedCrew: {
                        'Ing. Rodriguez': {
                            trauma: null,
                            emotionalState: 'proud_genius',
                            skillModifier: 1.15,
                            personalThought: 'Marco, ojalá vieras esto. Soy bueno en algo.',
                            relationships: {
                                'Capitán Silva': 10,
                                'Dra. Chen': 10,
                                'Lt. Johnson': 10,
                                'Chef Patel': 10
                            }
                        },
                        'Dra. Chen': {
                            emotionalState: 'impressed',
                            personalThought: 'Rodriguez es más brillante de lo que pensaba.',
                            relationships: {
                                'Ing. Rodriguez': 15
                            }
                        }
                    },
                    narrative: `72 horas después...

[VRRRRRRRRR - Suena como Ferrari nuevo]

✅ +200 Energía permanente
✅ Reactor al 120%
✅ Rodriguez: +15% eficiencia
✅ TODOS: +10 relación
Chen (despierta): "Imposible... pero lo hiciste."
Johnson: "¿Puedes arreglar mi vida amorosa?"`,
                    chainEvent: null
                },
                failure: {
                    flag: 'rodriguez_disaster',
                    resourceDeltas: { energy: -300, data: -100 },
                    affectedCrew: {
                        'Ing. Rodriguez': {
                            trauma: 'perfectionist_failure',
                            emotionalState: 'broken',
                            skillModifier: 0.75,
                            personalThought: 'Marco me dejó porque siempre lo rompo todo. Ahora rompí la nave. Patrón confirmado.',
                            relationships: {
                                'Capitán Silva': -10,
                                'Dra. Chen': -15,
                                'Lt. Johnson': -15,
                                'Chef Patel': -10
                            }
                        },
                        'Dra. Chen': {
                            emotionalState: 'furious',
                            restDelta: -30,
                            personalThought: 'Rodriguez me despertó para presenciar su desastre. Imperdonable.',
                            relationships: {
                                'Ing. Rodriguez': -15
                            }
                        }
                    },
                    narrative: `[BOOM. Apagón total.]

Chen (recién despierta): "¿QUÉ PASÓ?"
Rodriguez (llorando): "Lo rompí."

❌ -300 Energía
❌ -100 Datos
⚠️ Rodriguez: Trauma, -25% eficiencia
⚠️ Chen: -30 Descanso
⚠️ TODOS: -15 relación
Chen: "NUNCA me despiertes para TUS errores."`,
                    chainEvent: null
                }
            }
        }
    },

    // Rodriguez Event 2
    {
        id: 'rodriguez_event_02',
        character: 'Ing. Rodriguez',
        icon: '⚙️',
        title: 'El Ruido Misterioso',
        trigger: {
            minTranche: 3,
            maxTranche: 9,
            requiredAlive: ['Ing. Rodriguez'],
            requiredAwake: ['Ing. Rodriguez'],
            requiredAsleep: [],
            resourceMin: {},
            resourceMax: {},
            requiredFlags: [],
            blockedByFlags: ['rodriguez_ticking_investigated'],
            probability: 0.35
        },
        description: `Rodriguez irrumpe en el puente a las 2:30 AM con cara de no haber dormido en 48 horas.

"Comandante, hay un TICTAC en el casco. Sección 7-B.
Lleva 6 horas. Constante. Regular. No natural."

[Reproduce audio grabado: tic... tic... tic...]

"Podría ser:
1. Dilatación térmica (aburrido, probable)
2. Componente suelto (medio preocupante)
3. Temporizador de bomba (mi cerebro a las 3 AM)"

"Mi ex Marco me decía: 'Rodriguez, no TODO es una conspiración.'
Y yo le respondía: 'Dime eso cuando el microondas explote.'"

"Spoiler: El microondas SÍ explotó. Pero era mi culpa."

"¿Investigo o duermo?"`,

        optionA: {
            label: '💤 Duerme, Rodriguez. Es dilatación térmica. Confía en mí.',
            requires: {},
            costs: {},
            wakeUp: [],
            result: 'ignore'
        },

        optionB: {
            label: '🔍 Investiga AHORA. No duermo hasta saberlo.',
            requires: {},
            costs: { energy: 30 },
            wakeUp: [],
            result: 'investigate'
        },

        outcomes: {
            ignore: {
                flag: 'rodriguez_ignored_sound',
                resourceDeltas: {},
                affectedCrew: {
                    'Ing. Rodriguez': {
                        trauma: null,
                        emotionalState: 'anxious_paranoid',
                        skillModifier: 0.95,
                        personalThought: '¿Y si ERA importante? Marco decía que siempre exagero... pero a veces tengo razón.',
                        relationships: {
                            'Capitán Silva': -5
                        }
                    }
                },
                narrative: `Rodriguez se va a dormir... pero NO duerme.

[3 horas después]

Rodriguez (por comunicador): "Comandante, sigo escuchándolo."
Silva: "Rodriguez, DUERME."

✅ +0 Recursos (nada pasó)
⚠️ Rodriguez: Ansiedad, -5% eficiencia
⚠️ Silva: -5 relación (agotado de lidiar con esto)

[El tic-tac era dilatación térmica.]
[Rodriguez NO lo sabrá nunca.]
[Vivirá con la duda.]`,
                chainEvent: null
            },
            investigate: {
                flag: 'rodriguez_ticking_investigated',
                resourceDeltas: { energy: -30 },
                affectedCrew: {
                    'Ing. Rodriguez': {
                        trauma: null,
                        emotionalState: 'relieved_validated',
                        skillModifier: 1.05,
                        personalThought: 'Era solo un panel suelto. Pero NECESITABA saberlo. Mi instinto funciona.',
                        relationships: {
                            'Capitán Silva': 5
                        }
                    }
                },
                narrative: `Rodriguez desaparece en el casco con herramientas.

[90 minutos después]

Rodriguez: "¡LO ENCONTRÉ!"

[Muestra panel de ventilación con tornillo flojo]

✅ Panel reparado
✅ -30 Energía (herramientas)
✅ Rodriguez: Validado, +5% eficiencia
✅ Silva: +5 relación

Rodriguez: "Marco me decía 'paranoico'. Yo le decía 'preparado'."

Silva: "A veces tu paranoia nos salva, Rodriguez."

Rodriguez (sonriendo): "A veces."`,
                chainEvent: null
            }
        }
    },

    // Rodriguez Event 3
    {
        id: 'rodriguez_event_03',
        character: 'Ing. Rodriguez',
        icon: '⚙️',
        title: 'La Pieza Fantasma',
        trigger: {
            minTranche: 2,
            maxTranche: 8,
            requiredAlive: ['Ing. Rodriguez'],
            requiredAwake: ['Ing. Rodriguez'],
            requiredAsleep: [],
            resourceMin: {},
            resourceMax: {},
            requiredFlags: [],
            blockedByFlags: ['rodriguez_phantom_part'],
            probability: 0.4
        },
        description: `Rodriguez entra al puente sosteniendo un tornillo.

"Comandante, tenemos un problema."

[Coloca el tornillo en la mesa]

"Acabo de reparar el sistema de soporte vital.
Todo funciona perfecto.
Pero ME SOBRÓ ESTO."

"En ingeniería, si te sobra una pieza después de armar algo...
significa que:
1. Era extra (optimista)
2. Olvidaste dónde iba (realista)
3. La nave va a explotar (mi cerebro)"

"Mi ex Marco me ayudaba a armar muebles de IKEA.
Siempre sobraban piezas.
Él decía: 'Son extras, tranquilo.'
Yo revisaba el manual 6 veces."

"Spoiler: El librero se cayó a los 3 meses."

"¿Reviso TODO el sistema o confío en que era extra?"`,

        optionA: {
            label: '📦 Era extra. IKEA espacial. No pasa nada.',
            requires: {},
            costs: {},
            wakeUp: [],
            result: 'ignore_part'
        },

        optionB: {
            label: '🔍 Desarmo TODO hasta encontrar de dónde salió.',
            requires: { energy: 50 },
            costs: { energy: 50 },
            wakeUp: [],
            result: 'obsessive_check'
        },

        outcomes: {
            ignore_part: {
                flag: 'rodriguez_phantom_part_ignored',
                resourceDeltas: {},
                affectedCrew: {
                    'Ing. Rodriguez': {
                        trauma: 'phantom_part_anxiety',
                        emotionalState: 'obsessive_worried',
                        skillModifier: 0.9,
                        personalThought: 'Sé que era extra... pero ¿y si no? ¿Y si Marco tenía razón y siempre exagero? Pero el librero SÍ se cayó...',
                        relationships: {}
                    }
                },
                narrative: `Rodriguez guarda el tornillo en un cajón.

[3 días después]

Rodriguez revisa el cajón 14 veces al día.

Chen: "Rodriguez, ¿estás bien?"
Rodriguez: "SÍ. Solo... verificando."

⚠️ Rodriguez: Trauma (ansiedad por pieza fantasma)
⚠️ -10% eficiencia en reparaciones
⚠️ Obsesión permanente

[La pieza ERA extra.]
[Rodriguez NUNCA lo sabrá.]
[El librero de Marco lo persigue.]`,
                chainEvent: null
            },
            obsessive_check: {
                flag: 'rodriguez_phantom_part_solved',
                resourceDeltas: { energy: -50 },
                affectedCrew: {
                    'Ing. Rodriguez': {
                        trauma: null,
                        emotionalState: 'triumphant_validated',
                        skillModifier: 1.1,
                        personalThought: 'Lo sabía. SABÍA que no era extra. Mi instinto nunca falla. Marco estaba equivocado.',
                        relationships: {
                            'Capitán Silva': 10
                        }
                    }
                },
                narrative: `Rodriguez desarma TODO el sistema de soporte vital.

[6 horas después]

Rodriguez: "¡AQUÍ ESTABA!"

[El tornillo iba en el regulador de presión]

✅ -50 Energía (proceso obsesivo)
✅ Sistema al 105% eficiencia
✅ Rodriguez: +10% eficiencia permanente
✅ Silva: +10 relación

Silva: "Buen trabajo, Rodriguez."
Rodriguez: "El librero de Marco NO se va a caer nunca más."

[Nota: Marco ya no está.]
[Pero Rodriguez ganó esta vez.]`,
                chainEvent: null
            }
        }
    },

    // Rodriguez Event 4
    {
        id: 'rodriguez_event_04',
        character: 'Ing. Rodriguez',
        icon: '⚙️',
        title: 'La Impresora Maldita',
        trigger: {
            minTranche: 3,
            maxTranche: 8,
            requiredAlive: ['Ing. Rodriguez', 'Lt. Johnson'],
            requiredAwake: ['Ing. Rodriguez', 'Lt. Johnson'],
            requiredAsleep: [],
            resourceMin: {},
            resourceMax: {},
            requiredFlags: [],
            blockedByFlags: ['rodriguez_printer_incident'],
            probability: 0.45
        },
        description: `Johnson entra a ingeniería con una impresora 3D.

"Rodriguez, ¿puedes arreglar esto?"

Rodriguez: "Johnson, soy Ingeniero Jefe de una nave interestelar.
Diseñé el sistema de propulsión cuántica.
Optimicé reactores que alimentan 200 tripulantes.
¿Y me pides arreglar una IMPRESORA?"

Johnson: "Sí."

Rodriguez: "..."

[Suspiro profundo]

"Está bien. Dos opciones:
1. Te digo que no (dignidad intacta)
2. La arreglo pero me voy a obsesionar y termino rediseñándola"

"Mi ex Marco me pidió arreglar su laptop.
Le instalé 3 sistemas operativos, overclocking, refrigeración líquida.
Él solo quería ver Netflix."

"Spoiler: Lo dejé."

"Bueno, él me dejó. Pero fue por MI culpa."

"¿Qué hago con tu impresora?"`,

        optionA: {
            label: '🚫 No, Johnson. Pídele a Chen que lea el manual.',
            requires: {},
            costs: {},
            wakeUp: [],
            result: 'refuse_dignity'
        },

        optionB: {
            label: '🔧 Está bien... pero NO me culpes si termina haciendo café.',
            requires: { energy: 40, data: 20 },
            costs: { energy: 40, data: 20 },
            wakeUp: [],
            result: 'overengineer'
        },

        outcomes: {
            refuse_dignity: {
                flag: 'rodriguez_printer_refused',
                resourceDeltas: {},
                affectedCrew: {
                    'Ing. Rodriguez': {
                        trauma: null,
                        emotionalState: 'proud_boundaries',
                        skillModifier: 1.05,
                        personalThought: 'Dije que no. Marco estaría orgulloso. Estoy aprendiendo límites.',
                        relationships: {
                            'Lt. Johnson': -5
                        }
                    },
                    'Lt. Johnson': {
                        emotionalState: 'annoyed',
                        personalThought: 'Rodriguez es brillante pero a veces insoportable.',
                        relationships: {
                            'Ing. Rodriguez': -5
                        }
                    }
                },
                narrative: `Rodriguez: "No."

Johnson: "¿En serio?"
Rodriguez: "En serio. Tengo dignidad profesional."

Johnson se va con la impresora rota.

✅ Rodriguez: Límites sanos, +5% eficiencia
⚠️ Johnson: -5 relación (molesto)
⚠️ Rodriguez-Johnson: -5 relación mutua

Chen (escuchando): "Crecimiento personal, Rodriguez."

Rodriguez: "Marco estaría... bueno, él no está. Pero estaría orgulloso."`,
                chainEvent: null
            },
            overengineer: {
                flag: 'rodriguez_printer_incident',
                resourceDeltas: { energy: -40, data: -20 },
                affectedCrew: {
                    'Ing. Rodriguez': {
                        trauma: null,
                        emotionalState: 'maniac_creator',
                        skillModifier: 1.15,
                        personalThought: 'Lo hice otra vez. La impresora ahora hace 6 cosas que Johnson no pidió. Pero es PERFECTA.',
                        relationships: {
                            'Lt. Johnson': 10,
                            'Chef Patel': 10
                        }
                    },
                    'Lt. Johnson': {
                        emotionalState: 'confused_grateful',
                        personalThought: 'Pedí una impresora. Ahora tengo... ¿una estación de fabricación? Gracias... creo.',
                        relationships: {
                            'Ing. Rodriguez': 10
                        }
                    },
                    'Chef Patel': {
                        emotionalState: 'excited',
                        personalThought: '¡Rodriguez hizo una impresora que hace COMIDA! Este tipo es un genio loco.',
                        relationships: {
                            'Ing. Rodriguez': 10
                        }
                    }
                },
                narrative: `[8 horas después]

Rodriguez: "¡TERMINÉ!"

[La "impresora" ahora tiene]:
✅ Impresión 3D (lo que pidió Johnson)
✅ Escáner molecular
✅ Replicador de comida básica
✅ Cargador inalámbrico
✅ Cafetera integrada
✅ Reproduce música

Johnson: "Yo solo quería imprimir formularios..."
Rodriguez: "Ahora TAMBIÉN haces waffles."

✅ -40 Energía, -20 Datos
✅ Rodriguez: +15% eficiencia (modo genio)
✅ Johnson: +10 relación (impresionado)
✅ Patel: +10 relación (ama la comida extra)

Patel: "¡Rodriguez, eres mi héroe!"
Rodriguez: "Marco nunca lo entendió. Pero ustedes sí."

[La laptop de Marco sigue en algún lugar...]
[Haciendo café probablemente.]`,
                chainEvent: null
            }
        }
    },

    // EVENTO 4: LT. JOHNSON
    {
        id: 'johnson_event_01',
        character: 'Lt. Johnson',
        icon: '📧',
        title: 'Mamá llamó (Pero es del Pasado)',
        trigger: {
            minTranche: 4,
            maxTranche: 8,
            requiredAlive: ['Lt. Johnson'],
            requiredAwake: ['Lt. Johnson'],
            requiredAsleep: [],
            resourceMin: {},
            resourceMax: {},
            requiredFlags: [],
            blockedByFlags: ['johnson_message_crisis'],
            probability: 0.5
        },
        description: `Johnson tiene un mensaje cuántico sin abrir hace 3 días.

"Comandante, es de mi mamá. Fue enviado hace 15 años luz.
Ella tiene 71 ahora. Probablemente está muerta."

"Puedo abrirlo y llorar durante 2 semanas como un bebé,
o borrarlo y fingir que nunca existió."

"¿Sabías que en el espacio no puedes llorar bien?
Las lágrimas flotan. Es muy estúpido."

"Igual aquí. Tenemos gravedad artificial pero sigo llorando como idiota."`,

        optionA: {
            label: '📧 Necesito saber si todavía me recuerda. O si ya me olvidó.',
            requires: {},
            costs: {},
            wakeUp: [],
            result: 'gamble'
        },

        optionB: {
            label: '🗑️ Ignorance is bliss. Además, es historia antigua. Literalmente.',
            requires: {},
            costs: { entertainment: 30 },
            wakeUp: [],
            result: 'repress'
        },

        outcomes: {
            gamble: {
                successRate: 0.5,
                success: {
                    flag: 'johnson_mother_alive',
                    resourceDeltas: {},
                    affectedCrew: {
                        'Lt. Johnson': {
                            trauma: null,
                            emotionalState: 'motivated',
                            skillModifier: 1.2,
                            personalThought: 'Mamá sigue viva. Vale la pena llegar.',
                            relationships: {
                                'Capitán Silva': 15,
                                'Dra. Chen': 10,
                                'Ing. Rodriguez': 10,
                                'Chef Patel': 15
                            }
                        },
                        'Chef Patel': {
                            emotionalState: 'caring',
                            personalThought: 'Johnson necesita apoyo. Le prepararé algo especial.',
                            relationships: {
                                'Lt. Johnson': 10
                            }
                        }
                    },
                    narrative: `Mamá (sonriendo): "Hijo, tengo 71. Tu padre murió.
Pero estoy bien. Te veo en las noticias.
Llega a salvo. Te amo."

Johnson llora (lágrimas buenas).

✅ Johnson: +20% eficiencia
✅ +15 relación con TODOS
Patel le hace su comida favorita.`,
                    chainEvent: null
                },
                failure: {
                    flag: 'johnson_mother_dead',
                    resourceDeltas: {},
                    affectedCrew: {
                        'Lt. Johnson': {
                            trauma: 'mother_dead',
                            emotionalState: 'devastated',
                            skillModifier: 0.8,
                            restDelta: -20,
                            entertainmentDelta: -15,
                            personalThought: 'Mamá murió sola. Yo elegí las estrellas. Nunca me perdonaré.',
                            relationships: {
                                'Capitán Silva': -5
                            }
                        },
                        'Dra. Chen': {
                            emotionalState: 'concerned',
                            personalThought: 'Johnson necesita apoyo psicológico. Debo monitorearlo.',
                            relationships: {
                                'Lt. Johnson': 5
                            }
                        }
                    },
                    narrative: `Voz robótica: "María Johnson falleció hace 2 años.
Mensaje póstumo: 'Quería verte una vez más. Lo siento.'"

Johnson colapsa.

⚠️ Johnson: Trauma, -20% eficiencia
⚠️ -20 Descanso, -15 Entretenimiento
Silva: "Lo siento, chico."
Johnson: "Ya no importa llegar..."`,
                    chainEvent: null
                }
            },
            repress: {
                flag: 'johnson_message_deleted',
                resourceDeltas: { entertainment: -30 },
                affectedCrew: {
                    'Lt. Johnson': {
                        trauma: 'repressed_grief',
                        emotionalState: 'distant',
                        skillModifier: 0.9,
                        entertainmentDelta: -30,
                        personalThought: 'No sé si mamá está viva. Prefiero no saberlo. ¿Eso me hace cobarde?',
                        relationships: {
                            'Dra. Chen': -5
                        }
                    },
                    'Dra. Chen': {
                        emotionalState: 'worried',
                        personalThought: 'Johnson está reprimiendo algo grave. Esto explotará eventualmente.',
                        relationships: {
                            'Lt. Johnson': -5
                        }
                    }
                },
                narrative: `Johnson presiona "DELETE".

Johnson: "Ya pasó."
Silva: "¿Seguro?"
Johnson: "No. Pero es más fácil así."

Durante semanas actúa normal. Pero está... raro.

⚠️ -30 Entretenimiento
⚠️ Johnson: -10% eficiencia
⚠️ Breakdown garantizado en 2-3 tramos
Chen: "Reprimir trauma nunca funciona."`,
                chainEvent: null
            }
        }
    },

    // EVENTO 5: CHEF PATEL
    {
        id: 'patel_event_01',
        character: 'Chef Patel',
        icon: '🌱',
        title: 'Gordon Ramsay Espacial',
        trigger: {
            minTranche: 3,
            maxTranche: 8,
            requiredAlive: ['Chef Patel'],
            requiredAwake: ['Chef Patel'],
            requiredAsleep: [],
            resourceMin: { food: 100 },
            resourceMax: {},
            requiredFlags: [],
            blockedByFlags: ['patel_greenhouse_crisis'],
            probability: 0.4
        },
        description: `Chef Patel irrumpe en el puente con las manos llenas de tierra y cara de funeral.

"Comandante, las plantas están jodidas. Agua contaminada.
Metales pesados. Básicamente cultivé verduras radioactivas."

"Puedo intentar 'curarlas' con química dudosa,
o quemarlas todas y comer proteína en polvo sabor cartón
durante 6 meses."

"También puedo rezar. Pero nunca funciona en el espacio."`,

        optionA: {
            label: '🧪 Ciencia > Dios. Voy a drogar estas plantas hasta que sean comestibles.',
            requires: { medicine: 20, water: 30 },
            costs: { medicine: 20, water: 30, energy: 15 },
            wakeUp: [],
            result: 'gamble'
        },

        optionB: {
            label: '🔥 Fuck it. QUÉMALO TODO. Volveremos a la dieta de astronauta de 1960.',
            requires: {},
            costs: { food: 150, energy: 20 },
            wakeUp: [],
            result: 'safe'
        },

        outcomes: {
            gamble: {
                successRate: 0.65,
                success: {
                    flag: 'patel_greenhouse_saved',
                    resourceDeltas: { food: 100, data: 50 },
                    affectedCrew: {
                        'Chef Patel': {
                            trauma: null,
                            emotionalState: 'proud',
                            skillModifier: 1.1,
                            personalThought: 'Mis nietos comerán ensalada espacial. Soy una leyenda.',
                            relationships: {
                                'Capitán Silva': 10,
                                'Dra. Chen': 5
                            }
                        }
                    },
                    narrative: `Semana 3: Patel prueba una lechuga. No muere.

✅ +100 Alimentos
✅ +50 Datos científicos
✅ Patel: +10% eficiencia
Silva: "Impresionante, chef."
Chen: "Estadísticamente imposible. Pero bueno."`,
                    chainEvent: null
                },
                failure: {
                    flag: 'patel_greenhouse_failed',
                    resourceDeltas: { food: -150, medicine: -20, water: -30 },
                    affectedCrew: {
                        'Chef Patel': {
                            trauma: 'incompetent_cook',
                            emotionalState: 'devastated',
                            skillModifier: 0.8,
                            personalThought: 'Soy un fraude. Mis nietos me odiarán.',
                            relationships: {
                                'Capitán Silva': -15,
                                'Dra. Chen': -15,
                                'Lt. Johnson': -15,
                                'Ing. Rodriguez': -15
                            }
                        }
                    },
                    narrative: `Patel: "Las plantas mutaron. Ahora son tóxicas."
Silva: "..."

❌ -150 Alimentos
❌ -20 Medicina
❌ -30 Agua
⚠️ Patel: -20% eficiencia, trauma
⚠️ TODOS: -15 relación
Johnson: "Casi nos envenenas, viejo."`,
                    chainEvent: null
                }
            },
            safe: {
                flag: 'patel_greenhouse_burned',
                resourceDeltas: { food: -150, energy: -20 },
                affectedCrew: {
                    'Chef Patel': {
                        trauma: 'guilt',
                        emotionalState: 'depressed',
                        skillModifier: 0.9,
                        restDelta: -15,
                        personalThought: 'Mis nietos preguntarán por qué fui tan cobarde.',
                        relationships: {
                            'Capitán Silva': -5,
                            'Lt. Johnson': -10
                        }
                    },
                    'ALL_CREW': {
                        entertainmentDelta: -10
                    }
                },
                narrative: `Patel observa las llamas consumir su jardín.

6 meses de proteína sintética sabor "pollo" (es cartón):

❌ -150 Alimentos
⚠️ TODOS: -10 Entretenimiento
⚠️ Patel: -15 Descanso
Johnson: "Prefiero morir de hambre."
✅ Nadie se intoxicó (aún)`,
                chainEvent: null
            }
        }
    },

    // EVENTO PATEL 02: GORDON RAMSAY A LAS 3 AM
    {
        id: 'patel_event_02',
        character: 'Chef Patel',
        icon: '🍕',
        title: 'Gordon Ramsay a las 3 AM',
        trigger: {
            minTranche: 2,
            maxTranche: 8,
            requiredAlive: ['Chef Patel'],
            requiredAwake: [],
            requiredAsleep: ['Chef Patel'],
            resourceMin: { food: 50 },
            resourceMax: {},
            requiredFlags: [],
            blockedByFlags: ['patel_woken_by_hungry_crew'],
            probability: 0.4
        },
        description: `3:47 AM. Johnson irrumpe en la cápsula de Patel y lo zarandea.

Johnson está harto de comer proteína sintética que "sabe a cartón mojado con esperanzas rotas". Silva lo respalda por radio.

Patel mira el reloj. Dos opciones: mandarlos al carajo y dormir 4 horas más, o levantarse y cocinar como un chef Michelin en pijama.

"¿Me despertaste... por HAMBRE?"`,

        optionA: {
            label: '😴 "Váyanse al carajo. Coman cartón." (Sigue durmiendo)',
            requires: {},
            costs: {},
            wakeUp: [],
            result: 'sleep'
        },

        optionB: {
            label: '👨‍🍳 "Está bien, pendejos. Menú 5 estrellas a las 4 AM."',
            requires: { food: 30, water: 10 },
            costs: { food: 30, water: 10, energy: 20 },
            wakeUp: ['Chef Patel'],
            result: 'cook'
        },

        outcomes: {
            sleep: {
                flag: 'patel_refused_to_cook',
                resourceDeltas: {},
                affectedCrew: {
                    'Chef Patel': {
                        trauma: null,
                        emotionalState: 'well_rested',
                        skillModifier: 1.0,
                        restDelta: 20,
                        personalThought: 'Dormí bien. Que se jodan los hambrientos. Mis necesidades también importan.',
                        relationships: {
                            'Lt. Johnson': -15,
                            'Capitán Silva': -10
                        }
                    },
                    'Lt. Johnson': {
                        trauma: null,
                        emotionalState: 'hangry',
                        skillModifier: 0.9,
                        entertainmentDelta: -15,
                        personalThought: 'Patel es un egoísta. Cuando tenga hambre real, no le ayudaré.',
                        relationships: {
                            'Chef Patel': -15
                        }
                    },
                    'Capitán Silva': {
                        trauma: null,
                        emotionalState: 'disappointed',
                        skillModifier: 0.95,
                        entertainmentDelta: -10,
                        personalThought: 'Patel puso su comodidad sobre el equipo. Decepcionante.',
                        relationships: {
                            'Chef Patel': -10
                        }
                    }
                },
                narrative: `Patel responde "No" y vuelve a dormir.

Johnson y Silva se quedan mirando la puerta cerrada mientras comen cartón.

✅ Patel: +20 Descanso (durmió como bebé)
❌ Johnson: -15 Entretenimiento, -10% eficiencia (HANGRY)
❌ Silva: -10 Entretenimiento
⚠️ Relaciones: Johnson -15, Silva -10

Johnson promete recordar esto "cuando Patel necesite algo de mí".`,
                chainEvent: null
            },
            cook: {
                flag: 'patel_midnight_chef',
                resourceDeltas: { food: -30, water: -10, energy: -20 },
                affectedCrew: {
                    'Chef Patel': {
                        trauma: null,
                        emotionalState: 'tired_but_proud',
                        skillModifier: 1.1,
                        restDelta: -20,
                        personalThought: 'Cociné a las 4 AM en pijama. Mis nietos dirán: "Abuela era una santa."',
                        relationships: {
                            'Lt. Johnson': 20,
                            'Capitán Silva': 15,
                            'Dra. Chen': 10,
                            'Ing. Rodriguez': 10
                        }
                    },
                    'Lt. Johnson': {
                        trauma: null,
                        emotionalState: 'grateful_and_full',
                        skillModifier: 1.1,
                        entertainmentDelta: 25,
                        personalThought: 'Patel es un santo. Le debo mi vida. O al menos mi felicidad.',
                        relationships: {
                            'Chef Patel': 20
                        }
                    },
                    'Capitán Silva': {
                        trauma: null,
                        emotionalState: 'satisfied',
                        skillModifier: 1.05,
                        entertainmentDelta: 20,
                        personalThought: 'Patel sacrificó su descanso por nosotros. Buen tripulante.',
                        relationships: {
                            'Chef Patel': 15
                        }
                    },
                    'Dra. Chen': {
                        trauma: null,
                        emotionalState: 'impressed',
                        skillModifier: 1.0,
                        entertainmentDelta: 15,
                        personalThought: 'El aroma me despertó. Valió la pena.',
                        relationships: {
                            'Chef Patel': 10
                        }
                    },
                    'Ing. Rodriguez': {
                        trauma: null,
                        emotionalState: 'happy',
                        skillModifier: 1.0,
                        entertainmentDelta: 15,
                        personalThought: 'Patel cocina mejor que Marco. Y no me juzga.',
                        relationships: {
                            'Chef Patel': 10
                        }
                    }
                },
                narrative: `2 horas después, Patel sirve risotto de hongos deshidratados con trufa sintética.

Johnson llora. Silva admite que no había comido así desde la Tierra. El aroma despierta a Chen y Rodriguez, que se unen a la mesa.

✅ Patel: +10% eficiencia, -20 Descanso
✅ TODOS: +15-25 Entretenimiento
✅ Relaciones: +10-20 con todos

"Patel, eres un héroe."
"Cállate y come."`,
                chainEvent: null
            }
        }
    },

    // EVENTO PATEL 03: YOUSPACETUBE COOKING FAIL
    {
        id: 'patel_event_03',
        character: 'Chef Patel',
        icon: '📺',
        title: 'YouSpaceTube Cooking Fail',
        trigger: {
            minTranche: 3,
            maxTranche: 9,
            requiredAlive: ['Chef Patel'],
            requiredAwake: ['Chef Patel'],
            requiredAsleep: [],
            resourceMin: { food: 80, data: 30 },
            resourceMax: {},
            requiredFlags: [],
            blockedByFlags: ['patel_youtube_disaster'],
            probability: 0.35
        },
        description: `Patel entra con una tablet y una sonrisa sospechosa.

Ha estado viendo YouSpaceTube. Encontró una receta de "Sushi Espacial Fermentado con Algas Criogénicas" con 2 millones de views.

Chen menciona "muchas razones médicas" por las que es mala idea. Rodriguez pregunta la probabilidad de intoxicación.

Patel responde: "Sí."`,

        optionA: {
            label: '🍣 "YOLO culinario. Somos exploradores o cobardes."',
            requires: { food: 50, data: 30 },
            costs: { food: 50, data: 30 },
            wakeUp: [],
            result: 'experiment'
        },

        optionB: {
            label: '😐 "Mejor no. Sigo con mi menú aburrido pero seguro."',
            requires: {},
            costs: {},
            wakeUp: [],
            result: 'boring'
        },

        outcomes: {
            experiment: {
                successRate: 0.45,
                success: {
                    flag: 'patel_youtube_success',
                    resourceDeltas: { data: 50 },
                    affectedCrew: {
                        'Chef Patel': {
                            trauma: null,
                            emotionalState: 'culinary_genius',
                            skillModifier: 1.15,
                            personalThought: 'YouSpaceTube me enseñó más que 20 años de cocina tradicional. El futuro es ahora.',
                            relationships: {
                                'Lt. Johnson': 15,
                                'Capitán Silva': 10,
                                'Dra. Chen': 10,
                                'Ing. Rodriguez': 15
                            }
                        },
                        'Lt. Johnson': {
                            trauma: null,
                            emotionalState: 'mind_blown',
                            skillModifier: 1.0,
                            entertainmentDelta: 20,
                            personalThought: 'Patel acaba de reinventar la comida espacial. Genio.',
                            relationships: { 'Chef Patel': 15 }
                        },
                        'Capitán Silva': {
                            trauma: null,
                            emotionalState: 'impressed',
                            skillModifier: 1.0,
                            entertainmentDelta: 15,
                            personalThought: 'Arriesgó y ganó. Respeto.',
                            relationships: { 'Chef Patel': 10 }
                        },
                        'Dra. Chen': {
                            trauma: null,
                            emotionalState: 'surprised',
                            skillModifier: 1.0,
                            entertainmentDelta: 15,
                            personalThought: 'Estadísticamente no debería haber funcionado. Pero funcionó.',
                            relationships: { 'Chef Patel': 10 }
                        },
                        'Ing. Rodriguez': {
                            trauma: null,
                            emotionalState: 'delighted',
                            skillModifier: 1.0,
                            entertainmentDelta: 20,
                            personalThought: 'Esto sabe mejor que cualquier cosa que Marco cocinaba.',
                            relationships: { 'Chef Patel': 15 }
                        }
                    },
                    narrative: `Patel sirve unos rolls verdes brillantes. Johnson pregunta si es comestible.

Todos prueban. Silencio. Luego explosión de elogios.

Chen admite que "no tiene sentido médico, pero está delicioso".

✅ Patel: +15% eficiencia
✅ TODOS: +15-20 Entretenimiento
✅ +50 Datos científicos
✅ Relaciones: +10-15 con todos

"YouSpaceTube, bebé."`,
                    chainEvent: null
                },
                failure: {
                    flag: 'patel_youtube_disaster',
                    resourceDeltas: { medicine: -30, water: -20 },
                    affectedCrew: {
                        'Chef Patel': {
                            trauma: 'culinary_shame',
                            emotionalState: 'humiliated',
                            skillModifier: 0.85,
                            personalThought: 'Enveneé a todos. YouSpaceTube me mintió. Nunca confiaré en internet otra vez.',
                            relationships: {
                                'Lt. Johnson': -10,
                                'Capitán Silva': -10,
                                'Dra. Chen': -15,
                                'Ing. Rodriguez': -10
                            }
                        },
                        'Lt. Johnson': {
                            trauma: null,
                            emotionalState: 'sick',
                            skillModifier: 0.85,
                            healthDelta: -15,
                            wasteDelta: 40,
                            personalThought: 'Patel casi me mata. No volveré a confiar en su "experimentación".',
                            relationships: { 'Chef Patel': -10 }
                        },
                        'Capitán Silva': {
                            trauma: null,
                            emotionalState: 'sick',
                            skillModifier: 0.85,
                            healthDelta: -15,
                            wasteDelta: 40,
                            personalThought: 'Patel envenenó a toda la tripulación. Inaceptable.',
                            relationships: { 'Chef Patel': -10 }
                        },
                        'Dra. Chen': {
                            trauma: null,
                            emotionalState: 'furious_and_sick',
                            skillModifier: 0.8,
                            healthDelta: -20,
                            wasteDelta: 50,
                            personalThought: 'Le DIJE que era mala idea. Ahora tengo intoxicación alimentaria. Idiota.',
                            relationships: { 'Chef Patel': -15 }
                        },
                        'Ing. Rodriguez': {
                            trauma: null,
                            emotionalState: 'sick',
                            skillModifier: 0.85,
                            healthDelta: -15,
                            wasteDelta: 40,
                            personalThought: 'Marco cocinaba mal, pero al menos no me envenenaba.',
                            relationships: { 'Chef Patel': -10 }
                        }
                    },
                    narrative: `10 minutos después todos corren a los baños. Caos gastrointestinal masivo.

Chen grita desde el baño que le había advertido.

❌ TODOS: -15-20 Salud, +40-50 Higiene crítica
❌ -30 Medicina, -20 Agua
⚠️ Patel: Trauma, -15% eficiencia
⚠️ Relaciones: -10-15 con todos

"Nunca. Más. YouSpaceTube."`,
                    chainEvent: null
                }
            },
            boring: {
                flag: 'patel_played_safe_again',
                resourceDeltas: {},
                affectedCrew: {
                    'Chef Patel': {
                        trauma: null,
                        emotionalState: 'boring',
                        skillModifier: 0.95,
                        personalThought: 'Jugué seguro otra vez. Mis nietos preguntarán: "¿Por qué eras tan aburrida, abuela?"',
                        relationships: {}
                    },
                    'Lt. Johnson': {
                        trauma: null,
                        emotionalState: 'disappointed',
                        skillModifier: 1.0,
                        entertainmentDelta: -5,
                        personalThought: 'Patel le tiene miedo al riesgo. Aburrido.',
                        relationships: { 'Chef Patel': -5 }
                    }
                },
                narrative: `Patel guarda la tablet y sirve menú normal.

Intercambio entre Johnson y Patel:
"Cobarde."
"Vivo."
"Aburrido."
"Con intestinos funcionales."

✅ Nadie se intoxicó
⚠️ Patel: -5% eficiencia
⚠️ Johnson: -5 Entretenimiento, -5 relación

Chen aprueba la decisión. Patel se pregunta por qué se siente como un fracaso.`,
                chainEvent: null
            }
        }
    },

    // EVENTO PATEL 04: SPACE TRUFFLE O DEATH FUNGUS
    {
        id: 'patel_event_04',
        character: 'Chef Patel',
        icon: '👽',
        title: 'Space Truffle o Death Fungus',
        trigger: {
            minTranche: 4,
            maxTranche: 9,
            requiredAlive: ['Chef Patel'],
            requiredAwake: ['Chef Patel'],
            requiredAsleep: [],
            resourceMin: {},
            resourceMax: {},
            requiredFlags: [],
            blockedByFlags: ['patel_alien_food'],
            probability: 0.3
        },
        description: `Patel trae un contenedor sellado con algo que encontraron flotando cerca de la nave.

Huele a trufa, queso añejo, o quizás a "sueños". Chen lo escanea: orgánico, origen desconocido, posiblemente tóxico.

Rodriguez pregunta probabilidad de muerte. Chen responde "alta". Patel pregunta probabilidad de sabor increíble.

"...También alta."`,

        optionA: {
            label: '👨‍🍳 "Vine a explorar. COCÍNALO." (Riesgo: muerte)',
            requires: {},
            costs: { energy: 20 },
            wakeUp: [],
            result: 'cook_alien'
        },

        optionB: {
            label: '🚮 "Al espacio. No vale la pena morir por comida."',
            requires: {},
            costs: {},
            wakeUp: [],
            result: 'trash_it'
        },

        outcomes: {
            cook_alien: {
                successRate: 0.55,
                success: {
                    flag: 'patel_alien_delicacy',
                    resourceDeltas: { food: 150, data: 100 },
                    affectedCrew: {
                        'Chef Patel': {
                            trauma: null,
                            emotionalState: 'legendary_chef',
                            skillModifier: 1.2,
                            personalThought: 'Cociné comida alienígena. Soy el primer chef interestelar. MIS NIETOS ESCRIBIRÁN LIBROS SOBRE MÍ.',
                            relationships: {
                                'Lt. Johnson': 20,
                                'Capitán Silva': 15,
                                'Dra. Chen': 15,
                                'Ing. Rodriguez': 20
                            }
                        },
                        'Lt. Johnson': {
                            trauma: null,
                            emotionalState: 'transcendent',
                            skillModifier: 1.1,
                            entertainmentDelta: 30,
                            personalThought: 'Acabo de probar el universo. Patel es un dios.',
                            relationships: { 'Chef Patel': 20 }
                        },
                        'Capitán Silva': {
                            trauma: null,
                            emotionalState: 'mind_blown',
                            skillModifier: 1.05,
                            entertainmentDelta: 25,
                            personalThought: 'Este sabor... Elena, ojalá estuvieras aquí para probarlo.',
                            relationships: { 'Chef Patel': 15 }
                        },
                        'Dra. Chen': {
                            trauma: null,
                            emotionalState: 'scientifically_amazed',
                            skillModifier: 1.05,
                            entertainmentDelta: 25,
                            personalThought: 'Esto desafía toda mi comprensión de bioquímica. Fascinante.',
                            relationships: { 'Chef Patel': 15 }
                        },
                        'Ing. Rodriguez': {
                            trauma: null,
                            emotionalState: 'euphoric',
                            skillModifier: 1.1,
                            entertainmentDelta: 30,
                            personalThought: 'Esto sabe a... ¿felicidad? ¿Existe la felicidad en forma de sabor?',
                            relationships: { 'Chef Patel': 20 }
                        }
                    },
                    narrative: `El aroma del organismo cocinándose llena toda la nave.

Silencio total mientras todos prueban. Johnson llora. Silva describe el sabor como "el universo en un plato". Chen admite que es "imposible pero real".

✅ +150 Alimentos (se multiplicó al cocinarlo)
✅ +100 Datos científicos (DESCUBRIMIENTO HISTÓRICO)
✅ Patel: +20% eficiencia PERMANENTE
✅ TODOS: +25-30 Entretenimiento
✅ Relaciones: +15-20 con todos

"Patel, acabas de cambiar la gastronomía espacial para siempre."`,
                    chainEvent: null
                },
                failure: {
                    flag: 'patel_alien_poison',
                    resourceDeltas: { medicine: -50, water: -40 },
                    affectedCrew: {
                        'Chef Patel': {
                            trauma: 'poisoner',
                            emotionalState: 'devastated',
                            skillModifier: 0.7,
                            healthDelta: -25,
                            personalThought: 'Enveneé a todos con comida alien. Soy el peor chef de la historia humana. Mis nietos me repudiarán.',
                            relationships: {
                                'Lt. Johnson': -20,
                                'Capitán Silva': -15,
                                'Dra. Chen': -20,
                                'Ing. Rodriguez': -15
                            }
                        },
                        'Lt. Johnson': {
                            trauma: 'alien_poisoning',
                            emotionalState: 'dying',
                            skillModifier: 0.7,
                            healthDelta: -30,
                            wasteDelta: 60,
                            personalThought: 'Estoy muriendo. Patel me mató. Con comida alien. Qué muerte más estúpida.',
                            relationships: { 'Chef Patel': -20 }
                        },
                        'Capitán Silva': {
                            trauma: null,
                            emotionalState: 'critically_ill',
                            skillModifier: 0.75,
                            healthDelta: -25,
                            wasteDelta: 50,
                            personalThought: 'Patel casi mata a toda la tripulación. Inaceptable.',
                            relationships: { 'Chef Patel': -15 }
                        },
                        'Dra. Chen': {
                            trauma: null,
                            emotionalState: 'furious_medic',
                            skillModifier: 0.8,
                            healthDelta: -20,
                            wasteDelta: 50,
                            personalThought: 'LE DIJE QUE ERA TÓXICO. NADIE ESCUCHA A LA DOCTORA.',
                            relationships: { 'Chef Patel': -20 }
                        },
                        'Ing. Rodriguez': {
                            trauma: null,
                            emotionalState: 'sick_and_angry',
                            skillModifier: 0.75,
                            healthDelta: -25,
                            wasteDelta: 55,
                            personalThought: 'Marco me dejó, pero al menos nunca me envenenó con aliens.',
                            relationships: { 'Chef Patel': -15 }
                        }
                    },
                    narrative: `5 minutos después del primer bocado, Silva vomita. Caos absoluto.

Chen grita que es tóxico mientras trata a todos. Johnson delira: "Veo colores que no existen... ¿es esto la muerte?"

❌ TODOS: -20-30 Salud (envenenamiento severo)
❌ TODOS: +50-60 Higiene crítica
❌ -50 Medicina, -40 Agua
⚠️ Patel: Trauma severo, -30% eficiencia
⚠️ Relaciones: -15-20 con todos
⚠️ Johnson: Trauma "alien_poisoning"

Patel llora en posición fetal repitiendo "lo siento".`,
                    chainEvent: null
                }
            },
            trash_it: {
                flag: 'patel_missed_discovery',
                resourceDeltas: {},
                affectedCrew: {
                    'Chef Patel': {
                        trauma: null,
                        emotionalState: 'regretful',
                        skillModifier: 0.95,
                        personalThought: '¿Y si era el descubrimiento culinario del siglo? Nunca lo sabré. Cobarde.',
                        relationships: {}
                    },
                    'Dra. Chen': {
                        trauma: null,
                        emotionalState: 'relieved',
                        skillModifier: 1.0,
                        personalThought: 'Gracias a Dios alguien escuchó a la doctora por una vez.',
                        relationships: { 'Chef Patel': 5 }
                    },
                    'Lt. Johnson': {
                        trauma: null,
                        emotionalState: 'disappointed',
                        skillModifier: 1.0,
                        entertainmentDelta: -10,
                        personalThought: 'Patel eligió seguridad sobre aventura. Aburrido.',
                        relationships: { 'Chef Patel': -10 }
                    }
                },
                narrative: `Patel tira el organismo al espacio y lo mira alejarse por la ventana.

Chen aprueba. Johnson lo llama cobarde. Rodriguez menciona "intestinos funcionales".

✅ Nadie murió
⚠️ Patel: -5% eficiencia (remordimiento)
⚠️ Chen: +5 relación
⚠️ Johnson: -10 relación
❌ Oportunidad perdida para siempre

Esa noche Patel no puede dormir. ¿Y si era el descubrimiento del siglo? ¿Y si sus nietos preguntan por qué fue tan cobarde?

Nunca lo sabrá.`,
                chainEvent: null
            }
        }
    },

    // EVENTOS GENERALES
    {
        id: 'general_event_01',
        character: 'Tripulación',
        icon: '🛰️',
        title: 'Basura Espacial VIP',
        trigger: {
            minTranche: 1,
            maxTranche: 3,
            requiredAlive: [],
            requiredAwake: ['Capitán Silva'],
            requiredAsleep: [],
            resourceMin: { energy: 50 },
            resourceMax: {},
            requiredFlags: [],
            blockedByFlags: ['space_junk_looted'],
            probability: 0.5
        },
        description: `Los sensores detectan un satélite abandonado de la Primera Expedición flotando a 2 km.

Johnson menciona que puede tener piezas valiosas. Chen advierte sobre posible contaminación radiactiva. Silva añade que también podría explotar.

Rodriguez calcula que recuperarlo costaría energía, pero podría contener datos científicos, piezas de repuesto, o absolutamente nada.

"Es como una caja misteriosa del espacio. ¿Tesoro o trampa?"`,

        optionA: {
            label: '🎁 "Fortune favors the bold. TRÁIGANLO A BORDO."',
            requires: { energy: 50 },
            costs: { energy: 50 },
            wakeUp: ['Ing. Rodriguez'],
            result: 'loot'
        },

        optionB: {
            label: '🚫 "No vale la pena el riesgo. Sigamos la ruta."',
            requires: {},
            costs: {},
            wakeUp: [],
            result: 'ignore'
        },

        outcomes: {
            loot: {
                successRate: 0.6,
                success: {
                    flag: 'space_junk_treasure',
                    resourceDeltas: { data: 150, medicine: 50, energy: 100 },
                    affectedCrew: {
                        'Lt. Johnson': {
                            trauma: null,
                            emotionalState: 'excited',
                            skillModifier: 1.05,
                            entertainmentDelta: 15,
                            personalThought: 'Aposté y gané. La fortuna favorece a los audaces.',
                            relationships: { 'Capitán Silva': 10 }
                        },
                        'Ing. Rodriguez': {
                            trauma: null,
                            emotionalState: 'satisfied',
                            skillModifier: 1.0,
                            entertainmentDelta: 10,
                            personalThought: 'Recuperar basura espacial fue más satisfactorio de lo esperado.',
                            relationships: { 'Lt. Johnson': 5 }
                        },
                        'Capitán Silva': {
                            trauma: null,
                            emotionalState: 'pleased',
                            skillModifier: 1.0,
                            personalThought: 'Buena decisión. A veces el riesgo vale la pena.',
                            relationships: { 'Lt. Johnson': 5 }
                        }
                    },
                    narrative: `Rodriguez y Johnson realizan EVA para recuperar el satélite.

Dentro encuentran banco de baterías intacto, kit médico sellado, y archivos de la Primera Expedición.

✅ +150 Datos científicos
✅ +50 Medicina
✅ +100 Energía (baterías recuperadas)
✅ Johnson: +5% eficiencia, +15 Entretenimiento
✅ Rodriguez: +10 Entretenimiento
✅ Relaciones mejoradas

"Black Friday espacial. Todo gratis."`,
                    chainEvent: null
                },
                failure: {
                    flag: 'space_junk_disaster',
                    resourceDeltas: { energy: -50, oxygen: -30 },
                    affectedCrew: {
                        'Lt. Johnson': {
                            trauma: null,
                            emotionalState: 'disappointed',
                            skillModifier: 0.95,
                            healthDelta: -10,
                            personalThought: 'Aposté y perdí. La próxima vez escucharé a Chen.',
                            relationships: { 'Dra. Chen': 5 }
                        },
                        'Ing. Rodriguez': {
                            trauma: null,
                            emotionalState: 'frustrated',
                            skillModifier: 0.95,
                            restDelta: -10,
                            personalThought: 'Desperdicié energía en basura literal. Frustrante.',
                            relationships: {}
                        },
                        'Dra. Chen': {
                            trauma: null,
                            emotionalState: 'smug',
                            skillModifier: 1.0,
                            personalThought: 'Les advertí. Nadie escucha a la doctora.',
                            relationships: { 'Lt. Johnson': 5 }
                        },
                        'Capitán Silva': {
                            trauma: null,
                            emotionalState: 'regretful',
                            skillModifier: 1.0,
                            personalThought: 'Mala apuesta. Desperdicié recursos.',
                            relationships: {}
                        }
                    },
                    narrative: `Rodriguez y Johnson abren el satélite. Interior: vacío completo.

Solo encuentran una nota: "Los primeros ya tomaron lo bueno. -Tripulación Alpha"

El satélite además liberó gas tóxico residual al abrirse.

❌ -50 Energía (gastada en recuperación)
❌ -30 Oxígeno (contaminación)
⚠️ Johnson: -5% eficiencia, -10 Salud
⚠️ Rodriguez: -10 Descanso

Chen comenta que lo había advertido.`,
                    chainEvent: null
                }
            },
            ignore: {
                flag: 'space_junk_ignored',
                resourceDeltas: {},
                affectedCrew: {
                    'Lt. Johnson': {
                        trauma: null,
                        emotionalState: 'regretful',
                        skillModifier: 1.0,
                        entertainmentDelta: -5,
                        personalThought: '¿Y si había tesoro? Nunca lo sabré.',
                        relationships: {}
                    },
                    'Dra. Chen': {
                        trauma: null,
                        emotionalState: 'relieved',
                        skillModifier: 1.0,
                        personalThought: 'Decisión prudente. Evitamos riesgo innecesario.',
                        relationships: {}
                    }
                },
                narrative: `La nave continúa su ruta. El satélite se aleja en la oscuridad.

Johnson lo observa por la ventana con expresión melancólica.

✅ Recursos conservados
⚠️ Johnson: -5 Entretenimiento (curiosidad insatisfecha)

Esa noche, Johnson sueña con tesoros espaciales perdidos.`,
                chainEvent: null
            }
        }
    },

    {
        id: 'general_event_02',
        character: 'Tripulación',
        icon: '📦',
        title: 'La Cápsula del Tiempo',
        trigger: {
            minTranche: 1,
            maxTranche: 3,
            requiredAlive: [],
            requiredAwake: ['Lt. Johnson'],
            requiredAsleep: [],
            resourceMin: { energy: 40 },
            resourceMax: {},
            requiredFlags: [],
            blockedByFlags: ['time_capsule_opened'],
            probability: 0.45
        },
        description: `Los sensores detectan una cápsula de la Tierra flotando en la ruta. Marcas: "Proyecto Génesis - No abrir hasta Nueva Tierra".

Johnson sugiere abrirla ahora. Patel menciona que podría contener música, películas, o mensajes de seres queridos.

Silva señala que también podría ser solo burocracia gubernamental del 2035.

Rodriguez calcula que abrirla consumiría energía, pero el boost moral podría valer la pena.

"Kinder Sorpresa espacial. ¿Juguete o decepción?"`,

        optionA: {
            label: '🎁 "ÁBRELA. Necesitamos algo que nos recuerde a casa."',
            requires: { energy: 40 },
            costs: { energy: 40 },
            wakeUp: [],
            result: 'open'
        },

        optionB: {
            label: '📋 "Respetemos las instrucciones. Esperamos a Nueva Tierra."',
            requires: {},
            costs: {},
            wakeUp: [],
            result: 'wait'
        },

        outcomes: {
            open: {
                successRate: 0.7,
                success: {
                    flag: 'time_capsule_treasure',
                    resourceDeltas: { energy: -40, data: 80 },
                    affectedCrew: {
                        'Lt. Johnson': {
                            trauma: null,
                            emotionalState: 'nostalgic_happy',
                            skillModifier: 1.1,
                            entertainmentDelta: 30,
                            personalThought: 'La música de la Tierra. Mamá escuchaba esto. Vale la pena llegar.',
                            relationships: {
                                'Chef Patel': 10,
                                'Capitán Silva': 5
                            }
                        },
                        'Chef Patel': {
                            trauma: null,
                            emotionalState: 'emotional',
                            skillModifier: 1.05,
                            entertainmentDelta: 25,
                            personalThought: 'Recetas de mi abuela. Las cocinaré en Nueva Tierra para mis nietos.',
                            relationships: { 'Lt. Johnson': 10 }
                        },
                        'Capitán Silva': {
                            trauma: null,
                            emotionalState: 'sentimental',
                            skillModifier: 1.0,
                            entertainmentDelta: 20,
                            personalThought: 'Fotos de Elena y Sofía. Vale la pena cada sacrificio.',
                            relationships: { 'Lt. Johnson': 5 }
                        },
                        'Dra. Chen': {
                            trauma: null,
                            emotionalState: 'touched',
                            skillModifier: 1.0,
                            entertainmentDelta: 20,
                            personalThought: 'Mensajes de familias. Esto es por lo que luchamos.',
                            relationships: {}
                        },
                        'Ing. Rodriguez': {
                            trauma: null,
                            emotionalState: 'hopeful',
                            skillModifier: 1.0,
                            entertainmentDelta: 15,
                            personalThought: 'Música que Marco y yo escuchábamos. Buenos recuerdos.',
                            relationships: {}
                        }
                    },
                    narrative: `La cápsula contiene: música clásica de la Tierra, películas, recetas tradicionales, fotos de familias, y mensajes de esperanza.

Toda la tripulación pasa la noche viendo películas antiguas y llorando de nostalgia.

✅ +80 Datos (entretenimiento archivado)
✅ TODOS: +15-30 Entretenimiento (boost moral masivo)
✅ Eficiencia: +5-10% temporalmente
✅ Relaciones mejoradas

Patel cocina recetas de la cápsula. Johnson pone música de los 2020s.

"Vale la pena llegar."`,
                    chainEvent: null
                },
                failure: {
                    flag: 'time_capsule_disappointment',
                    resourceDeltas: { energy: -40 },
                    affectedCrew: {
                        'Lt. Johnson': {
                            trauma: null,
                            emotionalState: 'disappointed',
                            skillModifier: 0.95,
                            entertainmentDelta: -10,
                            personalThought: 'Abrimos la cápsula para... ¿informes fiscales? Decepcionante.',
                            relationships: {}
                        },
                        'Capitán Silva': {
                            trauma: null,
                            emotionalState: 'annoyed',
                            skillModifier: 1.0,
                            personalThought: 'Desperdiciamos energía en burocracia. Típico del gobierno.',
                            relationships: {}
                        },
                        'Chef Patel': {
                            trauma: null,
                            emotionalState: 'let_down',
                            skillModifier: 1.0,
                            entertainmentDelta: -5,
                            personalThought: 'Esperaba recetas. Encontré formularios del IRS.',
                            relationships: {}
                        }
                    },
                    narrative: `La cápsula contiene: informes fiscales del 2035, manuales de procedimientos gubernamentales, y 47 copias del mismo memo sobre "Protocolo de Cápsulas Temporales".

Silencio incómodo en la sala.

❌ -40 Energía (desperdiciada)
⚠️ TODOS: -5-10 Entretenimiento (decepción masiva)
⚠️ Johnson: -5% eficiencia (frustración)

Johnson mira la cápsula con odio: "¿Quién aprobó esto?"

Silva suspira: "Burócratas."

Nadie vuelve a hablar de la cápsula.`,
                    chainEvent: null
                }
            },
            wait: {
                flag: 'time_capsule_respected',
                resourceDeltas: {},
                affectedCrew: {
                    'Capitán Silva': {
                        trauma: null,
                        emotionalState: 'disciplined',
                        skillModifier: 1.0,
                        personalThought: 'Seguimos las reglas. Eso nos mantendrá con vida.',
                        relationships: {}
                    },
                    'Lt. Johnson': {
                        trauma: null,
                        emotionalState: 'curious',
                        skillModifier: 1.0,
                        entertainmentDelta: -5,
                        personalThought: '¿Qué habrá dentro? La curiosidad me mata.',
                        relationships: {}
                    }
                },
                narrative: `Silva decide respetar las instrucciones. La cápsula continúa su viaje hacia Nueva Tierra.

Johnson la observa alejarse con expresión melancólica.

✅ Energía conservada
⚠️ Johnson: -5 Entretenimiento (curiosidad insatisfecha)

Durante semanas, la tripulación especula sobre el contenido.

Johnson: "¿Y si había música de mamá?"
Silva: "O formularios del IRS."
Johnson: "Nunca lo sabremos."

La incertidumbre persiste.`,
                chainEvent: null
            }
        }
    }
];
