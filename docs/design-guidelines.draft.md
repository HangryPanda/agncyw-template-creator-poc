# Design System Guidelines (DRAFT)

> **Status**: IN PROGRESS - Active Discussion & Decision Tracking
> **Last Updated**: 2025-01-26
> **Purpose**: Define the architectural philosophy and organizational structure for our multi-app workspace UI system
> **Note**: This is a living discussion document. Finalized decisions will be moved to design-guidelines.md

---

## ACTION ITEMS

**Priority 1 - Clarifications Needed**:
- [X] ~~Clarify file naming conventions (PascalCase components, kebab-case CSS)~~ (COMPLETED - Decision #1 updated with descriptive naming principle)
- [X] ~~Review Figma tokens in `/docs/typography-spacing-scale`~~ (COMPLETED)
- [X] ~~Add color tokens to appropriate Figma token document~~ (COMPLETED)
- [X] ~~Create real-world TypeScript vs JSON/CSS token scenario~~ (COMPLETED - Decision approved)
- [X] ~~Finalize Component Organization Strategies (Page/Layout/View/Construct/Component)~~ (COMPLETED - Decision #1 revised, Decision #13 added)

**Priority 2 - Documentation Updates**:
- [X] ~~Create `/docs/decision-roadmaps/` folder for decision framework documents~~ (COMPLETED)
- [X] ~~Create `/docs/decision-roadmaps/component-placement.md` - AI Assistant Decision Roadmap~~ (COMPLETED)
  - Include 5-question decision tree from Decision #13
  - Include complete file structure (Page/Layout/View/Construct/Component locations)
  - Include descriptive naming conventions and anti-patterns
  - Include file naming patterns for AI pattern matching
  - Include practical examples for each component type
  - **Purpose**: Single source of truth for "Where does this file go?" decisions
- [X] ~~Extract Variant API decision roadmap to `/docs/decision-roadmaps/variant-api-patterns.md`~~ (COMPLETED)
- [X] ~~Extract Cross-App Reuse Decision Matrix to `/docs/decision-roadmaps/cross-app-reuse.md`~~ (COMPLETED)
  - **IMPORTANT**: Include all practical examples from the guidelines (InlineTagEditor, QuoteCalculator, Modal, FormDrawer, etc.) for developer context
- [ ] **NEW**: Update ui-designer subagent instructions to reference decision roadmaps (variant API, cross-app reuse, component placement)
- [X] ~~Update CLAUDE.md with AI Assistant Component Classification System~~ (COMPLETED)
  - Add reference to `/docs/decision-roadmaps/component-placement.md` as primary source
  - Add quick-reference summary of 5-question decision tree
  - Add file naming pattern rules (Page.tsx, Layout.tsx, View.tsx suffixes)
  - Add descriptive naming principle and anti-patterns
  - Add reference to `/docs/decision-roadmaps/cross-app-reuse.md` for construct promotion rules
  - Include key examples from decision matrices for developer context
- [X] ~~**NEW**: Add theme-aware semantic color tokens to `src/index.css`:~~ (COMPLETED)
  - ~~**Essential**: `--success`, `--success-foreground`, `--warning`, `--warning-foreground`~~
  - ~~**Optional** (for advanced customization): `--info`, `--info-foreground`, `--text-tertiary`, `--text-placeholder`~~
  - ~~**Background variants**: `--success-bg`, `--warning-bg`, `--error-bg`, `--info-bg`~~
- [ ] **NEW**: Add app-specific/brand color tokens section to `src/index.css` with guidelines (DEFERRED - to be completed when creating final design-guidelines.md)
  - Section header: "App-Specific & Brand Colors"
  - Usage note: "Add when existing brand colors or custom colors are needed (e.g., insurance red replacing default blue primary) or additional color primitives (purple, teal, etc.) for use cases existing tokens don't fulfill"
  - **CAUTION note**: "Must also add theme-aware versions if tokens should respond to theme. Do not add variations to keep colors consistent across all applications"
  - Include examples: `--brand-insurance-red`, `--brand-teal-accent`
- [X] ~~Create Variant API decision roadmap with examples and reasoning~~ (COMPLETED - Approved)
- [X] ~~Update Cross-App Reuse Decision Matrix based on governance rules~~ (COMPLETED - Approved)
- [X] ~~**NEW**: Create official `/docs/design-guidelines.md` by extracting and verifying EXECUTIVE SUMMARY section~~ (COMPLETED)
  - **Source**: Lines 64-2495 (stops at "## ORIGINAL DRAFT BEGINS BELOW")
  - **Must Include**: All 13 DECISIONS FINALIZED (lines 72-456)
    1. Component Hierarchy Definitions (line 72) - 5-layer architecture
    2. Token Organization Strategy (line 140) - 2-tier automated system
    3. Construct Governance Model (line 176) - Rules 1-3
    4. File Structure & Co-location (line 191)
    5. Migration Strategy (line 218)
    6. Construct Deprecation Strategy (line 245) - xx-Archive-xx folder
    7. Claude Code as Permanent Workflow Fixture (line 264)
    8. Token Implementation Strategy (line 287)
    9. Variant API Pattern Selection (line 310)
    10. Additional Semantic Color Tokens (line 331)
    11. Cross-App Reuse Decision Matrix (line 351)
    12. App-Specific/Brand Color Token Guidelines (line 376)
    13. AI Assistant Decision Tree for Component Classification (line 393)
  - **Must Include**: Updated Component Hierarchy Summary (lines 2455-2477)
  - **Exclude**: "What You Need to Decide" sections (lines 2481-2491)
  - **Exclude**: Original draft discussion materials (lines 2496+)
  - **Verification**: Read lines 64-2495 completely before extraction to ensure no content is missed
- [X] **DEPRECATED**: Rewrite Component Organization Strategies section (keeping as draft discussion - not deleting content)
- [X] ~~Create subagent checklist for construct archive review~~ (COMPLETED - `/docs/decision-roadmaps/construct-archive-review.md`)
- [ ] Document Phase 3 migration guidance (what comes after Phase 2?)

**Priority 3 - Migration Execution**:
- [ ] Perform codebase audit to identify high-value conversion targets
- [ ] Document conversion targets in markdown file
- [ ] Create conversion plans for each target
- [ ] Write unit tests for conversions
- [ ] Begin Phase 2.2 conversions with git checkpoints

---

## EXECUTIVE SUMMARY - DECISIONS & ACTION ITEMS

**Document Status**: This section summarizes all decisions made and items requiring action. The original draft discussion begins at the "Philosophy" section below.

---

### DECISIONS FINALIZED

#### 1. Component Hierarchy Definitions
**STATUS**: ✅ APPROVED (REVISED - AI Assistant Optimized)

**5-Layer Architecture:**

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

**Additional Definitions:**

- **Preset**: Dual definition
  - **Type A - UI Configuration**: Pre-defined prop combinations (e.g., `<Button preset="danger" />`)
    - Location: `construct/[name].presets.ts`
    - Contains: Immutable config objects
  - **Type B - Domain Data**: Pre-filled template content, insurance product configs
    - Location: `apps/[app-name]/config/presets/`
    - Contains: Domain data, not UI configuration

- **Schema**: Zod validation rules
  - Location: Co-located with forms/constructs (`construct/[name].schema.ts`)

**Descriptive Naming Principle (AI Assistant Critical):**
- ✅ **ALWAYS use descriptive names**: `TemplateEditor.tsx`, `TemplateSidebarView.tsx`, `InlineTagEditor.tsx`
- ❌ **NEVER use generic names**: `Editor.tsx`, `Sidebar.tsx`, `Manager.tsx`, `Panel.tsx`
- **Reason**: Generic names create ambiguity and require AI assistants to read multiple files for verification. Descriptive names enable instant file identification.
- **Pattern**: `[Domain][Entity][Action/Type]` (e.g., `TemplateMetadataForm.tsx`, `VariableInsertionPopover.tsx`)
- **Exception**: Atomic primitives can use generic names (Button, Input, Badge) because they're universally understood.

**Impact**:
- TemplateEditorPage.tsx → `apps/[app-name]/pages/` (route container)
- ThreeColumnEditorLayout.tsx → `apps/[app-name]/layouts/` (structural skeleton)
- TemplateSidebarView.tsx → `apps/[app-name]/views/` (composed section)
- EditorWorkspaceView.tsx → `apps/[app-name]/views/` (composed section)
- InlineTagEditor.tsx → `core/ui/constructs/` or `apps/[app-name]/components/` (construct)
- UI Preset files → `construct/[name].presets.ts`
- Domain Preset files → `apps/[app-name]/config/presets/`
- Schema files → Co-located with components

---

#### 2. Token Organization Strategy
**STATUS**: ✅ APPROVED - 2-Tier Automated System with Claude Code

**Accepted Pattern**:
```
Tier 1: Figma Primitives (docs/typography-spacing-scale/)
  ↓
Claude Code Mapping Layer (Automated)
  ↓
Tier 2: Theme Variables (src/index.css - existing HSL system)
  ↓
Tier 3: Construct Variables (construct/[name].vars.css)
```

**Key Points**:
- **Primitives**: Defined in Figma, synced to `design-tokens.css` (reference only, never used directly)
- **Theme Variables**: Existing HSL-based system (`--primary`, `--border`, `--foreground`, etc.)
- **Claude Code Bridge**: Automatically maps Figma primitives → theme variables during implementation
- **Components**: NEVER use primitives directly, ALWAYS use theme-aware variables

**App-Specific Tokens**:
- Use `data-app="[app-name]"` attribute on app root
- Apps define semantic tokens in `apps/[app-name]/styles/tokens.css`
- Claude Code enforces proper token usage automatically

**Rationale**:
- Eliminates manual design-to-code translation
- Designer-friendly Figma workflow (readable token names)
- Developer-friendly theme system (automatic light/dark mode)
- Claude Code ensures consistency and pattern enforcement
- Scales easily with team growth (automated enforcement)

**Documentation**: See `docs/typography-spacing-scale/figma-settings.md` for complete workflow and Figma → Theme mapping table.

---

#### 3. Construct Governance Model
**STATUS**: ✅ APPROVED - Incremental Promotion

**Promotion Criteria**:
- **Rule 1**: Promote when required in another application OR when asked to evaluate existing constructs
- **Rule 2**: Promote when the construct fulfills a common use case or design pattern (shared by default)
- **Note**: Modifying a construct to enhance/expand functionality WITHOUT breaking original use case = promotion to shared

**Demotion Criteria**:
- **Rule 3**: When modifying the construct breaks it and it's no longer used in another application

**Process**: User will explicitly instruct promotion or ask Claude to identify reusable constructs from other apps.

---

#### 4. File Structure & Co-location
**STATUS**: ✅ APPROVED (Pending naming convention clarification)

**Accepted Structure**:
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

**Co-location Rules**:
- ✅ Co-locate: Types, hooks, utilities exclusive to this construct
- ❌ Keep global: Shared domain types, shared hooks, general utilities

**Public API Pattern**: Use `index.ts` to control exports (don't export internal implementation details)

**USER QUESTION**: Are the file naming conventions in the example (PascalCase for components, kebab-case for CSS) best practices or fragments from earlier discussions? Awaiting clarification before finalizing.

---

#### 5. Migration Strategy
**STATUS**: ✅ APPROVED - Audit First, All-At-Once Conversion

**Modified Plan**:
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

**Conversion Approach**:
- ❌ NO hybrid state during conversion (all-at-once per construct)
- ✅ Use git commits as safety checkpoints
- ✅ Create commit of current project status before starting conversion process
- ✅ Tests validate conversion success before committing

**80/20 Shared Components**:
- Set aside during Phase 2
- Create list for one-by-one consideration after main conversions

---

#### 6. Construct Deprecation Strategy
**STATUS**: ✅ APPROVED - Enhanced Process

**Process**:
1. Mark with `@deprecated` JSDoc comment + migration guide
2. Add `console.warn` in dev mode
3. Update docs with deprecation notice + timeline
4. After 2 sprints with no usage, move to `xx-Archive-xx/` folder
5. Add `xx-Archive-xx/` to `.gitignore` as safety measure
6. **NEW**: Create Claude Code subagent to review archived constructs
   - Subagent follows checklist (needs creation)
   - Creates JIRA task with review details
   - Marks as "ready for deletion" or "needs further review"
   - Includes completed checklist and review details

**Action Item**: Create subagent checklist for archive review process.

---

#### 7. Claude Code as Permanent Workflow Fixture
**STATUS**: ✅ APPROVED - Core Development Tool

**Decision**: Claude Code (via MCP Server connection) is a permanent fixture in the design→development workflow.

**Responsibilities**:
- Automated Figma token → theme variable mapping
- Enforces construct patterns and naming conventions
- Generates code following design system rules
- Eliminates manual translation between design and development
- Maintains pattern consistency across codebase

**Impact**:
- Simplifies token system (2-tier with automated bridge)
- Reduces manual maintenance overhead
- Ensures architectural consistency automatically
- Scales easily with team growth (Claude enforces rules for all developers)
- Designer workflow remains simple (Figma only)

**Documentation**: Complete workflow documented in `docs/typography-spacing-scale/figma-settings.md`

---

#### 8. Token Implementation Strategy
**STATUS**: ✅ APPROVED - JSON + CSS + TypeScript Verification

**Decision**: Use JSON + CSS Variables with TypeScript compilation verification (Enhanced Option A).

**Workflow**:
1. Figma primitives → JSON export → CSS variables (`design-tokens.css`)
2. Claude Code creates/updates tokens (automated)
3. Vite plugin runs TypeScript compilation before commits pushed to origin
4. Local commits for safety checkpoints, push only after build passes
5. Theme variables in `src/index.css` reference primitives

**Why This Works**:
- Already have TypeScript verification via Vite plugin
- Claude Code creates tokens (no manual editing)
- Build fails if token errors exist (catches issues before push)
- No need for Vanilla Extract/Panda CSS complexity
- Get compile-time safety without build tool overhead

**Rejected Alternative**: TypeScript-only approach (Vanilla Extract/Panda CSS) - unnecessary complexity for current workflow.

---

#### 9. Variant API Pattern Selection
**STATUS**: ✅ APPROVED - Decision Roadmap Approach

**Decision**: Use decision roadmap framework (not hard guidelines) to evaluate variant patterns on a case-by-case basis.

**Approach**: When building components with variations, Claude Code will evaluate using the decision framework to recommend:
- **Pattern A (Props)**: For 1-4 independent variations
- **Pattern B (Compound)**: For fundamentally different component behaviors
- **Pattern C (Presets)**: For common combinations that prevent invalid states
- **Hybrid**: Mix patterns when appropriate

**Process**:
1. Claude Code evaluates component requirements
2. Applies decision tree from roadmap
3. Recommends pattern with reasoning
4. User/designer approves or adjusts

**Documentation**: Complete framework will be extracted to `/docs/decision-roadmaps/variant-api-patterns.md` as single source of truth for this and future decision roadmaps.

---

#### 10. Additional Semantic Color Tokens
**STATUS**: ✅ APPROVED - Theme-Aware Tokens for Advanced Customization

**Decision**: Add additional semantic color tokens to `src/index.css` for scenarios requiring more granular control.

**Tokens to Add**:
- **Essential**: `--success`, `--success-foreground`, `--warning`, `--warning-foreground` (currently missing)
- **Optional** (advanced customization): `--info`, `--info-foreground`, `--text-tertiary`, `--text-placeholder`
- **Background variants**: `--success-bg`, `--warning-bg`, `--error-bg`, `--info-bg`

**Usage Guidelines**:
- Essential tokens: Use for standard feedback states (alerts, toasts, notifications)
- Optional tokens: Only use when specific scenarios require more customization than base theme provides
- All tokens must be theme-aware (adapt to light/dark mode automatically)
- Use OKLCH color space to match existing theme system

**Implementation**: ui-designer subagent will determine appropriate OKLCH values that harmonize with existing ProTheme color system.

---

#### 11. Cross-App Reuse Decision Matrix
**STATUS**: ✅ APPROVED - Governance Rules Applied

**Decision**: Approved decision matrix incorporating governance Rules 1, 2, and 3 for construct promotion/demotion.

**Key Rules**:
- **Rule 1**: Promote when required in another app OR when evaluating existing constructs
- **Rule 2**: Promote when construct fulfills common use case/design pattern (shared by default)
- **Rule 3**: Demote when modification breaks it and no longer used elsewhere

**Process**:
- Decision flowchart for new components
- 5 practical examples showing rules applied
- Demotion process with FORK_REASON.md template
- Auto-promote lists for different component types

**Documentation**: Will be extracted to `/docs/decision-roadmaps/cross-app-reuse.md`

**Action Items**:
- Extract decision matrix to decision roadmaps folder
- Update ui-designer subagent instructions to reference matrix
- Update CLAUDE.md with examples for developer context

---

#### 12. App-Specific/Brand Color Token Guidelines
**STATUS**: ✅ APPROVED - Section for Custom Brand Colors

**Decision**: Add dedicated section in `src/index.css` for app-specific and brand colors.

**Purpose**: Allow adding custom brand colors (e.g., insurance red replacing default blue primary) or additional color primitives (purple, teal, etc.) for use cases existing tokens don't fulfill.

**Guidelines**:
- Add when existing brand colors or custom colors are needed
- Must also add theme-aware versions if tokens should respond to theme
- **CAUTION**: Do not add variations to keep colors consistent across all applications
- Example: `--brand-insurance-red`, `--brand-teal-accent`

**Implementation**: Add section to `src/index.css` with usage note and examples.

---

#### 13. AI Assistant Decision Tree for Component Classification
**STATUS**: ✅ APPROVED - AI-Friendly Component Classification System

**Decision**: Provide AI assistants with explicit decision tree for determining component type and location.

**Purpose**: Eliminate ambiguity in component placement. Enable AI assistants to make correct decisions without human intervention.

**5-Question Decision Tree:**

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

**Benefits:**
- Zero ambiguity for AI assistants
- Instant classification without file inspection
- Prevents incorrect component placement
- Reduces need for human verification

**Implementation**: Add to CLAUDE.md as "AI Component Classification Rules"

---

### PENDING USER DECISIONS

#### 1. TypeScript vs JSON/CSS for Tokens
**STATUS**: ✅ APPROVED - Enhanced Option A (JSON + CSS + TypeScript Verification)

**Decision**: Use JSON + CSS Variables with TypeScript compilation verification via Vite plugin.

**Workflow**:
- Figma primitives → JSON export → CSS variables (design-tokens.css)
- Claude Code creates/updates tokens (no manual designer editing)
- Vite plugin runs TypeScript compilation before commits pushed
- Local commits for safety checkpoints, push only after build passes
- Theme variables in src/index.css reference primitives

**Benefits**:
- ✅ Simple, standard CSS variables (no build complexity)
- ✅ TypeScript catches errors before push (compile-time safety)
- ✅ Claude Code ensures correct token usage
- ✅ Designer-friendly JSON format (Figma export compatible)
- ✅ No runtime surprises (build fails locally first)

**Rationale**: Already have TypeScript verification in workflow via Vite. No need for Vanilla Extract/Panda CSS complexity. Get compile-time safety without the overhead.

---

#### 2. Figma Token Integration
**STATUS**: ✅ APPROVED - 2-Tier Automated Workflow

**User Question**: "I have figma tokens defined in @/docs/typography-spacing-scale - is this what you are referring to? Is critical information (aside from color tokens) missing? I want you to update the correct document with the color tokens, please."

**Resolution**:
- ✅ Color tokens added to `/docs/typography-spacing-scale/design-tokens.css`
- ✅ Complete Figma collection definitions added to `figma-settings.md`
- ✅ Automated workflow documented (Figma → Claude Code → Theme Variables)
- ✅ Figma → Theme mapping table created for Claude Code reference

**Decision**: Use 2-tier system with Claude Code as automated bridge
- Designers work in Figma with primitives (blue/600, gray/200, etc.)
- Claude Code automatically maps to theme variables during implementation
- Components use theme-aware variables only (`--primary`, `--border`, etc.)

**Documentation**: See `docs/typography-spacing-scale/figma-settings.md` for complete workflow

---

#### 3. Variant API Decision Roadmap
**STATUS**: ✅ APPROVED - Decision Framework Ready

**User Decision**: "It's only natural to make this a decision roadmap when we encounter the scenario naturally. So no hard guideline, just provide a decision roadmap to help decide which path to follow."

**Approval**: Roadmap approved. Claude Code will perform evaluations to help decide which pattern to use when building components with variations.

**Documentation**: Complete decision roadmap in [PENDING DECISION 2] below. Will be extracted to `/docs/decision-roadmaps/` folder as single source of truth.

**Action Item**: Create `/docs/decision-roadmaps/variant-api-patterns.md` with the approved decision framework.

---

#### 4. Cross-App Reuse Decision Matrix
**STATUS**: ✅ APPROVED - Decision Matrix with Governance Rules

**User Decision**: Approved the updated decision matrix incorporating governance rules (Rule 1, 2, 3).

**Documentation**: Will be extracted to `/docs/decision-roadmaps/cross-app-reuse.md` as single source of truth.

**Action Items**:
- Create decision matrix file in decision roadmaps folder
- Update ui-designer subagent instructions to reference this decision matrix
- Update CLAUDE.md to include examples from the decision matrix for developer context

**Discussion Materials**: ✅ See complete decision matrix in [PENDING DECISION 4] below (will be extracted).

---

#### 5. Component Organization Strategies
**STATUS**: ✅ APPROVED - Finalized in Decision #1 and #13

**Resolution**: Component organization strategy has been completely revised and finalized in Decision #1 (Component Hierarchy Definitions) and Decision #13 (AI Assistant Decision Tree).

**Key Updates**:
- Clarified distinction between Page (route container) vs View (composed section)
- Added Layout as content-agnostic structural skeleton
- Established 5-layer architecture: Page → Layout → View → Construct → Component
- Added AI-friendly decision tree for component classification
- Added descriptive naming conventions principle
- All questions resolved and incorporated into Decision #1

**Action Items**:
- Create `/docs/decision-roadmaps/component-placement.md` as single source of truth
- Update CLAUDE.md with references to decision roadmap

---

### ACTION ITEMS

**Priority 1 - Clarifications Needed**:
- [X] ~~Clarify file naming conventions (PascalCase components, kebab-case CSS)~~ (COMPLETED - Decision #1 updated with descriptive naming principle)
- [X] ~~Review Figma tokens in `/docs/typography-spacing-scale`~~ (COMPLETED)
- [X] ~~Add color tokens to appropriate Figma token document~~ (COMPLETED)
- [X] ~~Create real-world TypeScript vs JSON/CSS token scenario~~ (COMPLETED - Decision approved)
- [X] ~~Finalize Component Organization Strategies (Page/Layout/View/Construct/Component)~~ (COMPLETED - Decision #1 revised, Decision #13 added)

**Priority 2 - Documentation Updates**:
- [ ] **NEW**: Create `/docs/decision-roadmaps/` folder for decision framework documents
- [ ] **NEW**: Create `/docs/decision-roadmaps/component-placement.md` - AI Assistant Decision Roadmap
  - Include 5-question decision tree from Decision #13
  - Include complete file structure (Page/Layout/View/Construct/Component locations)
  - Include descriptive naming conventions and anti-patterns
  - Include file naming patterns for AI pattern matching
  - Include practical examples for each component type
  - **Purpose**: Single source of truth for "Where does this file go?" decisions
- [ ] **NEW**: Extract Variant API decision roadmap to `/docs/decision-roadmaps/variant-api-patterns.md`
- [ ] **NEW**: Extract Cross-App Reuse Decision Matrix to `/docs/decision-roadmaps/cross-app-reuse.md`
  - **IMPORTANT**: Include all practical examples from the guidelines (InlineTagEditor, QuoteCalculator, Modal, FormDrawer, etc.) for developer context
- [ ] **NEW**: Update ui-designer subagent instructions to reference decision roadmaps (variant API, cross-app reuse, component placement)
- [ ] **NEW**: Update CLAUDE.md with AI Assistant Component Classification System
  - Add reference to `/docs/decision-roadmaps/component-placement.md` as primary source
  - Add quick-reference summary of 5-question decision tree
  - Add file naming pattern rules (Page.tsx, Layout.tsx, View.tsx suffixes)
  - Add descriptive naming principle and anti-patterns
  - Add reference to `/docs/decision-roadmaps/cross-app-reuse.md` for construct promotion rules
  - Include key examples from decision matrices for developer context
- [X] ~~**NEW**: Add theme-aware semantic color tokens to `src/index.css`:~~ (COMPLETED)
  - ~~**Essential**: `--success`, `--success-foreground`, `--warning`, `--warning-foreground`~~
  - ~~**Optional** (for advanced customization): `--info`, `--info-foreground`, `--text-tertiary`, `--text-placeholder`~~
  - ~~**Background variants**: `--success-bg`, `--warning-bg`, `--error-bg`, `--info-bg`~~
- [ ] **NEW**: Add app-specific/brand color tokens section to `src/index.css` with guidelines (DEFERRED - to be completed when creating final design-guidelines.md)
  - Section header: "App-Specific & Brand Colors"
  - Usage note: "Add when existing brand colors or custom colors are needed (e.g., insurance red replacing default blue primary) or additional color primitives (purple, teal, etc.) for use cases existing tokens don't fulfill"
  - **CAUTION note**: "Must also add theme-aware versions if tokens should respond to theme. Do not add variations to keep colors consistent across all applications"
  - Include examples: `--brand-insurance-red`, `--brand-teal-accent`
- [X] ~~Create Variant API decision roadmap with examples and reasoning~~ (COMPLETED - Approved)
- [X] ~~Update Cross-App Reuse Decision Matrix based on governance rules~~ (COMPLETED - Approved)
- [X] ~~**NEW**: Create official `/docs/design-guidelines.md` by extracting and verifying EXECUTIVE SUMMARY section~~ (COMPLETED)
  - **Source**: Lines 64-2495 (stops at "## ORIGINAL DRAFT BEGINS BELOW")
  - **Must Include**: All 13 DECISIONS FINALIZED (lines 72-456)
    1. Component Hierarchy Definitions (line 72) - 5-layer architecture
    2. Token Organization Strategy (line 140) - 2-tier automated system
    3. Construct Governance Model (line 176) - Rules 1-3
    4. File Structure & Co-location (line 191)
    5. Migration Strategy (line 218)
    6. Construct Deprecation Strategy (line 245) - xx-Archive-xx folder
    7. Claude Code as Permanent Workflow Fixture (line 264)
    8. Token Implementation Strategy (line 287)
    9. Variant API Pattern Selection (line 310)
    10. Additional Semantic Color Tokens (line 331)
    11. Cross-App Reuse Decision Matrix (line 351)
    12. App-Specific/Brand Color Token Guidelines (line 376)
    13. AI Assistant Decision Tree for Component Classification (line 393)
  - **Must Include**: Updated Component Hierarchy Summary (lines 2455-2477)
  - **Exclude**: "What You Need to Decide" sections (lines 2481-2491)
  - **Exclude**: Original draft discussion materials (lines 2496+)
  - **Verification**: Read lines 64-2495 completely before extraction to ensure no content is missed
- [ ] **DEPRECATED**: Rewrite Component Organization Strategies section (keeping as draft discussion - not deleting content)
- [X] ~~Create subagent checklist for construct archive review~~ (COMPLETED - `/docs/decision-roadmaps/construct-archive-review.md`)
- [ ] Document Phase 3 migration guidance (what comes after Phase 2?)

**Priority 3 - Migration Execution**:
- [ ] Perform codebase audit to identify high-value conversion targets
- [ ] Document conversion targets in markdown file
- [ ] Create conversion plans for each target
- [ ] Write unit tests for conversions
- [ ] Begin Phase 2.2 conversions with git checkpoints

---

### NOTES FOR FINALIZATION

When moving decisions to `design-guidelines.md`:
1. All ✅ APPROVED items should be written as prescriptive guidelines (not suggestions)
2. Include rationale for each decision
3. Remove discussion points and alternatives (keep only approved approach)
4. Add examples and code snippets for clarity
5. Keep this draft file as historical record of decision process

---

## ========================================
## PENDING DECISION DISCUSSION MATERIALS
## ========================================

The following sections provide detailed analysis, real-world scenarios, and decision frameworks for the pending user decisions identified above. Review these materials to make informed final decisions.

---

## [APPROVED DECISION 1] - TypeScript vs JSON/CSS for Tokens - Real-World Scenario

**Status**: ✅ APPROVED - Enhanced Option A (JSON + CSS + TypeScript Verification)

**User Decision**: Use JSON + CSS Variables with TypeScript verification via Vite plugin. Claude Code creates tokens, Vite catches errors before push, local commits for checkpoints.

**Note**: This discussion section remains for reference showing the comparison that led to the decision.

---

### Real-World Scenario: Adding a New Primary Color

Let's walk through a realistic scenario: You need to add a new primary color and use it in a Button component.

#### Option A: JSON + CSS Variables (Current Approach)

**Step 1: Designer updates tokens.json**
```json
{
  "color": {
    "primary": {
      "$type": "color",
      "$value": "#D32F2F",
      "$description": "Insurance brand red"
    },
    "primary-hover": {
      "$type": "color",
      "$value": "#B71C1C"
    }
  }
}
```

**Step 2: CSS variables are generated/updated**
```css
/* design-tokens.css */
:root {
  --color-primary: #D32F2F;
  --color-primary-hover: #B71C1C;
}
```

**Step 3: Developer uses in component**
```tsx
// Button.tsx
export function Button({ children }: ButtonProps) {
  return (
    <button className="bg-[--color-primary] hover:bg-[--color-primary-hover]">
      {children}
    </button>
  )
}
```

**What happens if you make a typo?**
```tsx
// TYPO: --color-primry (missing 'a')
<button className="bg-[--color-primry]">
  Click me
</button>
```

Runtime Experience:
- TypeScript: No error (CSS variable names are just strings)
- Browser: Button has no background color (fallback to transparent)
- Developer Tools: You see `background: var(--color-primry)` which doesn't exist
- Discovery: Only when you visually inspect the button in the browser
- Fix time: 5-10 minutes (need to check browser, find typo, fix, reload)

**Pros:**
- Simple setup - works immediately with existing Tailwind
- Designers can edit tokens.json directly without dev help
- No build step required (just edit CSS file)
- Easy to understand for junior developers
- Hot reload works instantly

**Cons:**
- No autocomplete in JSX (have to remember variable names)
- Typos discovered at runtime (when you see broken UI)
- No compile-time safety
- Refactoring is manual (find/replace across files)

---

#### Option B: TypeScript (Vanilla Extract / Panda CSS)

**Step 1: Designer updates tokens.ts**
```typescript
// tokens.ts
export const colors = {
  primary: '#D32F2F',
  primaryHover: '#B71C1C',
} as const

export type ColorToken = keyof typeof colors
```

**Step 2: CSS is generated at build time**
```typescript
// Button.css.ts (Vanilla Extract)
import { style } from '@vanilla-extract/css'
import { colors } from './tokens'

export const button = style({
  backgroundColor: colors.primary,
  ':hover': {
    backgroundColor: colors.primaryHover,
  },
})
```

**Step 3: Developer uses in component**
```tsx
// Button.tsx
import * as styles from './Button.css'

export function Button({ children }: ButtonProps) {
  return <button className={styles.button}>{children}</button>
}
```

**What happens if you make a typo?**
```typescript
// TYPO: colors.primry (missing 'a')
export const button = style({
  backgroundColor: colors.primry, // TypeScript error!
})
```

Compile-Time Experience:
```
TypeScript Error (before browser even loads):
Property 'primry' does not exist on type '{ primary: string; primaryHover: string; }'.
Did you mean 'primary'?
```

- Discovery: Immediate red squiggly in VS Code
- VS Code autocomplete: Shows all available color tokens as you type
- Build fails: `npm run build` won't complete until fixed
- Fix time: 30 seconds (VS Code shows the error, suggests fix)

**Pros:**
- Full TypeScript autocomplete (VS Code shows all color tokens)
- Typos caught immediately (before browser loads)
- Refactoring is safe (rename symbol across entire codebase)
- Type safety prevents invalid combinations
- Can generate multiple outputs (CSS, JS, JSON) from single source

**Cons:**
- Requires build step (Vanilla Extract, Panda CSS, etc.)
- More complex setup (webpack/vite plugins)
- Designers need dev help to update tokens (TypeScript knowledge required)
- Steeper learning curve for team
- Hot reload slightly slower (need to rebuild CSS)

---

### Real-World Error Messages Compared

#### Scenario: You accidentally use a non-existent color token

**Option A (JSON/CSS):**
```tsx
<button className="bg-[--color-danger-hoverr]">Delete</button>
```

What you see:
- Browser: Button with transparent background
- Console: No errors (CSS just ignores invalid variables)
- You realize something is wrong when: You visually inspect the page
- Debugging: Open DevTools, inspect element, see `var(--color-danger-hoverr)` doesn't exist
- Error message: None (silent failure)

**Option B (TypeScript):**
```typescript
backgroundColor: colors.dangerHoverr
```

What you see:
```
TypeScript Error (line 12, column 20):
Property 'dangerHoverr' does not exist on type ColorTokens.
Did you mean 'dangerHover'?
```
- VS Code: Red squiggly line immediately
- Build: Fails with exact location of error
- Debugging: No debugging needed - error tells you exactly what's wrong
- Error message: Clear, actionable, with suggestion

---

### Designer Workflow Comparison

#### Option A (JSON/CSS) - Designer Updates Primary Color

1. Open `tokens.json` in any text editor
2. Change `"$value": "#D32F2F"` to `"$value": "#E53935"`
3. Save file
4. Refresh browser
5. Done

Time: 30 seconds
Tools needed: Text editor
Collaboration: Designer can work independently

#### Option B (TypeScript) - Designer Updates Primary Color

1. Open `tokens.ts` in VS Code
2. Change `primary: '#D32F2F'` to `primary: '#E53935'`
3. Save file
4. Wait for build to complete (5-10 seconds)
5. Refresh browser
6. Done

OR (more realistic for non-dev designers):

1. Ask developer to update token
2. Developer makes change in `tokens.ts`
3. Developer commits and deploys

Time: 30 seconds (if designer knows TypeScript) OR 5-30 minutes (if needs dev help)
Tools needed: VS Code, TypeScript knowledge
Collaboration: Designer may need developer assistance

---

### Migration Path Analysis

#### If you start with Option A and want to switch to Option B later:

**Effort: Medium (2-3 days)**

Steps:
1. Install Vanilla Extract or Panda CSS
2. Convert `tokens.json` to `tokens.ts`
3. Create `.css.ts` files for components
4. Update all component imports
5. Test thoroughly

Challenges:
- Need to update all components at once (can't do incrementally)
- Requires team training on new system
- Build configuration becomes more complex

#### If you start with Option B and want to switch to Option A later:

**Effort: Low (1 day)**

Steps:
1. Export `tokens.ts` to `tokens.json`
2. Generate CSS variables from tokens
3. Update components to use CSS variables instead of style objects
4. Remove Vanilla Extract/Panda CSS

Challenges:
- Lose type safety (can't go back easily)
- Team may resist losing autocomplete

---

### Specific Walkthrough: Adding New Primary Color to Button

#### Option A (JSON/CSS) - Full Workflow

```bash
# Step 1: Designer edits tokens.json
code docs/typography-spacing-scale/tokens.json
```

```json
{
  "color": {
    "insurance-red": {
      "$type": "color",
      "$value": "#D32F2F"
    }
  }
}
```

```bash
# Step 2: Manually update CSS (or run script)
code docs/typography-spacing-scale/design-tokens.css
```

```css
:root {
  --color-insurance-red: #D32F2F;
}
```

```bash
# Step 3: Developer uses in Button
code src/core/ui/primitives/button/Button.tsx
```

```tsx
export function Button({ variant = 'primary' }: ButtonProps) {
  const styles = variant === 'primary'
    ? 'bg-[--color-insurance-red] hover:bg-[--color-insurance-red-hover]'
    : 'bg-gray-200'

  return <button className={styles}>{children}</button>
}
```

Potential issues:
- Typo in `--color-insurance-red` → no autocomplete, no error
- Forgot to add `--color-insurance-red-hover` → button hover is transparent
- Discovery: Only when testing in browser

#### Option B (TypeScript) - Full Workflow

```bash
# Step 1: Designer/dev edits tokens.ts
code src/styles/tokens/tokens.ts
```

```typescript
export const colors = {
  insuranceRed: '#D32F2F',
  insuranceRedHover: '#B71C1C',
} as const

export type ColorToken = keyof typeof colors
```

```bash
# Step 2: Developer uses in Button.css.ts
code src/core/ui/primitives/button/Button.css.ts
```

```typescript
import { style, styleVariants } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens'

export const button = style({
  padding: '8px 16px',
  borderRadius: '4px',
})

export const variant = styleVariants({
  primary: {
    backgroundColor: colors.insuranceRed, // Autocomplete suggests all colors
    ':hover': {
      backgroundColor: colors.insuranceRedHover,
    },
  },
  secondary: {
    backgroundColor: colors.gray200,
  },
})
```

```bash
# Step 3: Use in component
code src/core/ui/primitives/button/Button.tsx
```

```tsx
import * as styles from './Button.css'

export function Button({ variant = 'primary' }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles.variant[variant]}`}>
      {children}
    </button>
  )
}
```

Benefits:
- Autocomplete shows all available colors as you type
- TypeScript error if you use non-existent color
- Refactoring is safe (rename `insuranceRed` across entire codebase)
- Discovery: Immediate (before you even run the app)

---

### What You Need to Decide

**Primary Question**: Do you value type safety and autocomplete over simplicity and designer autonomy?

**Recommendation**: Start with Option A (JSON + CSS Variables)

**Reasoning**:
1. Your team already has `tokens.json` and `design-tokens.css` set up
2. You're in rapid iteration phase (6-day sprints)
3. Designers can update tokens without developer bottleneck
4. If you find yourself with production bugs from typos, migrate to Option B later
5. Migration path from A → B is well-documented and medium effort

**When to reconsider Option B**:
- You've had 3+ production bugs from CSS variable typos
- Your team grows to 5+ developers (autocomplete saves time at scale)
- You're building a white-label product (need type-safe theme switching)
- Designers have TypeScript knowledge or you hire a design engineer

---

### Questions for You

- [ ] How often do your designers need to update design tokens? (Daily/Weekly/Monthly)
- [ ] Do your designers have TypeScript/coding knowledge?
- [ ] Have you experienced bugs from CSS variable typos in the past?
- [ ] How important is autocomplete in your development workflow?
- [ ] Are you planning to hire more developers soon (scaling team)?
- [ ] Do you prefer catching errors at compile-time or runtime?

---

## [APPROVED DECISION 2] - Variant API Decision Roadmap

**Status**: ✅ APPROVED - Decision Framework Approach

**User Decision**: Approved decision roadmap framework. Claude Code will evaluate and recommend variant patterns on a case-by-case basis using this framework.

**Action**: Will be extracted to `/docs/decision-roadmaps/variant-api-patterns.md` as single source of truth.

**Note**: This discussion section remains for reference and will be used as the basis for the standalone decision roadmap document.

---

This is a decision framework to help you choose the right variant pattern when building components. There's no one-size-fits-all answer - it depends on the component's complexity and usage patterns.

---

### The Three Variant Patterns

#### Pattern A: Prop-Based Variants
```tsx
<Button size="md" variant="primary" />
<Modal size="lg" position="center" />
<TagEditor mode="compact" position="inline" />
```

#### Pattern B: Compound Components
```tsx
<Button.Primary />
<Modal.Large />
<TagEditor.Compact />
```

#### Pattern C: Preset Objects
```tsx
import { BUTTON_PRESETS } from './Button.presets'
<Button preset={BUTTON_PRESETS.danger} />
<Button preset="danger" /> // or string reference
```

---

### Decision Tree Flowchart

```
START: I need to create variants for my component
  |
  ├─ Question 1: How many variant dimensions are there?
  │   │
  │   ├─ 1-2 dimensions (e.g., size, variant)
  │   │   └─> Use Pattern A (Props)
  │   │
  │   ├─ 3-4 dimensions (e.g., size, variant, position, mode)
  │   │   └─> Go to Question 2
  │   │
  │   └─ 5+ dimensions
  │       └─> Use Pattern C (Presets) - too many props!
  │
  ├─ Question 2: Are certain prop combinations invalid or dangerous?
  │   │
  │   ├─ YES (e.g., size="sm" + variant="icon" is invalid)
  │   │   └─> Use Pattern C (Presets) - prevent invalid states
  │   │
  │   └─ NO (any combination is valid)
  │       └─> Use Pattern A (Props) - maximum flexibility
  │
  ├─ Question 3: Do variants have completely different props?
  │   │
  │   ├─ YES (e.g., PrimaryButton has onClick, IconButton has icon)
  │   │   └─> Use Pattern B (Compound Components)
  │   │
  │   └─ NO (all variants share same base props)
  │       └─> Use Pattern A (Props)
  │
  └─ Question 4: Are there common combinations used 80%+ of the time?
      │
      ├─ YES (e.g., "danger button" always = red + bold + medium)
      │   └─> Use Pattern A (Props) + Pattern C (Presets for shortcuts)
      │
      └─ NO (variants used evenly)
          └─> Use Pattern A (Props)
```

---

### Trade-Offs Comparison Table

| Criteria | Pattern A: Props | Pattern B: Compound | Pattern C: Presets |
|----------|-----------------|---------------------|-------------------|
| **Flexibility** | High - any combination | Low - fixed variants | Medium - predefined combos |
| **Type Safety** | Medium - can pass invalid combos | High - each variant is separate type | High - presets are validated |
| **Discoverability** | High - autocomplete shows all props | Medium - need to know component names | Low - need to import presets |
| **Code Volume** | Low - single component | High - one component per variant | Medium - component + preset file |
| **Learning Curve** | Low - standard React pattern | Medium - need to understand compound pattern | Medium - need to find presets |
| **Maintenance** | Easy - single source of truth | Hard - multiple components to update | Medium - update presets when props change |
| **Validation** | Manual - need prop validation | Automatic - TypeScript enforces | Automatic - presets are pre-validated |
| **Best For** | 1-3 simple props | Fundamentally different variants | Many props with common patterns |

---

### Real-World Examples

#### Example 1: Button Component (1-2 dimensions)

**Variant Dimensions:**
- Size: sm, md, lg
- Variant: primary, secondary, ghost, danger

**Total Combinations:** 4 sizes × 4 variants = 16 combinations (all valid)

**Decision:** Pattern A (Props)

**Implementation:**
```tsx
// Button.tsx
interface ButtonProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  children: React.ReactNode
}

export function Button({
  size = 'md',
  variant = 'primary',
  children
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    ghost: 'bg-transparent text-blue-600 hover:bg-blue-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  return (
    <button className={`${sizeClasses[size]} ${variantClasses[variant]}`}>
      {children}
    </button>
  )
}

// Usage
<Button size="md" variant="primary">Save</Button>
<Button size="sm" variant="danger">Delete</Button>
```

**Why this works:** Simple, intuitive, all combinations are valid.

---

#### Example 2: Modal Component (3-4 dimensions)

**Variant Dimensions:**
- Size: sm, md, lg, xl, full
- Position: center, top, right, bottom
- Backdrop: blur, dim, none
- CloseButton: visible, hidden

**Total Combinations:** 5 × 4 × 3 × 2 = 120 combinations (many are nonsensical)

**Decision:** Pattern A (Props) + Pattern C (Presets for common use cases)

**Implementation:**
```tsx
// Modal.tsx
interface ModalProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  position?: 'center' | 'top' | 'right' | 'bottom'
  backdrop?: 'blur' | 'dim' | 'none'
  showCloseButton?: boolean
  children: React.ReactNode
}

export function Modal({
  size = 'md',
  position = 'center',
  backdrop = 'blur',
  showCloseButton = true,
  children,
}: ModalProps) {
  // Implementation
}

// Modal.presets.ts
export const MODAL_PRESETS = {
  dialog: {
    size: 'sm',
    position: 'center',
    backdrop: 'blur',
    showCloseButton: true,
  },
  drawer: {
    size: 'md',
    position: 'right',
    backdrop: 'dim',
    showCloseButton: true,
  },
  fullscreen: {
    size: 'full',
    position: 'center',
    backdrop: 'none',
    showCloseButton: false,
  },
} as const satisfies Record<string, Partial<ModalProps>>

// Usage
// Flexible: custom combinations
<Modal size="lg" position="center" backdrop="blur">
  <p>Custom modal</p>
</Modal>

// Convenient: presets for common patterns
<Modal {...MODAL_PRESETS.dialog}>
  <p>Confirm deletion?</p>
</Modal>

<Modal {...MODAL_PRESETS.drawer}>
  <p>Settings panel</p>
</Modal>
```

**Why this works:**
- Power users can customize every detail with props
- Common use cases have convenient presets
- Presets are type-safe (validated against ModalProps)
- Best of both worlds

---

#### Example 3: TagEditor Component (Fundamentally Different Variants)

**Variants:**
- Inline: Renders inside text flow, compact size, minimal chrome
- Panel: Renders in sidebar, full features, keyboard shortcuts
- Readonly: Display-only mode, no editing capabilities

**Key Insight:** These aren't just style differences - they have different **behavior** and **props**:
- Inline: `onBlur`, `position`, `maxTags`
- Panel: `onSave`, `onCancel`, `showSearch`
- Readonly: `tags` (no editing props)

**Decision:** Pattern B (Compound Components)

**Implementation:**
```tsx
// TagEditor.tsx - Shared logic
function TagEditorBase({ mode, children }: { mode: string; children: React.ReactNode }) {
  return <div data-tag-editor-mode={mode}>{children}</div>
}

// TagEditor.Inline.tsx
interface InlineTagEditorProps {
  tags: Tag[]
  onBlur?: () => void
  position?: 'above' | 'below'
  maxTags?: number
}

function InlineTagEditor({ tags, onBlur, position = 'below', maxTags }: InlineTagEditorProps) {
  return (
    <TagEditorBase mode="inline">
      {/* Inline-specific UI */}
    </TagEditorBase>
  )
}

// TagEditor.Panel.tsx
interface PanelTagEditorProps {
  tags: Tag[]
  onSave: (tags: Tag[]) => void
  onCancel: () => void
  showSearch?: boolean
}

function PanelTagEditor({ tags, onSave, onCancel, showSearch = true }: PanelTagEditorProps) {
  return (
    <TagEditorBase mode="panel">
      {/* Panel-specific UI with search, keyboard shortcuts */}
    </TagEditorBase>
  )
}

// TagEditor.Readonly.tsx
interface ReadonlyTagEditorProps {
  tags: Tag[]
}

function ReadonlyTagEditor({ tags }: ReadonlyTagEditorProps) {
  return (
    <TagEditorBase mode="readonly">
      {/* Display-only UI */}
    </TagEditorBase>
  )
}

// index.ts
export const TagEditor = {
  Inline: InlineTagEditor,
  Panel: PanelTagEditor,
  Readonly: ReadonlyTagEditor,
}

// Usage
<TagEditor.Inline
  tags={tags}
  onBlur={handleBlur}
  maxTags={5}
/>

<TagEditor.Panel
  tags={tags}
  onSave={handleSave}
  onCancel={handleCancel}
  showSearch
/>

<TagEditor.Readonly tags={tags} />
```

**Why this works:**
- Each variant has completely different props (type-safe)
- Can't accidentally pass `onSave` to readonly variant (TypeScript error)
- Clear intent: `<TagEditor.Readonly />` is more obvious than `<TagEditor mode="readonly" />`
- Easier to maintain: each variant is a separate file

---

### Decision Matrix: Quick Reference

**Use Pattern A (Props) when:**
- ✅ Component has 1-3 variant dimensions
- ✅ All prop combinations are valid
- ✅ Variants share the same props and behavior
- ✅ Examples: Button, Input, Badge, Alert

**Use Pattern B (Compound Components) when:**
- ✅ Variants have fundamentally different props
- ✅ Variants have different behavior/logic
- ✅ Clear naming improves readability (Modal.Drawer vs Modal position="right")
- ✅ Examples: Form.TextField vs Form.Select, Layout.Sidebar vs Layout.Main

**Use Pattern C (Presets) when:**
- ✅ Component has 4+ variant dimensions (too many props)
- ✅ Certain prop combinations are invalid or dangerous
- ✅ 80%+ usage follows 3-5 common patterns
- ✅ You want to enforce design system consistency
- ✅ Examples: Complex modals, data tables, form layouts

**Use Pattern A + C (Hybrid) when:**
- ✅ You want flexibility AND convenience
- ✅ Power users need custom combinations
- ✅ Most users want quick presets
- ✅ Examples: Modal, DataTable, Form

---

### Specific Guidance by Variant Count

**1-2 variants:** Always use Pattern A (Props)
```tsx
<Button variant="primary" size="md" />
```

**3-4 variants:** Use Pattern A, consider adding Pattern C presets
```tsx
// Flexible
<Modal size="lg" position="center" backdrop="blur" showClose />

// Convenient
<Modal {...MODAL_PRESETS.dialog} />
```

**5+ variants:** Use Pattern C (Presets) to prevent prop explosion
```tsx
<DataTable preset={TABLE_PRESETS.compactSortableEditable} />
// Better than:
<DataTable size="sm" sortable editable showHeader showFooter stickyHeader virtualScroll />
```

**Different behavior per variant:** Use Pattern B (Compound)
```tsx
<Form.TextField name="email" validation={emailSchema} />
<Form.Select name="country" options={countries} />
// Better than:
<FormField type="text" name="email" />
<FormField type="select" name="country" />
```

---

### What You Need to Decide

**Primary Question**: When encountering a new component with variants, which pattern should you start with?

**Recommendation**: Follow the decision tree above. Default to Pattern A (Props) unless you have a specific reason to use B or C.

**Questions for You:**
- [ ] Review the decision tree - does it make sense for your workflow?
- [ ] Are there any component types you're planning to build soon that would benefit from this guidance?
- [ ] Do you want to add any team-specific criteria to the decision matrix?

---

## [APPROVED DECISION 3] - Figma Color Tokens - Review & Addition

**Status**: ✅ COMPLETED - Color Tokens Added

**Resolution**:
- ✅ Color tokens added to `/docs/typography-spacing-scale/design-tokens.css`
- ✅ Color collections added to `/docs/typography-spacing-scale/figma-settings.md`
- ✅ Complete 2-tier automated workflow documented
- ✅ Figma → Theme mapping table created

**Note**: This section remains for reference showing the original analysis and color token structure that was implemented.

---

### Current State of Figma Tokens

I've reviewed the `/docs/typography-spacing-scale/` directory. Here's what you currently have:

#### What's Already Defined

**1. Spacing Tokens** ✅ COMPLETE
- File: `tokens.json`, `design-tokens.css`
- Coverage: 2xs (2px) through 4xl (48px)
- Status: Production-ready, well-documented

**2. Typography Tokens** ✅ COMPLETE
- Font sizes: 2xs (10px) through 4xl (30px)
- Line heights: tight (1.25), normal (1.5), relaxed (1.75)
- Font weights: regular (400), medium (500), semibold (600), bold (700)
- Font families: Inter (base), JetBrains Mono (mono)
- Status: Production-ready, well-documented

**3. Breakpoints** ✅ COMPLETE
- Panel sizes: xs (360px) through full (1024px)
- Status: Production-ready, optimized for panel-based layouts

#### What Was Missing (Now Completed)

**4. Color Tokens** ✅ NOW DEFINED

~~This was the critical missing piece.~~ **UPDATE**: Color tokens have been added to both `design-tokens.css` and `figma-settings.md` with complete primitive scales and Figma → Theme mapping.

---

### Implemented Color Token Structure

**Note**: The structure below was recommended and has now been fully implemented in `design-tokens.css` and `figma-settings.md`.

Based on your existing token structure and the tiered token strategy already approved, here's the complete color system to add:

#### Tier 1: Primitive Color Tokens (Raw Values)

These are the base color palette - the raw values from your design system.

```json
{
  "color": {
    "primitive": {
      "gray": {
        "50": { "$type": "color", "$value": "#F9FAFB" },
        "100": { "$type": "color", "$value": "#F3F4F6" },
        "200": { "$type": "color", "$value": "#E5E7EB" },
        "300": { "$type": "color", "$value": "#D1D5DB" },
        "400": { "$type": "color", "$value": "#9CA3AF" },
        "500": { "$type": "color", "$value": "#6B7280" },
        "600": { "$type": "color", "$value": "#4B5563" },
        "700": { "$type": "color", "$value": "#374151" },
        "800": { "$type": "color", "$value": "#1F2937" },
        "900": { "$type": "color", "$value": "#111827" },
        "950": { "$type": "color", "$value": "#030712" }
      },
      "blue": {
        "50": { "$type": "color", "$value": "#EFF6FF" },
        "100": { "$type": "color", "$value": "#DBEAFE" },
        "200": { "$type": "color", "$value": "#BFDBFE" },
        "300": { "$type": "color", "$value": "#93C5FD" },
        "400": { "$type": "color", "$value": "#60A5FA" },
        "500": { "$type": "color", "$value": "#3B82F6" },
        "600": { "$type": "color", "$value": "#2563EB" },
        "700": { "$type": "color", "$value": "#1D4ED8" },
        "800": { "$type": "color", "$value": "#1E40AF" },
        "900": { "$type": "color", "$value": "#1E3A8A" }
      },
      "red": {
        "50": { "$type": "color", "$value": "#FEF2F2" },
        "100": { "$type": "color", "$value": "#FEE2E2" },
        "200": { "$type": "color", "$value": "#FECACA" },
        "300": { "$type": "color", "$value": "#FCA5A5" },
        "400": { "$type": "color", "$value": "#F87171" },
        "500": { "$type": "color", "$value": "#EF4444" },
        "600": { "$type": "color", "$value": "#DC2626" },
        "700": { "$type": "color", "$value": "#B91C1C" },
        "800": { "$type": "color", "$value": "#991B1B" },
        "900": { "$type": "color", "$value": "#7F1D1D" }
      },
      "green": {
        "50": { "$type": "color", "$value": "#F0FDF4" },
        "100": { "$type": "color", "$value": "#DCFCE7" },
        "200": { "$type": "color", "$value": "#BBF7D0" },
        "300": { "$type": "color", "$value": "#86EFAC" },
        "400": { "$type": "color", "$value": "#4ADE80" },
        "500": { "$type": "color", "$value": "#22C55E" },
        "600": { "$type": "color", "$value": "#16A34A" },
        "700": { "$type": "color", "$value": "#15803D" },
        "800": { "$type": "color", "$value": "#166534" },
        "900": { "$type": "color", "$value": "#14532D" }
      },
      "yellow": {
        "50": { "$type": "color", "$value": "#FEFCE8" },
        "100": { "$type": "color", "$value": "#FEF9C3" },
        "200": { "$type": "color", "$value": "#FEF08A" },
        "300": { "$type": "color", "$value": "#FDE047" },
        "400": { "$type": "color", "$value": "#FACC15" },
        "500": { "$type": "color", "$value": "#EAB308" },
        "600": { "$type": "color", "$value": "#CA8A04" },
        "700": { "$type": "color", "$value": "#A16207" },
        "800": { "$type": "color", "$value": "#854D0E" },
        "900": { "$type": "color", "$value": "#713F12" }
      },
      "orange": {
        "50": { "$type": "color", "$value": "#FFF7ED" },
        "100": { "$type": "color", "$value": "#FFEDD5" },
        "200": { "$type": "color", "$value": "#FED7AA" },
        "300": { "$type": "color", "$value": "#FDBA74" },
        "400": { "$type": "color", "$value": "#FB923C" },
        "500": { "$type": "color", "$value": "#F97316" },
        "600": { "$type": "color", "$value": "#EA580C" },
        "700": { "$type": "color", "$value": "#C2410C" },
        "800": { "$type": "color", "$value": "#9A3412" },
        "900": { "$type": "color", "$value": "#7C2D12" }
      }
    }
  }
}
```

---

#### Tier 2: Semantic Color Tokens (Mapped to Primitives)

These define the **intent** (what the color means) rather than the appearance.

```json
{
  "color": {
    "semantic": {
      "surface": {
        "primary": { "$type": "color", "$value": "{color.primitive.gray.50}" },
        "secondary": { "$type": "color", "$value": "{color.primitive.gray.100}" },
        "tertiary": { "$type": "color", "$value": "{color.primitive.gray.200}" },
        "inverse": { "$type": "color", "$value": "{color.primitive.gray.900}" }
      },
      "border": {
        "default": { "$type": "color", "$value": "{color.primitive.gray.200}" },
        "strong": { "$type": "color", "$value": "{color.primitive.gray.300}" },
        "subtle": { "$type": "color", "$value": "{color.primitive.gray.100}" }
      },
      "text": {
        "primary": { "$type": "color", "$value": "{color.primitive.gray.900}" },
        "secondary": { "$type": "color", "$value": "{color.primitive.gray.600}" },
        "tertiary": { "$type": "color", "$value": "{color.primitive.gray.500}" },
        "inverse": { "$type": "color", "$value": "{color.primitive.gray.50}" },
        "placeholder": { "$type": "color", "$value": "{color.primitive.gray.400}" }
      },
      "action": {
        "primary": { "$type": "color", "$value": "{color.primitive.blue.600}" },
        "primary-hover": { "$type": "color", "$value": "{color.primitive.blue.700}" },
        "primary-active": { "$type": "color", "$value": "{color.primitive.blue.800}" },
        "secondary": { "$type": "color", "$value": "{color.primitive.gray.200}" },
        "secondary-hover": { "$type": "color", "$value": "{color.primitive.gray.300}" }
      },
      "feedback": {
        "success": { "$type": "color", "$value": "{color.primitive.green.600}" },
        "success-bg": { "$type": "color", "$value": "{color.primitive.green.50}" },
        "warning": { "$type": "color", "$value": "{color.primitive.orange.600}" },
        "warning-bg": { "$type": "color", "$value": "{color.primitive.orange.50}" },
        "error": { "$type": "color", "$value": "{color.primitive.red.600}" },
        "error-bg": { "$type": "color", "$value": "{color.primitive.red.50}" },
        "info": { "$type": "color", "$value": "{color.primitive.blue.600}" },
        "info-bg": { "$type": "color", "$value": "{color.primitive.blue.50}" }
      },
      "focus": {
        "ring": { "$type": "color", "$value": "{color.primitive.blue.500}" },
        "ring-offset": { "$type": "color", "$value": "{color.primitive.gray.50}" }
      }
    }
  }
}
```

---

### Where to Add Color Tokens

**File to Update:** `/docs/typography-spacing-scale/tokens.json`

**Location:** Add the color section after the existing `breakpoints` section.

**Updated File Structure:**
```json
{
  "spacing": { /* existing */ },
  "typography": { /* existing */ },
  "breakpoints": { /* existing */ },
  "color": {
    "primitive": { /* NEW - add primitive colors */ },
    "semantic": { /* NEW - add semantic colors */ }
  }
}
```

---

### CSS Variable Generation

✅ **COMPLETED**: Color tokens have been added to `/docs/typography-spacing-scale/design-tokens.css` with the following structure:

```css
:root {
  /* ============================================
     EXISTING TOKENS (keep as-is)
     ============================================ */
  --spacing-2xs: 2px;
  /* ... rest of spacing ... */

  --fontSize-2xs: 10px;
  /* ... rest of typography ... */

  /* ============================================
     COLOR TOKENS - PRIMITIVES (NEW)
     ============================================ */
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;
  --color-gray-950: #030712;

  --color-blue-50: #EFF6FF;
  --color-blue-100: #DBEAFE;
  --color-blue-200: #BFDBFE;
  --color-blue-300: #93C5FD;
  --color-blue-400: #60A5FA;
  --color-blue-500: #3B82F6;
  --color-blue-600: #2563EB;
  --color-blue-700: #1D4ED8;
  --color-blue-800: #1E40AF;
  --color-blue-900: #1E3A8A;

  --color-red-50: #FEF2F2;
  --color-red-100: #FEE2E2;
  --color-red-200: #FECACA;
  --color-red-300: #FCA5A5;
  --color-red-400: #F87171;
  --color-red-500: #EF4444;
  --color-red-600: #DC2626;
  --color-red-700: #B91C1C;
  --color-red-800: #991B1B;
  --color-red-900: #7F1D1D;

  --color-green-50: #F0FDF4;
  --color-green-100: #DCFCE7;
  --color-green-200: #BBF7D0;
  --color-green-300: #86EFAC;
  --color-green-400: #4ADE80;
  --color-green-500: #22C55E;
  --color-green-600: #16A34A;
  --color-green-700: #15803D;
  --color-green-800: #166534;
  --color-green-900: #14532D;

  --color-yellow-50: #FEFCE8;
  --color-yellow-100: #FEF9C3;
  --color-yellow-200: #FEF08A;
  --color-yellow-300: #FDE047;
  --color-yellow-400: #FACC15;
  --color-yellow-500: #EAB308;
  --color-yellow-600: #CA8A04;
  --color-yellow-700: #A16207;
  --color-yellow-800: #854D0E;
  --color-yellow-900: #713F12;

  --color-orange-50: #FFF7ED;
  --color-orange-100: #FFEDD5;
  --color-orange-200: #FED7AA;
  --color-orange-300: #FDBA74;
  --color-orange-400: #FB923C;
  --color-orange-500: #F97316;
  --color-orange-600: #EA580C;
  --color-orange-700: #C2410C;
  --color-orange-800: #9A3412;
  --color-orange-900: #7C2D12;

  /* ============================================
     COLOR TOKENS - SEMANTIC (NEW)
     ============================================ */
  --color-surface-primary: var(--color-gray-50);
  --color-surface-secondary: var(--color-gray-100);
  --color-surface-tertiary: var(--color-gray-200);
  --color-surface-inverse: var(--color-gray-900);

  --color-border-default: var(--color-gray-200);
  --color-border-strong: var(--color-gray-300);
  --color-border-subtle: var(--color-gray-100);

  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-600);
  --color-text-tertiary: var(--color-gray-500);
  --color-text-inverse: var(--color-gray-50);
  --color-text-placeholder: var(--color-gray-400);

  --color-action-primary: var(--color-blue-600);
  --color-action-primary-hover: var(--color-blue-700);
  --color-action-primary-active: var(--color-blue-800);
  --color-action-secondary: var(--color-gray-200);
  --color-action-secondary-hover: var(--color-gray-300);

  --color-feedback-success: var(--color-green-600);
  --color-feedback-success-bg: var(--color-green-50);
  --color-feedback-warning: var(--color-orange-600);
  --color-feedback-warning-bg: var(--color-orange-50);
  --color-feedback-error: var(--color-red-600);
  --color-feedback-error-bg: var(--color-red-50);
  --color-feedback-info: var(--color-blue-600);
  --color-feedback-info-bg: var(--color-blue-50);

  --color-focus-ring: var(--color-blue-500);
  --color-focus-ring-offset: var(--color-gray-50);
}
```

---

### How This Completes the Token System

Your current token system has:
1. Spacing scale ✅
2. Typography scale ✅
3. Breakpoints ✅

Adding colors completes the foundation:
4. Color primitives (raw values)
5. Color semantics (intent-based naming)

This creates a complete design token system following the **tiered approach** you've already approved:

```
Tier 1: Primitives (tokens.json)
  ├─ spacing (2xs → 4xl)
  ├─ typography (fontSize, lineHeight, fontWeight, fontFamily)
  ├─ breakpoints (panel-xs → panel-full)
  └─ color.primitive (gray, blue, red, green, yellow, orange)
       ↓
Tier 2: Semantics (design-tokens.css)
  ├─ color.semantic.surface (primary, secondary, tertiary, inverse)
  ├─ color.semantic.border (default, strong, subtle)
  ├─ color.semantic.text (primary, secondary, tertiary, inverse, placeholder)
  ├─ color.semantic.action (primary, secondary + hover/active states)
  ├─ color.semantic.feedback (success, warning, error, info + backgrounds)
  └─ color.semantic.focus (ring, ring-offset)
       ↓
Tier 3: Construct Variables (per-component CSS)
  └─ Component-specific overrides (e.g., --button-primary-bg)
```

---

### Usage Example

Once colors are added, developers can use them consistently:

```tsx
// Using semantic tokens (recommended)
<button className="bg-[--color-action-primary] hover:bg-[--color-action-primary-hover] text-[--color-text-inverse]">
  Save
</button>

// Using primitive tokens (when you need specific shade)
<div className="border-[--color-gray-200] bg-[--color-gray-50]">
  Card content
</div>

// In CSS
.alert-success {
  background-color: var(--color-feedback-success-bg);
  border-color: var(--color-feedback-success);
  color: var(--color-text-primary);
}
```

---

### What You Need to Decide

**Primary Question**: Should I add the color tokens to your existing token files?

**Recommendation**: Yes, add color tokens following the structure above.

**Questions for You:**
- [ ] Do you have existing brand colors (e.g., insurance red) that should replace the default blue primary?
- [ ] Are there any additional color primitives needed (purple, teal, etc.)?
- [ ] Do you want me to add the color tokens now, or would you prefer to review/customize first?

---

## [APPROVED DECISION 4] - Updated Cross-App Reuse Decision Matrix

**Status**: ✅ APPROVED - Governance Rules Applied

**User Decision**: Approved decision matrix incorporating governance Rules 1, 2, and 3.

**Action**: Will be extracted to `/docs/decision-roadmaps/cross-app-reuse.md` as single source of truth. ui-designer and CLAUDE.md will reference this matrix with examples.

**Note**: This section remains for reference and will be used as the basis for the standalone decision roadmap document.

---

This decision matrix has been rebuilt to incorporate the approved construct governance rules.

---

### Approved Governance Rules (Recap)

**Rule 1: Promotion Criteria - Explicit Instruction or Multi-App Need**
- Promote when required in another application
- Promote when evaluating existing constructs and finding reusable patterns

**Rule 2: Promotion Criteria - Common Use Cases**
- Promote when the construct fulfills a common use case or design pattern
- Shared by default if it's a universal pattern

**Rule 3: Demotion Criteria - Breaking Changes**
- Demote when modifying the construct breaks it and it's no longer used in another application

**Enhancement Rule: Non-Breaking Expansion**
- Modifying a construct to enhance or expand functionality WITHOUT breaking original use case = promotion to shared

---

### Updated Decision Matrix

| Scenario | Action | Rule Applied | Reasoning |
|----------|--------|--------------|-----------|
| **Component required in 2+ apps** | ✅ PROMOTE to shared | Rule 1 | Multi-app need proven |
| **User explicitly requests promotion** | ✅ PROMOTE to shared | Rule 1 | Explicit instruction |
| **User asks to find reusable constructs** | ✅ EVALUATE & PROMOTE matches | Rule 1 | Evaluating existing constructs |
| **Construct fulfills common pattern** (Button, Modal, Form inputs) | ✅ PROMOTE to shared | Rule 2 | Universal design pattern |
| **Construct is domain-specific** (QuoteCalculator, PipelineKanban) | ❌ KEEP app-specific | N/A | Business logic, not reusable |
| **Modification enhances WITHOUT breaking** | ✅ PROMOTE to shared | Enhancement Rule | Safe to share, more powerful |
| **Modification breaks original use case** | ❌ DEMOTE to app-specific | Rule 3 | Breaking change = not shared |
| **Construct breaks AND still used elsewhere** | 🔄 FORK or FIX | Rule 3 (inverse) | Coordination required |
| **One-off prototype or spike** | ❌ KEEP app-specific | N/A | Not proven useful yet |

---

### Practical Examples with Rules Applied

#### Example 1: InlineTagEditor

**Scenario**: Template Editor app has InlineTagEditor. CRM app needs tag editing.

**Evaluation**:
- Is it required in another app? ✅ YES (CRM app)
- Does it fulfill a common pattern? ✅ YES (tag management is universal)

**Decision**: ✅ PROMOTE to `core/ui/constructs/inline-tag-editor/`

**Rules Applied**: Rule 1 (multi-app need) + Rule 2 (common pattern)

---

#### Example 2: QuoteCalculator

**Scenario**: Insurance app has QuoteCalculator. CRM app doesn't need it.

**Evaluation**:
- Is it required in another app? ❌ NO
- Does it fulfill a common pattern? ❌ NO (insurance-specific business logic)

**Decision**: ❌ KEEP in `apps/insurance/components/QuoteCalculator.tsx`

**Rules Applied**: None (domain-specific component)

---

#### Example 3: Modal with Loading State

**Scenario**: Existing shared Modal. User requests adding loading state without breaking existing usage.

**Evaluation**:
- Does modification break existing usage? ❌ NO (optional prop with safe default)
- Does it enhance functionality? ✅ YES (adds loading indicator)

**Decision**: ✅ UPDATE shared Modal, keep in `core/ui/overlays/modal/`

**Rules Applied**: Enhancement Rule (non-breaking expansion)

**Implementation**:
```tsx
// Before
interface ModalProps {
  children: React.ReactNode
}

// After (non-breaking)
interface ModalProps {
  children: React.ReactNode
  isLoading?: boolean  // Optional, defaults to false
}
```

---

#### Example 4: FormDrawer with Insurance-Specific Validation

**Scenario**: Shared FormDrawer exists. Insurance app needs policy number validation.

**Evaluation**:
- Does modification break existing usage? ✅ YES (would require insurance-specific props)
- Is it still used in other apps? ✅ YES (CRM app uses it)

**Decision**: 🔄 CREATE insurance-specific wrapper, keep core FormDrawer shared

**Rules Applied**: Rule 3 inverse (breaking change, still used elsewhere = fork/extend)

**Implementation**:
```tsx
// Keep shared core
// core/ui/constructs/form-drawer/FormDrawer.tsx
export function FormDrawer({ children, onSubmit }: FormDrawerProps) {
  // Generic implementation
}

// Create insurance-specific wrapper
// apps/insurance/components/InsuranceFormDrawer.tsx
export function InsuranceFormDrawer({ policyNumber, ...props }: InsuranceFormDrawerProps) {
  const validate = useInsurancePolicyValidation()

  return (
    <FormDrawer {...props}>
      {policyNumber && <PolicyNumberField validate={validate} />}
      {props.children}
    </FormDrawer>
  )
}
```

---

#### Example 5: User Asks "Can We Reuse TagEditor from CRM App?"

**Scenario**: Building new feature, user asks Claude to check if CRM app has reusable tag editor.

**Evaluation**:
- Is this explicit instruction to evaluate? ✅ YES
- Does CRM app have TagEditor? ✅ YES
- Can it be used without breaking changes? ✅ YES

**Decision**: ✅ PROMOTE CRM TagEditor to shared construct

**Rules Applied**: Rule 1 (evaluating existing constructs)

**Process**:
1. Claude identifies `apps/crm/components/TagEditor.tsx`
2. Claude evaluates: generic enough? ✅ YES
3. Claude promotes to `core/ui/constructs/tag-editor/TagEditor.tsx`
4. Update imports in both CRM and new feature

---

### Decision Flowchart

```
START: Need a component/construct
  |
  ├─ Question 1: Does another app already have this?
  │   │
  │   ├─ YES → Evaluate if reusable (Rule 1)
  │   │   ├─ Generic enough? → PROMOTE to shared
  │   │   └─ Domain-specific? → BUILD new app-specific version
  │   │
  │   └─ NO → Continue to Question 2
  │
  ├─ Question 2: Is this a common design pattern?
  │   │
  │   ├─ YES (Button, Modal, Form, Tag Editor) → BUILD as shared (Rule 2)
  │   │
  │   └─ NO → Continue to Question 3
  │
  ├─ Question 3: Is this domain-specific business logic?
  │   │
  │   ├─ YES (QuoteCalculator, PipelineKanban) → BUILD as app-specific
  │   │
  │   └─ NO → Continue to Question 4
  │
  └─ Question 4: Will this be needed in 2+ apps?
      │
      ├─ HIGH CONFIDENCE → BUILD as shared
      │
      ├─ MAYBE → BUILD as app-specific, promote later if needed
      │
      └─ NO → BUILD as app-specific
```

---

### When to Demote (Rule 3 Application)

**Trigger**: You need to modify an existing shared construct

**Evaluation Questions**:
1. Does this modification break existing usage? (Changes required props, removes features, changes behavior)
2. Is this construct still used in other apps?

**Decision Matrix**:

| Breaks Existing? | Used Elsewhere? | Action |
|------------------|----------------|--------|
| NO (safe enhancement) | YES | ✅ UPDATE shared construct |
| NO (safe enhancement) | NO | ✅ UPDATE shared construct |
| YES (breaking change) | YES | 🔄 COORDINATE with other teams OR create app-specific fork |
| YES (breaking change) | NO | ❌ DEMOTE to app-specific |

**Demotion Process** (when breaks AND not used elsewhere):
1. Move from `core/ui/constructs/[name]/` to `apps/[app-name]/components/[Name]/`
2. Update imports in affected app
3. Document reason in `FORK_REASON.md`:
   ```markdown
   # Fork Reason: TagEditor

   **Original Location**: `core/ui/constructs/tag-editor/`
   **Demoted To**: `apps/insurance/components/TagEditor/`
   **Date**: 2025-01-26
   **Reason**: Added insurance-specific policy number validation that broke generic API. No longer used in CRM app (they switched to different implementation).
   ```

---

### Common Patterns - Auto-Promote List

These patterns should ALWAYS be built as shared (Rule 2):

**UI Primitives** (always shared):
- Button, Input, Select, Checkbox, Radio, Toggle, Badge, Tooltip

**Common Patterns** (always shared):
- Modal, Dialog, Drawer, Dropdown, Popover
- DataTable, List, VirtualList
- FormField, FormGroup, FormDrawer
- TagEditor, TagInput, TagList
- Toast, Alert, Notification
- Tabs, Accordion, Collapse
- LoadingSpinner, Skeleton, ProgressBar

**Domain-Specific** (always app-specific):
- QuoteCalculator, PolicyEditor, ClaimForm (insurance domain)
- PipelineKanban, ContactCard, DealEditor (CRM domain)
- OnboardingWizard, DashboardMetrics (app-specific flows)

---

### What You Need to Decide

**Primary Question**: Does this updated decision matrix accurately reflect your workflow?

**Recommendation**: Use this matrix as the source of truth for promotion/demotion decisions.

**Questions for You:**
- [ ] Review the decision matrix - does it match your expectations?
- [ ] Are there any domain-specific patterns I should add to the "always app-specific" list?
- [ ] Do you want to add any team-specific common patterns to the "always shared" list?
- [ ] Should I create a checklist tool (TodoWrite) for evaluating promotion decisions?

---

## [PENDING DECISION 5] - Component Organization Strategy (Refreshed)

**Status**: Awaiting User Review & Decision

This section has been completely rewritten to align with the current finalized decisions.

---

### Finalized Definitions (Recap)

Based on your approved decisions:

**View**
- Definition: Page-level compositions containing routes, page-level state, and data fetching
- Location: `apps/[app-name]/views/`
- Examples: TemplateEditor.tsx, TemplatePreview.tsx, DashboardView.tsx

**Preset**
- Definition: Dual-definition concept
  - **Type A - UI Configuration**: Pre-defined prop combinations (e.g., `<Button preset="danger" />`)
    - Location: `construct/[name].presets.ts`
    - Contains: Immutable config objects
  - **Type B - Domain Data**: Pre-filled template content, insurance product configs
    - Location: `apps/[app-name]/config/presets/`
    - Contains: Domain data, not UI configuration

**Schema**
- Definition: Zod validation rules co-located with forms
- Location: Co-located with forms/constructs (`construct/[name].schema.ts`)

**Construct**
- Definition: Multi-component assembly with cohesive purpose
- Location: `core/ui/constructs/` (shared) OR `apps/[app-name]/components/` (app-specific)
- Promotion: Follows Rules 1-3 from governance model

---

### Updated File Structure

Based on approved decisions, here's the complete, finalized file structure:

```
src/
├── core/                                    # Shared across all apps
│   ├── ui/
│   │   ├── primitives/                      # Basic UI controls
│   │   │   ├── button/
│   │   │   │   ├── Button.tsx               # PascalCase component
│   │   │   │   ├── button.vars.css          # CSS variables (themeable)
│   │   │   │   ├── button.tailwind.css      # Tailwind composition
│   │   │   │   ├── types.ts                 # Component-specific types
│   │   │   │   ├── Button.presets.ts        # UI configuration presets (Type A)
│   │   │   │   └── index.ts                 # Public API exports
│   │   │   └── input/
│   │   │       └── [same structure]
│   │   │
│   │   ├── overlays/                        # Modal, Dialog, Dropdown patterns
│   │   │   └── modal/
│   │   │       ├── Modal.tsx
│   │   │       ├── modal.vars.css
│   │   │       ├── Modal.presets.ts         # Common modal configurations
│   │   │       └── index.ts
│   │   │
│   │   └── constructs/                      # Multi-component assemblies
│   │       └── inline-tag-editor/
│   │           ├── InlineTagEditor.tsx
│   │           ├── inline-tag-editor.vars.css
│   │           ├── inline-tag-editor.tailwind.css
│   │           ├── types.ts
│   │           ├── useInlineTagEditor.ts    # Construct-specific hook
│   │           ├── InlineTagEditor.schema.ts  # Zod validation schema
│   │           ├── InlineTagEditor.test.tsx
│   │           └── index.ts
│   │
│   ├── lexical/                             # Lexical-specific framework code
│   │   ├── components/
│   │   ├── plugins/
│   │   ├── nodes/
│   │   └── themes/
│   │
│   └── styles/                              # Global design tokens
│       ├── tokens/
│       │   ├── primitives.json              # Tier 1: Raw values
│       │   └── design-tokens.css            # Generated CSS variables
│       └── themes/
│           ├── light.css                    # Tier 2: Semantic mappings
│           └── dark.css
│
├── apps/
│   └── template-editor/                     # App-specific code
│       ├── views/                           # Page-level compositions (NEW)
│       │   ├── TemplateEditor.tsx           # Full page: routes, state, data
│       │   └── TemplatePreview.tsx          # Full page: routes, state, data
│       │
│       ├── components/                      # App-specific components
│       │   └── QuoteCalculator/             # Insurance-specific logic
│       │       ├── QuoteCalculator.tsx
│       │       ├── QuoteCalculator.schema.ts  # Zod validation
│       │       └── index.ts
│       │
│       ├── config/
│       │   ├── presets/                     # Domain data presets (Type B)
│       │   │   ├── emailTemplates.ts        # Pre-filled template content
│       │   │   └── insuranceProducts.ts     # Insurance product configs
│       │   └── routes.ts
│       │
│       ├── features/                        # Feature-specific code
│       │   └── editor/
│       │       ├── components/              # Feature-scoped components
│       │       └── hooks/
│       │           └── useTemplateEditor.ts
│       │
│       └── styles/
│           └── tokens.css                   # App-specific semantic tokens
│
├── hooks/                                   # Shared hooks (global)
│   ├── template-registry/
│   │   └── useTemplateRegistry.ts
│   ├── modal-system/
│   │   └── useModal.ts
│   └── index.ts
│
└── services/                                # Shared services (global)
    ├── template-registry/
    │   └── templateRegistryService.ts
    └── local-storage/
        └── localStorageService.ts
```

---

### Key Organizational Principles (Updated)

#### 1. Views Live in Apps
**Decision**: All page-level compositions go in `apps/[app-name]/views/`

**Rationale**:
- Views contain routes, page-level state, data fetching (app concerns)
- Not reusable across apps (different routing, different data sources)
- Clear separation: constructs are position-agnostic, views orchestrate them

**File Relocation**:
```
Before: src/components/TemplateEditor.tsx
After:  src/apps/template-editor/views/TemplateEditor.tsx

Before: src/components/TemplatePreview.tsx
After:  src/apps/template-editor/views/TemplatePreview.tsx
```

---

#### 2. Presets Have Dual Definition
**Decision**: Presets mean different things in different contexts

**Type A - UI Configuration Presets**:
- Location: `construct/[name].presets.ts`
- Purpose: Pre-defined prop combinations for UI components
- Example:
  ```typescript
  // core/ui/primitives/button/Button.presets.ts
  export const BUTTON_PRESETS = {
    danger: {
      variant: 'solid',
      color: 'red',
      size: 'md',
    },
    success: {
      variant: 'solid',
      color: 'green',
      size: 'md',
    },
  } as const satisfies Record<string, Partial<ButtonProps>>
  ```

**Type B - Domain Data Presets**:
- Location: `apps/[app-name]/config/presets/`
- Purpose: Pre-filled template content, product configs, starter data
- Example:
  ```typescript
  // apps/template-editor/config/presets/emailTemplates.ts
  export const EMAIL_PRESETS = {
    welcomeEmail: {
      subject: 'Welcome to [Company]!',
      body: '...',
      tags: ['onboarding', 'welcome'],
    },
    followUp: {
      subject: 'Following up on your quote',
      body: '...',
      tags: ['sales', 'follow-up'],
    },
  }
  ```

**Why This Matters**: Prevents confusion about where presets belong. UI presets = component folder. Domain presets = app config folder.

---

#### 3. Schemas Co-locate with Forms
**Decision**: Zod validation schemas live next to the components they validate

**Location**:
- Shared construct with form: `core/ui/constructs/[name]/[Name].schema.ts`
- App-specific component with form: `apps/[app-name]/components/[Name]/[Name].schema.ts`

**Example**:
```typescript
// core/ui/constructs/inline-tag-editor/InlineTagEditor.schema.ts
import { z } from 'zod'

export const tagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
})

