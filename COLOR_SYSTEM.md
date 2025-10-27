# Color System Documentation

## Overview

The color system uses **OKLCH color space** to provide a perceptually uniform, designer-friendly palette that integrates seamlessly with the existing theme system. All colors are generated programmatically from base values, making it easy to adjust the entire palette.

## Key Benefits

1. **Perceptually Uniform**: Equal steps in OKLCH produce equal perceived color differences
2. **Designer-Friendly**: Adjust lightness, saturation (chroma), and hue independently
3. **Consistent with Theme**: Uses same OKLCH format as the app's theme system
4. **Programmatic**: Generate variations automatically rather than hardcoding hex values
5. **Easy Maintenance**: Change base colors and all variations update automatically

## Architecture

### Color Space: OKLCH

OKLCH format: `oklch(L C H)`
- **L (Lightness)**: 0-1 (0 = black, 1 = white)
- **C (Chroma)**: 0-0.4 (saturation intensity, 0 = grayscale)
- **H (Hue)**: 0-360 (color wheel degrees)

### Color Families

10 distinct color families, each with optimized hue and chroma values:

```typescript
blue    → hue: 230°, chroma: 0.12
teal    → hue: 180°, chroma: 0.12
green   → hue: 145°, chroma: 0.12
lime    → hue: 110°, chroma: 0.12
yellow  → hue: 80°,  chroma: 0.12
orange  → hue: 50°,  chroma: 0.12
red     → hue: 15°,  chroma: 0.14
pink    → hue: 340°, chroma: 0.14
purple  → hue: 290°, chroma: 0.12
gray    → hue: 0°,   chroma: 0.00
```

### Lightness Scale (4 Rows)

Each color family generates 4 variations with different lightness levels:

```typescript
Row 1 (lightest): L = 0.92  // Very light pastels for backgrounds
Row 2 (light):    L = 0.78  // Default tag/badge colors (PRESET_COLORS)
Row 3 (medium):   L = 0.60  // Active states, buttons
Row 4 (dark):     L = 0.45  // Text on light backgrounds
```

### Chroma Adjustments

Lighter colors receive slightly more saturation to maintain vibrancy:

```typescript
lightest: 1.0x base chroma
light:    1.2x base chroma (DEFAULT)
medium:   1.3x base chroma
dark:     1.0x base chroma
```

## Usage

### Basic Usage

```typescript
import {
  COLOR_PALETTE,      // Full 4x10 palette
  PRESET_COLORS,      // Row 2 (light colors)
  getNextDistinctColor
} from '@/utils/colorSystem';

// Use in component
const [options, setOptions] = useState([
  { id: '1', label: 'Google', color: PRESET_COLORS[0] },
  { id: '2', label: 'Facebook', color: PRESET_COLORS[1] },
]);

// Add new option with distinct color
const newColor = getNextDistinctColor(options.length);
```

### Color Picker Grid

```typescript
// Render 4x10 color palette
{COLOR_PALETTE.map((row, rowIndex) => (
  <div key={rowIndex} className="flex gap-1">
    {row.map((color, colorIndex) => (
      <button
        key={`${rowIndex}-${colorIndex}`}
        style={{ backgroundColor: color }}
        onClick={() => handleColorSelect(color)}
      />
    ))}
  </div>
))}
```

### Advanced: Color Adjustments

```typescript
import {
  adjustColorLightness,
  adjustColorChroma
} from '@/utils/colorSystem';

// Create hover state (slightly lighter)
const hoverColor = adjustColorLightness(baseColor, 0.05);

// Increase saturation
const saturatedColor = adjustColorChroma(baseColor, 1.3);
```

## Customization

### Method 1: Design Tokens (Recommended)

Edit `COLOR_DESIGN_TOKENS` in `/Users/jasonvongsay/Downloads/insurance-template-poc-ts/src/utils/colorSystem.ts`:

