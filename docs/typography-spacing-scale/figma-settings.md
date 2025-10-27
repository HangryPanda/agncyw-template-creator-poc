

## Figma Variables Setup Guide

### Collection 1: Spacing
Create a **Number** collection named "Spacing":
``` typescript
spacing/2xs → 2
spacing/xs → 4
spacing/sm → 6
spacing/md → 8
spacing/lg → 12
spacing/xl → 16
spacing/2xl → 24
spacing/3xl → 32
spacing/4xl → 48
```

### Collection 2: Typography - Font Size
Create a **Number** collection named "Font Size":
``` typescript
fontSize/2xs → 10
fontSize/xs → 11
fontSize/sm → 12
fontSize/base → 13
fontSize/md → 14
fontSize/lg → 16
fontSize/xl → 18
fontSize/2xl → 20
fontSize/3xl → 24
fontSize/4xl → 30
```

### Collection 3: Typography - Line Height
Create a **Number** collection named "Line Height":
``` typescript
lineHeight/tight → 1.25
lineHeight/normal → 1.5
lineHeight/relaxed → 1.75
```

### Collection 4: Typography - Font Weight
Create a **Number** collection named "Font Weight":
``` typescript
fontWeight/regular → 400
fontWeight/medium → 500
fontWeight/semibold → 600
fontWeight/bold → 700
```

### Collection 5: Typography - Font Family
Create a **String** collection named "Font Family":
``` typescript
fontFamily/base → Inter
fontFamily/mono → JetBrains Mono
```

### Collection 6: Breakpoints (for reference)
Create a **Number** collection named "Breakpoints":
``` typescript
breakpoint/panel-xs → 360
breakpoint/panel-sm → 420
breakpoint/panel-md → 480
breakpoint/panel-lg → 600
breakpoint/panel-xl → 720
breakpoint/panel-full → 1024
```

### Collection 7: Colors - Primitives
Create a **Color** collection named "Colors":

#### Gray Scale
``` typescript
color/gray/50 → #F9FAFB
color/gray/100 → #F3F4F6
color/gray/200 → #E5E7EB
color/gray/300 → #D1D5DB
color/gray/400 → #9CA3AF
color/gray/500 → #6B7280
color/gray/600 → #4B5563
color/gray/700 → #374151
color/gray/800 → #1F2937
color/gray/900 → #111827
color/gray/950 → #030712
```

#### Blue Scale (Primary)
``` typescript
color/blue/50 → #EFF6FF
color/blue/100 → #DBEAFE
color/blue/200 → #BFDBFE
color/blue/300 → #93C5FD
color/blue/400 → #60A5FA
color/blue/500 → #3B82F6
color/blue/600 → #2563EB
color/blue/700 → #1D4ED8
color/blue/800 → #1E40AF
color/blue/900 → #1E3A8A
```

#### Red Scale (Danger/Error)
``` typescript
color/red/50 → #FEF2F2
color/red/100 → #FEE2E2
color/red/200 → #FECACA
color/red/300 → #FCA5A5
color/red/400 → #F87171
color/red/500 → #EF4444
color/red/600 → #DC2626
color/red/700 → #B91C1C
color/red/800 → #991B1B
color/red/900 → #7F1D1D
```

#### Green Scale (Success)
``` typescript
color/green/50 → #F0FDF4
color/green/100 → #DCFCE7
color/green/200 → #BBF7D0
color/green/300 → #86EFAC
color/green/400 → #4ADE80
color/green/500 → #22C55E
color/green/600 → #16A34A
color/green/700 → #15803D
color/green/800 → #166534
color/green/900 → #14532D
```

#### Yellow Scale (Warning)
``` typescript
color/yellow/50 → #FEFCE8
color/yellow/100 → #FEF9C3
color/yellow/200 → #FEF08A
color/yellow/300 → #FDE047
color/yellow/400 → #FACC15
color/yellow/500 → #EAB308
color/yellow/600 → #CA8A04
color/yellow/700 → #A16207
color/yellow/800 → #854D0E
color/yellow/900 → #713F12
```