export const tagEditorSchema = z.object({
  tags: z.array(tagSchema),
  maxTags: z.number().min(1).max(20).optional(),
})

export type Tag = z.infer<typeof tagSchema>
export type TagEditorData = z.infer<typeof tagEditorSchema>
```

**Why This Matters**: Validation logic is part of the component's contract. Co-locating ensures they stay in sync when component changes.

---

#### 4. Construct Promotion Follows Approved Rules

**Promotion Decision**:
- Rule 1: Required in another app OR evaluating existing constructs → PROMOTE
- Rule 2: Fulfills common use case/design pattern → PROMOTE (shared by default)
- Enhancement Rule: Modifying without breaking → PROMOTE

**File Movement**:
```
Initial (app-specific):
apps/insurance/components/TagEditor.tsx

After promotion (Rule 1 - needed in CRM):
core/ui/constructs/tag-editor/TagEditor.tsx
```

**Demotion Decision**:
- Rule 3: Modification breaks it AND no longer used elsewhere → DEMOTE

**File Movement**:
```
Before (shared):
core/ui/constructs/form-drawer/FormDrawer.tsx

After demotion (Rule 3 - broke API, not used in CRM):
apps/insurance/components/FormDrawer.tsx
+ FORK_REASON.md documenting why
```

---

### Migration Impact on Current Files

Based on approved decisions, here's the immediate impact:

#### Files to Move

**1. Views → apps/template-editor/views/**
```bash
mv src/components/TemplateEditor.tsx src/apps/template-editor/views/TemplateEditor.tsx
mv src/components/TemplatePreview.tsx src/apps/template-editor/views/TemplatePreview.tsx
```

**2. Domain Presets → apps/template-editor/config/presets/**
```bash
# If you have email template presets, product configs, etc.
mv src/config/emailTemplates.ts src/apps/template-editor/config/presets/emailTemplates.ts
```

**3. Schemas → Co-locate with components**
```bash
# If you have standalone schema files, move them next to their components
mv src/schemas/tagEditor.schema.ts src/core/ui/constructs/inline-tag-editor/InlineTagEditor.schema.ts
```

#### Update Imports

After moving files:
```typescript
// Before
import { TemplateEditor } from '@/components/TemplateEditor'

