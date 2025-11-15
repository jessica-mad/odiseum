# 📋 ODISEUM V2.0 - Referencia Completa de Stats y Campos

Este documento es la **fuente única de verdad** para todos los nombres de campos, stats y configuraciones.

---

## 🎯 RECURSOS (Resources)

### Keys de Recursos (usar en minúsculas)
| Key | Nombre Display | Ícono | Peso/Unidad | Renovable |
|-----|---------------|-------|-------------|-----------|
| `energy` | Energía | ⚡ | 1 kg | ❌ |
| `food` | Alimentos | 🍕 | 2 kg | ✅ |
| `water` | Agua | 💧 | 1 kg | ✅ |
| `oxygen` | Oxígeno | 🫁 | 0.5 kg | ✅ |
| `medicine` | Medicinas | 💊 | 0.5 kg | ❌ |
| `data` | Datos/Entret. | 💾 | 0.1 kg | ❌ |
| `fuel` | Combustible | 🛢️ | 1 kg | ❌ |

### Estructura en Código

**En initializeGame():**
```javascript
const resources = config && config.resources ? config.resources : defaultResources;

Energy = new Resource('Energía', resources.energy, resources.energy, ...);
Food = new Resource('Alimentos', resources.food, resources.food, ...);
Water = new Resource('Agua', resources.water, resources.water, ...);
Oxygen = new Resource('Oxígeno', resources.oxygen, resources.oxygen, ...);
Medicine = new Resource('Medicinas', resources.medicine, resources.medicine, ...);
Data = new Resource('Datos/Entret.', resources.data, resources.data, ...);
Fuel = new Resource('Combustible', resources.fuel, resources.fuel, ...);
```

**En configurador:**
```javascript
this.selectedResources = {
    energy: 700,
    food: 300,
    water: 600,
    oxygen: 800,
    medicine: 100,
    data: 200,
    fuel: 1000
};
```

---

## 👥 TRIPULACIÓN (Crew)

### Keys de Roles
| Key en Config | Role Interno | Position Display |
|--------------|--------------|------------------|
| `comandante` | `commander` | Comandante |
| `doctor` | `doctor` | Médica |
| `ingeniero` | `engineer` | Ingeniero |
| `navegante` | `scientist` | Navegante |
| `chef` | `cook` | Cocinero/Botánico |

### Campos Comunes de Crew Data
```javascript
{
    id: 1,                          // Número único
    name: "Chen",                   // Nombre del tripulante
    position: "Comandante",         // Posición display
    age: 45,                        // Edad inicial
    img: "avatar1.jpg",            // Imagen
    role: "commander",             // Role interno del juego
    state: "Despierto",            // Estado inicial
    personality: { ... },          // Rasgos de personalidad
    leftBehind: { ... },           // Historia personal
    fearOfDeath: "Alta",           // Miedo a morir

    // CONFIGURACIÓN PERSONALIZADA (del configurador)
    configStats: { ... },          // Stats de gameplay
    configBenefits: "...",         // Descripción de beneficios
    configDrawbacks: "..."         // Descripción de desventajas
}
```

---

## ⚙️ STATS DE CONFIGURACIÓN (configStats)

### 🎖️ COMANDANTE

| Stat | Tipo | Valores | Descripción |
|------|------|---------|-------------|
| `efficiencyBonus` | float | 0.05 - 0.15 | Bonus de eficiencia a crew despierta |
| `agingRate` | float | 1.0 - 1.2 | Multiplicador de envejecimiento |
| `luckBonus` | float | 0.10 | Bonus de suerte en eventos (opcional) |

**Ejemplo:**
```javascript
// Veterano (7pts)
stats: { efficiencyBonus: 0.15, agingRate: 1.2 }

// Estándar (5pts)
stats: { efficiencyBonus: 0.10, agingRate: 1.0 }

// Promovido (3pts)
stats: { efficiencyBonus: 0.05, luckBonus: 0.10, agingRate: 1.0 }
```

**Implementación:**
- `AwakeBenefitSystem.getCrewEfficiencyMultiplier()` usa `efficiencyBonus`
- `Crew.age()` usa `agingRate`

---

### ⚕️ DOCTOR

