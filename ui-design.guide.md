# Designer's Quick Start Guide

## What You Need to Know

The color system uses **OKLCH color space** - a modern, designer-friendly format that works like this:

```
oklch(Lightness Chroma Hue)
       ↓        ↓      ↓
    0.78     0.144   230
```

- **Lightness** (0-1): How light/dark (0 = black, 1 = white)
- **Chroma** (0-0.4): How saturated (0 = gray, 0.4 = vivid)
- **Hue** (0-360): Color wheel position (0 = red, 120 = green, 240 = blue)

## Quick Adjustments

### Want All Colors Lighter/Darker?

Edit `/Users/jasonvongsay/Downloads/insurance-template-poc-ts/src/utils/colorSystem.ts`, find `COLOR_DESIGN_TOKENS`:

```typescript
export const COLOR_DESIGN_TOKENS = {
  globalLightnessOffset: 0.05,  // Make everything lighter
  // or
  globalLightnessOffset: -0.05, // Make everything darker

  // ... rest of config
};
```

### Want All Colors More/Less Saturated?

```typescript
export const COLOR_DESIGN_TOKENS = {
  globalChromaMultiplier: 1.3,  // More saturated (130%)
  // or
  globalChromaMultiplier: 0.8,  // Less saturated (80%)

  // ... rest of config
};
```

### Want to Adjust a Specific Row?

```typescript
export const COLOR_DESIGN_TOKENS = {
  // ... globals

  // Adjust Row 2 (light/default colors)
  light: {
    lightness: 0.75,          // Make row lighter (default: 0.78)
    chromaMultiplier: 1.5,    // More saturated (default: 1.2)
  },

  // Adjust Row 3 (medium colors)
  medium: {
    lightness: 0.65,          // Lighter medium (default: 0.60)
    chromaMultiplier: 1.1,    // Less saturated (default: 1.3)
  },

  // ... rest of config
};
```

### Want to Adjust a Specific Color Family?

```typescript
export const COLOR_DESIGN_TOKENS = {
  // ... other settings

  familyOverrides: {
    blue: {
      chromaMultiplier: 0.9,  // Tone down blue saturation
    },
    red: {
      chromaMultiplier: 1.2,  // Pump up red saturation
    },
    purple: {
      chromaMultiplier: 1.1,  // Slightly more vivid purple
    },
  },
};
```

## Change Base Colors

Find `COLOR_FAMILIES` in `/Users/jasonvongsay/Downloads/insurance-template-poc-ts/src/utils/colorSystem.ts`:

```typescript
export const COLOR_FAMILIES: ColorFamily[] = [
  { name: 'blue',   hue: 230, chroma: 0.12 },  // Shift hue left/right
  { name: 'teal',   hue: 180, chroma: 0.12 },  // Increase/decrease chroma
  { name: 'green',  hue: 145, chroma: 0.12 },
  { name: 'lime',   hue: 110, chroma: 0.12 },
  { name: 'yellow', hue: 80,  chroma: 0.12 },
  { name: 'orange', hue: 50,  chroma: 0.12 },
  { name: 'red',    hue: 15,  chroma: 0.14 },  // Reds/pinks slightly higher chroma
  { name: 'pink',   hue: 340, chroma: 0.14 },
  { name: 'purple', hue: 290, chroma: 0.12 },
  { name: 'gray',   hue: 0,   chroma: 0.00 },  // Gray has no chroma (desaturated)
];
```

### Common Hue Adjustments

Want a different shade of blue?

```typescript
{ name: 'blue', hue: 210, chroma: 0.12 },  // More cyan-ish
{ name: 'blue', hue: 250, chroma: 0.12 },  // More violet-ish
```

Want warmer or cooler greens?

```typescript
{ name: 'green', hue: 130, chroma: 0.12 },  // Yellower green
{ name: 'green', hue: 160, chroma: 0.12 },  // Bluer green
```

## Common Design Scenarios

### Scenario 1: "Colors are too muted"

```typescript
export const COLOR_DESIGN_TOKENS = {
  globalChromaMultiplier: 1.3,  // Increase saturation by 30%

  light: {
    lightness: 0.78,
    chromaMultiplier: 1.4,      // Even more for default row
  },
};
```

