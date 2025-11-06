// ============================================
// EVENTOS CRÍTICOS - ODISEUM V2.0
// ============================================

const EVENTS_POOL = [
    // EVENTO 1: CAPITÁN SILVA
    {
        id: 'silva_event_01',
        character: 'Capitán Silva',
        icon: '⚠️',
        title: '',
        trigger: {
            minTranche: 3,
            maxTranche: 7,
            requiredAlive: ['Capitán Silva'],
            requiredAwake: ['Capitán Silva'],
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
                flag: 'silva_good_decision',
                affectedCrew: {
                    'Capitán Silva': {
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
                flag: 'silva_bad_decision',
                affectedCrew: {
                    'Capitán Silva': {
                        trauma: '',
                        emotionalState: '',
                        skillModifier: 1,
                        relationships: {}
                    }
                },
                narrative: '',
                chainEvent: 'silva_event_02'
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
        icon: '⚠️',
        title: '',
        trigger: {
            minTranche: 1,
            maxTranche: 15,
            requiredAlive: ['Lt. Johnson'],
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
                flag: 'johnson_good_decision',
                affectedCrew: {
                    'Lt. Johnson': {
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
                flag: 'johnson_bad_decision',
                affectedCrew: {
                    'Lt. Johnson': {
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

    // EVENTO 5: CHEF PATEL
    {
        id: 'patel_event_01',
        character: 'Chef Patel',
        icon: '🌱',
        title: 'Crisis en el Invernadero',
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
        description: `Chef Patel entra apresurado al puente de mando, con las manos manchadas de tierra.

"Comandante, tenemos un problema crítico en el invernadero. El sistema de filtrado de agua ha estado reciclando agua contaminada durante semanas. Las plantas han absorbido niveles peligrosos de metales pesados."

Patel muestra análisis en su tablet: lechugas con manchas marrones, tomates deformes, hierbas marchitas.

"He identificado dos opciones, pero ambas tienen riesgos..."

La decisión está en tus manos. Los 10,000 embriones necesitan llegar bien alimentados, pero ¿a qué costo?`,

        optionA: {
            label: '🌿 Intentar salvar la cosecha actual (Arriesgado)',
            requires: {
                medicine: 20,
                water: 30
            },
            costs: {
                medicine: 20,
                water: 30,
                energy: 15
            },
            wakeUp: [],
            result: 'good'
        },

        optionB: {
            label: '🔥 Quemar cosecha y empezar de nuevo (Seguro pero costoso)',
            requires: {},
            costs: {
                food: 150,
                energy: 20
            },
            wakeUp: [],
            result: 'bad'
        },

        outcomes: {
            good: {
                flag: 'patel_greenhouse_saved',
                resourceDeltas: {
                    food: 100
                },
                affectedCrew: {
                    'Chef Patel': {
                        trauma: null,
                        emotionalState: 'proud',
                        skillModifier: 1.1,
                        relationships: {
                            'Capitán Silva': 10,
                            'Dra. Chen': 5
                        }
                    }
                },
                narrative: `Los siguientes días son tensos. Chef Patel apenas duerme, monitoreando cada planta, aplicando tratamientos de quelación con precisión quirúrgica.

Día 7: Las primeras lechugas muestran mejoría. Las manchas retroceden.

Día 14: Los análisis son claros - las plantas están seguras para consumo. Incluso mejor, la crisis le enseñó técnicas de purificación más eficientes.

**RESULTADO:**
✅ +100 Alimentos (cosecha recuperada)
✅ Producción optimizada (sistema mejorado)
✅ Chef Patel gana confianza y habilidades (+10% eficiencia)

Patel añade en su bitácora personal: "Hoy salvé más que plantas. Salvé la esperanza de que podemos superar cualquier obstáculo."`,
                chainEvent: 'patel_event_02_success'
            },

            bad: {
                flag: 'patel_greenhouse_burned',
                affectedCrew: {
                    'Chef Patel': {
                        trauma: 'guilt',
                        emotionalState: 'depressed',
                        skillModifier: 0.9,
                        restDelta: -15,
                        relationships: {
                            'Capitán Silva': -5,
                            'Lt. Johnson': -10
                        }
                    },
                    'ALL_CREW': {
                        trauma: null,
                        emotionalState: 'disappointed',
                        skillModifier: 1.0,
                        entertainmentDelta: -10,
                        relationships: {}
                    }
                },
                narrative: `Las llamas consumen semanas de trabajo. Chef Patel observa en silencio cómo su jardín se convierte en cenizas.

"Era lo correcto," murmura, pero sus manos tiemblan.

Las semanas siguientes son difíciles. Patel replanta todo desde cero, pero las nuevas plantas son jóvenes, básicas, sin el sabor ni la variedad de antes.

**RESULTADO:**
❌ -150 Alimentos (cosecha perdida)
⚠️ Comida será básica y poco apetitosa
⚠️ TODA la tripulación: -10 Entretenimiento (comida horrible baja la moral)
⚠️ Chef Patel: -15 Descanso (insomnio por culpa), -10% eficiencia
✅ Pero al menos es seguro... ¿verdad?

Patel añade en su bitácora: "Destruí mi jardín para salvar la misión. Espero que valga la pena. Los demás me miran diferente ahora."`,
                chainEvent: 'patel_event_02_redemption'
            }
        }
    }
];
