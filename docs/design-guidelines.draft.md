# Design System Guidelines (DRAFT)

> **Status**: Work in Progress
> **Last Updated**: 2025-01-25
> **Purpose**: Define the architectural philosophy and organizational structure for our multi-app workspace UI system

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
- How do we handle app-specific semantic meanings (e.g., "priority-high" in insurance vs CRM)?
- Should we implement tiered tokens?
  1. **Primitive tokens** (true globals: raw color values, spacing scales)
  2. **Semantic tokens** (app-level: `--color-insurance-primary`, `--color-crm-accent`)
  3. **Construct tokens** (component-scoped: `--ite-border`, `--ite-radius`)

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
- What's the process for "demoting" a construct back to app-specific when it diverges?

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

### 4. Cross-App Reuse Criteria

**When to promote a component to a shared construct:**
- [ ] Used in 2+ apps? (or should it be 3+?)
- [ ] Has stable API (not changing every sprint)?
- [ ] Generic enough to avoid app-specific logic?
- [ ] Worth the maintenance overhead of shared ownership?
- [ ] Other criteria?

**When to keep a component app-specific:**
- [ ] One-off screen/feature
- [ ] Rapid prototype
- [ ] Highly domain-specific logic
- [ ] Other criteria?

**Claude's Suggestions:**

**Decision Matrix:**

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

### 6. Migration Strategy

**Incremental Adoption Plan:**
- Phase 1: Establish token system and theme infrastructure
- Phase 2: Convert high-value shared components (InlineTagEditor, form inputs)
- Phase 3: [EXPAND]

**Questions:**
- What's the timeline/trigger for Phase 2?
- Do we convert all instances at once, or allow hybrid (old + new) temporarily?
- How do we handle components that are 80% shared but have 20% app-specific variations?

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

### Design Tool Integration (Figma Tokens)

**Do you need it?**
- ✅ YES if: Designers own the design system, devs implement it
- ✅ YES if: Frequent rebranding or white-label requirements
- ❌ NO if: Small team, devs handle design decisions
- ❌ NO if: Design changes are infrequent

**Claude's Suggestion**: Skip it initially. Figma Tokens adds complexity and requires design team process changes. Revisit when you have 5+ apps or external design team.

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

**Claude's Suggestion**: Never delete immediately. Always give 2-sprint grace period for teams to migrate.

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

**Recommended Approach: Hybrid Organization**

Combine **purpose-based grouping** (primitives, overlays) with **technology/feature grouping** (lexical, forms) for clear boundaries:

```
src/
├── core/                              # Shared, reusable across apps
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