/**
 * OKLCH-based Color System for Tag/Option Colors
 *
 * This system defines base colors and programmatically generates variations
 * for light, medium, and dark shades. Uses OKLCH color space for perceptually
 * uniform color manipulation.
 *
 * OKLCH format: oklch(L C H)
 * - L (Lightness): 0-1 (0 = black, 1 = white)
 * - C (Chroma): 0-0.4 (saturation intensity)
 * - H (Hue): 0-360 (color wheel degrees)
 */

export interface ColorFamily {
  name: string;
  hue: number;        // Hue angle (0-360)
  chroma: number;     // Base saturation (0-0.4)
}

/**
 * Base color families with optimized hue and chroma values
 * Each family will generate 4 variations (lightest, light, medium, dark)
 */
export const COLOR_FAMILIES: ColorFamily[] = [
  { name: 'blue',    hue: 230, chroma: 0.12 },
  { name: 'teal',    hue: 180, chroma: 0.12 },
  { name: 'green',   hue: 145, chroma: 0.12 },
  { name: 'lime',    hue: 110, chroma: 0.12 },
  { name: 'yellow',  hue: 80,  chroma: 0.12 },
  { name: 'orange',  hue: 50,  chroma: 0.12 },
  { name: 'red',     hue: 15,  chroma: 0.14 },
  { name: 'pink',    hue: 340, chroma: 0.14 },
  { name: 'purple',  hue: 290, chroma: 0.12 },
  { name: 'gray',    hue: 0,   chroma: 0.00 },
];

/**
 * Lightness levels for each row of the color palette
 * Row 1: Very light (pastels for backgrounds)
 * Row 2: Light (tag/badge colors)
 * Row 3: Medium (active states, buttons)
 * Row 4: Dark (text on light backgrounds)
 */
export const LIGHTNESS_SCALE = {
  lightest: 0.92,  // Row 1: Very light pastels
  light:    0.78,  // Row 2: Light, friendly colors (DEFAULT)
  medium:   0.60,  // Row 3: Medium saturation
  dark:     0.45,  // Row 4: Dark, rich colors
};

/**
 * Chroma (saturation) adjustments for each lightness level
 * Lighter colors need slightly more chroma to appear vibrant
 */
const CHROMA_ADJUSTMENTS = {
  lightest: 1.0,   // Keep base chroma
  light:    1.2,   // Slightly more saturated
  medium:   1.3,   // More saturated
  dark:     1.0,   // Base chroma
};

/**
 * Generate OKLCH color string
 */
export function oklch(lightness: number, chroma: number, hue: number): string {
  return `oklch(${lightness.toFixed(2)} ${chroma.toFixed(3)} ${hue})`;
}

/**
 * Generate hex color from OKLCH
 * This is a simplified conversion - for production, consider using a library like 'culori'
 */
export function oklchToHex(lightness: number, chroma: number, hue: number): string {
  // For now, return the OKLCH string
  // Browsers with OKLCH support will handle this natively
  // For older browsers, you'd need a polyfill or conversion library
  return oklch(lightness, chroma, hue);
}

/**
 * Generate a single color variation
 */
export function generateColorVariation(
  family: ColorFamily,
  lightness: number,
  chromaMultiplier: number = 1.0
): string {
  const adjustedChroma = family.chroma * chromaMultiplier;
  return oklch(lightness, adjustedChroma, family.hue);
}

/**
 * Generate all 4 variations for a color family
 */
export function generateColorFamilyVariations(family: ColorFamily): {
  lightest: string;
  light: string;
  medium: string;
  dark: string;
} {
  return {
    lightest: generateColorVariation(
      family,
      LIGHTNESS_SCALE.lightest,
      CHROMA_ADJUSTMENTS.lightest
    ),
    light: generateColorVariation(
      family,
      LIGHTNESS_SCALE.light,
      CHROMA_ADJUSTMENTS.light
    ),
    medium: generateColorVariation(
      family,
      LIGHTNESS_SCALE.medium,
      CHROMA_ADJUSTMENTS.medium
    ),
    dark: generateColorVariation(
      family,
      LIGHTNESS_SCALE.dark,
      CHROMA_ADJUSTMENTS.dark
    ),
  };
}

/**
 * Generate complete color palette (4 rows x 10 colors)
 */