// After
import { TemplateEditor } from '@/apps/template-editor/views/TemplateEditor'

// Or with path alias update in tsconfig.json:
import { TemplateEditor } from '@/apps/template-editor/views'
```

---

### Construct File Structure (Finalized)

Based on approved co-location decisions:

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

**What to Co-locate** ✅:
- Types used exclusively by this construct
- Hooks used exclusively by this construct
- Validation schemas for this construct's forms
- UI configuration presets for this construct
- Tests and stories

**What to Keep Global** ❌:
- Shared domain types (Tag, User, Template)
- Shared hooks (useTemplateRegistry, useAuth)
- Shared utilities (formatDate, debounce)
- Domain data presets (email templates, product configs)

---

### Updated Component Hierarchy Summary

```
Component  → Atomic primitives (Button, Input, Badge)
            Location: core/ui/primitives/

Construct  → Multi-component assemblies (InlineTagEditor, FormDrawer)
            Location: core/ui/constructs/ (shared) OR apps/[app]/components/ (app-specific)
            Promotion: Rules 1-3

Layout     → Spatial relationship managers (DashboardLayout, PageWrapper)
            Location: apps/[app]/layouts/ OR core/layouts/ (if shared)

View       → Page-level compositions with routes/state/data
            Location: apps/[app]/views/

