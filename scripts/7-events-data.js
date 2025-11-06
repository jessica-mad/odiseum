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
        icon: '⚠️',
        title: '',
        trigger: {
            minTranche: 5,
            maxTranche: 20,
            requiredAlive: ['Chef Patel'],
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
                flag: 'patel_good_decision',
                affectedCrew: {
                    'Chef Patel': {
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
                flag: 'patel_bad_decision',
                affectedCrew: {
                    'Chef Patel': {
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
    }
];
