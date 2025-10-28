# Component Placement Decision Roadmap

> **Purpose**: Single source of truth for "Where does this file go?" decisions
> **Audience**: AI assistants, developers, design system maintainers
> **Last Updated**: 2025-10-27

---

## Executive Summary

This document provides a **pre-check + 5-question decision tree** to determine where components should be placed in the codebase and how they should be named. It eliminates ambiguity and enables AI assistants to make correct placement decisions without human intervention.

**Quick Decision Flow:**
1. **Pre-Check**: Is this part of a third-party library's UI system? → Domain Library Component
2. **If not**, use 5-question tree: Page → Layout → View → Construct → Component

---

## Component Hierarchy Overview

```
Domain Library Component (Third-party library UI)
 ├─ Owns: Library-specific UI controls
 ├─ Location: src/components/[domain]/[type]/
 ├─ Naming: [Domain][Component].tsx OR [domain]/[Component].tsx
 └─ Examples: Lexical, shadcn/ui, Radix UI

Page (Route container)
 ├─ Owns: URL route, page state, data fetching
 ├─ Location: apps/[app-name]/pages/
 └─ Naming: [DescriptiveName]Page.tsx

Layout (Structural skeleton - content-agnostic)
 ├─ Owns: Spatial relationships (columns, panels, grids)
 ├─ Location: core/ui/layouts/ OR apps/[app-name]/layouts/
 └─ Naming: [DescriptiveName]Layout.tsx

View (Composed section with state-driven rendering)
 ├─ Owns: Section-level composition
 ├─ Fills: Layout slots
 ├─ Location: core/ui/views/ OR apps/[app-name]/views/
 └─ Naming: [DescriptiveName]View.tsx

Construct (Multi-component assembly)
 ├─ Owns: Cohesive UI functionality with business logic
 ├─ Location: core/ui/constructs/ OR apps/[app-name]/components/
 └─ Naming: [Descriptive][Purpose].tsx

Component (Atomic primitive)
 ├─ Owns: Single UI control
 ├─ Location: core/ui/primitives/
 └─ Naming: [Name].tsx
```

---

## Pre-Check: Domain-Specific Library Components

**IMPORTANT**: Before using the 5-question decision tree, check if this component is part of a third-party library's UI system.

### What is a Domain Library Component?

**Domain library components** are UI components that belong to a third-party library or framework's UI system (Lexical, shadcn/ui, Radix UI, etc.). These are distinct from:
- **Generic shared primitives** (`core/ui/primitives/`) - Our own reusable components
- **App-specific constructs** (`apps/[app-name]/components/`) - Business logic components

### Identification Criteria

A component is a **Domain Library Component** if it meets ANY of these criteria:

1. **Imported from third-party package**
   ```typescript
   // ✅ Domain Library Component
   import { LexicalComposer } from '@lexical/react/LexicalComposer'
   import { Button } from '@radix-ui/react-button'
   ```

2. **Part of library's UI system**
   - Lexical editor UI components (toolbar buttons, modals, color pickers)
   - shadcn/ui components built on Radix UI
   - Headless UI components

3. **Tightly coupled to library/framework**
   - Requires library-specific context (LexicalComposer, ThemeProvider)
   - Uses library-specific APIs or hooks
   - Designed specifically for use within that library's ecosystem

4. **Generic name but domain-specific implementation**
   - "Button" that only works in Lexical editor
   - "Modal" that requires Radix UI Dialog primitives
   - "Select" that uses Headless UI components

### File Structure for Domain Library Components

Domain library components are organized by:
1. **Domain** (which library/framework)
2. **Type** (primitives, overlays, constructs, etc.)
3. **Component name** (domain-prefixed or directory-namespaced)

**Pattern A: Domain-Prefixed Naming**
```
src/components/
└── lexical/                          (domain)
    ├── primitives/                   (type)
    │   ├── LexicalButton.tsx         (domain-prefixed)
    │   ├── LexicalTextInput.tsx
    │   └── LexicalSelect.tsx
    ├── overlays/
    │   ├── LexicalModal.tsx
    │   └── LexicalDialog.tsx
    └── pickers/
        └── LexicalColorPicker.tsx
```