#### Orange Scale (Attention)
``` typescript
color/orange/50 → #FFF7ED
color/orange/100 → #FFEDD5
color/orange/200 → #FED7AA
color/orange/300 → #FDBA74
color/orange/400 → #FB923C
color/orange/500 → #F97316
color/orange/600 → #EA580C
color/orange/700 → #C2410C
color/orange/800 → #9A3412
color/orange/900 → #7C2D12
```

---

## Design-to-Development Workflow

### Overview: 2-Tier Automated System

This project uses a **Claude Code-powered automated workflow** that eliminates manual translation between design and development.

**Architecture:**
```
Tier 1: Figma Primitives (Designer Domain)
   ↓
Claude Code Mapping Layer (Automated)
   ↓
Tier 2: Theme Variables (Developer Domain)
   ↓
Components (Use theme variables only)
```

---

### For Designers

#### Design Phase
1. **Work in Figma** using the primitive tokens defined above
2. **Design against dark theme** as baseline
3. **Use semantic labels** when handing off:
   - "This uses blue/600 for primary actions"
   - "Border uses gray/200"
   - "Text uses gray/900 for primary content"

#### Handoff Process
1. Export tokens from Figma (if needed for sync)
2. Provide design file with semantic annotations
3. Indicate which primitive represents which semantic meaning:
   - Primary action color: `blue/600`
   - Border color: `gray/200`
   - Success states: `green/600`
   - Error states: `red/600`
   - etc.

#### When Colors Change
1. Update primitive values in Figma
2. Export tokens (optional)
3. Notify developer: "Primary changed from blue/600 to purple/600"
4. Claude Code handles the rest automatically

---

### For Developers (Claude Code)

#### Implementation Rules

**❌ NEVER use primitive colors directly:**
```tsx
// ❌ DON'T
<button className="bg-[#2563EB]">
<button style={{ background: 'var(--color-blue-600)' }}>
```

**✅ ALWAYS use theme variables:**
```tsx
// ✅ DO
<button className="bg-primary text-primary-foreground">
<div className="border border-border">
<p className="text-foreground">
```

#### Figma Token → Theme Variable Mapping

| Figma Token | Theme Variable | Usage | Tailwind Class |
|-------------|----------------|-------|----------------|
| **Colors** | | | |
| `blue/600` | `--primary` | Primary actions, links | `bg-primary`, `text-primary` |
| `blue/500` | `--ring` | Focus rings | `ring-ring` |
| `gray/900` | `--foreground` | Primary text | `text-foreground` |
| `gray/600` | `--muted-foreground` | Secondary text | `text-muted-foreground` |
| `gray/200` | `--border` | Borders, dividers | `border-border` |
| `gray/50` | `--accent` | Subtle backgrounds | `bg-accent` |
| `white` | `--background` | Surface color | `bg-background` |
| `red/600` | `--destructive` | Errors, danger | `bg-destructive` |
| `green/600` | `--success`* | Success states | `bg-success` |
| `yellow/600` | `--warning`* | Warnings | `bg-warning` |
| **Typography** | | | |
| `fontSize/base` | `--fontSize-base` | Default text | `text-base` |
| `fontWeight/medium` | `--fontWeight-medium` | Medium weight | `font-medium` |
| **Spacing** | | | |
| `spacing/md` | `--spacing-md` | Default spacing | `p-2` (8px) |
| `spacing/lg` | `--spacing-lg` | Comfortable spacing | `p-3` (12px) |

*Note: If theme variable doesn't exist yet, add it to `src/index.css`

#### Automated Mapping Process

When implementing a Figma design:

1. **Read Figma annotations**: "Button uses blue/600 for background"
2. **Map to theme variable**: `blue/600` → `--primary`
3. **Generate component**: Use Tailwind class `bg-primary`
4. **Result**: Theme-aware component that works in light/dark modes

**Example Workflow:**

**Figma Handoff:**
```
Button Component
- Background: blue/600 (primary action)
- Text: white
- Border: none
- Border radius: 6px
- Padding: spacing/sm spacing/lg (6px 12px)
```