| Stat | Tipo | Valores | Descripción |
|------|------|---------|-------------|
| `healingRate` | float | 0.75 - 1.5 | Velocidad de curación (1.0 = normal) |
| `medicineUsage` | float | 1.0 - 1.5 | Multiplicador consumo medicina |
| `greenhouseBonus` | float | 0.0 - 0.30 | Bonus producción invernadero |
| `canSynthMedicine` | boolean | true/false | Puede sintetizar medicina |

**Ejemplo:**
```javascript
// Botánico (7pts)
stats: { healingRate: 1.0, greenhouseBonus: 0.30, canSynthMedicine: true }

// Estándar (5pts)
stats: { healingRate: 1.0, greenhouseBonus: 0, canSynthMedicine: false }

// Precavida (3pts)
stats: { healingRate: 1.5, medicineUsage: 1.5, greenhouseBonus: 0, canSynthMedicine: false }
```

**Implementación:**
- `AwakeBenefitSystem.applyMedicalSupport()` usa `healingRate`
- `Crew.tryAutoManage()` usa `healingRate` y `medicineUsage`
- `SpecialAbilitiesSystem.medicineSynthesis()` verifica `canSynthMedicine`

---

### 🔧 INGENIERO

| Stat | Tipo | Valores | Descripción |
|------|------|---------|-------------|
| `repairRate` | float | 0.8 - 1.5 | Velocidad de reparación |
| `degradationReduction` | float | 0.20 - 0.40 | Reducción de degradación |
| `agingRate` | float | 1.0 - 1.1 | Multiplicador de envejecimiento |
| `canUpgradeRooms` | boolean | true/false | Puede mejorar salas |
| `upgradeBonus` | float | 0.10 | Bonus de mejora (si can) |

**Ejemplo:**
```javascript
// Veterano (7pts)
stats: { repairRate: 1.5, degradationReduction: 0.40, agingRate: 1.1 }

// Estándar (5pts)
stats: { repairRate: 1.0, degradationReduction: 0.20 }

// Prodigio (3pts)
stats: { repairRate: 0.8, canUpgradeRooms: true, upgradeBonus: 0.10 }
```

**Implementación:**
- `AwakeBenefitSystem.getEngineerDamageReduction()` usa `degradationReduction`
- `ShipMapSystem` (si existe) usa `repairRate`
- `SpecialAbilitiesSystem.roomUpgrade()` verifica `canUpgradeRooms`

---

### 🧭 NAVEGANTE

| Stat | Tipo | Valores | Descripción |
|------|------|---------|-------------|
| `totalTranches` | integer | 10 - 15 | Duración total de misión en tranches |
| `eventDifficulty` | float | 0.8 - 1.2 | Multiplicador dificultad eventos |
| `fuelConsumption` | float | 1.0 - 1.2 | Multiplicador consumo fuel |

**Ejemplo:**
```javascript
// Arriesgado (7pts)
stats: { totalTranches: 10, eventDifficulty: 1.2, fuelConsumption: 1.0 }

// Estándar (5pts)
stats: { totalTranches: 12, eventDifficulty: 1.0, fuelConsumption: 1.0 }

// Conservador (3pts)
stats: { totalTranches: 15, eventDifficulty: 0.8, fuelConsumption: 1.2 }
```

**Implementación:**
- `initializeGame()` usa `totalTranches` → almacena en `window.configuredMissionTranches`
- `initializeGame()` usa `eventDifficulty` → almacena en `window.eventDifficultyModifier`
- EventSystem (futuro) usará `window.eventDifficultyModifier`

---

### 👨‍🍳 CHEF

| Stat | Tipo | Valores | Descripción |
|------|------|---------|-------------|
| `foodConsumption` | float | 0.90 - 1.1 | Multiplicador consumo food (0.90 = -10%) |
| `greenhouseBonus` | float | 0.0 - 0.20 | Bonus producción invernadero |
| `canConvertWater` | boolean | true/false | Puede convertir agua → comida |
| `conversionRate` | float | 0.5 | Ratio conversión (si can) |

**Ejemplo:**
```javascript
// Eficiente (7pts)
stats: { foodConsumption: 0.90, greenhouseBonus: 0.20 }

// Estándar (5pts)
stats: { foodConsumption: 1.0, greenhouseBonus: 0 }

// Creativo (3pts)
stats: { foodConsumption: 1.1, canConvertWater: true, conversionRate: 0.5 }
```

**Implementación:**
- `AwakeBenefitSystem.modifyFoodConsumption()` usa `foodConsumption`
- `SpecialAbilitiesSystem.waterToFood()` verifica `canConvertWater`

