/**
 * Color System Demo Component
 *
 * Interactive demonstration of the OKLCH-based color system.
 * Use this to:
 * - Preview the color palette
 * - Test color adjustments
 * - Visualize color families and variations
 * - Experiment with design tokens
 */

import { useState } from 'react';
import { Button } from '@/components/ui/primitives/shadcn/Button';
import { Input } from '@/components/ui/primitives/shadcn/Input';
import { Label } from '@/components/ui/primitives/shadcn/Label';
import {
  COLOR_PALETTE,
  PRESET_COLORS,
  COLOR_FAMILIES,
  LIGHTNESS_SCALE,
  DISTINCT_COLOR_SEQUENCE,
  generateColorVariation,
  adjustColorLightness,
  adjustColorChroma,
  getNextDistinctColor,
} from '@/utils/colorSystem';

export default function ColorSystemDemo(): JSX.Element {
  const [selectedColor, setSelectedColor] = useState<string>(PRESET_COLORS[0]);
  const [lightnessAdjust, setLightnessAdjust] = useState<number>(0);
  const [chromaMultiplier, setChromaMultiplier] = useState<number>(1.0);

  const adjustedColor = (() => {
    let color = selectedColor;
    if (lightnessAdjust !== 0) {
      color = adjustColorLightness(color, lightnessAdjust);
    }
    if (chromaMultiplier !== 1.0) {
      color = adjustColorChroma(color, chromaMultiplier);
    }
    return color;
  })();

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Color System Demo</h1>
        <p className="text-muted-foreground">
          Interactive demonstration of the OKLCH-based color palette
        </p>
      </div>

      {/* Full Color Palette */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Full Color Palette</h2>
          <p className="text-sm text-muted-foreground mb-4">
            4 rows × 10 color families. Click any color to select it.
          </p>
        </div>

        <div className="space-y-3">
          {COLOR_PALETTE.map((row, rowIndex) => {
            const rowLabel = ['Lightest (0.92)', 'Light (0.78)', 'Medium (0.60)', 'Dark (0.45)'][rowIndex];
            return (
              <div key={rowIndex}>
                <div className="text-xs text-muted-foreground mb-1 font-mono">
                  Row {rowIndex + 1}: {rowLabel}
                </div>
                <div className="flex gap-2">
                  {row.map((color, colorIndex) => (
                    <button
                      key={`${rowIndex}-${colorIndex}`}
                      className="relative w-16 h-16 rounded-lg border-2 border-border hover:border-ring transition-all hover:scale-105 group"
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      title={`${COLOR_FAMILIES[colorIndex].name}\n${color}`}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors" />
                      {selectedColor === color && (
                        <div className="absolute inset-0 border-4 border-ring rounded-lg" />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 text-[10px] text-center bg-black/50 text-white py-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                        {COLOR_FAMILIES[colorIndex].name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Preset Colors (Row 2) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Preset Colors (Default Row)</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Row 2 colors used by default for tags and badges
          </p>
        </div>

        <div className="flex gap-3">
          {PRESET_COLORS.map((color, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <button
                className="w-20 h-20 rounded-xl border-2 border-border hover:border-ring transition-all hover:scale-105"
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                title={color}
              />
              <div className="text-xs font-mono text-muted-foreground">
                {COLOR_FAMILIES[index].name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Distinct Color Sequence */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Distinct Color Sequence</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Order used for maximum visual distinction between consecutive tags
          </p>
        </div>

        <div className="flex gap-3">
          {DISTINCT_COLOR_SEQUENCE.map((colorIndex, position) => {
            const color = PRESET_COLORS[colorIndex];
            return (
              <div key={position} className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-xl border-2 border-border"
                    style={{ backgroundColor: color }}
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    {position + 1}
                  </div>
                </div>
                <div className="text-xs font-mono text-muted-foreground">
                  {COLOR_FAMILIES[colorIndex].name}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Color Families Detail */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Color Families</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Base hue and chroma values for each color family
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {COLOR_FAMILIES.map((family, index) => (
            <div
              key={family.name}
              className="border rounded-lg p-4 space-y-3 bg-card"
            >
              <div
                className="w-full h-20 rounded-lg"
                style={{ backgroundColor: PRESET_COLORS[index] }}
              />
              <div className="space-y-1">
                <div className="font-semibold capitalize">{family.name}</div>
                <div className="text-xs text-muted-foreground font-mono space-y-0.5">
                  <div>Hue: {family.hue}°</div>
                  <div>Chroma: {family.chroma.toFixed(3)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Adjustments */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Interactive Color Adjuster</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Select a color above and adjust lightness and saturation
          </p>
        </div>

        <div className="border rounded-lg p-6 bg-card space-y-6">
          <div className="flex gap-6 items-center">
            <div className="space-y-2">
              <div className="text-sm font-medium">Original</div>
              <div
                className="w-24 h-24 rounded-xl border-2 border-border"
                style={{ backgroundColor: selectedColor }}
              />
              <div className="text-xs font-mono text-muted-foreground break-all max-w-[96px]">
                {selectedColor}
              </div>
            </div>

            <div className="text-2xl text-muted-foreground">→</div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Adjusted</div>
              <div
                className="w-24 h-24 rounded-xl border-2 border-ring"
                style={{ backgroundColor: adjustedColor }}
              />
              <div className="text-xs font-mono text-muted-foreground break-all max-w-[96px]">
                {adjustedColor}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="lightness-adjust">Lightness Adjust</Label>
                  <span className="text-sm text-muted-foreground font-mono">
                    {lightnessAdjust > 0 ? '+' : ''}{lightnessAdjust.toFixed(2)}
                  </span>
                </div>
                <Input
                  id="lightness-adjust"
                  type="range"
                  min="-0.3"
                  max="0.3"
                  step="0.01"
                  value={lightnessAdjust}
                  onChange={(e) => setLightnessAdjust(parseFloat(e.target.value))}
                  className="cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="chroma-multiply">Chroma Multiplier</Label>
                  <span className="text-sm text-muted-foreground font-mono">
                    ×{chromaMultiplier.toFixed(2)}
                  </span>
                </div>
                <Input
                  id="chroma-multiply"
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={chromaMultiplier}
                  onChange={(e) => setChromaMultiplier(parseFloat(e.target.value))}
                  className="cursor-pointer"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLightnessAdjust(0);
                  setChromaMultiplier(1.0);
                }}
              >
                Reset Adjustments
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Lightness Scale */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Lightness Scale</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Defined lightness levels for each row
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {Object.entries(LIGHTNESS_SCALE).map(([key, value]) => (
            <div key={key} className="border rounded-lg p-4 bg-card space-y-2">
              <div className="font-semibold capitalize">{key}</div>
              <div className="text-2xl font-mono">{value.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">
                Lightness value (0-1)
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Usage Examples */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Usage Examples</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Simulated tags using the color system
          </p>
        </div>

        <div className="border rounded-lg p-6 bg-card space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-medium">Auto-assigned colors (distinct sequence)</div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-full text-sm font-medium border"
                  style={{
                    backgroundColor: getNextDistinctColor(i),
                    borderColor: adjustColorLightness(getNextDistinctColor(i), -0.1),
                  }}
                >
                  Tag {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Preset colors (sequential)</div>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-full text-sm font-medium border"
                  style={{
                    backgroundColor: color,
                    borderColor: adjustColorLightness(color, -0.1),
                  }}
                >
                  {COLOR_FAMILIES[i].name}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">All palette rows for blue family</div>
            <div className="flex flex-wrap gap-2">
              {COLOR_PALETTE.map((row, rowIndex) => {
                const color = row[0]; // Blue is index 0
                return (
                  <div
                    key={rowIndex}
                    className="px-3 py-1.5 rounded-full text-sm font-medium border"
                    style={{
                      backgroundColor: color,
                      borderColor: adjustColorLightness(color, -0.1),
                    }}
                  >
                    Row {rowIndex + 1}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Code Examples</h2>
        </div>

        <div className="border rounded-lg p-4 bg-muted/30 font-mono text-sm space-y-3">
          <div>
            <div className="text-muted-foreground mb-1">// Import the color system</div>
            <div>import {'{ COLOR_PALETTE, PRESET_COLORS }'} from '@/utils/colorSystem';</div>
          </div>

          <div>
            <div className="text-muted-foreground mb-1">// Use preset colors for tags</div>
            <div>const tagColor = PRESET_COLORS[0]; // Blue</div>
          </div>

          <div>
            <div className="text-muted-foreground mb-1">// Get next distinct color</div>
            <div>const nextColor = getNextDistinctColor(options.length);</div>
          </div>

          <div>
            <div className="text-muted-foreground mb-1">// Adjust existing color</div>
            <div>const lighter = adjustColorLightness(color, 0.05);</div>
            <div>const saturated = adjustColorChroma(color, 1.3);</div>
          </div>
        </div>
      </section>
    </div>
  );
}
