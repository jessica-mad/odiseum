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
        icon: '⚠️',
        title: '',
        trigger: {
            minTranche: 2,
            maxTranche: 12,
            requiredAlive: ['Ing. Rodriguez'],
            requiredAwake: [],
            requiredAsleep: [],
            resourceMin: {},
            resourceMax: {},
            requiredFlags: [],
            blockedByFlags: [],
            probability: 0
        },
        description: '',
        optionA: {
            label: '',
            requires: {},
            costs: {},
            wakeUp: [],
            result: 'good'
        },
        optionB: {
            label: '',
            requires: {},
            costs: {},
            wakeUp: [],
            result: 'bad'
        },
        outcomes: {
            good: {
                flag: 'rodriguez_good_decision',
                affectedCrew: {
                    'Ing. Rodriguez': {
                        trauma: null,
                        emotionalState: '',
                        skillModifier: 1,
                        relationships: {}
                    }
                },
                narrative: '',
                chainEvent: null
            },
            bad: {
                flag: 'rodriguez_bad_decision',
                affectedCrew: {
                    'Ing. Rodriguez': {
                        trauma: '',
                        emotionalState: '',
                        skillModifier: 1,
                        relationships: {}
                    }
                },
                narrative: '',
                chainEvent: null
            }
        }
    },

    // EVENTO 4: LT. JOHNSON
    {
        id: 'johnson_event_01',
        character: 'Lt. Johnson',
        icon: '🎯',
        title: 'El Atajo de Johnson',
        trigger: {
            minTranche: 2,
            maxTranche: 8,
            requiredAlive: ['Lt. Johnson'],
            requiredAwake: ['Lt. Johnson'],
            requiredAsleep: [],
            resourceMin: { fuel: 200 },
            resourceMax: {},
            requiredFlags: [],
            blockedByFlags: ['johnson_shortcut'],
            probability: 0.5
        },
        description: `Johnson irrumpe en el puente a las 2 AM con una sonrisa idiota.

"¡COMANDANTE! Encontré algo increíble."

Proyecta un mapa estelar: "Hay una corriente gravitacional justo aquí. Si la usamos, podríamos recortar 5 AÑOS del viaje."

Silva (medio dormido): "Johnson, son las 2 AM..."

Johnson: "¡CINCO AÑOS, capitán! Podría llegar a Nueva Tierra y todavía ser joven. Mis padres... podrían seguir vivos cuando regrese la señal."

Silva mira los cálculos. Son... arriesgados. Muy arriesgados.

Johnson (suplicante): "Tengo 29. No quiero tener 50 cuando lleguemos. Por favor."`,

        optionA: {
            label: '⚡ Usar el atajo - Velocidad máxima (60% éxito)',
            requires: {
                fuel: 150,
                energy: 100
            },
            costs: {
                fuel: 150,
                energy: 100
            },
            wakeUp: ['Ing. Rodriguez'],
            result: 'good'
        },

        optionB: {
            label: '🐌 Ruta estándar - Johnson tendrá 50+ al llegar',
            requires: {},
            costs: {
                data: 30
            },
            wakeUp: [],
            result: 'bad'
        },

        outcomes: {
            good: {
                successRate: 0.6,
                success: {
                    flag: 'johnson_shortcut_hero',
                    resourceDeltas: {
                        data: 200,
                        fuel: 50
                    },
                    affectedCrew: {
                        'Lt. Johnson': {
                            trauma: null,
                            emotionalState: 'euphoric_genius',
                            skillModifier: 1.2,
                            relationships: {
                                'Capitán Silva': 20,
                                'Ing. Rodriguez': 15,
                                'Chef Patel': 10,
                                'Dra. Chen': 5
                            }
                        },
                        'Ing. Rodriguez': {
                            trauma: null,
                            emotionalState: 'impressed',
                            skillModifier: 1.0,
                            relationships: {
                                'Lt. Johnson': 15
                            }
                        },
                        'Capitán Silva': {
                            trauma: null,
                            emotionalState: 'proud',
                            skillModifier: 1.0,
                            relationships: {
                                'Lt. Johnson': 10
                            }
                        },
                        'Chef Patel': {
                            trauma: null,
                            emotionalState: 'hopeful',
                            skillModifier: 1.0,
                            relationships: {
                                'Lt. Johnson': 10
                            }
                        },
                        'Dra. Chen': {
                            trauma: null,
                            emotionalState: 'amazed',
                            skillModifier: 1.0,
                            relationships: {
                                'Lt. Johnson': 5
                            }
                        }
                    },
                    narrative: `Johnson (en los controles): "Entrando a la corriente en 3... 2... 1..."

[La nave ACELERA]

Rodriguez: "¡Velocidad aumentando al 340%!"
Silva: "Johnson, ¿seguro de esto?"
Johnson (riendo): "¡CONFÍA EN MÍ, VIEJO!"

[15 minutos de velocidad extrema]

Sistema: "MANIOBRA EXITOSA. TIEMPO DE VIAJE REDUCIDO."

✅ **-5 AÑOS DEL VIAJE TOTAL** (REDUCCIÓN MASIVA)
✅ +200 Datos científicos (nueva ruta documentada)
✅ +50 Combustible (eficiencia inesperada)
✅ Johnson: +20% eficiencia permanente (genio confirmado)
✅ TODAS las relaciones con Johnson mejoran significativamente

Johnson (llorando de felicidad): "Mamá, papá... voy a llegar a tiempo. Todavía voy a llegar."

Silva (palmada en el hombro): "Buen trabajo, chico."

Chen: "Estadísticamente imposible. Pero lo hiciste."

**Bitácora de Johnson:** "Hoy me convertí en leyenda. Comeré gratis en Nueva Tierra."`,
                    chainEvent: null
                },
                failure: {
                    flag: 'johnson_shortcut_disaster',
                    resourceDeltas: {
                        fuel: -300,
                        energy: -400,
                        oxygen: -100,
                        water: -50
                    },
                    affectedCrew: {
                        'Lt. Johnson': {
                            trauma: 'reckless_guilt',
                            emotionalState: 'devastated_guilt',
                            skillModifier: 0.7,
                            healthDelta: -15,
                            relationships: {
                                'Capitán Silva': -25,
                                'Ing. Rodriguez': -15,
                                'Dra. Chen': -15,
                                'Chef Patel': -15
                            }
                        },
                        'Ing. Rodriguez': {
                            trauma: null,
                            emotionalState: 'traumatized',
                            skillModifier: 1.0,
                            restDelta: -30,
                            relationships: {
                                'Lt. Johnson': -15
                            }
                        },
                        'Capitán Silva': {
                            trauma: null,
                            emotionalState: 'furious',
                            skillModifier: 1.0,
                            relationships: {
                                'Lt. Johnson': -25
                            }
                        },
                        'Dra. Chen': {
                            trauma: null,
                            emotionalState: 'angry_scared',
                            skillModifier: 1.0,
                            relationships: {
                                'Lt. Johnson': -15
                            }
                        },
                        'Chef Patel': {
                            trauma: null,
                            emotionalState: 'shaken',
                            skillModifier: 1.0,
                            relationships: {
                                'Lt. Johnson': -15
                            }
                        }
                    },
                    narrative: `[ALARMAS ROJAS POR TODOS LADOS]

Johnson: "¿Por qué hay tantas alarmas?"
Rodriguez: "¡PORQUE NOS ESTAMOS MURIENDO!"
Silva: "¡JOHNSON, SÁCANOS DE AQUÍ!"

[CRASH. EXPLOSIÓN. CAOS.]

Sistema: "DAÑO CRÍTICO. MÚLTIPLES SISTEMAS COMPROMETIDOS."

❌ -300 Combustible (gastado en correcciones de emergencia)
❌ -400 Energía (sistemas sobrecargados)
❌ -100 Oxígeno (fuga)
❌ -50 Agua (sellado)
⚠️ Johnson: Trauma severo (reckless_guilt), -30% eficiencia
⚠️ Rodriguez: -30 Descanso (despertado para el apocalipsis)
❌ TODAS las relaciones con Johnson: -15 mínimo
❌ Silva específicamente: -25 (casi mata a todos)

Silva (furioso): "¿EN QUÉ DEMONIOS ESTABAS PENSANDO?"
Johnson (en shock): "Yo... yo solo quería..."
Chen: "Casi nos matas. A todos."
Rodriguez: "Me despertaste para ESTO?"

Johnson colapsa en el piso, llorando.

**Bitácora de Johnson:** "Maté a mis amigos. No merezco llegar a Nueva Tierra."

[Johnson desarrolla ansiedad paralizante. Ya no confía en sí mismo.]`,
                    chainEvent: 'johnson_event_02_redemption'
                }
            },

            bad: {
                flag: 'johnson_dream_denied',
                resourceDeltas: {
                    data: -30
                },
                affectedCrew: {
                    'Lt. Johnson': {
                        trauma: 'crushed_dreams',
                        emotionalState: 'bitter_resentful',
                        skillModifier: 0.85,
                        entertainmentDelta: -10,
                        relationships: {
                            'Capitán Silva': -15,
                            'Ing. Rodriguez': -5,
                            'Dra. Chen': -5,
                            'Chef Patel': -5
                        }
                    }
                },
                narrative: `Silva mira a Johnson a los ojos.

"No."

Johnson: "¿Qué?"
Silva: "No voy a arriesgar esta misión por tu crisis existencial."
Johnson: "Pero... capitán... cinco años..."
Silva: "La respuesta es no. Fin de la discusión."

Johnson se queda en silencio. Algo se rompe en su mirada.

❌ -30 Datos (tiempo perdido analizando)
⚠️ Johnson: Trauma (crushed_dreams)
⚠️ Johnson: -15% eficiencia permanente (amargura)
⚠️ Johnson: -15 relación con Silva (resentimiento)
⚠️ Johnson: -5 relación con TODOS (se vuelve antisocial)
⚠️ Johnson: -10 Entretenimiento (depresión)

Semanas después...

Johnson hace su trabajo. Apenas. Ya no sonríe. Ya no hace chistes.

Chen: "¿Johnson, estás bien?"
Johnson: "¿Importa?"

Patel: "El chico perdió su chispa."
Silva: "Hice lo correcto."
Patel: "¿Sí? Porque lo mataste por dentro."

**Bitácora de Johnson:** "Capitán Silva me recordó que no importo. Solo importa la misión. Llegaré a Nueva Tierra siendo un viejo amargado. Gracias, capitán."

**Consecuencias a largo plazo:**
- Johnson ya no sugiere ideas
- Johnson eventualmente intentará algo desesperado...`,
                chainEvent: 'johnson_event_02_breakdown'
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
    }
];