**Pattern B: Directory-Namespaced**
```
src/components/
└── ui/                               (domain)
    ├── primitives/
    │   └── shadcn/                   (namespace directory)
    │       ├── Button.tsx            (generic name OK within namespace)
    │       ├── Input.tsx
    │       └── Select.tsx
    ├── overlays/
    │   └── shadcn/
    │       ├── Dialog.tsx
    │       └── Popover.tsx
    └── constructs/
        └── shadcn/
            └── Card.tsx
```

**When to use each pattern:**
- **Domain-Prefixed**: Better for editor autocomplete, clear at import site
- **Directory-Namespaced**: Better for grouping many library components together

### Domain Grouping Principle (Multi-Layered)

**When domain library components are related by purpose or integration, use multi-layered grouping to prevent scattered folders.**

**Core Principle:** Group by domain, then group those domain folders under a common parent category.

**Multi-Layered Approach:**
1. **First Layer**: Group by component type or purpose category (UI controls vs integrations vs features)
2. **Second Layer**: Group by specific domain within that category

**Decision Points:**

**Step 1:** "Do I have multiple related domain folders?"
- ✅ **YES** → Create parent category folder, then domain subfolders
- ❌ **NO** → Single domain folder is fine

**Step 2:** "What's the shared purpose category?"
- Integrations/Plugins → `plugins/` or `integrations/`
- UI Features → `features/` or specific category name
- Authentication flows → `flows/` or `providers/`

**Anti-Pattern (Scattered):**
```
❌ DON'T: Domain folders scattered at same level as UI type folders
src/components/lexical/
├── primitives/          (UI type)
├── overlays/            (UI type)
├── equation/            (domain) ← scattered
├── katex/               (domain) ← scattered
└── excalidraw/          (domain) ← scattered
```

**Correct Pattern (Multi-Layered):**
```
✅ DO: Group domain folders under common parent
src/components/lexical/
├── primitives/          (UI layer)
├── overlays/            (UI layer)
├── pickers/             (UI layer)
├── editors/             (UI layer)
└── plugins/             (Integration layer - parent category)
    ├── equation/        (domain)
    │   ├── EquationEditor.tsx
    │   └── EquationEditor.css
    ├── katex/           (domain)
    │   ├── KatexEquationAlterer.tsx
    │   ├── KatexEquationAlterer.css
    │   └── KatexRenderer.tsx
    └── excalidraw/      (domain)
        ├── ExcalidrawModal.tsx
        └── ExcalidrawModal.css
```

**More Examples:**

**Authentication:**
```
src/components/auth/
├── forms/               (UI layer - parent category)
│   ├── login/           (domain)
│   │   ├── LoginForm.tsx
│   │   └── LoginModal.tsx
│   └── signup/          (domain)
│       ├── SignupForm.tsx
│       └── SignupWizard.tsx
└── providers/           (Integration layer - parent category)
    ├── oauth/           (domain)
    │   └── OAuthProvider.tsx
    └── saml/            (domain)
        └── SamlProvider.tsx
```

**Payments:**
```
src/components/payments/
├── checkout/            (Feature domain - grouped together)
│   ├── CheckoutForm.tsx
│   └── PaymentMethodSelector.tsx
├── receipt/             (Feature domain - grouped together)
│   └── ReceiptViewer.tsx
└── providers/           (Integration layer if needed)
    ├── stripe/
    └── paypal/
```

**Charts:**
```
src/components/charts/
└── types/               (Parent category for chart types)
    ├── bar/
    │   ├── BarChart.tsx
    │   └── BarChartLegend.tsx
    ├── line/
    │   └── LineChart.tsx
    └── pie/
        └── PieChart.tsx
```