**Claude Code Implementation:**
```tsx
export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="bg-primary text-primary-foreground rounded-md px-3 py-1.5"
      {...props}
    >
      {children}
    </button>
  )
}
```

**Why it works:**
- `bg-primary` → Uses theme-aware primary color
- `text-primary-foreground` → Automatically contrasts with primary
- Component works in both light and dark themes
- No manual color values anywhere

---

### Automation Possibilities (Future MCP Tools)

#### Figma Token Import Command
```bash
# Concept: Automated token sync
claude-code import-figma-tokens primitives.json

# Claude Code would:
# 1. Read primitives.json
# 2. Identify semantic mappings (blue/600 = primary)
# 3. Update theme variables in src/index.css
# 4. Convert hex to HSL format automatically
# 5. Report changes
```

#### Design Handoff Assistant
```bash
# Concept: Parse Figma design with Claude Code
claude-code implement-design <figma-url> --component Button

# Claude Code would:
# 1. Read Figma design specs
# 2. Identify colors/spacing/typography used
# 3. Map to theme variables automatically
# 4. Generate component following construct pattern
# 5. Apply proper naming conventions
```

---

### Benefits of This Workflow

**For Designers:**
- ✅ Work in familiar Figma environment
- ✅ Use readable token names (blue/600, not HSL values)
- ✅ No need to learn theme variable system
- ✅ Color changes are simple Figma updates

**For Developers:**
- ✅ No manual translation work
- ✅ Claude Code enforces theme variable usage
- ✅ Components automatically theme-aware
- ✅ Consistent patterns across codebase

**For the Team:**
- ✅ Single source of truth (Figma)
- ✅ Automated enforcement via Claude Code
- ✅ Scales easily (new devs follow same pattern)
- ✅ Reduces maintenance overhead

---

## File Locations

**Figma Token Definitions:**
- This file: `/docs/typography-spacing-scale/figma-settings.md`

**Primitive Token CSS:**
- Generated CSS: `/docs/typography-spacing-scale/design-tokens.css`
- **Note**: Primitives are for Figma sync only, never used directly in components

**Theme Variables (actual implementation):**
- Theme system: `/src/index.css`
- Contains `--primary`, `--border`, `--foreground`, etc.
- These are what components actually use

**Mapping Documentation:**
- See table above for Figma → Theme mappings
- Claude Code uses this mapping automatically
- Update mapping table when adding new semantic tokens

---

## Common Scenarios

### Scenario 1: Designer Changes Primary Color

**Designer action:**
1. Updates `color/blue/600` → `color/purple/600` in Figma
2. Exports tokens (optional)
3. Tells developer: "Primary changed to purple/600"

**Developer action:**
1. "Claude, update primary color from blue/600 to purple/600"
2. Claude updates `--primary` value in `src/index.css`
3. Done - all components update automatically

### Scenario 2: New Component from Figma

**Designer provides:**
- Figma design with color annotations
- "Card uses gray/50 for background, gray/200 for border"

**Developer asks Claude:**
- "Build Card component from this Figma spec"

**Claude generates:**
```tsx
export function Card({ children }: CardProps) {
  return (
    <div className="bg-accent border border-border rounded-lg p-4">
      {children}
    </div>
  )
}
```

### Scenario 3: Adding New Semantic Token

**Need:** Warning state feedback color

**Steps:**
1. Identify Figma primitive: `yellow/600`
2. Add to theme (`src/index.css`):
   ```css
   --warning: 48 96% 53%; /* yellow/600 in HSL */
   --warning-foreground: 26 83% 14%;
   ```
3. Update mapping table in this document
4. Claude Code now knows `yellow/600` → `--warning`

---

## Notes

- **Primitives are sync-only**: The primitive tokens in `design-tokens.css` exist for Figma export/import compatibility, not for direct use in components
- **Theme variables are implementation**: Components always use theme variables (`--primary`, `--border`, etc.)
- **Claude Code is the bridge**: Automatically maps Figma primitives to theme variables during implementation
- **Design in dark theme**: Use dark theme as baseline in Figma to match development environment