```typescript
export const COLOR_DESIGN_TOKENS = {
  // Make all colors more saturated
  globalChromaMultiplier: 1.2,  // Default: 1.0

  // Make all colors lighter
  globalLightnessOffset: 0.05,  // Default: 0.0

  // Adjust specific rows
  light: {
    lightness: 0.80,          // Default: 0.78
    chromaMultiplier: 1.3,    // Default: 1.2
  },

  // Per-family overrides
  familyOverrides: {
    red:  { chromaMultiplier: 1.2 },  // More saturated reds
    blue: { chromaMultiplier: 0.9 },  // Less saturated blues
  },
};
```

### Method 2: Base Color Families

Modify `COLOR_FAMILIES` array to change hue or base saturation:

```typescript
export const COLOR_FAMILIES: ColorFamily[] = [
  { name: 'blue',  hue: 235, chroma: 0.14 },  // Shift hue, increase saturation
  { name: 'teal',  hue: 175, chroma: 0.10 },  // Adjust to taste
  // ...
];
```

### Method 3: Lightness Scale

Adjust lightness levels for all rows:

```typescript
export const LIGHTNESS_SCALE = {
  lightest: 0.94,  // Even lighter pastels (default: 0.92)
  light:    0.75,  // Slightly darker tags (default: 0.78)
  medium:   0.58,  // Adjust medium (default: 0.60)
  dark:     0.42,  // Darker text colors (default: 0.45)
};
```

## Color Selection Strategy

### Distinct Color Sequence

New options automatically cycle through colors in an order that maximizes visual distinction:

```typescript
export const DISTINCT_COLOR_SEQUENCE = [0, 2, 6, 8, 4, 1, 5, 7, 3, 9];
// Maps to: blue → green → red → purple → yellow → teal → orange → pink → lime → gray
```

This ensures that:
1. First option is blue (familiar, safe)
2. Second option is green (maximum hue distance)
3. Third option is red (completes RGB primary triad)
4. Subsequent options maintain perceptual distance

### Custom Sequences

Create domain-specific sequences for specialized use cases:

```typescript
// For status indicators: green first, then yellow, red
const STATUS_SEQUENCE = [2, 4, 6];  // green, yellow, red

// For platform tags: blue-centric palette
const PLATFORM_SEQUENCE = [0, 1, 8, 7];  // blue, teal, purple, pink
```

## Integration with Theme System

The color system uses the same OKLCH format as `/Users/jasonvongsay/Downloads/insurance-template-poc-ts/src/index.css`, ensuring visual consistency across:

- Tag/badge colors
- Theme brand colors
- UI component states
- Dark/light mode variants

Example alignment:

```css
/* Theme brand colors (from index.css) */
--brand-blue: oklch(0.7 0.118 230);
--brand-green: oklch(0.85 0.15 180);

/* Tag palette colors (from colorSystem.ts) */
blue family:  oklch(0.78 0.144 230)  /* Similar hue, adjustable lightness */
green family: oklch(0.78 0.144 145)  /* Consistent chroma levels */
```

## Browser Support

### Modern Browsers (2023+)
OKLCH is natively supported in:
- Chrome 111+
- Safari 16.4+
- Firefox 113+
- Edge 111+

### Legacy Browsers
For older browsers, consider using a color conversion library like `culori`:

```bash
npm install culori
```

```typescript
import { oklch, formatHex } from 'culori';

// Convert to hex for fallback
const hexColor = formatHex(oklch(0.78, 0.144, 230));
```

## Examples

### Example 1: Create a Custom Palette

```typescript
import { generateColorFamilyVariations, COLOR_FAMILIES } from '@/utils/colorSystem';

// Generate only blue variations
const blueFamily = COLOR_FAMILIES[0];
const blueVariations = generateColorFamilyVariations(blueFamily);

console.log(blueVariations);
// {
//   lightest: "oklch(0.92 0.12 230)",
//   light: "oklch(0.78 0.144 230)",
//   medium: "oklch(0.60 0.156 230)",
//   dark: "oklch(0.45 0.12 230)"
// }
```

### Example 2: Generate Custom Row

```typescript
import { COLOR_FAMILIES, generateColorVariation } from '@/utils/colorSystem';

// Create a custom "extra dark" row
const extraDarkRow = COLOR_FAMILIES.map(family =>
  generateColorVariation(family, 0.35, 0.8)  // L=0.35, chroma*0.8
);
```