---

## 🔄 FLUJO DE CONFIGURACIÓN A JUEGO

```
1. Usuario configura en missionConfigurator
   ├─ selectedCrew = { comandante: {...}, doctor: {...}, ... }
   └─ selectedResources = { energy: 700, food: 300, ... }

2. confirmAndStart() crea gameConfiguration
   └─ { crew: selectedCrew, resources: selectedResources, seed: "KEPLER-XXX" }

3. startGameWithConfiguration(config) llama initializeGame(config)

4. initializeGame(config)
   ├─ Crea Resources usando config.resources
   └─ Llama createCrewFromData(config)

5. createCrewFromData(config)
   ├─ Itera sobre config.crew
   ├─ Mapea cada opción → crewData
   │  └─ Incluye configStats: selectedOption.stats
   └─ Retorna array de Crew objects

6. Constructor de Crew almacena:
   ├─ this.configStats = data.configStats || {}
   ├─ this.configBenefits = data.configBenefits || null
   └─ this.configDrawbacks = data.configDrawbacks || null

7. Sistemas del juego acceden a configStats:
   ├─ awakeBenefitSystem.getCrewEfficiencyMultiplier(crew)
   │  └─ usa crew.configStats.efficiencyBonus
   ├─ awakeBenefitSystem.applyMedicalSupport(crew)
   │  └─ usa crew.configStats.healingRate
   └─ specialAbilities.medicineSynthesis()
      └─ verifica crew.configStats.canSynthMedicine
```

---

## ✅ CHECKLIST DE HOMOLOGACIÓN

### Nombres de Recursos ✅
- [x] Keys en minúsculas: energy, food, water, oxygen, medicine, data, fuel
- [x] Usados consistentemente en configurador y initializeGame()
- [x] RESOURCE_LIMITS define estructura completa

### Nombres de Roles ✅
- [x] Keys del configurador: comandante, doctor, ingeniero, navegante, chef
- [x] Roles internos: commander, doctor, engineer, scientist, cook
- [x] Mapeo correcto en createCrewFromData()

### Stats de Crew ✅
- [x] `efficiencyBonus` (comandante)
- [x] `agingRate` (comandante, ingeniero)
- [x] `healingRate` (doctor)
- [x] `medicineUsage` (doctor)
- [x] `canSynthMedicine` (doctor)
- [x] `degradationReduction` (ingeniero)
- [x] `canUpgradeRooms` (ingeniero)
- [x] `totalTranches` (navegante)
- [x] `eventDifficulty` (navegante)
- [x] `foodConsumption` (chef)
- [x] `canConvertWater` (chef)

### Implementación ✅
- [x] Constructor de Crew guarda configStats
- [x] AwakeBenefitSystem usa configStats correctamente
- [x] SpecialAbilitiesSystem verifica habilidades correctamente
- [x] initializeGame() almacena config globalmente

---

## 🔧 DEBUGGING

### Para verificar que config se está pasando:

```javascript
// En initializeGame()
console.log('[initializeGame] Config recibida:', config);
console.log('[initializeGame] Recursos:', config?.resources);
console.log('[initializeGame] Crew:', config?.crew);

// En createCrewFromData()
console.log('[createCrewFromData] Tripulante creado:', crewData.name, crewData.configStats);

// En constructor de Crew
console.log('[Crew constructor] configStats:', this.configStats);

// En awakeBenefitSystem
console.log('[AwakeBenefitSystem] Captain stats:', this.captain?.configStats);
```

### Para verificar en runtime:

```javascript
// En consola del navegador
window.missionConfig               // Config completa
crewMembers[0].configStats         // Stats del comandante
crewMembers[1].configStats         // Stats del doctor
Energy.quantity                     // Energía actual
Food.quantity                       // Comida actual
```

---

## 📝 NOTAS IMPORTANTES

1. **NUNCA uses valores hardcoded** - Siempre verifica primero si existe en configStats
2. **Fallback a defaults** - Si no hay configStats, usa valores legacy
3. **configStats es opcional** - El juego debe funcionar sin configurador
4. **Keys en lowercase** - Todos los recursos usan minúsculas
5. **Stats son inmutables** - Una vez creados, los stats no cambian en runtime

---

**Última actualización:** 2025-11-15
**Versión:** ODISEUM V2.0 - Configurador Integrado
