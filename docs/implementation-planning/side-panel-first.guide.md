# Side Panel-First Design Strategy

## Design Philosophy

We design for side panel-first experiences optimized for Microsoft Edge Side Panel, where our application serves as a workflow supplement rather than a replacement. Users interact with our SaaS while simultaneously working in their primary applications (agency management systems, carrier portals, email, CRM, etc.). Our application fills workflow gaps and enhances productivity without disrupting existing processes.

---

## Core Principles

### 1. Contextual Assistance

- The app is always accessible but never intrusive
- Content prioritizes immediate-action items over comprehensive overviews
- Information architecture assumes user context from their primary workflow

### 2. Width-Responsive (Not Device-Responsive)

- Design for panel widths ranging from 360px (minimum functional) to 800px (maximum comfort)
- Layouts must gracefully adapt as users manually resize the panel
- Default panel width should be 480px (optimal balance of information density and usability)

### 3. Vertical Optimization

- Assume unlimited vertical scroll (desktop context)
- Horizontal space is precious; vertical space is abundant
- Stack rather than spread layouts

### 4. High Information Density

- Use 13px base typography and compact spacing scale
- Progressive disclosure over sprawling layouts
- Scannable data presentation (tables, lists, compact cards)

---

## Breakpoint Strategy

Define breakpoints based on panel width, not device size:

```typescript
{
  "breakpoints": {
    "panel-xs": {
      "$value": "360px",
      "$description": "Minimum functional width - single column, essential actions only"
    },
    "panel-sm": {
      "$value": "420px",
      "$description": "Narrow panel - comfortable single column with breathing room"
    },
    "panel-md": {
      "$value": "480px",
      "$description": "Default/optimal width - primary design target"
    },
    "panel-lg": {
      "$value": "600px",
      "$description": "Comfortable width - can introduce secondary columns sparingly"
    },
    "panel-xl": {
      "$value": "720px",
      "$description": "Wide panel - two-column layouts, expanded data tables"
    },
    "panel-full": {
      "$value": "1024px",
      "$description": "Full-width fallback - standard desktop layout"
    }
  }
}
```

---

## Layout Patterns by Width

### 360px - 419px (panel-xs)

**Philosophy:** Essential actions only, extreme prioritization

- Single column stacking only
- Collapse all secondary information into accordions/expandable sections
- **Navigation:** Hamburger menu or icon-only nav
- **Tables:** Show 2-3 critical columns, horizontal scroll for rest
- **Forms:** Full-width inputs stacked vertically
- **Cards:** Full-width, minimal padding (12px)
- **Actions:** Full-width primary buttons

**Example Layouts:**
- Quote list: Name + Status only, tap to expand details
- Coverage snapshot: Key coverage items stacked, "See all" expansion
- Template editor: Minimal toolbar with dropdowns

### 420px - 479px (panel-sm)

**Philosophy:** Comfortable single column with breathing room

- Still single column, but more generous spacing
- Can show 3-4 table columns comfortably
- **Forms:** Occasional inline label+input pairs for short fields
- **Cards:** 16px padding, room for secondary actions
- **Navigation:** Text labels with icons
- **Tabs:** Scrollable horizontal tabs if needed

**Example Layouts:**
- Quote list: Name + Status + Premium + Actions
- Coverage form: Some fields side-by-side (e.g., limit + deductible)

### 480px - 599px (panel-md) ⭐ PRIMARY TARGET

**Philosophy:** Optimal balance - design here first

- Primarily single column with strategic inline groupings
- **Tables:** 4-6 columns visible, good data density
- **Forms:** Related fields can be paired (e.g., effective/expiration dates)
- **Cards:** Comfortable padding, inline actions possible
- **Navigation:** Full horizontal nav or vertical sidebar (collapsed)
- **Tabs:** Full horizontal tabs with text labels

**Example Layouts:**
- Coverage comparison: 2 policies side-by-side with key coverages
- Quote builder: Form with logical field groupings
- Template library: List view with preview thumbnails

### 600px - 719px (panel-lg)

**Philosophy:** Breathing room - selective two-column moments

- Introduce limited two-column layouts for specific scenarios
- Main content + supplementary sidebar (70/30 split)
- **Tables:** Full data visibility, all relevant columns
- **Forms:** Two-column layouts for related fields
- **Cards:** Can show 2-up grid for small cards (tags, quick actions)

**Example Layouts:**
- Quote detail: Main quote info + activity sidebar
- Template editor: Editor pane + properties panel
- Dashboard: Metric cards in 2-column grid

