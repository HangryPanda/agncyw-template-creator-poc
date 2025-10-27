# Implementation Brief — Contrast Boost (OKLCH + optional WCAG guard)

## Context
- Stack: Laravel + Vite + React + Tailwind  
- Design tokens already compiled to CSS variables (light/dark + variants)  
- Tailwind utilities consume tokens via `var(--token)`

## Goal
Add a global math-driven contrast control that works across all themes/variants **without duplicating theme files**:  
- Primary: CSS-only boost using **OKLCH relative color math** via `--contrast-k` (1 = normal, > 1 = higher contrast)  
- Optional: JS “WCAG guard” ensuring text/background pairs reach ≥ 4.5:1 contrast  

## Deliverables
1. CSS layer computing adjusted tokens from base colors  
2. React hook `useContrastMode()` for toggle + persistence  
3. *(Optional)* JS `contrastGuard.ts` enforcing WCAG  
4. Short README snippet describing usage  

---

## 1. CSS — contrast math layer  
Create `resources/css/tokens/contrast.css` and import it **after** your base/theme CSS.

```css
/* Global contrast knob */
:root { --contrast-k: 1; }
:root[data-contrast="high"] { --contrast-k: 1.35; }

/* Derived tokens from base tokens (defined per theme) */
:root {
  /* Base tokens supplied by your themes */
  /* --bg-base, --fg-base, --muted-base, --accent-base, etc. */

  /* Push lightness away from 0.5 for higher contrast */
  --bg: oklch(from var(--bg-base) calc(0.5 + (l - 0.5) * var(--contrast-k)) c h);
  --fg: oklch(from var(--fg-base)
              calc(0.5 + (l - 0.5) * var(--contrast-k))
              calc(c / var(--contrast-k))
              h);
  --muted: oklch(from var(--muted-base)
                calc(0.5 + (l - 0.5) * var(--contrast-k))
                c h);

  /* Accents: mix toward anchor (white on dark, black on light) */
  --contrast-anchor: white;
  --accent: color-mix(in oklch,
              var(--accent-base),
              var(--contrast-anchor)
              calc(max(0, var(--contrast-k) - 1) * 22%));

  /* Borders / focus */
  --border-default: oklch(from var(--border-default-base)
                          calc(0.5 + (l - 0.5) * var(--contrast-k))
                          c h);
  --focus-ring: color-mix(in oklch,
                 var(--accent-base),
                 var(--contrast-anchor)
                 calc(max(0, var(--contrast-k) - 1) * 30%));
}
```

**Import order inside `resources/css/app.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import "tokens/base.css";      /* typography/spacing/etc. */
@import "themes/light.css";
@import "themes/dark.css";
/* ...other theme variants... */
@import "tokens/contrast.css";  /* must come last */
```

---

## 2. React hook for toggle + persistence  

**File:** `resources/js/theme/useContrast.ts`

```ts
import { useEffect, useState } from "react";

type ContrastMode = "normal" | "high";
const KEY = "ui-contrast";

export function useContrastMode() {
  const [contrast, setContrast] = useState<ContrastMode>(
    () => (localStorage.getItem(KEY) as ContrastMode) || "normal"
  );

  useEffect(() => {
    localStorage.setItem(KEY, contrast);
    const root = document.documentElement;
    if (contrast === "high") root.setAttribute("data-contrast", "high");
    else root.removeAttribute("data-contrast");
  }, [contrast]);

  return { contrast, setContrast };
}
```

**Usage Example:**  
```tsx
const { contrast, setContrast } = useContrastMode();
<select value={contrast} onChange={(e) => setContrast(e.target.value as any)}>
  <option value="normal">Normal contrast</option>
  <option value="high">High contrast</option>
</select>
```

---

## 3. Optional JS WCAG guard (hard guarantee ≥4.5:1)

**File:** `resources/js/theme/contrastGuard.ts`

```ts
import { converter, formatCss, wcagContrast } from 'culori';
const toOklch = converter('oklch');
const toSrgb = converter('rgb');

function stepBoost(fg: any, bg: any, factor = 1.1) {
  const F = { ...toOklch(fg) };
  const B = { ...toOklch(bg) };
  F.l = 0.5 + (F.l - 0.5) * factor;
  F.c = F.c / factor;
  return toSrgb(F);
}

export function ensurePairs(min = 4.5, pairs: Array<[string, string]>) {
  const style = getComputedStyle(document.documentElement);
  for (const [fgVar, bgVar] of pairs) {
    let fg = style.getPropertyValue(fgVar).trim();
    const bg = style.getPropertyValue(bgVar).trim();
    let tries = 0;
    while (wcagContrast(fg, bg) < min && tries++ < 12) {
      fg = formatCss(stepBoost(fg, bg));
    }
    document.documentElement.style.setProperty(fgVar, fg);
  }
}
```

Call it after toggling high contrast:
```ts
import { ensurePairs } from './contrastGuard';
ensurePairs(4.5, [
  ['--fg', '--bg'],
  ['--fg-muted', '--bg'],
  ['--button-fg', '--button-bg'],
]);
```

---

## Acceptance Criteria
- `<html data-contrast="high">` increases contrast across UI without switching themes.  
- Existing color variants retain mood but render higher contrast.  
- Tailwind utilities continue functioning (`var(--token)`).  
- Optional guard ensures ≥4.5:1 contrast ratios.

---

## Nice-to-haves
- Slider for adjustable `--contrast-k` values.  
- Auto switch of `--contrast-anchor` (white/black) based on mode.  
- Storybook examples for visual comparison.