### Example 3: Interactive Color Adjuster

```typescript
function ColorAdjuster({ baseColor }: { baseColor: string }) {
  const [lightness, setLightness] = useState(0.78);
  const [chroma, setChroma] = useState(1.0);

  const adjustedColor = React.useMemo(() => {
    let color = adjustColorLightness(baseColor, lightness - 0.78);
    return adjustColorChroma(color, chroma);
  }, [baseColor, lightness, chroma]);

  return (
    <div>
      <div style={{ backgroundColor: adjustedColor }} />
      <input type="range" min="0.2" max="0.95" step="0.01"
        value={lightness} onChange={e => setLightness(+e.target.value)} />
      <input type="range" min="0.5" max="1.5" step="0.1"
        value={chroma} onChange={e => setChroma(+e.target.value)} />
    </div>
  );
}
```

## Troubleshooting

### Colors Look Different Than Expected

1. **Check browser support**: Ensure you're using a modern browser with OKLCH support
2. **Verify theme**: Some themes may have color filters applied (dark mode, high contrast)
3. **Monitor calibration**: OKLCH is device-independent but displays vary

### Colors Too Saturated/Desaturated

Adjust `globalChromaMultiplier` in `COLOR_DESIGN_TOKENS`:

```typescript
globalChromaMultiplier: 0.8,  // Less saturated
globalChromaMultiplier: 1.3,  // More saturated
```

### Colors Too Light/Dark

Adjust `globalLightnessOffset`:

```typescript
globalLightnessOffset: -0.05,  // Darker
globalLightnessOffset: 0.05,   // Lighter
```

### Specific Color Needs Adjustment

Use per-family overrides:

```typescript
familyOverrides: {
  red: {
    chromaMultiplier: 1.2,  // Make red more vibrant
  },
  gray: {
    chromaMultiplier: 0.0,  // Keep gray completely desaturated
  },
},
```

## Migration Guide

### From Hex-Based System

**Before:**
```typescript
const COLOR_PALETTE = [
  ['#dbeafe', '#daf5f0', ...],
  ['#93c5fd', '#5eead4', ...],
];
```

**After:**
```typescript
import { COLOR_PALETTE } from '@/utils/colorSystem';
// Palette is automatically generated
```

### Updating Existing Colors

1. Identify the color family and row
2. Use corresponding index from COLOR_PALETTE
3. Or use helper functions for dynamic generation

## Performance Considerations

### Precomputed Palette

The `COLOR_PALETTE` constant is computed once at module load:

```typescript
export const COLOR_PALETTE = generateColorPalette();  // Computed once
```

### Runtime Generation

For dynamic colors, memoize results:

```typescript
const customColor = useMemo(() =>
  generateColorVariation(family, lightness, chroma),
  [family, lightness, chroma]
);
```

## Best Practices

1. **Use PRESET_COLORS for defaults**: Row 2 (light) is optimized for tags/badges
2. **Use DISTINCT_COLOR_SEQUENCE**: Ensures maximum visual distinction
3. **Adjust tokens, not code**: Prefer `COLOR_DESIGN_TOKENS` over modifying core functions
4. **Test in dark mode**: Ensure colors work in all theme variants
5. **Consider accessibility**: Verify sufficient contrast ratios (WCAG AA: 4.5:1)

## Future Enhancements

Potential additions to the system:

- **Contrast checker**: Validate WCAG compliance
- **Color blindness simulation**: Preview palette for different vision types
- **Theme integration**: Auto-adjust for dark/light modes
- **Export formats**: Generate Figma/Sketch color libraries
- **Named colors**: Semantic labels like "success", "warning", "info"

## Resources

- [OKLCH Color Picker](https://oklch.com/)
- [OKLCH Browser Support](https://caniuse.com/mdn-css_types_color_oklch)
- [Color Science Primer](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/)
- [Culori (Color Conversion Library)](https://culorijs.org/)

## Support

For questions or issues with the color system, see:
- `/src/utils/colorSystem.ts` - Source code
- `/src/components/SelectFieldConfig.tsx` - Usage example