### 720px+ (panel-xl)

**Philosophy:** Enhanced layouts, not redesigned experiences

- Two-column layouts are comfortable
- Can introduce master-detail views
- **Tables:** Expanded with additional contextual columns
- **Dashboard:** 2-3 column metric grids
- Still maintain vertical-first philosophy

**Example Layouts:**
- Policy dashboard: 3-up metric cards, data table below
- Template library: Grid view (2-3 columns) with rich previews
- Quote comparison: 3 policies side-by-side

---

## Content Prioritization Framework

At each breakpoint, apply this hierarchy:

### Level 1 (Always Visible)

- Primary action the user came to perform
- Critical status information
- Essential navigation

### Level 2 (Visible at panel-sm+)

- Secondary actions
- Supporting context
- Recent activity/history

### Level 3 (Visible at panel-md+)

- Tertiary actions
- Additional metadata
- Helpful tips/guidance

### Level 4 (Visible at panel-lg+)

- Comprehensive details
- Advanced features
- Rich supplementary content

---

## Technical Implementation

### CSS Container Queries (Preferred)

Use container queries to make components self-responsive:

```css
.panel-container {
  container-type: inline-size;
  container-name: panel;
}

@container panel (min-width: 480px) {
  .quote-card {
    display: grid;
    grid-template-columns: 1fr auto;
  }
}
```

### Tailwind Custom Breakpoints

```javascript
// tailwind.config.js
theme: {
  screens: {
    'panel-xs': '360px',
    'panel-sm': '420px',
    'panel-md': '480px',  // default target
    'panel-lg': '600px',
    'panel-xl': '720px',
    'panel-full': '1024px',
  }
}
```

---

## Component Design Patterns

### Adaptive Tables

```jsx
// Show 2 columns at panel-xs, 4 at panel-md, 6 at panel-lg
<table className="w-full text-sm">
  <thead>
    <tr>
      <th>Name</th>
      <th>Status</th>
      <th className="hidden panel-md:table-cell">Premium</th>
      <th className="hidden panel-md:table-cell">Effective</th>
      <th className="hidden panel-lg:table-cell">Agent</th>
      <th className="hidden panel-lg:table-cell">Modified</th>
    </tr>
  </thead>
</table>
```

### Progressive Form Layouts

```jsx
// Stack at small widths, inline pairs at panel-md+
<div className="space-y-md panel-md:grid panel-md:grid-cols-2 panel-md:gap-md">
  <input placeholder="Effective Date" />
  <input placeholder="Expiration Date" />
</div>
```

### Adaptive Navigation

```jsx
// Icon-only at panel-xs, with labels at panel-sm+
<nav className="flex items-center gap-xs">
  <button>
    <Icon />
    <span className="hidden panel-sm:inline ml-xs">Quotes</span>
  </button>
</nav>
```

---

## Testing Requirements

### Mandatory Width Testing Points

1. **360px** (minimum functional)
2. **480px** (primary target - spend 70% of design time here)
3. **600px** (comfortable expansion)
4. **720px+** (enhanced experience)

### Resize Behavior

- Layouts must reflow smoothly without jarring jumps
- No horizontal scrollbars except on data tables (and only when necessary)
- Content remains accessible and readable at all supported widths

---

## Key Differences from Mobile-First Design

| Traditional Mobile-First | Side Panel-First |
|--------------------------|------------------|
| Design for 375px phone first | Design for 480px panel first |
| Optimize for touch targets (44px min) | Optimize for precision cursors (smaller targets OK) |
| Assume limited vertical space | Assume abundant vertical scroll |
| Progressive enhancement to desktop | Progressive disclosure at wider panels |
| Breakpoints at 640px, 768px, 1024px | Breakpoints at 360px, 420px, 480px, 600px, 720px |
| Design standalone experiences | Design supplementary experiences |

---

## Summary Instruction for AI Assistant

**When designing UI/UX for this SaaS application, optimize for Microsoft Edge Side Panel with a 480px default width as your primary design target.** The app supplements the user's existing workflow rather than replacing it, so prioritize high information density, vertical layouts, and progressive disclosure. Design components that gracefully adapt from 360px (minimum) to 800px (comfortable maximum) using width-based breakpoints, not device-based breakpoints. Assume desktop context with unlimited vertical scroll, precision cursor input, and 13px base typography. Test all designs at 360px, 480px, 600px, and 720px widths to ensure smooth responsive behavior as users manually resize the panel.