Preset     → Dual definition
            Type A (UI config): construct/[name].presets.ts
            Type B (domain data): apps/[app]/config/presets/

Schema     → Zod validation rules
            Location: Co-located with component/construct
```

---

### What You Need to Decide

**Primary Question**: Is this organizational structure clear and aligned with your workflow?

**Recommendation**: Accept this structure as the finalized organization strategy.

**Questions for You:**
- [ ] Review the updated file structure - does it make sense?
- [ ] Are you ready to proceed with file relocations (Views to apps/[app]/views/)?
- [ ] Do you want me to create a migration checklist for reorganizing existing files?
- [ ] Should I update the CLAUDE.md documentation to reflect this finalized structure?

---

## ========================================
## ORIGINAL DRAFT BEGINS BELOW
## ========================================

The following sections contain the original discussion, Claude's suggestions, and user answers that led to the decisions summarized above. Do not alter this content - it serves as a historical record of the decision-making process.

---

## Philosophy

### Core Principles

1. **Atomic to Composed**: Smallest reusable elements form constructs; constructs form layouts
2. **Cohesion over Centralization**: Co-locate style logic with its component but keep tokens global
3. **Incremental Adoption**: Apply the construct pattern only when we need to - prove reuse patterns before investing in abstraction
4. **Context-Aware Components**: Constructs should be position-agnostic; layouts are position-aware

---

## Naming Conventions

### Philosophy: Hybrid, Language-Appropriate Naming

We use **hybrid naming conventions** that respect React/TypeScript ecosystem standards while maintaining compliance safety for regulated industries.

**Key Principle**: File names should match their primary export and follow language conventions, while directories use universal `kebab-case`.

---

### Frontend (React/TypeScript) Rules

#### **1. Directories: Always `kebab-case`**
```
coverage-snapshot/
inline-tag-editor/
template-registry/
local-storage/
```

#### **2. Components: `PascalCase.tsx`**
```tsx
Button.tsx                  // export function Button()
InlineTagEditor.tsx         // export function InlineTagEditor()
TemplateEditor.tsx          // export function TemplateEditor()
```
- Matches React ecosystem conventions (Create React App, Next.js, Remix)
- File name matches component export name
- No `.component.tsx` suffix needed (`.tsx` already signals component)

#### **3. Hooks: `useCamelCase.ts`**
```typescript
useTemplateRegistry.ts      // export function useTemplateRegistry()
useCoverageSnapshot.ts      // export function useCoverageSnapshot()
useModal.ts                 // export function useModal()
```
- Follows JavaScript/React hook conventions
- File name matches hook export name

#### **4. Services: `descriptiveNameService.ts` (⚠️ Compliance-Critical)**
```typescript
localStorageService.ts      // ⚠️ EXPLICIT: browser localStorage, NO PII
apiService.ts               // 🔐 EXPLICIT: server API, PII allowed
stateService.ts             // EXPLICIT: React state management
templateRegistryService.ts  // EXPLICIT: template CRUD operations
```

**Why Services Are Verbose:**

Service files use explicit, descriptive names (e.g., `localStorageService.ts` instead of `storage.ts`) for **compliance safety** in regulated industries (insurance, healthcare, banking).

This prevents catastrophic PII violations by making storage mechanisms crystal clear to both humans and AI assistants. In environments with State Farm partnerships or HIPAA compliance, the trade-off of 3-5 extra characters for complete clarity is worth preventing regulatory violations.

**Examples:**
- ❌ **Ambiguous (dangerous):** `storage.ts` - Which storage? localStorage? Database? Session?
- ✅ **Explicit (safe):** `localStorageService.ts` - Clearly browser storage, NO PII

#### **5. Types: `types.ts` or match domain**
```typescript
types.ts                    // Feature-scoped type definitions
Template.ts                 // Specific domain type export
```

#### **6. CSS: `kebab-case.css`**
```css
button.css
inline-tag-editor.vars.css
inline-tag-editor.tailwind.css
template-editor.theme.css
```

#### **7. Utilities/Helpers: `camelCase.ts`**
```typescript
formatDate.ts               // export function formatDate()
debounce.ts                 // export function debounce()
colorSystem.ts              // export const PRESET_COLORS = [...]
```

---

### Complete Frontend Example

```
src/
├── core/
│   ├── ui/
│   │   ├── primitives/
│   │   │   └── button/                    # kebab-case directory
│   │   │       ├── Button.tsx             # PascalCase component
│   │   │       ├── Button.css             # kebab-case CSS
│   │   │       ├── types.ts               # Types
│   │   │       └── index.ts               # Barrel export
│   │   │
│   │   └── constructs/
│   │       └── inline-tag-editor/         # kebab-case directory
│   │           ├── InlineTagEditor.tsx    # PascalCase component
│   │           ├── inline-tag-editor.vars.css
│   │           ├── inline-tag-editor.tailwind.css
│   │           ├── types.ts
│   │           └── index.ts
│   │
│   ├── lexical/
│   │   ├── components/
│   │   │   └── EquationEditor.tsx         # PascalCase component
│   │   ├── themes/
│   │   │   ├── templateEditor.theme.ts    # camelCase config object
│   │   │   └── templateEditor.theme.css   # kebab-case CSS
│   │   └── plugins/
│   │       └── ToolbarPlugin.ts           # PascalCase plugin
│   │
│   └── styles/
│       ├── tokens/
│       │   ├── primitives.json            # kebab-case data file
│       │   ├── colorSystem.css            # camelCase (matches JS naming)
│       │   └── typography.css             # kebab-case
│       └── themes/
│           ├── light.css                  # kebab-case
│           └── dark.css                   # kebab-case
│
├── apps/
│   └── template-editor/
│       └── features/
│           └── editor/                    # kebab-case directory
│               ├── components/
│               │   └── TemplateEditor.tsx # PascalCase component
│               ├── hooks/
│               │   └── useTemplateEditor.ts  # useCamelCase hook
│               └── services/
│                   ├── localStorageService.ts  # ⚠️ Explicit service
│                   └── apiService.ts            # 🔐 Explicit service
│
├── hooks/
│   └── template-registry/                 # kebab-case directory
│       └── useTemplateRegistry.ts         # useCamelCase hook
│
└── services/
    └── template-registry/                 # kebab-case directory
        └── templateRegistryService.ts     # camelCase + Service