**Key Insights:**
1. **Prevent Scattering**: Don't mix UI type folders with domain folders at the same level
2. **Common Parent**: Group related domains under a parent category folder
3. **Scalability**: Easy to add new domains without cluttering the root
4. **Clarity**: Structure immediately shows organization (UI layer vs Integration layer vs Feature domains)

### AI Assistant Pre-Check Checklist

Before proceeding to the 5-question tree, ask:

- [ ] **Is it imported from a third-party package?**
  - If YES → Domain Library Component

- [ ] **Is it part of a library's UI system?** (Lexical, shadcn, Radix)
  - If YES → Domain Library Component

- [ ] **Does it require library-specific context/hooks?**
  - If YES → Domain Library Component

- [ ] **Is it tightly coupled to a framework?**
  - If YES → Domain Library Component

- [ ] **Has generic name (Button, Modal, Input) but domain-specific implementation?**
  - If YES → Domain Library Component → Apply domain prefix or namespace

**If ALL answers are NO** → Continue to 5-Question Decision Tree below

---

## 5-Question Decision Tree

Use this decision tree to classify any component and determine its location:

```
START: I need to create/modify a component
  |
  ├─ Question 1: Is this tied to a URL route?
  │   │
  │   ├─ YES → It's a PAGE
  │   │   Location: apps/[app-name]/pages/
  │   │   Naming: [DescriptiveName]Page.tsx
  │   │   Contains: useParams(), useNavigate(), data fetching, route orchestration
  │   │   Examples: TemplateEditorPage.tsx, DashboardPage.tsx, SettingsPage.tsx
  │   │
  │   └─ NO → Continue to Question 2
  │
  ├─ Question 2: Does this define structural slots (columns, panels, grids)?
  │   │
  │   ├─ YES → It's a LAYOUT
  │   │   Location: core/ui/layouts/ (shared) OR apps/[app-name]/layouts/ (app-specific)
  │   │   Naming: [DescriptiveName]Layout.tsx
  │   │   Props: Slots (header, left, center, right, footer)
  │   │   Contains: ResizablePanel, Grid, Flexbox structure
  │   │   Examples: ThreeColumnEditorLayout.tsx, SidebarWithResizableLayout.tsx
  │   │
  │   └─ NO → Continue to Question 3
  │
  ├─ Question 3: Does this fill a layout slot and show different compositions based on state?
  │   │
  │   ├─ YES → It's a VIEW
  │   │   Location: core/ui/views/ (shared) OR apps/[app-name]/views/ (app-specific)
  │   │   Naming: [DescriptiveName]View.tsx
  │   │   Props: State prop that determines composition
  │   │   Contains: Conditional rendering of Constructs
  │   │   Examples: TemplateSidebarView.tsx, EditorWorkspaceView.tsx, OutlinePanelView.tsx
  │   │
  │   └─ NO → Continue to Question 4
  │
  ├─ Question 4: Does this assemble multiple components with cohesive purpose?
  │   │
  │   ├─ YES → It's a CONSTRUCT
  │   │   Location: core/ui/constructs/ (shared) OR apps/[app-name]/components/ (app-specific)
  │   │   Naming: [Descriptive][Purpose].tsx
  │   │   Contains: Multiple components + business logic
  │   │   Promotion: Follow governance Rules 1-3 (see cross-app-reuse.md)
  │   │   Examples: InlineTagEditor.tsx, TemplateMetadataEditor.tsx, FormDrawer.tsx
  │   │
  │   └─ NO → Continue to Question 5
  │
  └─ Question 5: Is this a single UI control?
      │
      └─ YES → It's a COMPONENT
          Location: core/ui/primitives/
          Naming: [Name].tsx (generic OK for universally understood primitives)
          Contains: Single atomic element (Button, Input, Badge)
          Examples: Button.tsx, Input.tsx, Badge.tsx, Select.tsx
```

---

## Component Type Definitions

### 0. Domain Library Component (Third-Party Library UI)

**Definition:** UI component that belongs to a third-party library or framework's UI system (Lexical, shadcn/ui, Radix UI, etc.).

