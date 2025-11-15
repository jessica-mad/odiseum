# MANUAL DE ESTILO - ODISEUM

## PRINCIPIOS GENERALES DE DISEÑO

Este documento establece las reglas de estilo visual para mantener una estética coherente en toda la aplicación ODISEUM.

---

## 1. CAJAS Y CONTENEDORES

### REGLA: Solo elementos clicables en cajas

**✓ CORRECTO:**
- Botones en cajas/boxes
- Cards clicables en cajas/boxes
- Elementos interactivos con borde y fondo

**✗ INCORRECTO:**
- Texto informativo en cajas
- Labels en cajas
- Información estática en boxes

**ALTERNATIVA para separación:**
- Usar `border` para separar información
- Usar líneas divisorias
- Usar espaciado vertical

```css
/* CORRECTO - Botón en caja */
.button {
    background: #ffffff;
    border: 2px solid #000000;
    padding: 10px 20px;
    cursor: pointer;
}

/* CORRECTO - Separación con border */
.info-section {
    border-top: 2px solid #000000;
    padding-top: 15px;
    /* SIN background, SIN box-shadow */
}

/* INCORRECTO - Texto en caja */
.label {
    background: #ffffff;  /* ✗ NO */
    border: 2px solid #000000;  /* ✗ NO */
    padding: 10px;
}
```

---

## 2. TIPOGRAFÍA

### 2.1 MAYÚSCULAS

**REGLA: Todos los titulares y botones en MAYÚSCULAS**

```css
/* Titulares */
h1, h2, h3, h4, h5, h6 {
    text-transform: uppercase;
}

/* Botones */
button {
    text-transform: uppercase;
}
```

**Ejemplos:**
- ✓ `TRIPULACIÓN`
- ✓ `CONFIRMAR`
- ✓ `ESTADO DEL VIAJE`
- ✗ `tripulación`
- ✗ `Confirmar`

### 2.2 TAMAÑOS DE FUENTE MÍNIMOS

**REGLA: Tamaños mínimos legibles**

- **Desktop:** `14pt` mínimo (≈ 18.67px)
- **Móvil:** `15pt` mínimo (≈ 20px)

```css
/* Desktop */
@media (min-width: 769px) {
    body {
        font-size: 14pt; /* 18.67px */
    }
}

/* Móvil */
@media (max-width: 768px) {
    body {
        font-size: 15pt; /* 20px */
    }
}
```

**Variables CSS:**
```css
:root {
    --font-size-min-desktop: 14pt;
    --font-size-min-mobile: 15pt;
}
```

---

## 3. ESTADOS DE SELECCIÓN

### 3.1 ELEMENTOS SELECCIONADOS

**REGLA: Aro verde para elementos seleccionados**

```css
.element.selected {
    outline: 3px solid var(--color-terminal-green);
    outline-offset: 2px;
}
```

**Visual:**
```
┌────────────────┐
│                │ ← Verde brillante (#00ff41)
│  SELECCIONADO  │    Outline visible
│                │
└────────────────┘
```

### 3.2 ELEMENTOS NO SELECCIONADOS

**REGLA: Apariencia deshabilitada con verde oscuro casi negro**

```css
.element.deselected {
    background: var(--color-deselected-bg);
    color: var(--color-deselected-text);
    opacity: 0.6;
    cursor: default;
}
```

**Colores:**
```css
:root {
    --color-deselected-bg: #0a1a0a;     /* Verde muy oscuro casi negro */
    --color-deselected-text: #2d4d2d;   /* Verde oscuro para texto */
    --color-deselected-border: #1a2a1a; /* Verde oscuro para bordes */
}
```

**Visual:**
```
┌────────────────┐
│                │ ← Verde muy oscuro (#0a1a0a)
│ DESELECCIONADO │    Apariencia deshabilitada
│                │    Opacidad reducida
└────────────────┘
```

---

## 4. PALETA DE COLORES

### Colores Base
```css
--color-white: #ffffff;
--color-black: #000000;
--color-terminal-green: #00ff41;        /* Seleccionado */
--color-terminal-green-dim: #00aa2b;
--color-terminal-green-dark: #006622;
```

### Estados de Selección
```css
--color-selected-outline: #00ff41;      /* Verde brillante */
--color-deselected-bg: #0a1a0a;         /* Verde muy oscuro */
--color-deselected-text: #2d4d2d;       /* Verde oscuro */
--color-deselected-border: #1a2a1a;     /* Verde oscuro */
```

### Alertas
```css
--color-alert-red: #ff0055;
--color-alert-orange: #ff9500;
--color-alert-yellow: #ffff00;
--color-alert-green: #00ff41;
```

---

## 5. EJEMPLOS DE APLICACIÓN

### Ejemplo 1: Botón
```css
.button {
    /* Caja permitida (elemento clicable) */
    background: #ffffff;
    border: 2px solid #000000;
    padding: 10px 20px;

    /* Texto en mayúsculas */
    text-transform: uppercase;

    /* Tamaño mínimo */
    font-size: var(--font-size-min-desktop);

    cursor: pointer;
}

.button.selected {
    outline: 3px solid var(--color-terminal-green);
    outline-offset: 2px;
}

.button:not(.selected) {
    background: var(--color-deselected-bg);
    color: var(--color-deselected-text);
    opacity: 0.6;
}
```

### Ejemplo 2: Card Clicable
```css
.card {
    /* Caja permitida (elemento clicable) */
    background: #ffffff;
    border: 2px solid #000000;
    padding: 15px;
    cursor: pointer;
}

.card-title {
    /* Título en mayúsculas */
    text-transform: uppercase;
    font-size: var(--font-size-min-desktop);
}

.card.selected {
    outline: 3px solid var(--color-terminal-green);
    outline-offset: 2px;
}

.card.deselected {
    background: var(--color-deselected-bg);
    border-color: var(--color-deselected-border);
    color: var(--color-deselected-text);
    opacity: 0.6;
}
```

### Ejemplo 3: Sección Informativa
```css
.info-section {
    /* SIN caja (no clicable) */
    border-top: 2px solid #000000;
    padding-top: 15px;
    margin-top: 15px;
    /* NO background, NO box-shadow */
}

.info-title {
    /* Título en mayúsculas */
    text-transform: uppercase;
    font-size: var(--font-size-min-desktop);
    margin-bottom: 10px;
}

.info-text {
    font-size: var(--font-size-min-desktop);
    line-height: 1.5;
}
```

---

## 6. CHECKLIST DE DISEÑO

Antes de implementar cualquier componente, verificar:

- [ ] ¿Es clicable? → Sí: usar caja | No: usar border para separar
- [ ] ¿Es título o botón? → Aplicar `text-transform: uppercase`
- [ ] ¿Cumple tamaño mínimo? → Desktop 14pt / Móvil 15pt
- [ ] ¿Tiene estados seleccionado/deseleccionado? → Aplicar estilos correspondientes

---

## 7. RESPONSIVE DESIGN

### Desktop (≥769px)
```css
@media (min-width: 769px) {
    :root {
        --font-size-base: 14pt;
    }
}
```

### Móvil (≤768px)
```css
@media (max-width: 768px) {
    :root {
        --font-size-base: 15pt;
    }

    /* Elementos tactiles más grandes */
    button {
        min-height: 44px;
        padding: 12px 24px;
    }
}
```

---

## VERSIÓN

- **Versión:** 1.0
- **Fecha:** 2025-11-15
- **Proyecto:** ODISEUM V2.0