### Scenario 2: "Colors are too dark"

```typescript
export const COLOR_DESIGN_TOKENS = {
  globalLightnessOffset: 0.08,  // Shift everything 8% lighter
};
```

### Scenario 3: "I want pastel colors"

```typescript
export const COLOR_DESIGN_TOKENS = {
  globalLightnessOffset: 0.1,   // Much lighter
  globalChromaMultiplier: 0.7,  // Less saturated
};
```

### Scenario 4: "I want vibrant, punchy colors"

```typescript
export const COLOR_DESIGN_TOKENS = {
  globalLightnessOffset: -0.05, // Slightly darker
  globalChromaMultiplier: 1.4,  // Much more saturated
};
```

### Scenario 5: "Blue needs to pop more than other colors"

```typescript
export const COLOR_DESIGN_TOKENS = {
  familyOverrides: {
    blue: {
      chromaMultiplier: 1.5,    // 50% more saturated than base
    },
  },
};
```

## How Rows Work

The palette has 4 rows, each with different lightness:

```
Row 1 (lightest): L=0.92  →  Very light pastels (backgrounds)
Row 2 (light):    L=0.78  →  Default for tags/badges ⭐
Row 3 (medium):   L=0.60  →  Active states, buttons
Row 4 (dark):     L=0.45  →  Text on light backgrounds
```

**Row 2 is the default** used for new tags and options.

To change which row is used by default, edit `PRESET_COLORS`:

```typescript
// Current (uses Row 2 - light)
export const PRESET_COLORS = getPresetColors();

// To use Row 3 instead (medium colors)
export const PRESET_COLORS = COLOR_PALETTE[2];

// To use Row 1 (lightest pastels)
export const PRESET_COLORS = COLOR_PALETTE[0];
```

## Testing Your Changes

### Visual Preview

1. Start the dev server: `npm run dev`
2. Add a route to view the demo component:

```typescript
// In your App.tsx or router
import ColorSystemDemo from '@/components/ColorSystemDemo';

// Add route or render conditionally
<ColorSystemDemo />
```

3. Open browser and see all colors + adjustments live

### Quick Test Without Demo

Add this to any component:

```typescript
import { COLOR_PALETTE } from '@/utils/colorSystem';

// Render palette
{COLOR_PALETTE.map((row, rowIndex) => (
  <div key={rowIndex} className="flex gap-2">
    {row.map((color, i) => (
      <div
        key={i}
        className="w-12 h-12"
        style={{ backgroundColor: color }}
      />
    ))}
  </div>
))}
```

## Design System Integration

### Already Defined Theme Colors

Your app uses these brand colors (in `/Users/jasonvongsay/Downloads/insurance-template-poc-ts/src/index.css`):

```css
--brand-blue:   oklch(0.7 0.118 230)
--brand-purple: oklch(0.65 0.15 290)
--brand-green:  oklch(0.85 0.15 180)
--brand-pink:   oklch(0.7 0.2 340)
--brand-orange: oklch(0.75 0.12 60)
--brand-red:    oklch(0.6 0.25 15)
```

The tag palette uses **similar hues** but allows independent adjustment.

### Aligning Palette with Brand Colors

To match tag colors closer to brand:

```typescript
export const COLOR_FAMILIES: ColorFamily[] = [
  { name: 'blue',   hue: 230, chroma: 0.118 },  // Match --brand-blue hue
  { name: 'purple', hue: 290, chroma: 0.15 },   // Match --brand-purple
  // ... adjust others to taste
];
```

## Color Picker Tool

