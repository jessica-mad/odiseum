# ODISEUM V2.0 - Terminal Theme Redesign

## 🎨 Overview

This redesign transforms Odiseum from a retro Mac OS aesthetic to a terminal/command-line interface with a black and green color scheme inspired by classic computer terminals.

## 🌟 Key Changes

### Visual Theme
- **Color Scheme**: Black background (#000000) with terminal green (#00ff41)
- **Typography**: Monaco monospace font for the retro terminal feel
- **Alerts**: Acid yellow (#ffff00) and red (#ff0055) for warnings and critical alerts
- **Icons**: Replaced emojis with pixel art icons from [pixelarticons](https://github.com/halfmage/pixelarticons)

### Layout Reorganization
- **Navigation Console**: Moved to the bottom of the interface (fixed position)
- **Voyage Map**: Enhanced visualization with:
  - Solid green line for completed journey segments
  - Dashed line for remaining distance
  - Glowing nodes marking progress waypoints
  - Real-time distance and speed readouts

### Components Updated

#### 1. Navigation Console (Bottom)
- Fixed position at bottom of screen
- Height: 180px
- Shows voyage progress with visual indicators
- Displays current speed, distance traveled, and forecast

#### 2. Resource Strip
- Black background with green terminal text
- Updated icons using pixelarticons
- Each resource chip has terminal styling with dark borders

#### 3. Crew Sidebar
- Terminal green borders and text
- Black background with subtle scanline effect
- Updated status indicators with acid colors

#### 4. Notifications
- Terminal theme with acid alert colors
- Glowing borders for critical alerts
- Pulse animations for urgent messages

#### 5. Popups/Windows
- Black background with green borders
- Terminal green glowing effects
- All buttons updated to terminal style

## 📁 New Files Created

### CSS Files
- `styles/6-theme-terminal.css` - Main terminal theme styles
- `styles/7-components-terminal.css` - Component overrides for terminal theme

### JavaScript Files
- `scripts/icon-loader.js` - Utility functions for loading pixelarticons
- `scripts/8-icon-replacer.js` - Automatically replaces emojis with SVG icons on page load

## 🎯 Icon System

### Pixelarticons Integration
The game now uses SVG icons from the pixelarticons library (486 icons available).

#### Icon Mapping
```javascript
// Resources
energy: 'zap'
food: 'drop'
water: 'drop'
oxygen: 'device-vibrate'
medicine: 'heart'
data: 'chart-bar'
fuel: 'drop-full'

// Navigation
ship: 'ship'
map: 'map'
users: 'users'
book: 'book'

// UI
close: 'close'
menu: 'menu'
check: 'check'
alert: 'alert'
warning: 'warning-box'
```

### Usage
```javascript
// Create an icon
const icon = createIcon('ship', 24, 'terminal-green');

// Create using game icon map
const userIcon = createGameIcon('user', 24);

// Replace emoji in element
replaceEmojiWithIcon(element, 'energy', 24);
```

## 🎨 Color Palette

### Primary Colors
```css
--color-terminal-green: #00ff41      /* Main UI color */
--color-terminal-green-dim: #00aa2b  /* Secondary text */
--color-terminal-green-dark: #006622 /* Borders, inactive */
--color-terminal-bg: #000000         /* Main background */
--color-terminal-bg-light: #0a0a0a  /* Elevated surfaces */
```

### Alert Colors (Acid)
```css
--color-alert-red: #ff0055           /* Critical alerts */
--color-alert-red-glow: rgba(255, 0, 85, 0.6)
--color-alert-yellow: #ffff00        /* Warnings */
--color-alert-yellow-glow: rgba(255, 255, 0, 0.5)
--color-alert-green: #00ff41         /* Success */
```

## 🚀 Voyage Visualization

### Features
1. **Progress Line**: Solid green line showing completed journey
2. **Remaining Path**: Dashed green line showing distance left
3. **Waypoint Nodes**: Interactive nodes showing:
   - Completed tranches (solid green border)
   - Active tranche (pulsing green glow)
   - Standby tranches (dim green)
   - Forecast tranches (dashed border)

4. **Live Readouts**:
   - Current velocity percentage
   - Distance traveled / Total distance
   - Voyage forecast (when navigator is active)

### Node States
```css
.voyage-node.completed  /* Green, solid, completed */
.voyage-node.active     /* Pulsing glow, current */
.voyage-node.standby    /* Dim, waiting */
.voyage-node.forecast   /* Dashed border, predicted */
```

## 📱 Responsive Design

The navigation console adapts to different screen sizes:
- Desktop: Fixed at bottom, 180px height
- Mobile: Adjusts height automatically, minimum 140px

## 🎭 Special Effects

### Terminal Glow
All terminal green elements have a subtle glow effect:
```css
text-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
```

### Scanlines
Subtle scanline effect on backgrounds:
```css
background-image:
    repeating-linear-gradient(
        0deg, transparent, transparent 2px,
        rgba(0, 255, 65, 0.02) 2px,
        rgba(0, 255, 65, 0.02) 4px
    );
```

### Pulse Animations
- Active voyage nodes pulse with green glow
- Critical alerts pulse with red glow
- Important buttons have hover glow effects

## 🔧 Configuration

### Theme Toggle (Future)
To switch back to retro theme, modify `index.html`:
```html
<!-- Retro Theme -->
<link rel="stylesheet" href="styles/5-theme-retro.css">

<!-- Terminal Theme -->
<link rel="stylesheet" href="styles/6-theme-terminal.css">
<link rel="stylesheet" href="styles/7-components-terminal.css">
```

## 🎮 Gameplay Impact

The new terminal theme:
- **Improves readability** with high contrast green on black
- **Enhances immersion** with sci-fi command interface aesthetics
- **Better focus** on critical alerts with acid color palette
- **Clearer navigation** with dedicated bottom console

## 📊 Performance

- Icon loading is asynchronous and doesn't block rendering
- SVG icons are smaller than emoji fonts
- Glow effects use CSS shadows (GPU accelerated)
- Animations use transform and opacity for smooth 60fps

## 🐛 Known Issues

None currently. All features tested and working.

## 🔮 Future Enhancements

1. Add more pixelarticons for crew actions
2. Custom pixel art for planets in voyage visualization
3. Animated scanline effect option
4. Theme switcher in settings
5. Custom terminal cursor effects
6. Sound effects for terminal interactions

## 📝 Credits

- **Design**: Terminal/Command-line aesthetic
- **Icons**: [pixelarticons by Gerrit Halfmann](https://github.com/halfmage/pixelarticons)
- **Color Scheme**: Classic terminal green on black
- **Fonts**: Monaco monospace

---

**Version**: 2.0.0-terminal
**Date**: 2025-11-03
**Status**: ✅ Complete