```

---

### Compliance Documentation Required

**CRITICAL**: All storage services MUST include compliance warnings in JSDoc:

```typescript
/**
 * LocalStorageService
 *
 * ⚠️ COMPLIANCE WARNING ⚠️
 * - BROWSER LOCAL STORAGE ONLY
 * - NO PII (Personally Identifiable Information)
 * - NO SSN, Driver's License, Credit Cards, VINs
 * - ONLY: UI preferences, draft data, non-sensitive form state
 *
 * For PII storage, use apiService -> backend database
 */
export class LocalStorageService {
  // ...
}
```

---

### Common Mistakes to Avoid

❌ Using kebab-case for React components (`inline-tag-editor.component.tsx`)
❌ Using PascalCase for hooks (`UseTemplateRegistry.ts`)
❌ Creating ambiguous service files (`storage.ts`, `api.ts`)
❌ Using `.component.tsx` suffix (unnecessary, `.tsx` already signals component)
❌ Using `.hook.ts` suffix (unnecessary, `use` prefix already signals hook)
❌ Mixing camelCase and kebab-case directories
❌ Missing compliance warnings on storage services

---

## Component Hierarchy

### Semantic Naming Convention

```
Component  → Atomic level objects (buttons, inputs, badges)
Construct  → Assembly of components (tag editor, form group, card)
Layout     → Combined assemblies (dashboard layout, page wrapper)
View       → [NEEDS DEFINITION]
Preset     → [NEEDS DEFINITION]
Schema     → [NEEDS DEFINITION]
```

### Boundary Definitions

**Component vs Construct:**
- **Component**: Single-purpose, highly reusable atomic element
  - Examples: Button, Input, Badge, Icon
  - Style: Inline Tailwind acceptable for rapid iteration
  - Ownership: Can be app-specific or shared

- **Construct**: Multi-component assembly with cohesive purpose
  - Examples: InlineTagEditor, FormDrawer, DataTable
  - Style: Uses construct pattern (CSS variables + Tailwind @layer) when shared across apps
  - Ownership: Lives in `core/` when reused; lives in `apps/[app-name]/` when app-specific

**Construct vs Layout:**
- **Construct**: Position-agnostic, works anywhere it's dropped
  - No assumptions about viewport, grid systems, or sibling elements
  - Can be themed via CSS variable overrides

- **Layout**: Position-aware, manages spatial relationships
  - Cares about responsive breakpoints, grid systems, viewport positioning
  - Uses `data-layout="..."` attribute for scoping
  - Typically wraps constructs and provides positioning context

---

## Questions to Resolve

### 1. View/Preset/Schema Integration

**Current Understanding:**
- View: [EXPAND]
- Preset: [EXPAND]
- Schema: [EXPAND]

**Questions:**
- Are Views full-page compositions, or alternative renderings of the same data?
- Are Presets configuration objects for constructs (e.g., `<TagEditor preset="compact" />`)?
- Are Schemas type definitions, validation rules, or data structures?
- Should these live in the same component hierarchy or be separate concerns?

---

**📝 YOUR RESPONSE (fill in before proceeding with reorg):**

**View Definition:**
```
Contain Route definitions, page-level state, data fetching, 
```

**Preset Definition:**
```
1. **Configuration objects**: Pre-defined prop combinations (e.g., `<Button preset="danger" />` expands to `variant="solid" color="red" size="md"`)
   - Lives in: `construct/[name].presets.ts`
   - Contains: Immutable config objects 
