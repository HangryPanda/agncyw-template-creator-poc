# Design System Guidelines

> **Status**: Official - All decisions finalized and approved
> **Last Updated**: 2025-01-26
> **Purpose**: Single source of truth for design system architecture, component organization, and development patterns

---

## How to Use This Document

### For Developers

**Quick Lookup**:
- Need to know where a file should go? → See [Decision #1: Component Hierarchy](#1-component-hierarchy-definitions) or jump to [Component Hierarchy Summary](#component-hierarchy-summary)
- Need to add a new color token? → See [Decision #10: Semantic Color Tokens](#10-additional-semantic-color-tokens) and [Decision #12: Brand Colors](#12-app-specificbrand-color-token-guidelines)
- Need to deprecate a component? → See [Decision #6: Deprecation Strategy](#6-construct-deprecation-strategy)
- Need to decide on component variants (props vs compound)? → See [Decision #9: Variant API Patterns](#9-variant-api-pattern-selection)
- Need to promote a construct to shared? → See [Decision #11: Cross-App Reuse](#11-cross-app-reuse-decision-matrix)

**Navigation**: Each decision is self-contained with rationale, examples, and references to detailed decision roadmaps in `/docs/decision-matrix/`.

### For AI Assistants

**Critical Instructions**:
1. **Component Classification**: Use the [5-Question Decision Tree](#ai-assistant-5-question-decision-tree) in Decision #13 to determine component type and location
2. **Descriptive Naming**: ALWAYS follow the [Descriptive Naming Principle](#descriptive-naming-principle-ai-assistant-critical) - never use generic names
3. **Construct Promotion**: Apply [Governance Rules 1-3](#3-construct-governance-model) when deciding if construct should be shared
4. **Token Usage**: NEVER use Figma primitives directly - always map to theme-aware variables (see [Decision #2](#2-token-organization-strategy))
5. **File Structure**: Follow the [File Structure & Co-location](#4-file-structure--co-location) patterns exactly

**Key Difference from Developers**:
- AI assistants must use decision trees proactively without asking the user
- Developers can ask for clarification when ambiguous - AI assistants should apply the decision framework and recommend with reasoning
- AI assistants should verify their classification against the [Component Hierarchy Summary](#component-hierarchy-summary) before creating files

**Quick Reference Sections**:
- [Component Hierarchy Summary](#component-hierarchy-summary) - Visual overview of all layers
- [File Structure Patterns](#file-structure-patterns) - Where files go
- [Governance Rules](#3-construct-governance-model) - When to promote/demote constructs

---

## Table of Contents

### Approved Decisions
1. [Component Hierarchy Definitions](#1-component-hierarchy-definitions)
2. [Token Organization Strategy](#2-token-organization-strategy)
3. [Construct Governance Model](#3-construct-governance-model)
4. [File Structure & Co-location](#4-file-structure--co-location)
5. [Migration Strategy](#5-migration-strategy)
6. [Construct Deprecation Strategy](#6-construct-deprecation-strategy)
7. [Claude Code as Permanent Workflow Fixture](#7-claude-code-as-permanent-workflow-fixture)
8. [Token Implementation Strategy](#8-token-implementation-strategy)
9. [Variant Component Handling](#9-variant-component-handling)
10. [Additional Semantic Color Tokens](#10-additional-semantic-color-tokens)
11. [Cross-App Reuse Decision Matrix](#11-cross-app-reuse-decision-matrix)
12. [App-Specific/Brand Color Token Guidelines](#12-app-specificbrand-color-token-guidelines)
13. [AI Assistant Decision Tree for Component Classification](#13-ai-assistant-decision-tree-for-component-classification)

### Quick References
- [Component Hierarchy Summary](#component-hierarchy-summary)
- [File Structure Patterns](#file-structure-patterns)
- [Decision Matrix](#decision-matrix)

---

## Approved Decisions

### 1. Component Hierarchy Definitions

**STATUS**: ✅ APPROVED (REVISED - AI Assistant Optimized)

#### 5-Layer Architecture

1. **Page** - Route-level container
   - **Definition**: Top-level component tied to a URL route. Orchestrates the entire page composition.
   - **Location**: `apps/[app-name]/pages/`
   - **Naming**: `[DescriptiveName]Page.tsx` (e.g., `TemplateEditorPage.tsx`)
   - **AI Indicator**: Uses route hooks (`useParams()`, `useNavigate()`), data fetching, orchestrates layouts

2. **Layout** - Structural skeleton (content-agnostic)
   - **Definition**: Defines spatial relationships (columns, panels, grids) but doesn't know what fills the slots.
   - **Location**: `core/ui/layouts/` (shared) OR `apps/[app-name]/layouts/` (app-specific)
   - **Naming**: `[DescriptiveName]Layout.tsx` (e.g., `ThreeColumnEditorLayout.tsx`)
   - **AI Indicator**: Accepts slot props (header, left, center, right), uses structural components

3. **View** - Composed section with state-driven rendering
   - **Definition**: Self-contained composed section that fills a Layout slot. Renders different compositions based on state.
   - **Location**: `core/ui/views/` (shared) OR `apps/[app-name]/views/` (app-specific)
   - **Naming**: `[DescriptiveName]View.tsx` (e.g., `TemplateSidebarView.tsx`, `EditorWorkspaceView.tsx`)
   - **AI Indicator**: Conditionally renders compositions based on state prop

4. **Construct** - Multi-component assembly
   - **Definition**: Assembles multiple components with cohesive purpose. Contains business logic.
   - **Location**: `core/ui/constructs/` (shared) OR `apps/[app-name]/components/` (app-specific)
   - **Naming**: `[Descriptive][Purpose].tsx` (e.g., `InlineTagEditor.tsx`, `TemplateMetadataEditor.tsx`)
   - **AI Indicator**: Assembles multiple components, contains business logic
   - **Promotion**: Follows Rules 1-3 from governance model

5. **Component** - Atomic primitive
   - **Definition**: Single UI control (Button, Input, Badge). No business logic.
   - **Location**: `core/ui/primitives/`
   - **Naming**: `[Name].tsx` (e.g., `Button.tsx`, `Input.tsx`) - Generic names OK for universally understood primitives
   - **AI Indicator**: Single UI control, highly reusable

#### Additional Definitions

- **Preset**: Dual definition
  - **Type A - UI Configuration**: Pre-defined prop combinations (e.g., `<Button preset="danger" />`)
    - Location: `construct/[name].presets.ts`
    - Contains: Immutable config objects
  - **Type B - Domain Data**: Pre-filled template content, insurance product configs
    - Location: `apps/[app-name]/config/presets/`
    - Contains: Domain data, not UI configuration

- **Schema**: Zod validation rules
  - Location: Co-located with forms/constructs (`construct/[name].schema.ts`)

#### Descriptive Naming Principle (AI Assistant Critical)

- ✅ **ALWAYS use descriptive names**: `TemplateEditor.tsx`, `TemplateSidebarView.tsx`, `InlineTagEditor.tsx`
- ❌ **NEVER use generic names**: `Editor.tsx`, `Sidebar.tsx`, `Manager.tsx`, `Panel.tsx`
- **Reason**: Generic names create ambiguity and require AI assistants to read multiple files for verification. Descriptive names enable instant file identification.
- **Pattern**: `[Domain][Entity][Action/Type]` (e.g., `TemplateMetadataForm.tsx`, `VariableInsertionPopover.tsx`)
- **Exception**: Atomic primitives can use generic names (Button, Input, Badge) because they're universally understood.

#### File Location Examples

- TemplateEditorPage.tsx → `apps/[app-name]/pages/` (route container)
- ThreeColumnEditorLayout.tsx → `apps/[app-name]/layouts/` (structural skeleton)
- TemplateSidebarView.tsx → `apps/[app-name]/views/` (composed section)
- EditorWorkspaceView.tsx → `apps/[app-name]/views/` (composed section)
- InlineTagEditor.tsx → `core/ui/constructs/` or `apps/[app-name]/components/` (construct)
- UI Preset files → `construct/[name].presets.ts`
- Domain Preset files → `apps/[app-name]/config/presets/`
- Schema files → Co-located with components

---

### 2. Token Organization Strategy

**STATUS**: ✅ APPROVED - 2-Tier Automated System with Claude Code

#### Accepted Pattern

```
Tier 1: Figma Primitives (docs/typography-spacing-scale/)
  ↓
Claude Code Mapping Layer (Automated)
  ↓
Tier 2: Theme Variables (src/index.css - existing HSL system)
  ↓
Tier 3: Construct Variables (construct/[name].vars.css)
```

#### Key Points

- **Primitives**: Defined in Figma, synced to `design-tokens.css` (reference only, never used directly)
- **Theme Variables**: Existing HSL-based system (`--primary`, `--border`, `--foreground`, etc.)
- **Claude Code Bridge**: Automatically maps Figma primitives → theme variables during implementation
- **Components**: NEVER use primitives directly, ALWAYS use theme-aware variables

#### App-Specific Tokens

- Use `data-app="[app-name]"` attribute on app root
- Apps define semantic tokens in `apps/[app-name]/styles/tokens.css`
- Claude Code enforces proper token usage automatically

#### Rationale

- Eliminates manual design-to-code translation
- Designer-friendly Figma workflow (readable token names)
- Developer-friendly theme system (automatic light/dark mode)
- Claude Code ensures consistency and pattern enforcement
- Scales easily with team growth (automated enforcement)

**Documentation**: See `docs/typography-spacing-scale/figma-settings.md` for complete workflow and Figma → Theme mapping table.

---

### 3. Construct Governance Model

**STATUS**: ✅ APPROVED - Incremental Promotion

#### Promotion Criteria

- **Rule 1**: Promote when required in another application OR when asked to evaluate existing constructs
- **Rule 2**: Promote when the construct fulfills a common use case or design pattern (shared by default)
- **Enhancement Rule**: Modifying a construct to enhance/expand functionality WITHOUT breaking original use case = promotion to shared

#### Demotion Criteria

- **Rule 3**: When modifying the construct breaks it and it's no longer used in another application

#### Process

User will explicitly instruct promotion or ask Claude to identify reusable constructs from other apps.

**Detailed Documentation**: See `/docs/decision-matrix/cross-app-reuse.md` for complete decision matrix, flowcharts, and practical examples.

---

### 4. File Structure & Co-location

**STATUS**: ✅ APPROVED

#### Construct File Structure

```
construct/[name]/
├── [Name].tsx                    # PascalCase component
├── [name].vars.css               # kebab-case CSS variables
├── [name].tailwind.css           # kebab-case Tailwind classes
├── types.ts                      # Construct-specific types
├── use[Name].ts                  # Construct-specific hook
├── [Name].test.tsx               # Unit tests
├── [Name].stories.tsx            # Storybook stories
├── presets.ts                    # Optional presets
└── index.ts                      # Public API exports
```

#### Co-location Rules

- ✅ Co-locate: Types, hooks, utilities exclusive to this construct
- ❌ Keep global: Shared domain types, shared hooks, general utilities

#### Public API Pattern

Use `index.ts` to control exports (don't export internal implementation details)

---

### 5. Migration Strategy

**STATUS**: ✅ APPROVED - Audit First, All-At-Once Conversion

#### Modified Plan

- **Phase 0**: Perform initial evaluation/audit of codebase
- **Phase 1**: Establish token system and theme infrastructure
- **Phase 2**: Identify high-value shared components for conversion
  - Deliverable: Document identified targets in markdown file
  - **Phase 2.1**: Evaluate and create conversion plan for each target + create unit tests
  - **Phase 2.2**: Perform conversion one by one
    - Commit after each conversion as rollback safety checkpoint
    - No need to keep original file (rely on git history)
    - Detailed commit messages for each conversion
- **Phase 3**: TBD - Need professional guidance on next steps

#### Conversion Approach

- ❌ NO hybrid state during conversion (all-at-once per construct)
- ✅ Use git commits as safety checkpoints
- ✅ Create commit of current project status before starting conversion process
- ✅ Tests validate conversion success before committing

#### 80/20 Shared Components

- Set aside during Phase 2
- Create list for one-by-one consideration after main conversions

---

### 6. Construct Deprecation Strategy

**STATUS**: ✅ APPROVED - Enhanced Process

#### Process

1. Mark with `@deprecated` JSDoc comment + migration guide
2. Add `console.warn` in dev mode
3. Update docs with deprecation notice + timeline
4. After 2 sprints with no usage, move to `xx-Archive-xx/` folder
5. Add `xx-Archive-xx/` to `.gitignore` as safety measure
6. **NEW**: Claude Code subagent reviews archived constructs
   - Subagent follows checklist
   - Creates JIRA task with review details
   - Marks as "ready for deletion" or "needs further review"
   - Includes completed checklist and review details

**Detailed Documentation**: See `/docs/decision-matrix/construct-archive-review.md` for complete subagent checklist and review process.

---

### 7. Claude Code as Permanent Workflow Fixture

**STATUS**: ✅ APPROVED - Core Development Tool

#### Decision

Claude Code (via MCP Server connection) is a permanent fixture in the design→development workflow.

#### Responsibilities

- Automated Figma token → theme variable mapping
- Enforces construct patterns and naming conventions
- Generates code following design system rules
- Eliminates manual translation between design and development
- Maintains pattern consistency across codebase

#### Impact

- Simplifies token system (2-tier with automated bridge)
- Reduces manual maintenance overhead
- Ensures architectural consistency automatically
- Scales easily with team growth (Claude enforces rules for all developers)
- Designer workflow remains simple (Figma only)

**Documentation**: Complete workflow documented in `docs/typography-spacing-scale/figma-settings.md`

---

### 8. Token Implementation Strategy

**STATUS**: ✅ APPROVED - JSON + CSS + TypeScript Verification

#### Decision

Use JSON + CSS Variables with TypeScript compilation verification (Enhanced Option A).

#### Workflow

1. Figma primitives → JSON export → CSS variables (`design-tokens.css`)
2. Claude Code creates/updates tokens (automated)
3. Vite plugin runs TypeScript compilation before commits pushed to origin
4. Local commits for safety checkpoints, push only after build passes
5. Theme variables in `src/index.css` reference primitives

#### Why This Works

- Already have TypeScript verification via Vite plugin
- Claude Code creates tokens (no manual editing)
- Build fails if token errors exist (catches issues before push)
- No need for Vanilla Extract/Panda CSS complexity
- Get compile-time safety without build tool overhead

**Rejected Alternative**: TypeScript-only approach (Vanilla Extract/Panda CSS) - unnecessary complexity for current workflow.

---

### 9. Variant Component Handling

**STATUS**: ✅ APPROVED - Decision Roadmap Approach

#### Decision

Use decision roadmap framework (not hard guidelines) to evaluate variant patterns on a case-by-case basis.

#### Approach

When building components with variations, Claude Code will evaluate using the decision framework to recommend:
- **Pattern A (Props)**: For 1-4 independent variations
- **Pattern B (Compound)**: For fundamentally different component behaviors
- **Pattern C (Presets)**: For common combinations that prevent invalid states
- **Hybrid**: Mix patterns when appropriate

#### Process

1. Claude Code evaluates component requirements
2. Applies decision tree from roadmap
3. Recommends pattern with reasoning
4. User/designer approves or adjusts

**Detailed Documentation**: See `/docs/decision-matrix/variant-component-handling.md` for complete framework, decision trees, and examples.

---

### 10. Additional Semantic Color Tokens

**STATUS**: ✅ APPROVED - Theme-Aware Tokens for Advanced Customization

#### Decision

Add additional semantic color tokens to `src/index.css` for scenarios requiring more granular control.

#### Tokens Added

- **Essential**: `--success`, `--success-foreground`, `--warning`, `--warning-foreground`
- **Optional** (advanced customization): `--info`, `--info-foreground`, `--text-tertiary`, `--text-placeholder`
- **Background variants**: `--success-bg`, `--warning-bg`, `--error-bg`, `--info-bg`

#### Usage Guidelines

- Essential tokens: Use for standard feedback states (alerts, toasts, notifications)
- Optional tokens: Only use when specific scenarios require more customization than base theme provides
- All tokens must be theme-aware (adapt to light/dark mode automatically)
- Use OKLCH color space to match existing theme system

**Implementation**: See `src/index.css` lines 114-130 for token definitions.

---

### 11. Cross-App Reuse Decision Matrix

**STATUS**: ✅ APPROVED - Governance Rules Applied

#### Decision

Approved decision matrix incorporating governance Rules 1, 2, and 3 for construct promotion/demotion.

#### Key Rules

- **Rule 1**: Promote when required in another app OR when evaluating existing constructs
- **Rule 2**: Promote when construct fulfills common use case/design pattern (shared by default)
- **Rule 3**: Demote when modification breaks it and no longer used elsewhere

#### Process

- Decision flowchart for new components
- 5 practical examples showing rules applied
- Demotion process with FORK_REASON.md template
- Auto-promote lists for different component types

**Detailed Documentation**: See `/docs/decision-matrix/cross-app-reuse.md` for complete decision matrix, flowcharts, practical examples (InlineTagEditor, QuoteCalculator, Modal, FormDrawer, TagEditor).

---

### 12. App-Specific/Brand Color Token Guidelines

**STATUS**: ✅ APPROVED - Section for Custom Brand Colors

#### Decision

Add dedicated section in `src/index.css` for app-specific and brand colors.

#### Purpose

Allow adding custom brand colors (e.g., insurance red replacing default blue primary) or additional color primitives (purple, teal, etc.) for use cases existing tokens don't fulfill.

#### Guidelines

- Add when existing brand colors or custom colors are needed
- Must also add theme-aware versions if tokens should respond to theme
- **CAUTION**: Do not add variations to keep colors consistent across all applications
- Example: `--brand-insurance-red`, `--brand-teal-accent`

**Implementation**: See `src/index.css` lines 63-79 for usage notes and examples.

---

### 13. AI Assistant Decision Tree for Component Classification

**STATUS**: ✅ APPROVED - AI-Friendly Component Classification System

#### Decision

Provide AI assistants with explicit decision tree for determining component type and location.

#### Purpose

Eliminate ambiguity in component placement. Enable AI assistants to make correct decisions without human intervention.

#### AI Assistant 5-Question Decision Tree

```
START: I need to create/modify a component
  |
  ├─ Question 1: Is this tied to a URL route?
  │   ├─ YES → It's a PAGE
  │   │   Location: apps/[app-name]/pages/
  │   │   Naming: [DescriptiveName]Page.tsx
  │   │   Contains: useParams(), data fetching, route orchestration
  │   │
  │   └─ NO → Continue to Question 2
  │
  ├─ Question 2: Does this define structural slots (columns, panels, grids)?
  │   ├─ YES → It's a LAYOUT
  │   │   Location: core/ui/layouts/ OR apps/[app-name]/layouts/
  │   │   Naming: [DescriptiveName]Layout.tsx
  │   │   Props: Slots (header, left, center, right, footer)
  │   │   Contains: ResizablePanel, Grid, Flexbox structure
  │   │
  │   └─ NO → Continue to Question 3
  │
  ├─ Question 3: Does this fill a layout slot and show different compositions based on state?
  │   ├─ YES → It's a VIEW
  │   │   Location: core/ui/views/ OR apps/[app-name]/views/
  │   │   Naming: [DescriptiveName]View.tsx
  │   │   Props: State prop that determines composition
  │   │   Contains: Conditional rendering of Constructs
  │   │
  │   └─ NO → Continue to Question 4
  │
  ├─ Question 4: Does this assemble multiple components with cohesive purpose?
  │   ├─ YES → It's a CONSTRUCT
  │   │   Location: core/ui/constructs/ OR apps/[app-name]/components/
  │   │   Naming: [Descriptive][Purpose].tsx
  │   │   Contains: Multiple components + business logic
  │   │   Promotion: Follow Rules 1-3 from governance model
  │   │
  │   └─ NO → Continue to Question 5
  │
  └─ Question 5: Is this a single UI control?
      └─ YES → It's a COMPONENT
          Location: core/ui/primitives/
          Naming: [Name].tsx (generic OK for universally understood primitives)
          Contains: Single atomic element (Button, Input, Badge)
```

#### Benefits

- Zero ambiguity for AI assistants
- Instant classification without file inspection
- Prevents incorrect component placement
- Reduces need for human verification

**Implementation**: See CLAUDE.md for AI assistant instructions and `/docs/decision-matrix/component-placement.md` for complete decision roadmap.

---

## Component Hierarchy Summary

Quick visual reference for all component layers and their locations:

```
Component  → Atomic primitives (Button, Input, Badge)
            Location: core/ui/primitives/

Construct  → Multi-component assemblies (InlineTagEditor, FormDrawer)
            Location: core/ui/constructs/ (shared) OR apps/[app]/components/ (app-specific)
            Promotion: Rules 1-3

Layout     → Spatial relationship managers (ThreeColumnLayout, DashboardLayout)
            Location: apps/[app]/layouts/ OR core/ui/layouts/ (if shared)

View       → Composed sections with state-driven rendering (TemplateSidebarView, EditorWorkspaceView)
            Location: apps/[app]/views/ OR core/ui/views/ (if shared)

Page       → Route-level containers (TemplateEditorPage, DashboardPage)
            Location: apps/[app]/pages/

Preset     → Dual definition
            Type A (UI config): construct/[name].presets.ts
            Type B (domain data): apps/[app]/config/presets/

Schema     → Zod validation rules
            Location: Co-located with component/construct
```

---

## File Structure Patterns

### Construct File Structure

```
construct/[name]/
├── [Name].tsx                    # PascalCase component
├── [name].vars.css               # kebab-case CSS variables (themeable knobs)
├── [name].tailwind.css           # kebab-case Tailwind composition
├── types.ts                      # Construct-specific types
├── use[Name].ts                  # Construct-specific hook (if needed)
├── [Name].schema.ts              # Zod validation (if has forms)
├── [Name].presets.ts             # UI configuration presets (Type A)
├── [Name].test.tsx               # Unit tests
├── [Name].stories.tsx            # Storybook stories (optional)
└── index.ts                      # Public API exports
```

### What to Co-locate ✅

- Types used exclusively by this construct
- Hooks used exclusively by this construct
- Validation schemas for this construct's forms
- UI configuration presets for this construct
- Tests and stories

### What to Keep Global ❌

- Shared domain types (Tag, User, Template)
- Shared hooks (useTemplateRegistry, useAuth)
- Shared utilities (formatDate, debounce)
- Domain data presets (email templates, product configs)

---

## Decision Matrix

For detailed frameworks, flowcharts, and practical examples, see:

- **Component Placement**: `/docs/decision-matrix/component-placement.md`
  - Complete 5-question decision tree
  - File structure reference
  - Descriptive naming anti-patterns
  - Practical examples for each component type

- **Variant Component Handling**: `/docs/decision-matrix/variant-component-handling.md`
  - Props vs Compound vs Presets framework
  - Decision tree flowchart
  - Trade-offs comparison
  - Real-world examples (Button, Modal, TagEditor)

- **Cross-App Reuse**: `/docs/decision-matrix/cross-app-reuse.md`
  - Governance Rules 1-3 detailed
  - Promotion/demotion flowcharts
  - 5 practical examples with rules applied
  - Auto-promote lists by component type

- **Construct Archive Review**: `/docs/decision-matrix/construct-archive-review.md`
  - 20-question subagent checklist
  - Disposition decision matrix
  - JIRA task template
  - 3 review outcome examples

---

## Related Documentation

- **Developer Instructions**: `/CLAUDE.md` - AI assistant classification system and quick references
- **Token System**: `/docs/typography-spacing-scale/figma-settings.md` - Complete Figma → Theme workflow
- **Migration Progress**: `/docs/reorganization-progress.md` - Phase tracking and conversion status

---

## Revision History

- **2025-01-26**: Official release - All 13 decisions finalized and approved after 3-day design session