**Responsibilities:**
- Provide library-specific UI controls
- Maintain consistency with library's design system
- Used exclusively within domain context
- Bridge third-party libraries with our application

**Location:** `src/components/[domain]/[type]/`

**Naming Convention:**
- **Option A**: `[Domain][Component].tsx` (e.g., `LexicalButton.tsx`)
- **Option B**: `[Component].tsx` in `[domain]/` directory (e.g., `shadcn/Button.tsx`)

**AI Indicators:**
- Component is from a third-party library (Lexical, shadcn, Radix)
- Component is part of a domain-specific design system
- Component has generic name (Button, Modal, Input) but domain-specific implementation
- Component is tightly coupled to library/framework
- Requires library-specific context or hooks

**Examples:**

**Lexical Editor Components (Domain-Prefixed):**
```typescript
// src/components/lexical/primitives/LexicalButton.tsx
import './LexicalButton.css';

export default function LexicalButton({
  children,
  className,
  onClick,
  disabled,
}: LexicalButtonProps) {
  return (
    <button
      disabled={disabled}
      className={joinClasses('Button__root', className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Usage in Lexical toolbar
import { LexicalButton } from '@/components/lexical/primitives/LexicalButton';
```

**shadcn/ui Components (Directory-Namespaced):**
```typescript
// src/components/ui/primitives/shadcn/Button.tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground...",
        destructive: "bg-destructive text-destructive-foreground...",
      },
    },
  }
)

export function Button({ variant, ...props }: ButtonProps) {
  return <button className={buttonVariants({ variant })} {...props} />
}

// Usage
import { Button } from '@/components/ui/primitives/shadcn/Button';
```

**File Structure:**
```
src/components/
├── lexical/                      (Lexical editor domain)
│   ├── primitives/
│   │   ├── LexicalButton.tsx
│   │   ├── LexicalTextInput.tsx
│   │   └── LexicalSelect.tsx
│   ├── overlays/
│   │   ├── LexicalModal.tsx
│   │   └── LexicalDialog.tsx
│   ├── pickers/
│   │   └── LexicalColorPicker.tsx
│   └── editors/
│       └── LexicalContentEditable.tsx
│
├── ui/                           (shadcn/ui domain)
│   ├── primitives/shadcn/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Select.tsx
│   ├── overlays/shadcn/
│   │   ├── Dialog.tsx
│   │   └── Popover.tsx
│   └── constructs/shadcn/
│       ├── Card.tsx
│       └── Resizable.tsx
│
└── [other domain libraries as needed]
```

**Key Distinction from Generic Components:**
- **Domain Library Component**: `LexicalButton.tsx` - Only works in Lexical editor context
- **Generic Component**: `Button.tsx` in `core/ui/primitives/` - Works anywhere in the app

---

### 1. Page (Route-Level Container)

**Definition:** Top-level component tied to a URL route. Orchestrates the entire page composition.

**Responsibilities:**
- React Router route mapping (`/editor/:id`, `/dashboard`)
- Page-level state management (URL params, query strings)
- Data fetching (API calls, global state)
- Orchestrates Layouts and Views

**Location:** `apps/[app-name]/pages/`

**Naming Convention:** `[DescriptiveName]Page.tsx`

**AI Indicators:**
- Uses route hooks: `useParams()`, `useNavigate()`, `useSearchParams()`
- Performs data fetching: `useQuery()`, `useFetch()`, API calls
- Orchestrates multiple Layouts or Views
- Top-level component for a route

**Examples:**

```typescript
// TemplateEditorPage.tsx
export default function TemplateEditorPage() {
  const { templateId } = useParams()              // ← Route hook
  const { template, isLoading } = useTemplateData(templateId)  // ← Data fetching
  const [leftPanelState, setLeftPanelState] = useState('templates')

  return (
    <ThreeColumnEditorLayout                      // ← Uses Layout
      header={<EditorHeader template={template} />}
      left={<TemplateSidebarView state={leftPanelState} />}
      center={<EditorWorkspaceView template={template} />}
      right={<OutlinePanelView template={template} />}
    />
  )
}
```

