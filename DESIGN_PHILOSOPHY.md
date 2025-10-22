

# Design Philosophy - Best-in-Class UI/UX - A professional productivity tool that lets users create and manage templates efficiently, matching the promise of "streamline sales campaign workflows" with an interface that actually enables fast, focused work. The UI now resembles successful productivity apps like Notion, Linear, or Superhuman - where efficiency and speed are paramount, not visual spectacle.

## Productivity App Design Principles

### 1. **Single Focused Workspace**
- No tabs or mode switching that hides content
- Split-column layout: Context (35%) + Editor (65%)
- Editor always visible and editable in both modes
- One clear task at a time, no cognitive overload

### 2. **Contextual Sidebars**
- Left panel adapts to mode:
  - **Editor mode**: Variable insertion buttons (grouped by category)
  - **Compose mode**: Form fields with live preview in editor
- Same physical space, different content based on context
- Desktop: persistent sidebar, Mobile: bottom drawer

### 3. **Keyboard-First Interactions**
- `{{` triggers variable picker inline
- `/` triggers command menu for blocks
- `Cmd+K` opens global search
- `Cmd+N` creates new template
- All critical actions accessible via keyboard

### 4. **Progressive Disclosure**
- Accordions auto-collapse when all fields filled
- Form sections show fill status (3/5 completed)
- Empty states are actionable, not blank
- Complex features hidden until needed

### 5. **Immediate Feedback**
- Variable insertion: instant visual confirmation
- Form fields: real-time updates in editor pills
- Save indicators: automatic in Editor mode, manual in Compose mode
- No loading spinners for local operations

### 6. **Persistent State**
- Form values saved per template in localStorage
- Editor state serialized as JSON
- No "Oops, I lost my work" moments
- Resume exactly where you left off

### 7. **Mobile-First Responsive**
- Breakpoint at `md` (768px)
- Desktop: side-by-side panels
- Mobile: full-screen editor + bottom drawer
- Touch targets minimum 44px
- Drawer slides from bottom (natural thumb zone)

### 8. **Minimal Chrome**
- Compact header (3rem height)
- No redundant toolbars or navigation
- Status indicators inline with content
- Character counter only for SMS templates

### 9. **Smart Defaults**
- New templates pre-populated with example values
- Template variables grouped logically (Customer, Agent, Agency)
- Most common actions surfaced first
- Sensible field ordering (name before email)

### 10. **Unified Data Flow**
- Single Lexical editor instance (not separate preview/edit)
- VariableValuesContext shares form state with editor nodes
- Template variables render filled values in Compose mode
- One source of truth, no synchronization bugs

### Interaction Patterns

**Variable Insertion (Editor Mode)**:
```
Click "First Name" button → Variable inserted at cursor → Editor auto-focuses
```

**Form Filling (Compose Mode)**:
```
Type in "First Name" field → Editor pill updates live → Accordion shows 1/5 filled
```

