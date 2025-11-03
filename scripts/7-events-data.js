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
        icon: '⚠️',
        title: '',
        trigger: {
            minTranche: 4,
            maxTranche: 10,
            requiredAlive: ['Dra. Chen'],
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
                flag: 'chen_good_decision',
                affectedCrew: {
                    'Dra. Chen': {
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
                flag: 'chen_bad_decision',
                affectedCrew: {
                    'Dra. Chen': {
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