```
We also have config/presets which contain domain data, not ui configuration - - Lives in: `apps/[app-name]/config/presets/`
**Schema Definition:**
```
[Schemas are Zod validation rules co-located with forms"]
```

**File Location Impact:**
```
Based on above definitions:
- TemplateEditor.tsx should live in: src/app/views
- TemplatePreview.tsx should live in: src/app/views
- Preset files should live in: src/app/presets
- Schema files should live in: src/app/schema
```

---

**Claude's Suggestions:**

**View** - Most likely one of these patterns:
1. **Page-level compositions**: Full screens that combine layouts + constructs (e.g., `DashboardView`, `TemplateEditorView`)
   - Lives in: `apps/[app-name]/views/`
   - Contains: Route definitions, page-level state, data fetching

2. **Alternative renderings**: Different presentations of the same data (e.g., `TableView`, `CardView`, `ListViewMode`)
   - Lives in: Co-located with the construct/layout that owns the data
   - Contains: Switching logic for different visual modes

**Recommendation**: If it's pattern #1, Views are effectively "pages" and should live at the app level. If pattern #2, they're variants and should be part of the construct API.

**Preset** - Likely one of these:
1. **Configuration objects**: Pre-defined prop combinations (e.g., `<Button preset="danger" />` expands to `variant="solid" color="red" size="md"`)
   - Lives in: `construct/[name].presets.ts`
   - Contains: Immutable config objects

2. **Template data**: Pre-filled form values or template content (e.g., email templates, insurance product configs)
   - Lives in: `apps/[app-name]/config/presets/`
   - Contains: Domain data, not UI configuration

**Recommendation**: If it's UI configuration (pattern #1), presets should be exported from the construct itself. If it's domain data (pattern #2), it's separate from the component system entirely.

**Schema** - Most likely one of these:
1. **TypeScript type definitions**: Interface/type exports (e.g., `Tag`, `Template`, `User`)
   - Lives in: `core/types/` (shared) or `apps/[app-name]/types/` (app-specific)
   - Contains: `.ts` files with `interface` and `type` declarations

2. **Validation schemas**: Zod/Yup/Joi schemas for runtime validation
   - Lives in: Co-located with the form/construct that uses them (`construct/[name].schema.ts`)
   - Contains: Validator definitions, error messages

3. **Data structure templates**: JSON schemas or GraphQL schemas defining backend contracts
   - Lives in: `core/schemas/` or `apps/[app-name]/schemas/`
   - Contains: `.json` or `.graphql` files

**Recommendation**: TypeScript types (#1) are separate from the component hierarchy. Validation schemas (#2) should co-locate with constructs. Backend schemas (#3) belong in a separate `/schemas` directory outside the UI system.

### 2. Token Organization Strategy

**Current State:**
- Global tokens planned (`core/styles/tokens/core.tokens.json`)
- Theme layer planned (`core/styles/themes/light.css`, `dark.css`)
- Construct-scoped variables planned (`[data-construct="..."]`)

**Questions:**
- Do we need app-specific token palettes (`tokens.insurance.colors`, `tokens.crm.colors`)?
  Answer: Maybe? Today, we don't. But probably?
- How do we handle app-specific semantic meanings (e.g., "priority-high" in insurance vs CRM)?
  Answer: currently they are all the same. But we will most likely need to have app-specific semantic means (build as need-ed approach)
- 
Should we implement tiered tokens?
  1. **Primitive tokens** (true globals: raw color values, spacing scales)
  2. **Semantic tokens** (app-level: `--color-insurance-primary`, `--color-crm-accent`)
  3. **Construct tokens** (component-scoped: `--ite-border`, `--ite-radius`)
  Answer: Yes! I also use Figma so this will help. Additionally, we already do this to a degree. 

**Claude's Suggestions:**

**Tiered Token Strategy (Recommended):**

**Tier 1: Primitive Tokens** (`core/styles/tokens/primitives.json`)
```json
{
  "color": {
    "blue": { "500": "#3B82F6", "600": "#2563EB" },
    "red": { "500": "#EF4444", "600": "#DC2626" },
    "gray": { "50": "#F9FAFB", "900": "#111827" }
  },
  "space": { "1": "0.25rem", "4": "1rem", "8": "2rem" },
  "radius": { "sm": "0.375rem", "md": "0.5rem", "lg": "0.75rem" }
}
```
- **Purpose**: Design primitives - the raw vocabulary
- **Usage**: Never used directly in components
- **Ownership**: Design team / design system maintainers

**Tier 2: Semantic Tokens** (`core/styles/themes/[theme].css`)
```css
:root[data-theme="light"] {
  /* Shared semantic tokens (all apps) */
  --color-surface: white;
  --color-border: var(--gray-200);
  --color-text: var(--gray-900);

  /* App-specific semantic tokens */
  --color-primary: var(--blue-600);    /* Default, overridden by app */
  --color-accent: var(--blue-500);
}

:root[data-app="insurance"] {
  --color-primary: #D32F2F;            /* Insurance red */
  --color-priority-high: #DC2626;
  --color-priority-medium: #F59E0B;
}

:root[data-app="crm"] {
  --color-primary: #2563EB;            /* CRM blue */
  --color-pipeline-cold: #64748B;
  --color-pipeline-hot: #EF4444;
}
```
- **Purpose**: Intent-based naming (what it means, not what it looks like)
- **Usage**: Consumed by construct variables
- **Ownership**: Theme maintainers + app teams (for app-specific semantics)

**Tier 3: Construct Variables** (`construct/[name].vars.css`)
```css
[data-construct="InlineTagEditor"] {
  --ite-bg: var(--color-surface);
  --ite-border: var(--color-border);
  --ite-primary: var(--color-primary);
}
```
- **Purpose**: Themeable knobs specific to the construct
- **Usage**: Used in construct's CSS classes
- **Ownership**: Construct maintainers

**Why This Matters:**
- **Primitive → Semantic**: Allows rebranding without touching every component
- **Semantic → Construct**: Allows per-app theming without forking constructs
- **Construct isolation**: Layout can override `--ite-*` without affecting other constructs

**App-Specific Tokens:**
- Use `data-app="[app-name]"` attribute on app root
- Apps define their semantic tokens in `apps/[app-name]/styles/tokens.css`
- Import order: primitives → shared semantics → app semantics → construct variables

---

**📝 YOUR DECISION:**
```
[ ] Accept tiered token strategy (Primitive → Semantic → Construct)
[ ] Use different token organization
[ ] Needs modification: [specify changes]

App-specific tokens approach:
[ ] Use data-app attributes as suggested
[ ] Different approach: [specify]

Reasoning: [your reasoning here]
```

---

### 3. Construct Governance

**Challenge:**
As insurance app and CRM app evolve separately, shared constructs risk:
- Accumulating app-specific props that pollute the shared API
- Getting forked ("just copy it, I need one small change")
- Having conflicting override requirements between apps

**Questions:**
- Do we need a formal approval process for modifying shared constructs?
- Should constructs have explicit versioning if breaking changes are needed?
- What's the criteria for "promoting" a component to a shared construct?

 *ANSWER*: When it is required in another application. Constructs can be made and shared within the application UI. I will typically ask you to look for constructs in a specific application that could be reused, if it is determined that it meets our needs without modifications that would break the original intention of the construct. NOTE: Modifying a construct to enhance or expand the functionality without breaking the construct or altering it's original use case then that is when it becomes a shared construct. Typically, I will specify a construct from another application or I will ask you to look for one that might already meet our needs from another application. Essentially Use Rule 2. 

 Alternatively, the when the construct fulfills a common use case or design pattern then it is promoted as shared by default. Use Rule 5  

- What's the process for "demoting" a construct back to app-specific when it diverges?

*ANSWER* When modifying the construct breaks and is no longer used in another application. or Rule 3

**Claude's Suggestions:**

**Lightweight Governance Model (Recommended for small teams):**

**Rule 1: Approval Required for Shared Constructs**
- Changes to `core/ui/constructs/` require review from at least one developer from *each consuming app*
- Use GitHub PR labels: `requires-insurance-review`, `requires-crm-review`
- Block merge until all app teams approve

**Rule 2: Extend, Don't Modify**
When adding app-specific features to a shared construct:
1. **Preferred**: Use CSS variable overrides in app layouts (no code change needed)
2. **Acceptable**: Add optional props with safe defaults (doesn't break existing usage)
3. **Last resort**: Create app-specific wrapper component that extends the construct

**Rule 3: Fork Escape Hatch**
If a construct diverges significantly (>30% of props are app-specific), allow "demotion":
1. Copy construct to `apps/[app-name]/ui/constructs/[Name]Construct`
2. Remove from `core/`
3. Document the decision in a `FORK_REASON.md` file
4. After 2 sprints, evaluate if patterns emerged that could reunify

**Rule 4: Versioning Strategy**
For small teams, semantic versioning is overkill. Instead:
- **Breaking changes**: Require migration guide in PR description
- **New features**: Add `@since [date]` JSDoc comment
- **Deprecations**: Add `@deprecated Use [alternative] instead` comment + console.warn in dev mode

**Rule 5: Promotion Criteria**
A component becomes a shared construct when **all** of these are true:
- [ ] Used (or planned) in 2+ apps
- [ ] API is stable (unchanged for 2+ sprints)
- [ ] Generic enough (no hardcoded app-specific logic)
- [ ] Has test coverage (at least happy path)
- [ ] Documented (props table + usage example)

**Alternative for Larger Teams:**
If you grow to 10+ developers:
- Establish a "Design System Squad" that owns `core/`
- Use RFC process for new shared constructs
- Implement semantic versioning with changelog
- Consider monorepo versioning tools (Changesets, Lerna)

---

**📝 YOUR DECISION:**
```
[ ] Accept lightweight governance model (review from each consuming app)
[ ] Use stricter governance: [specify approach]
[X] Start with no governance, add later when needed

Promotion criteria:
[ ] Accept suggested 5-point checklist
[X] Modify criteria: Explicit instruction to promote it as a shared construct.

Fork/deprecation process:
[X] Accept suggested process
[ ] Different approach: [specify]

Reasoning: [your reasoning here]
```

---

### 4. Cross-App Reuse Criteria

**When to promote a component to a shared construct:**
- [ ] Used in 2+ apps? (or should it be 3+?)
- [ ] Has stable API (not changing every sprint)?
- [ ] Generic enough to avoid app-specific logic?
- [ ] Worth the maintenance overhead of shared ownership?
- [ ] Other criteria?
*ANSWER* Redundant Question? 

**When to keep a component app-specific:**
- [X] One-off screen/feature
- [X] Rapid prototype
- [X] Highly domain-specific logic
- [ ] Other criteria?

**Claude's Suggestions:**

**Decision Matrix:**
*ANSWER* Update to reflect answered questions from above

| Criteria | Promote to Shared | Keep App-Specific |
|----------|------------------|-------------------|
| **Usage** | Used in 2+ apps OR high confidence of reuse within 2 sprints | Single app, no reuse plan |
| **Stability** | Props unchanged for 2+ sprints | API still evolving rapidly |
| **Generality** | No hardcoded business logic (e.g., insurance rates, CRM pipelines) | Contains domain-specific calculations |
| **Complexity** | Medium-to-high complexity (worth the abstraction cost) | Trivial (e.g., just a styled div) |
| **Maintenance** | Breaking changes affect 2+ teams (worth coordination) | Only affects one team |

**Practical Examples:**

**✅ PROMOTE to Shared:**
- `InlineTagEditor` → Used in both insurance templates and CRM contacts
- `DataTable` → Generic, complex, used across apps
- `FormDrawer` → Common pattern for edit workflows
- `ConfirmDialog` → Universal need, stable API

**❌ KEEP App-Specific:**
- `QuoteCalculator` → Insurance-specific business logic
- `PipelineKanban` → CRM-specific domain
- `OnboardingWizard` → App-specific flow
- `DashboardMetrics` → Different metrics per app

**⚠️ GRAY AREA (evaluate case-by-case):**
- `FileUploader` → If apps have different storage backends, keep separate. If they share S3/blob logic, promote.
- `SearchBar` → If search APIs are different, keep separate. If UI/UX is identical, promote with adapter pattern.
- `NotificationBell` → If notification schemas differ, keep separate. If just styling differs, promote with theming.

**Rule of Thumb:**
If unsure, **start app-specific**. Premature abstraction is worse than duplication. After you see the same pattern 2-3 times, the right abstraction becomes obvious.

---

**📝 YOUR DECISION:**

[ ] Accept suggested decision matrix and examples
[ ] Modify promotion criteria: [specify changes]
[ ] Different threshold (e.g., 3+ apps instead of 2+)

*ANSWER* Provide updated Decision Matrix for approval. 

Rule of thumb:
[ ] Start app-specific, promote after seeing pattern 2-3 times
[ ] Different approach: [specify]

Reasoning: [your reasoning here]


---

### 5. File Structure & Co-location

**Proposed Structure for Shared Constructs:**
```
src/core/ui/constructs/inline-tag-editor/
├── InlineTagEditor.tsx                     # Main component
├── inline-tag-editor.vars.css              # Construct-scoped CSS variables
├── inline-tag-editor.tailwind.css          # Tailwind @layer composition
└── InlineTagEditor.test.tsx                # Tests
```

**Questions:**
- Do we co-locate types here or keep them in `core/types/`?


- Do we include Storybook stories in the construct folder?
- What about hooks specific to the construct (e.g., `useLexicalDirtyState.ts`)? 


**Claude's Suggestions:**

**Recommended File Structure (Full):**


```
src/core/ui/constructs/inline-tag-editor/
├── InlineTagEditor.tsx                       # Main component (PascalCase)
├── inline-tag-editor.vars.css                # CSS variables (themeable knobs)
├── inline-tag-editor.tailwind.css            # Tailwind classes (@layer components)
├── types.ts                                  # Construct-specific types
├── useInlineTagEditor.ts                     # Construct-specific hook (if needed)
├── InlineTagEditor.test.tsx                  # Unit tests
├── InlineTagEditor.stories.tsx               # Storybook stories (if using Storybook)
├── presets.ts                                # Optional: preset configurations
└── index.ts                                  # Public API exports
```

**Co-location Guidelines:**

**✅ CO-LOCATE (inside construct folder):**
- **Types used exclusively by this construct**: `TagEditorState`, `TagEditorPosition`
- **Hooks used exclusively by this construct**: `useTagEditorPosition`, `useTagSearch`
- **Utilities exclusive to this construct**: `validateTagName()`, `generateTagId()`
- **Test files**: Always co-locate with the code under test
- **Stories**: If using Storybook, co-locate for discoverability
- **Presets**: UI configuration objects specific to this construct

**❌ KEEP GLOBAL (in `core/types/` or `core/hooks/`):**
- **Shared domain types**: `Tag`, `User`, `Template` (used across multiple constructs)
- **Shared hooks**: `useTemplateRegistry`, `useAuth` (not construct-specific)
- **Shared utilities**: `formatDate()`, `debounce()` (general purpose)

**Example Public API (`index.ts`):**
```typescript
// Only export what consumers need
export { InlineTagEditor } from './InlineTagEditor'
export type { InlineTagEditorProps } from './types'
export { TAG_EDITOR_PRESETS } from './presets'

// Don't export internal implementation details
// (consumers shouldn't import useInlineTagEditor directly unless it's public)
```

**Benefits:**
- **Single source of truth**: All construct code lives together
- **Easy to delete**: Remove entire folder when construct is deprecated
- **Clear boundaries**: If you're importing from another construct's internals, you're doing it wrong
- **Easier to extract**: Can become a separate package later if needed

---

**📝 YOUR DECISION:**

[ ] Accept recommended file structure (including stories, types, hooks co-located)
[X] Modify structure: *ANSWER* Are the file naming conventions below best practices? Or is this a fragment from when we were planning on implementing unconventional naming conventions? If they are proper naming conventions, then I accept the recommended file structure. 

Co-location approach:
[X] Co-locate everything construct-specific (types, hooks, tests, stories)
[X] Keep some items global: [specify what]
*ANSWER* I like the recommendations you provided for both

Public API pattern:
[ ] Use index.ts to control exports
[ ] Export everything
[ ] Different approach: [specify]
*ANSWER* I like your Example and recommendation. Do we need to expand on this or is this guideline enough to ensure that we don't have any unncessary exports?

Reasoning: [your reasoning here]


---

### 6. Migration Strategy

**Incremental Adoption Plan:** 
*MODIFIED BY USER*
- Phase 1: Establish token system and theme infrastructure
- Phase 2: Identify high-value shared components for conversion.
 (InlineTagEditor, form inputs) Deliverable: Document identified target in markdown file for next steps. 
 - Phase 2.1: Evaluate and create a conversion plan for each identified target. Create unit tests to validate conversion
 - Phase 2.2: Perform conversion one by one. commit as rollback safety checkpoint after conversion success has been verified. No need to keep original file during conversion. Will rely on pre-conversion committ checkpoint as safety rollback checkpoint. 

- Phase 3: *NEED YOUR PROFESSIONAL GUIDANCE ON WHAT ELSE WE SHOULD DO*

**Questions:**
- What's the timeline/trigger for Phase 2?
- Do we convert all instances at once, or allow hybrid (old + new) temporarily? *ANSWER* All at once, since we have tests to validate conversion. 
- How do we handle components that are 80% shared but have 20% app-specific variations? *ANSWER* Set aside and create a List of these constructs to consider/address one by one after conversion of the constructs we identified as ready for conversion. 

**Claude's Suggestions:**

**Phased Migration Plan:**

**Phase 0: Preparation (1-2 days)**
- [ ] Create folder structure: `core/styles/tokens/`, `core/styles/themes/`
- [ ] Set up primitive tokens JSON file
- [ ] Create initial `light.css` theme
- [ ] Configure Tailwind to import these files
- [ ] Add `data-theme="light"` to app root
- [ ] Test that existing components still work

**Phase 1: Foundation (3-5 days)**
- [ ] Convert existing color/spacing values to token references
- [ ] Establish semantic token naming conventions
- [ ] Document token usage in CLAUDE.md
- [ ] Create example construct (pick simplest candidate, e.g., Badge or Button)
- [ ] Get team buy-in on the pattern

**Phase 2: High-Value Conversions (1-2 weeks)**
Priority order (convert in this sequence):
1. **InlineTagEditor** (high complexity, used in 2+ apps)
2. **Form inputs** (Button, Input, Select - frequently used)
3. **Modal/Drawer** (if shared pattern exists)
4. **DataTable** (if applicable)

For each conversion:
- [ ] Create construct folder with full file structure
- [ ] Convert component to use construct pattern
- [ ] Add `.vars.css` with themeable knobs
- [ ] Add `.tailwind.css` with component classes
- [ ] Update all import paths in consuming apps
- [ ] Test in both insurance and CRM apps
- [ ] Document in Storybook/examples

**Phase 3: App Integration (Ongoing)**
- [ ] Add `data-app="insurance"` to insurance app root
- [ ] Add `data-app="crm"` to CRM app root
- [ ] Create app-specific token overrides in `apps/[app]/styles/tokens.css`
- [ ] Test theming works correctly
- [ ] Refine construct variables based on usage

**Hybrid Strategy:**
✅ **YES, allow hybrid** during migration:
- New constructs use construct pattern
- Existing components keep inline Tailwind
- Convert opportunistically when touching code
- No "big bang" rewrite required

**Timeline Triggers:**
Phase 2 starts when:
- [ ] Backend rearchitecture begins (constructs ready before multi-app split)
- [ ] Second app (CRM) needs the component (proves reuse)
- [ ] Component becomes painful to maintain (many style inconsistencies)

**80/20 Shared Components:**
Use the **Adapter Pattern**:

```typescript
// Core construct (80% shared)
export function TagEditorConstruct(props: CoreProps) { ... }

// Insurance adapter (adds 20% insurance-specific logic)
export function InsuranceTagEditor(props: InsuranceProps) {
  const coreProps = adaptInsuranceProps(props)
  return (
    <TagEditorConstruct {...coreProps}>
      {props.showPolicyNumber && <PolicyNumberField />}
    </TagEditorConstruct>
  )
}
```

This keeps the core generic while allowing app-specific extensions without polluting the shared API.

---

**📝 YOUR DECISION:**

[ ] Accept phased migration plan (Phase 0 → Phase 1 → Phase 2 → Phase 3)
[X] Modify timeline: *ANSWER* Perform initial eval/audit - we Will probably need to modify based on results of Audit. 

Hybrid strategy during migration:
[ ] YES - Allow old inline Tailwind + new construct pattern to coexist
[ ] NO - Convert all at once
[X] Different approach: [specify] *ANSWER* Before conversion process begins you are to create a Commit of current project status for safety rollback checkpoint. You create a new checkpoint after each conversion with detailed commit messages.

Timeline triggers for Phase 2:
[ ] Start when backend rearchitecture begins
[ ] Start when second app needs the component
[ ] Start when component becomes painful to maintain
[X] Different trigger: [specify] Identify obvious high-value targets for conversion.

Handling 80/20 shared components:
[X] Use adapter pattern as suggested
[ ] Different approach: [specify]

Reasoning: [your reasoning here]


---

## Reference Implementation

See `/docs/construct-splitting.example.md` for a detailed example of the construct pattern applied to `InlineTagEditor`.

Key features demonstrated:
- 4-layer architecture (tokens → themes → construct variables → component classes)
- Layout-level overrides without modifying component code
- Position calculated inline (JS), visuals defined in CSS
- Semantic variable naming (`--ite-*` prefix for scoping)

---

## Architectural Alignment

This approach aligns with:
- **Design Systems 2.0**: Moving away from monolithic libraries to context-aware component APIs
- **Vertical Slice Architecture**: Each app owns its domain, but shares infrastructure
- **Progressive Enhancement**: Start simple, add complexity only when needed
- **Domain-Driven Design**: Constructs as bounded contexts with their own styling API

---

## Next Steps

1. **Expand View/Preset/Schema definitions** based on current usage patterns
2. **Define token tier strategy** (primitive vs semantic vs construct-scoped)
3. **Establish construct governance rules** (when to share, how to modify)
4. **Document promotion criteria** for component → construct
5. **Plan Phase 2 migration** (which components, what timeline)
6. **Update main CLAUDE.md** with finalized guidelines

---

## Open Discussion Points

_Use this section to capture ongoing debates and decisions that need stakeholder input:_

### TypeScript vs JSON/CSS for Tokens

**Option A: JSON + CSS Variables (Recommended for start)**
- ✅ Simple, no build tools needed
- ✅ Works with existing Tailwind setup
- ✅ Easy for designers to edit
- ❌ No type safety
- ❌ Typos discovered at runtime

**Option B: TypeScript (Vanilla Extract, Panda CSS, Stitches)**
- ✅ Full type safety and autocomplete
- ✅ Catch errors at compile time
- ❌ More complex setup
- ❌ Requires build step
- ❌ Harder for non-devs to contribute

**Claude's Suggestion**: Start with Option A (JSON/CSS). If you find yourself with token typos causing production bugs, migrate to Option B. Don't over-engineer early.

---

**📝 YOUR DECISION:**

[ ] Option A: JSON + CSS Variables
[ ] Option B: TypeScript (Vanilla Extract/Panda CSS)
[X] Other: [specify] *ANSWER* More Details needed. I don't know enough to understand the differences and drawbacks of both approaches. I need a real-world scenario to help me better understand before I can make a decision.

Reasoning: [your reasoning here]


---

### Design Tool Integration (Figma Tokens)

**Do you need it?**
- ✅ YES if: Designers own the design system, devs implement it
- ✅ YES if: Frequent rebranding or white-label requirements
- ❌ NO if: Small team, devs handle design decisions
- ❌ NO if: Design changes are infrequent

**Claude's Suggestion**: Skip it initially. Figma Tokens adds complexity and requires design team process changes. Revisit when you have 5+ apps or external design team.

---

**📝 YOUR DECISION:**

[X] YES: Implement Figma Tokens integration
[ ] NO: Skip for now
[ ] MAYBE: Revisit in [specify timeline]

Reasoning: *ANSWER* I have figma tokens defined in @/docs/typography-spacing-scale is this what you are referring to? Is missing critical information aside from colors tokens? I want you to update the correct document with the color tokens, please.  

---

### Variant API Patterns

**Option A: Prop-based variants**
```typescript
<TagEditor size="compact" position="inline" />
```
- ✅ Standard React pattern
- ✅ Easy to understand
- ❌ Can lead to prop explosion

**Option B: Compound components**
```typescript
<TagEditor.Compact />
<TagEditor.Inline />
```
- ✅ Clear intent
- ✅ Each variant can have different props
- ❌ More code to maintain

**Option C: Preset objects**
```typescript
<TagEditor preset={TAG_EDITOR_PRESETS.compact} />
```
- ✅ Prevents invalid combinations
- ✅ Easy to share presets
- ❌ Less discoverable (need to import presets)

**Claude's Suggestion**: Start with Option A (props). If you find certain combinations are always used together, add Option C (presets) as shortcuts. Option B is overkill unless variants are fundamentally different.

---

**📝 YOUR DECISION:**
```
[ ] Option A: Prop-based variants
[ ] Option B: Compound components
[ ] Option C: Preset objects
[ ] Hybrid: [specify combination]
*ANSWER* I think it's only natural to make this a decision roadmap when we encounter the scenario naturally. So no hard guideline, just provide a decision roadmap to help decide which path to follow. Include examples and reasoning for decisions to help guide decision making. 

Reasoning: [your reasoning here]
```

---

### Construct Deprecation Strategy

**When to deprecate a construct:**
- No longer used in any app
- Replaced by better abstraction
- Contains unmaintainable legacy code

**Process:**
1. Mark with `@deprecated` JSDoc comment + migration guide
2. Add console.warn in dev mode
3. Update docs with deprecation notice + timeline
4. After 2 sprints with no usage, remove from codebase
5. Add tombstone file: `[ConstructName].DEPRECATED.md` explaining why it was removed

**Claude's Suggestion**: Never delete immediately. Always give 2-sprint grace period for teams to migrate. Move to "xx-Archive-xx" folder after 2-week sprint. Make sure "xx-Archive-xx" is added to the .ignore list. as a safety measure. Note: Need to create a claude-code subagent to review archived constructs. Need you to create a checklist that the subagent to follow. Then subagent creates a JIRA Task of the review and marks the task as ready for deletion or needs further review. it should include the checklist and details of the review.  

---

## Component Organization Strategies

### Current State Analysis

**Monolithic UI Folder** (`src/ui/`):
- 29+ components in flat structure
- Mix of concerns: primitives (Button), overlays (Modal), specialized (KatexRenderer)
- No clear boundaries between generic vs Lexical-specific components
- Difficult to understand component purpose from file location alone

**Scattered Styles**:
- `src/styles/` - Lexical editor themes (PlaygroundEditorTheme, CommentEditorTheme, etc.)
- Design tokens mixed with component-specific styles
- Generic naming (design-system.css, premium-ui.css) doesn't indicate purpose

**See**: `docs/reorganization-progress.md` Phase 2 Steps 2.5-2.6 for current refactor plan

---

### Questions to Resolve

**Component Grouping:**
- How do we group components? By purpose (forms, overlays), by technology (lexical, react), or by feature domain?
- Where should generic UI primitives live vs app-specific constructs?
- How do we handle components that are 70% generic but have 30% app-specific usage?

**Style Co-location:**
- Should CSS files live next to components, or in separate style directories?
- How do we organize Lexical-specific themes vs global design tokens?
- Where do component-specific styles fit in the token hierarchy?

**Shared vs App-Specific:**
- When does a component belong in `core/` vs `apps/[app-name]/components/`?
- How do we prevent duplication while avoiding premature abstraction?

---

### Claude's Suggestions

#### **Component Grouping Strategy**
*USER COMMENT* Need to update based on the answers I provided above.
**Recommended Approach: Hybrid Organization**

Combine **purpose-based grouping** (primitives, overlays) with **technology/feature grouping** (lexical, forms) for clear boundaries:
│   ├── ui/
│   │   ├── primitives/                # Basic, generic controls
│   │   │   ├── button/                # kebab-case directory
│   │   │   │   ├── Button.tsx         # PascalCase component
│   │   │   │   ├── Button.css         # kebab-case CSS
│   │   │   │   └── index.ts
│   │   │   ├── input/
│   │   │   ├── select/
│   │   │   └── index.ts
│   │   │
│   │   ├── overlays/                  # Modal, Dialog, Dropdown patterns
│   │   │   ├── modal/
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── Modal.css
│   │   │   ├── dialog/
│   │   │   ├── dropdown/
│   │   │   └── index.ts
│   │   │
│   │   ├── pickers/                   # Specialized input pickers
│   │   │   ├── color-picker/
│   │   │   │   ├── ColorPicker.tsx
│   │   │   │   └── ColorPicker.css
│   │   │   └── index.ts
│   │   │
│   │   └── constructs/                # Multi-component assemblies
│   │       ├── inline-tag-editor/     # kebab-case directory
│   │       │   ├── InlineTagEditor.tsx
│   │       │   ├── inline-tag-editor.vars.css
│   │       │   ├── inline-tag-editor.tailwind.css
│   │       │   └── index.ts
│   │       └── index.ts
│   │
│   ├── lexical/                       # Lexical-specific (framework integration)
│   │   ├── components/                # Lexical UI components
│   │   │   ├── excalidraw-modal/
│   │   │   │   └── ExcalidrawModal.tsx
│   │   │   ├── equation-editor/
│   │   │   │   └── EquationEditor.tsx
│   │   │   ├── katex-renderer/
│   │   │   │   └── KatexRenderer.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── plugins/                   # Lexical plugins (existing)
│   │   ├── nodes/                     # Lexical nodes (existing)
│   │   ├── themes/                    # Lexical editor themes
│   │   │   ├── templateEditor.theme.ts    # camelCase config
│   │   │   ├── templateEditor.theme.css   # kebab-case CSS
│   │   │   ├── commentEditor.theme.ts
│   │   │   ├── commentEditor.theme.css
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   └── styles/                        # Global design system
│       ├── tokens/                    # Design tokens (primitives)
│       │   ├── primitives.json       # kebab-case data file
│       │   ├── colorSystem.css       # camelCase (matches JS)
│       │   ├── typography.css        # kebab-case
│       │   ├── effects.css           # kebab-case
│       │   └── index.css
│       │
│       └── themes/                    # Semantic token mappings
│           ├── light.css             # kebab-case
│           ├── dark.css              # kebab-case
│           └── index.css
│
├── apps/
│   ├── insurance/                     # App-specific (future)
│   │   └── components/                # Insurance-only components
│   │
│   └── template-editor/               # kebab-case directory
│       ├── components/                # App-specific components
│       └── features/                  # Feature-specific components
│           └── editor/
│               ├── components/
│               │   └── TemplateEditor.tsx
│               └── hooks/
│                   └── useTemplateEditor.ts
│
└── components/                        # Temporary bridge (Phase 2)
    ├── forms/                         # Being moved to core/ui/
    └── indicators/                    # Being moved to core/ui/
```

---

#### **Grouping Decision Matrix**

| Component Type | Location | Reasoning |
|---------------|----------|-----------|
| **Generic primitives** (Button, Input, Select) | `core/ui/primitives/` | Reusable across all apps, no business logic |
| **Generic patterns** (Modal, Dialog, Dropdown) | `core/ui/overlays/` | Common UI patterns, reusable |
| **Multi-component assemblies** (TagEditor, FormDrawer) | `core/ui/constructs/` | Complex, reusable, themeable |
| **Lexical-specific UI** (EquationEditor, KatexRenderer) | `core/lexical/components/` | Tightly coupled to Lexical framework |
| **Lexical editor themes** | `core/lexical/themes/` | Lexical editor styling configurations |
| **App-specific components** | `apps/[app]/components/` | Business logic, domain-specific |
| **Feature components** | `apps/[app]/features/[feature]/components/` | Scoped to single feature |

---

#### **Style Organization Strategy**

**Recommendation: Co-locate Component Styles, Centralize Tokens**

**Pattern 1: Component-Scoped Styles (Co-located)**
```
button/                      # kebab-case directory
├── Button.tsx               # PascalCase component
├── Button.css               # kebab-case CSS
├── types.ts                 # Type definitions
└── index.ts                 # Barrel export
```
- ✅ Easy to find and maintain
- ✅ Clear ownership
- ✅ Easy to delete when component is removed
- ✅ Supports CSS Modules if needed

**Pattern 2: Construct Styles (Split)**
```
inline-tag-editor/                          # kebab-case directory
├── InlineTagEditor.tsx                     # PascalCase component
├── inline-tag-editor.vars.css              # CSS variable API
├── inline-tag-editor.tailwind.css          # Tailwind composition
└── index.ts
```
- Separates themeable knobs (`.vars.css`) from structure (`.tailwind.css`)
- Allows layout-level overrides without touching component code

**Pattern 3: Global Design Tokens (Centralized)**
```
core/styles/
├── tokens/
│   ├── primitives.json          # Source of truth for raw values
│   ├── colorSystem.css          # Color scales + semantic mappings
│   ├── typography.css           # Font scales, line heights
│   └── effects.css              # Shadows, transitions, animations
└── themes/
    ├── light.css                # Semantic token values for light mode
    └── dark.css                 # Semantic token values for dark mode
```

**Pattern 4: Lexical Editor Themes (Technology-Scoped)**
```
core/lexical/themes/
├── templateEditor.theme.ts      # Lexical theme config object
├── templateEditor.theme.css     # Styles for Lexical CSS classes
├── commentEditor.theme.ts
└── commentEditor.theme.css
```
- Co-locate Lexical theme config with its CSS
- Separate from global tokens (Lexical uses its own CSS class system)

---

#### **Migration Path from Monolithic UI**

**Step 1: Categorize Existing Components**

Run this analysis on `src/ui/`:

| Component | New Location | Reason |
|-----------|-------------|---------|
| Button.tsx | `core/ui/primitives/button/Button.tsx` | Generic primitive |
| Modal.tsx | `core/ui/overlays/modal/Modal.tsx` | Generic overlay pattern |
| ColorPicker.tsx | `core/ui/pickers/color-picker/ColorPicker.tsx` | Specialized input |
| ExcalidrawModal.tsx | `core/lexical/components/excalidraw-modal/ExcalidrawModal.tsx` | Lexical-specific |
| KatexRenderer.tsx | `core/lexical/components/katex-renderer/KatexRenderer.tsx` | Lexical-specific |
| InlineTagEditor.tsx | `core/ui/constructs/inline-tag-editor/InlineTagEditor.tsx` | Multi-component assembly |

**Step 2: Move in Priority Order**

1. **Lexical components first** (`core/lexical/components/`)
   - Clear boundary: anything importing from `lexical` package
   - Creates clean separation of framework-specific code

2. **Primitives second** (`core/ui/primitives/`)
   - Foundation for everything else
   - High usage, low coupling

3. **Overlays third** (`core/ui/overlays/`)
   - Builds on primitives
   - Common patterns

4. **Constructs last** (`core/ui/constructs/`)
   - May depend on primitives and overlays
   - Apply construct pattern as you migrate

**Step 3: Update Imports Gradually**

Allow hybrid imports during migration:
```typescript
// Old (still works during migration)
import { Button } from '@/ui/Button'

// New (preferred)
import { Button } from '@/core/ui/primitives'
```

Update path aliases in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/core/*": ["./src/core/*"],
      "@/ui/*": ["./src/core/ui/*"],        // Bridge alias
      "@/lexical/*": ["./src/core/lexical/*"]
    }
  }
}
```

---

#### **Handling 70/30 Generic/Specific Components**

**Scenario**: Component is 70% reusable, 30% app-specific

**Option A: Keep Generic, Use Composition**
```typescript
// core/ui/overlays/Modal/Modal.view.tsx (70% generic)
export function Modal({ children, ...props }) { ... }

// apps/insurance/components/InsuranceModal/InsuranceModal.view.tsx (30% specific)
export function InsuranceModal({ policyNumber, ...props }) {
  return (
    <Modal {...props}>
      {policyNumber && <PolicyBanner number={policyNumber} />}
      {props.children}
    </Modal>
  )
}
```
✅ Core stays clean, apps extend via composition

**Option B: Keep Generic, Use Props**
```typescript
// core/ui/overlays/Modal/Modal.view.tsx
export function Modal({
  children,
  header,
  footer,
  renderCustomHeader,  // Escape hatch for apps
  ...props
}) { ... }
```
⚠️ Risk of prop explosion, but acceptable if props are optional

**Option C: Fork to App-Specific**
```typescript
// apps/insurance/components/InsuranceModal/
// Forked copy with insurance-specific modifications
```
❌ Last resort - creates duplication

**Rule of Thumb**: Use Option A (composition) by default. Option B if the extension points are stable. Option C only if the 30% makes Option A/B unreadable.

---

#### **Shared vs App-Specific Decision Tree**

```
Is this component used (or likely to be used) in 2+ apps?
├─ YES: Go to core/
│   ├─ Is it tightly coupled to Lexical?
│   │   ├─ YES: core/lexical/components/
│   │   └─ NO: Continue...
│   │
│   ├─ Is it a basic input/control (Button, Input, Select)?
│   │   └─ YES: core/ui/primitives/
│   │
│   ├─ Is it an overlay pattern (Modal, Dialog, Dropdown)?
│   │   └─ YES: core/ui/overlays/
│   │
│   ├─ Is it a specialized picker (ColorPicker, DatePicker)?
│   │   └─ YES: core/ui/pickers/
│   │
│   └─ Is it a multi-component assembly?
│       └─ YES: core/ui/constructs/
│
└─ NO: Keep in app
    ├─ Is it scoped to a single feature?
    │   └─ YES: apps/[app]/features/[feature]/components/
    │
    └─ Used across multiple features in this app?
        └─ YES: apps/[app]/components/
```

---

#### **Benefits of This Approach**

1. **Clear Boundaries**: Easy to determine where a component belongs
2. **Technology Isolation**: Lexical code is clearly separated from generic React
3. **Scalability**: Each category can grow independently
4. **Easy to Delete**: Remove entire folders when features are deprecated
5. **Import Clarity**: Path indicates component purpose (`@/core/ui/primitives` vs `@/core/lexical`)
6. **Migration-Friendly**: Can move components incrementally without breaking existing code

---

#### **What NOT To Do**

❌ **Avoid These Anti-Patterns:**

1. **Generic Naming**: `src/common/`, `src/shared/`, `src/base/`
   - Too vague, doesn't indicate purpose

2. **Technical Grouping Only**: `src/react/`, `src/components/`, `src/views/`
   - Doesn't help understand component domain

3. **Deep Nesting**: `src/ui/forms/inputs/text/basic/`
   - Overly granular, hard to navigate

4. **Mixed Concerns**: Same folder has primitives + constructs + lexical
   - Loses clear boundaries

5. **Style Separation**: All CSS in `src/styles/components/`
   - Breaks co-location, harder to maintain

---

**📝 YOUR DECISION:**
```
Component grouping strategy:
[ ] Accept hybrid organization (purpose-based + technology-based)
[ ] Different approach: [specify]

Specific locations approved:
[ ] Primitives in core/ui/primitives/
[ ] Overlays in core/ui/overlays/
[ ] Pickers in core/ui/pickers/
[ ] Constructs in core/ui/constructs/
[ ] Lexical components in core/lexical/components/
[ ] Lexical themes in core/lexical/themes/
[ ] Modify locations: [specify changes]

Style organization:
[ ] Co-locate component styles (Pattern 1 + Pattern 2)
[ ] Centralize tokens (Pattern 3)
[ ] Lexical themes separate (Pattern 4)
[ ] Different approach: [specify]

Migration path:
[ ] Follow suggested priority order (Lexical → Primitives → Overlays → Constructs)
[ ] Different order: [specify]

Handling 70/30 components:
[ ] Use composition (Option A)
[ ] Use optional props (Option B)
[ ] Fork only as last resort (Option C)
[ ] Different approach: [specify]

Reasoning: [your reasoning here] *Answer* These decision points are no longer valid based on the answers I provided above. Please update this to reflect the current decisions that have been made thus far. 
```

---