**File Structure:**
```
apps/template-editor/pages/
├── TemplateEditorPage.tsx
├── DashboardPage.tsx
└── SettingsPage.tsx
```

---

### 2. Layout (Structural Skeleton)

**Definition:** Content-agnostic structural composition. Defines spatial relationships (columns, panels, grids) but doesn't know what fills the slots.

**Responsibilities:**
- Define structural areas (header, left, center, right, footer)
- Handle responsive breakpoints
- Manage resizable panels, collapsible regions
- Provide slots for Views to fill

**Location:**
- Shared: `core/ui/layouts/`
- App-specific: `apps/[app-name]/layouts/`

**Naming Convention:** `[DescriptiveName]Layout.tsx`

**AI Indicators:**
- Accepts slot props: `header`, `left`, `center`, `right`, `footer`
- Uses structural components: `ResizablePanel`, `Grid`, `Flexbox`
- Content-agnostic (doesn't care what fills slots)
- Handles responsive breakpoints

**Examples:**

```typescript
// ThreeColumnEditorLayout.tsx
export function ThreeColumnEditorLayout({
  header,
  left,
  center,
  right
}: ThreeColumnLayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      {header && <header>{header}</header>}
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15}>
          {left}    {/* ← Slot (content-agnostic) */}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={40}>
          {center}  {/* ← Slot */}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={15}>
          {right}   {/* ← Slot */}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
```

**File Structure:**
```
core/ui/layouts/
├── ThreeColumnEditorLayout.tsx
├── SidebarWithResizableLayout.tsx
└── DashboardGridLayout.tsx

apps/template-editor/layouts/
└── CustomEditorLayout.tsx  (if app-specific needs)
```

**Key Insight:** Layouts are **position-aware** but **content-agnostic**. They say "here's a left panel" but don't care what goes in it.

---

### 3. View (Composed Section)

**Definition:** Self-contained composed section that fills a Layout slot. Renders different compositions based on state changes.

**Responsibilities:**
- Assemble Constructs into cohesive section
- Handle section-level state (filter states, expansion)
- Render different compositions based on state prop
- Fill slots provided by Layouts

**Location:**
- Shared: `core/ui/views/` (if truly generic)
- App-specific: `apps/[app-name]/views/` (most common)

**Naming Convention:** `[DescriptiveName]View.tsx`

**AI Indicators:**
- Accepts state prop that determines composition
- Conditionally renders different Constructs based on state
- Fills a Layout slot
- Assembles multiple Constructs

**Examples:**

```typescript
// TemplateSidebarView.tsx
export function TemplateSidebarView({
  state,  // 'templates' | 'tags' | 'backups'
  templates,
  onSelectTemplate
}: TemplateSidebarViewProps) {
  // Different compositions based on state
  if (state === 'tags') {
    return <TagManagerView tags={tags} />
  }

  if (state === 'backups') {
    return <BackupRestoreView />
  }

  // Default: template list composition
  return (
    <div className="h-full flex flex-col">
      <SearchBar />
      <FilterPanel />
      <TemplateList
        templates={templates}
        onSelect={onSelectTemplate}
      />
    </div>
  )
}
```

**File Structure:**
```
apps/template-editor/views/
├── TemplateSidebarView.tsx
├── EditorWorkspaceView.tsx
└── OutlinePanelView.tsx
```

**Key Insight:** Views are **content-aware compositions**. They know "I'm a sidebar that shows templates" and assemble the right Constructs based on state.

---

### 4. Construct (Multi-Component Assembly)

**Definition:** Assembles multiple components with cohesive purpose. Contains business logic and complex interactions.

**Responsibilities:**
- Assemble multiple Components with cohesive functionality
- Handle business logic and complex interactions
- Can be shared (promoted) or app-specific
- Reusable across Views

**Location:**
- Shared: `core/ui/_shared/` (when promoted via Rules 1-3)
- App-specific: `apps/[app-name]/components/` (default starting location as an example, but we apply our classification rules )

**Naming Convention:** `[Descriptive][Purpose].tsx`

**Promotion Rules:** See `/docs/decision-roadmaps/cross-app-reuse.md`

**AI Indicators:**
- Assembles multiple atomic Components
- Contains business logic or form handling
- Has cohesive, single purpose
- Reusable (or potentially reusable)

**Examples:**

```typescript
// InlineTagEditor.tsx (Construct)
export function InlineTagEditor({
  tags,
  onChange,
  maxTags = 10
}: InlineTagEditorProps) {
  const [isAdding, setIsAdding] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <TagList                    {/* ← Component */}
        tags={tags}
        onRemove={handleRemove}
      />
      {isAdding && (
        <>
          <TagInput               {/* ← Component */}
            onChange={handleAdd}
          />
          <ColorPicker            {/* ← Component */}
            onSelect={handleColorSelect}
          />
        </>
      )}
      <Button                     {/* ← Component */}
        onClick={() => setIsAdding(true)}
      >
        Add Tag
      </Button>
    </div>
  )
}
```

**File Structure:**
```
core/ui/constructs/               (shared constructs)
├── inline-tag-editor/
│   ├── InlineTagEditor.tsx
│   ├── inline-tag-editor.vars.css
│   ├── types.ts
│   └── index.ts
└── form-drawer/
    ├── FormDrawer.tsx
    └── index.ts

apps/template-editor/components/  (app-specific constructs)
├── TemplateMetadataEditor/
│   ├── TemplateMetadataEditor.tsx
│   └── index.ts
└── QuoteCalculator/
    ├── QuoteCalculator.tsx
    └── index.ts
```

---

### 5. Component (Atomic Primitive)

**Definition:** Single UI control. No business logic, just presentation and basic interaction.

**Responsibilities:**
- Provide single atomic UI element
- Handle basic interactions (click, hover, focus)
- Highly reusable across entire app
- No business logic

**Location:** `core/ui/primitives/`

**Naming Convention:** `[Name].tsx` (generic names OK for universally understood primitives)

**AI Indicators:**
- Single UI control (Button, Input, Badge, etc.)
- No business logic (just presentation)
- No composition (doesn't assemble other components)
- Highly reusable

**Examples:**

```typescript
// Button.tsx (Component)
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        buttonVariants({ variant, size })
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

**File Structure:**
```
core/ui/primitives/
├── button/
│   ├── Button.tsx
│   ├── button.vars.css
│   └── index.ts
├── input/
│   ├── Input.tsx
│   └── index.ts
└── badge/
    ├── Badge.tsx
    └── index.ts
```

**Exception:** Atomic primitives can use generic names (Button, Input, Badge) because they're universally understood across all design systems.

---

## Descriptive Naming Principle (AI-Critical)

### Core Principle: Descriptive Over Generic

**Purpose:** Enable AI assistants to identify correct files instantly without reading multiple files for verification.

### Naming Pattern

**Pattern:** `[Domain][Entity][Action/Type]`

**Examples:**
```typescript
// ✅ GOOD: Descriptive, clear intent
TemplateEditor.tsx               // Domain: Template, Entity: Editor
TemplateMetadataForm.tsx         // Domain: Template, Entity: Metadata, Type: Form
TemplateSidebarView.tsx          // Domain: Template, Entity: Sidebar, Type: View
InlineTagEditor.tsx              // Entity: Tag, Action: Editor, Type: Inline
TagManagerView.tsx               // Entity: Tag, Action: Manager, Type: View
VariableInsertionPopover.tsx     // Entity: Variable, Action: Insertion, Type: Popover
```

### Anti-Patterns (What to Avoid)

```typescript
// ❌ BAD: Generic, ambiguous
Editor.tsx                       // Which editor? What does it edit?
Sidebar.tsx                      // What's in the sidebar?
Panel.tsx                        // Which panel? What's its purpose?
Form.tsx                         // What form? What data?
Modal.tsx                        // Generic modal for what?
Manager.tsx                      // Managing what?
Container.tsx                    // Container for what?
Wrapper.tsx                      // Wrapping what?
```

### AI Assistant Impact

**With Generic Names:**
```
AI Task: "Update the editor component"
Process:
1. Read src/components/Editor.tsx (is this the right one?)
2. Check imports (what does it edit?)
3. Read parent component (where is it used?)
4. Verify it's the template editor (not metadata editor, code editor, etc.)
Total: 4 file reads + verification = slow, error-prone
```

**With Descriptive Names:**
```
AI Task: "Update the template editor component"
Process:
1. Find TemplateEditor.tsx (exact match)
Total: 1 file read = instant, accurate
```

### When Generic Names Are Acceptable

**Acceptable Generic Names:**
1. **Atomic primitives** universally understood: `Button`, `Input`, `Badge`, `Select`
2. **Industry-standard terms**: `Modal`, `Tooltip`, `Dropdown`, `Popover`
3. **Layout primitives** from established systems: `Grid`, `Stack`, `Flexbox`

**Reason:** These have universal meaning across all design systems.

---

## File Structure Reference

### Complete File Structure

```
src/
├── apps/
│   └── template-editor/                   # App-specific code
│       ├── pages/                         # Route containers
│       │   ├── TemplateEditorPage.tsx
│       │   ├── DashboardPage.tsx
│       │   └── SettingsPage.tsx
│       │
│       ├── layouts/                       # App-specific layouts (if needed)
│       │   └── CustomEditorLayout.tsx
│       │
│       ├── views/                         # App-specific composed sections
│       │   ├── TemplateSidebarView.tsx
│       │   ├── EditorWorkspaceView.tsx
│       │   └── OutlinePanelView.tsx
│       │
│       ├── components/                    # App-specific constructs
│       │   ├── TemplateMetadataEditor/
│       │   ├── QuoteCalculator/
│       │   └── InsuranceFormDrawer/
│       │
│       └── config/
│           └── presets/                   # Domain data presets
│               ├── emailTemplates.ts
│               └── insuranceProducts.ts
│
├── core/
│   └── ui/
│       ├── primitives/                    # Atomic components (shared)
│       │   ├── button/
│       │   │   ├── Button.tsx
│       │   │   ├── button.vars.css
│       │   │   └── index.ts
│       │   ├── input/
│       │   └── badge/
│       │
│       ├── constructs/                    # Shared multi-component assemblies
│       │   ├── inline-tag-editor/
│       │   │   ├── InlineTagEditor.tsx
│       │   │   ├── inline-tag-editor.vars.css
│       │   │   ├── types.ts
│       │   │   ├── InlineTagEditor.schema.ts
│       │   │   └── index.ts
│       │   └── form-drawer/
│       │
│       ├── layouts/                       # Shared structural skeletons
│       │   ├── ThreeColumnEditorLayout.tsx
│       │   ├── SidebarWithResizableLayout.tsx
│       │   └── DashboardGridLayout.tsx
│       │
│       └── views/                         # Shared composed sections (rare)
│           └── GenericSettingsView.tsx
│
└── pages/                                 # Alternative: top-level pages folder
    └── GitHubEditorPage.tsx
```

---

## Practical Examples

### Example 1: Template Editor Application

**Page:**
```typescript
// apps/template-editor/pages/TemplateEditorPage.tsx
export default function TemplateEditorPage() {
  const { templateId } = useParams()                    // Route hook
  const { template } = useTemplateData(templateId)      // Data fetching

  return (
    <ThreeColumnEditorLayout                            // Uses Layout
      left={<TemplateSidebarView state="templates" />}  // Uses View
      center={<EditorWorkspaceView mode="edit" />}      // Uses View
      right={<OutlinePanelView />}                      // Uses View
    />
  )
}
```

**Layout:**
```typescript
// core/ui/layouts/ThreeColumnEditorLayout.tsx
export function ThreeColumnEditorLayout({ left, center, right }) {
  return (
    <ResizablePanelGroup>
      <ResizablePanel>{left}</ResizablePanel>          // Slot
      <ResizablePanel>{center}</ResizablePanel>        // Slot
      <ResizablePanel>{right}</ResizablePanel>         // Slot
    </ResizablePanelGroup>
  )
}
```

**View:**
```typescript
// apps/template-editor/views/TemplateSidebarView.tsx
export function TemplateSidebarView({ state }) {
  if (state === 'templates') return <TemplateList />   // Construct
  if (state === 'tags') return <TagManager />          // Construct
  return null
}
```

**Construct:**
```typescript
// core/ui/constructs/inline-tag-editor/InlineTagEditor.tsx
export function InlineTagEditor({ tags, onChange }) {
  return (
    <>
      <TagList tags={tags} />          // Component
      <TagInput onChange={onChange} />  // Component
      <Button>Add Tag</Button>         // Component
    </>
  )
}
```

**Component:**
```typescript
// core/ui/primitives/button/Button.tsx
export function Button({ children, variant }) {
  return <button className={...}>{children}</button>
}
```

---

## Decision Checklist for AI Assistants

Before creating or modifying a file, answer these questions:

### Pre-Check: Domain Library Component

**FIRST**, check if this is a domain library component:

- [ ] **Is it imported from a third-party package?**
  - If YES → **DOMAIN LIBRARY COMPONENT** (`src/components/[domain]/[type]/`)

- [ ] **Is it part of a library's UI system?** (Lexical, shadcn, Radix)
  - If YES → **DOMAIN LIBRARY COMPONENT** (`src/components/[domain]/[type]/`)

- [ ] **Does it require library-specific context/hooks?**
  - If YES → **DOMAIN LIBRARY COMPONENT** (`src/components/[domain]/[type]/`)

- [ ] **Has generic name but domain-specific implementation?**
  - If YES → **DOMAIN LIBRARY COMPONENT** with domain prefix

**If ALL answers are NO**, continue to Quick Classification Checklist below:

### Quick Classification Checklist

- [ ] **Question 1:** Does it use `useParams()` or route hooks?
  - If YES → **PAGE** (`apps/[app-name]/pages/[Name]Page.tsx`)

- [ ] **Question 2:** Does it accept slot props (header, left, right)?
  - If YES → **LAYOUT** (`core/ui/layouts/[Name]Layout.tsx`)

- [ ] **Question 3:** Does it conditionally render based on state prop?
  - If YES → **VIEW** (`apps/[app-name]/views/[Name]View.tsx`)

- [ ] **Question 4:** Does it assemble multiple components?
  - If YES → **CONSTRUCT** (`apps/[app-name]/components/` or `core/ui/constructs/`)

- [ ] **Question 5:** Is it a single UI control?
  - If YES → **COMPONENT** (`core/ui/primitives/[name]/`)

### Naming Checklist

- [ ] Is the name **descriptive** (not generic)?
  - ✅ `TemplateEditor.tsx` (clear)
  - ❌ `Editor.tsx` (ambiguous)

- [ ] Does it follow the **[Domain][Entity][Action/Type]** pattern?
  - ✅ `TemplateMetadataForm.tsx`
  - ✅ `InlineTagEditor.tsx`

- [ ] Does it have the correct **suffix**?
  - Pages: `Page.tsx`
  - Layouts: `Layout.tsx`
  - Views: `View.tsx`
  - Constructs: No suffix (descriptive name only)
  - Components: No suffix (generic OK for primitives)

---

## Related Documentation

- **Construct Promotion Rules:** See `/docs/decision-roadmaps/cross-app-reuse.md`
- **Variant API Patterns:** See `/docs/decision-roadmaps/variant-api-patterns.md`
- **Design Guidelines:** See `/docs/design-guidelines.draft.md`
- **Developer Instructions:** See `/CLAUDE.md`

---

## Revision History

- **2025-10-27**: Added Domain Library Component pre-check - Addresses third-party library UI systems (Lexical, shadcn, Radix)
- **2025-01-26**: Initial creation - 5-layer architecture, AI decision tree, descriptive naming principle