export function generateColorPalette(): string[][] {
  const palette: string[][] = [[], [], [], []];

  COLOR_FAMILIES.forEach((family) => {
    const variations = generateColorFamilyVariations(family);
    palette[0].push(variations.lightest);
    palette[1].push(variations.light);
    palette[2].push(variations.medium);
    palette[3].push(variations.dark);
  });

  return palette;
}

/**
 * Get default preset colors (row 2 - light colors)
 * These are the colors used by default for new options
 */
export function getPresetColors(): string[] {
  return COLOR_FAMILIES.map((family) =>
    generateColorVariation(
      family,
      LIGHTNESS_SCALE.light,
      CHROMA_ADJUSTMENTS.light
    )
  );
}

/**
 * Get distinct color sequence for maximum visual distinction
 * Orders colors to ensure maximum perceptual difference between consecutive tags
 */
export const DISTINCT_COLOR_SEQUENCE = [0, 2, 6, 8, 4, 1, 5, 7, 3, 9];
// This maps to: blue -> green -> red -> purple -> yellow -> teal -> orange -> pink -> lime -> gray

/**
 * Get next color for a new option based on existing option count
 */
export function getNextDistinctColor(existingCount: number): string {
  const presetColors = getPresetColors();
  const colorIndex = DISTINCT_COLOR_SEQUENCE[existingCount % DISTINCT_COLOR_SEQUENCE.length];
  return presetColors[colorIndex];
}

/**
 * Adjust color lightness (useful for hover states, dark mode, etc.)
 */
export function adjustColorLightness(
  oklchColor: string,
  lightnessOffset: number
): string {
  // Parse OKLCH color string
  const match = oklchColor.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
  if (!match) return oklchColor;

  const [, l, c, h] = match;
  const newLightness = Math.max(0, Math.min(1, parseFloat(l) + lightnessOffset));

  return oklch(newLightness, parseFloat(c), parseFloat(h));
}

/**
 * Adjust color chroma/saturation
 */
export function adjustColorChroma(
  oklchColor: string,
  chromaMultiplier: number
): string {
  const match = oklchColor.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
  if (!match) return oklchColor;

  const [, l, c, h] = match;
  const newChroma = Math.max(0, Math.min(0.4, parseFloat(c) * chromaMultiplier));

  return oklch(parseFloat(l), newChroma, parseFloat(h));
}

/**
 * Precomputed color palette (for performance)
 * Call this once and reuse the result
 */
export const COLOR_PALETTE = generateColorPalette();

/**
 * Preset colors for default use (row 2)
 */
export const PRESET_COLORS = getPresetColors();

/**
 * Design tokens for easy tweaking
 * Adjust these values to change the entire color system
 */
export const COLOR_DESIGN_TOKENS = {
  // Global adjustments
  globalChromaMultiplier: 1.0,  // Increase to make all colors more saturated
  globalLightnessOffset: 0.0,   // Increase to make all colors lighter

  // Row-specific adjustments
  lightest: {
    lightness: 0.92,
    chromaMultiplier: 1.0,
  },
  light: {
    lightness: 0.78,
    chromaMultiplier: 1.2,
  },
  medium: {
    lightness: 0.60,
    chromaMultiplier: 1.3,
  },
  dark: {
    lightness: 0.45,
    chromaMultiplier: 1.0,
  },

  // Per-family overrides (optional)
  familyOverrides: {
    red:    { chromaMultiplier: 1.15 },  // Slightly more saturated reds
    pink:   { chromaMultiplier: 1.15 },  // Slightly more saturated pinks
    gray:   { chromaMultiplier: 0.0 },   // Keep gray desaturated
  },
};

/**
 * Helper to get a color with design token adjustments
 */
export function getAdjustedColor(
  familyIndex: number,
  row: 'lightest' | 'light' | 'medium' | 'dark'
): string {
  const family = COLOR_FAMILIES[familyIndex];
  const tokens = COLOR_DESIGN_TOKENS[row];
  const familyOverride = COLOR_DESIGN_TOKENS.familyOverrides[
    family.name as keyof typeof COLOR_DESIGN_TOKENS.familyOverrides
  ];

  const chromaMultiplier =
    tokens.chromaMultiplier *
    COLOR_DESIGN_TOKENS.globalChromaMultiplier *
    (familyOverride?.chromaMultiplier ?? 1.0);

  const lightness = tokens.lightness + COLOR_DESIGN_TOKENS.globalLightnessOffset;

  return generateColorVariation(family, lightness, chromaMultiplier);
}