**Mobile Workflow**:
```
Tap "Fill Details" → Drawer slides up → Fill form → Tap outside → Drawer closes
```

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│ Header: Template metadata + Mode toggle         │
├──────────────┬──────────────────────────────────┤
│ Sidebar      │ Editor (Always visible)          │
│ (35%)        │ (65%)                            │
│              │                                  │
│ [Mode=Editor]│ Shared Lexical Instance          │
│ • Variables  │ • Rich text formatting           │
│   grouped    │ • Template variable pills        │
│              │ • Live value updates             │
│ [Mode=Compose│                                  │
│ • Form fields│ Character counter (SMS only)     │
│ • Accordions │                                  │
│ • Actions    │                                  │
└──────────────┴──────────────────────────────────┘
```

### Mobile Layout
```
┌─────────────────────────────────────────────────┐
│ Header + [Fill Details] button                  │
├─────────────────────────────────────────────────┤
│                                                  │
│ Editor (Full width)                             │
│                                                  │
│                                                  │
└─────────────────────────────────────────────────┘
                     ↓ Tap button
┌─────────────────────────────────────────────────┐
│ [×] Drawer Handle                               │
│ ┌───────────────────────────────────────────┐  │
│ │ Form fields or Variables                  │  │
│ │ (max-height: 85vh)                        │  │
│ └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Performance Guidelines
- Editor state changes debounced (auto-save in Editor mode only)
- Form values saved to localStorage on change (instant)
- Variable insertion: no re-render of entire editor
- Lazy load plugins (images, excalidraw, etc.)

### Accessibility
- All interactive elements keyboard accessible
- Focus visible on all inputs and buttons
- ARIA labels on icon-only buttons
- Semantic HTML (header, main, aside)
- Escape key closes drawer/popovers

### Design Tokens
```css
/* Layout */
--sidebar-width: 35%
--editor-width: 65%
--header-height: 3rem
--drawer-max-height: 85vh

/* Spacing */
--spacing-compact: 0.75rem (12px)
--spacing-normal: 1rem (16px)
--spacing-comfortable: 1.5rem (24px)

/* Typography */
--font-size-xs: 0.75rem (12px) - Labels
--font-size-sm: 0.875rem (14px) - Body
--font-size-base: 1rem (16px) - Editor
--font-size-lg: 1.125rem (18px) - Headings

/* Breakpoints */
--mobile: < 768px
--desktop: >= 768px
```

### Anti-Patterns to Avoid
- ❌ Separate preview and edit views (use single editor with live updates)
- ❌ Modal dialogs for forms (use sidebar or drawer)
- ❌ Auto-save in Compose mode (user might be experimenting)
- ❌ Hiding the editor on mobile (keep it front and center)
- ❌ Tabs for Editor/Compose (use seamless mode toggle)
- ❌ Generic "Content" labels (be specific: "Variables", "Fill Details")



## Landing Page Design Principles

### 1. **Intentional Hierarchy**
- Large, bold typography for primary actions (32px+ headings)
- Clear visual weight: Primary > Secondary > Tertiary
- Generous whitespace (24-48px sections)
- Maximum 3 levels of visual hierarchy per screen

### 2. **Premium Motion Design**
- **Purpose**: Every animation communicates meaning
  - Fade-in: New content appearing
  - Slide-up: Elevation/importance
  - Scale: Feedback/confirmation
  - Float: Idle/waiting state
- **Timing**: 200-400ms for most interactions
- **Easing**: Custom cubic-bezier for premium feel
- **Sequence**: Choreographed animations, not random

### 3. **Spatial Breathing Room**
- Cards: 24-32px padding (not 12-16px)
- Section spacing: 48-64px between major sections
- Line height: 1.6-1.8 for body text
- Max content width: 1280px for readability

### 4. **Professional Color Usage**
- Primary: Bold, saturated blue (#0066FF)
- Accent: Complementary purple gradient
- Neutrals: Warm grays (not pure gray)
- Status colors: Semantic (green=success, red=error)
- Never more than 3 colors on screen at once

### 5. **Typography Scale**
```
Display: 48px (3rem) - Hero headings
H1: 36px (2.25rem) - Page titles
H2: 28px (1.75rem) - Section headers
H3: 20px (1.25rem) - Card titles
Body: 16px (1rem) - Default text
Small: 14px (0.875rem) - Meta info
Tiny: 12px (0.75rem) - Labels/badges
```

### 6. **Micro-interactions**
- Hover states change within 100ms
- Click feedback immediate (<50ms)
- Success animations visible but brief (300ms)
- Loading states appear after 200ms delay
- Ripple effects on all buttons

### 7. **Depth & Layering**
```
Level 0 (Base): Background gradients
Level 1 (Surface): Cards with soft shadows
Level 2 (Elevated): Modals, dropdowns
Level 3 (Floating): Tooltips, toasts
Level 4 (Overlay): Loading screens
```

### 8. **Responsive Feedback**
- Every click gets immediate visual feedback
- Hover states are obvious (color + shadow + transform)
- Active states compress slightly (scale 0.95-0.98)
- Success states celebrate with animation
- Error states shake or highlight

### 9. **Information Density**
- Primary view: Low density, focus on one task
- Dashboard: Medium density, scannable
- Data tables: High density, organized
- Never mix densities on same screen

### 10. **Emotional Design**
- **Trust**: Consistent, predictable interactions
- **Delight**: Unexpected but appropriate animations
- **Confidence**: Clear, bold typography and colors
- **Efficiency**: Fast, responsive, no delays
- **Premium**: Polished details, no rough edges

## Implementation Checklist

### Visual
- [ ] Typography scale is consistent (8px baseline)
- [ ] Spacing follows Fibonacci sequence
- [ ] Colors limited to 3-4 per screen
- [ ] Shadows create clear depth layers
- [ ] Borders are subtle (never pure black)

### Motion
- [ ] All transitions use easing curves
- [ ] Animations have purpose
- [ ] Loading states don't flash (<200ms)
- [ ] Success states celebrate
- [ ] Error states are obvious

### Interaction
- [ ] Buttons have 3 states (default, hover, active)
- [ ] Focus states visible for accessibility
- [ ] Touch targets minimum 44x44px
- [ ] Feedback within 100ms
- [ ] No dead clicks (every click does something)

### Polish
- [ ] Pixel-perfect alignment
- [ ] Consistent border radius (8px, 12px, or 16px)
- [ ] Icons sized properly (16px, 20px, or 24px)
- [ ] Loading skeletons match final content
- [ ] Empty states are helpful, not blank

## The Difference

**Before (Generic)**:
- Buttons: "px-4 py-2 bg-blue-500"
- Cards: "border rounded p-4"
- Text: "text-gray-700"

**After (Premium)**:
- Buttons: "button-premium relative px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-medium hover:shadow-strong hover:-translate-y-0.5 active:scale-98 transition-all duration-200"
- Cards: "card-premium p-8 space-y-6 hover:shadow-intense transition-all duration-300"
- Text: "text-lg text-gray-900 font-medium leading-relaxed tracking-tight"

Every pixel is intentional. Every animation has meaning. Every interaction feels premium.