Use [oklch.com](https://oklch.com/) to:
1. Visualize OKLCH colors
2. Convert hex to OKLCH
3. Explore hue ranges
4. Test different lightness/chroma combinations

## Common Mistakes

### Don't Do This:
```typescript
// ❌ Chroma above 0.4 (too saturated, may clip)
{ name: 'blue', hue: 230, chroma: 0.6 }

// ❌ Lightness outside 0-1
globalLightnessOffset: 0.5  // Will make colors white

// ❌ Negative chroma
familyOverrides: {
  blue: { chromaMultiplier: -1 }  // Invalid
}
```

### Do This Instead:
```typescript
// ✅ Keep chroma in reasonable range
{ name: 'blue', hue: 230, chroma: 0.16 }  // Max ~0.2 for safety

// ✅ Small lightness adjustments
globalLightnessOffset: 0.08  // Subtle shift

// ✅ Reasonable multipliers
familyOverrides: {
  blue: { chromaMultiplier: 1.3 }  // 30% more
}
```

## Getting Help

### Something Broke?

1. Reset tokens to defaults:

```typescript
export const COLOR_DESIGN_TOKENS = {
  globalChromaMultiplier: 1.0,
  globalLightnessOffset: 0.0,

  lightest: { lightness: 0.92, chromaMultiplier: 1.0 },
  light:    { lightness: 0.78, chromaMultiplier: 1.2 },
  medium:   { lightness: 0.60, chromaMultiplier: 1.3 },
  dark:     { lightness: 0.45, chromaMultiplier: 1.0 },

  familyOverrides: {},
};
```

2. Reset base colors to defaults (see above section)
3. Refresh browser and clear cache

### Colors Look Wrong in Production?

Check browser support:
- Chrome 111+
- Safari 16.4+
- Firefox 113+
- Edge 111+

For older browsers, colors may appear differently or not display. Consider adding a color conversion library like `culori` for legacy support.

## Workflow Summary

**For quick tweaks:**
1. Edit `COLOR_DESIGN_TOKENS` in `/Users/jasonvongsay/Downloads/insurance-template-poc-ts/src/utils/colorSystem.ts`
2. Save file
3. Refresh browser (Vite will hot-reload)

**For major changes:**
1. Edit `COLOR_FAMILIES` array
2. Adjust `LIGHTNESS_SCALE` if needed
3. Test with `ColorSystemDemo` component
4. Iterate until satisfied

**To share with developers:**
- Take screenshots of `ColorSystemDemo`
- Note your token adjustments
- Developers can apply exact values from your config

## Example: Complete Custom Palette

Here's a warm, earthy palette:

```typescript
// Warm, earthy colors
export const COLOR_FAMILIES: ColorFamily[] = [
  { name: 'ocean',      hue: 205, chroma: 0.10 },  // Muted blue
  { name: 'seafoam',    hue: 165, chroma: 0.10 },  // Soft teal
  { name: 'sage',       hue: 135, chroma: 0.09 },  // Earthy green
  { name: 'olive',      hue: 95,  chroma: 0.08 },  // Olive green
  { name: 'sand',       hue: 70,  chroma: 0.10 },  // Warm yellow
  { name: 'terracotta', hue: 25,  chroma: 0.13 },  // Clay orange
  { name: 'rust',       hue: 10,  chroma: 0.12 },  // Rusty red
  { name: 'rose',       hue: 350, chroma: 0.11 },  // Dusty rose
  { name: 'plum',       hue: 310, chroma: 0.09 },  // Muted purple
  { name: 'stone',      hue: 60,  chroma: 0.02 },  // Warm gray
];

export const COLOR_DESIGN_TOKENS = {
  globalChromaMultiplier: 0.9,   // Slightly desaturated
  globalLightnessOffset: 0.03,   // Slightly lighter

  light: {
    lightness: 0.75,              // Lighter default
    chromaMultiplier: 1.0,        // Less punch
  },
};
```

This creates a sophisticated, subdued palette perfect for wellness, lifestyle, or professional apps.

## Resources

- **Color Picker**: [oklch.com](https://oklch.com/)
- **Full Documentation**: [`/Users/jasonvongsay/Downloads/insurance-template-poc-ts/COLOR_SYSTEM.md`](/Users/jasonvongsay/Downloads/insurance-template-poc-ts/COLOR_SYSTEM.md)
- **Demo Component**: [`/Users/jasonvongsay/Downloads/insurance-template-poc-ts/src/components/ColorSystemDemo.tsx`](/Users/jasonvongsay/Downloads/insurance-template-poc-ts/src/components/ColorSystemDemo.tsx)
- **System Code**: [`/Users/jasonvongsay/Downloads/insurance-template-poc-ts/src/utils/colorSystem.ts`](/Users/jasonvongsay/Downloads/insurance-template-poc-ts/src/utils/colorSystem.ts)
