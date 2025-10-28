# Variant Component Handling Decision Roadmap

> **Purpose**: Decision framework for choosing the right variant pattern when building components
> **Audience**: AI assistants, developers, designers
> **Last Updated**: 2025-01-26
> **Status**: Approved - Use as evaluation framework (not hard guidelines)

---

## Executive Summary

This document provides a **decision framework** to help choose between three variant patterns when building components with variations. There's no one-size-fits-all answer - the right pattern depends on the component's complexity and usage patterns.

**When to use this**: When creating components that need multiple variations (size, style, behavior, etc.)

**Approach**: Claude Code will evaluate components using this framework and recommend the appropriate pattern with reasoning.

---

## The Three Variant Patterns

### Pattern A: Prop-Based Variants
```tsx
<Button size="md" variant="primary" />
<Modal size="lg" position="center" />
<TagEditor mode="compact" position="inline" />
```

**Characteristics:**
- Props control variations
- Single component with conditional logic
- Maximum flexibility

### Pattern B: Compound Components
```tsx
<Button.Primary />
<Modal.Large />
<TagEditor.Compact />
```

**Characteristics:**
- Separate components for each variant
- Different props per variant
- Type-safe by design

### Pattern C: Preset Objects
```tsx
import { BUTTON_PRESETS } from './Button.presets'
<Button preset={BUTTON_PRESETS.danger} />
<Button preset="danger" /> // or string reference
```

**Characteristics:**
- Predefined prop combinations
- Prevents invalid states
- Convenient shortcuts

---

## Decision Tree

Use this flowchart to determine which pattern to use:

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

## Trade-Offs Comparison

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

## Real-World Examples

### Example 1: Button Component (1-2 dimensions)

**Variant Dimensions:**
- Size: sm, md, lg
- Variant: primary, secondary, ghost, danger

**Total Combinations:** 4 sizes × 4 variants = 16 combinations (all valid)

**Decision:** ✅ Pattern A (Props)

**Rationale:**
- Only 2 variant dimensions
- All combinations are valid
- Variants share the same props
- Simple, intuitive API

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

### Example 2: Modal Component (3-4 dimensions)

**Variant Dimensions:**
- Size: sm, md, lg, xl, full
- Position: center, top, right, bottom
- Backdrop: blur, dim, none
- CloseButton: visible, hidden

**Total Combinations:** 5 × 4 × 3 × 2 = 120 combinations (many are nonsensical)

**Decision:** ✅ Pattern A (Props) + Pattern C (Presets for common use cases)

**Rationale:**
- 4 variant dimensions (manageable but complex)
- Not all combinations make sense
- 80% of usage follows 3-4 common patterns
- Power users still need flexibility
- Hybrid approach provides best of both worlds

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

// Flexible: custom combinations for power users
<Modal size="lg" position="center" backdrop="blur">
  <p>Custom modal</p>
</Modal>

// Convenient: presets for common patterns (80% of usage)
<Modal {...MODAL_PRESETS.dialog}>
  <p>Confirm deletion?</p>
</Modal>

<Modal {...MODAL_PRESETS.drawer}>
  <p>Settings panel</p>
</Modal>

<Modal {...MODAL_PRESETS.fullscreen}>
  <p>Full takeover</p>
</Modal>
```

**Why this works:**
- Power users can customize every detail with props
- Common use cases have convenient presets
- Presets are type-safe (validated against ModalProps)
- Best of both worlds: flexibility + convenience

---

### Example 3: TagEditor Component (Fundamentally Different Variants)

**Variants:**
- **Inline**: Renders inside text flow, compact size, minimal chrome
- **Panel**: Renders in sidebar, full features, keyboard shortcuts
- **Readonly**: Display-only mode, no editing capabilities

**Key Insight:** These aren't just style differences - they have different **behavior** and **props**:
- Inline: `onBlur`, `position`, `maxTags`
- Panel: `onSave`, `onCancel`, `showSearch`
- Readonly: `tags` (no editing props)

**Decision:** ✅ Pattern B (Compound Components)

**Rationale:**
- Variants have completely different props
- Variants have different behavior/logic
- TypeScript should prevent passing wrong props
- Clear intent: `<TagEditor.Readonly />` vs `<TagEditor mode="readonly" />`

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

## Decision Matrix: Quick Reference

### Use Pattern A (Props) when:

✅ Component has 1-3 variant dimensions
✅ All prop combinations are valid
✅ Variants share the same props and behavior
✅ **Examples:** Button, Input, Badge, Alert

### Use Pattern B (Compound Components) when:

✅ Variants have fundamentally different props
✅ Variants have different behavior/logic
✅ Clear naming improves readability (Modal.Drawer vs Modal position="right")
✅ **Examples:** Form.TextField vs Form.Select, Layout.Sidebar vs Layout.Main

### Use Pattern C (Presets) when:

✅ Component has 4+ variant dimensions (too many props)
✅ Certain prop combinations are invalid or dangerous
✅ 80%+ usage follows 3-5 common patterns
✅ You want to enforce design system consistency
✅ **Examples:** Complex modals, data tables, form layouts

### Use Pattern A + C (Hybrid) when:

✅ You want flexibility AND convenience
✅ Power users need custom combinations
✅ Most users want quick presets
✅ **Examples:** Modal, DataTable, Form

---

## Specific Guidance by Variant Count

### 1-2 variants: Always use Pattern A (Props)

```tsx
<Button variant="primary" size="md" />
```

**Rationale:** Simple, intuitive, no need for complexity.

---

### 3-4 variants: Use Pattern A, consider adding Pattern C presets

```tsx
// Flexible (power users)
<Modal size="lg" position="center" backdrop="blur" showClose />

// Convenient (80% of users)
<Modal {...MODAL_PRESETS.dialog} />
```

**Rationale:** Provide flexibility for power users, convenience for common cases.

---

### 5+ variants: Use Pattern C (Presets) to prevent prop explosion

```tsx
<DataTable preset={TABLE_PRESETS.compactSortableEditable} />

// Better than:
<DataTable
  size="sm"
  sortable
  editable
  showHeader
  showFooter
  stickyHeader
  virtualScroll
/>
```

**Rationale:** Too many props create poor DX. Presets enforce patterns and prevent invalid states.

---

### Different behavior per variant: Use Pattern B (Compound)

```tsx
<Form.TextField name="email" validation={emailSchema} />
<Form.Select name="country" options={countries} />

// Better than:
<FormField type="text" name="email" />
<FormField type="select" name="country" />
```

**Rationale:** Different props = different components. TypeScript enforces correctness.

---

## AI Assistant Evaluation Process

When encountering a component that needs variants:

1. **Count variant dimensions** (Question 1)
2. **Check for invalid combinations** (Question 2)
3. **Check if variants have different props** (Question 3)
4. **Check usage patterns** (Question 4)
5. **Recommend pattern with reasoning**
6. **User/designer approves or adjusts**

**Example Evaluation:**

```
Component: Alert
Variant Dimensions:
  - Type: success, warning, error, info (4 options)
  - Size: sm, md (2 options)
Total: 4 × 2 = 8 combinations

Question 1: How many dimensions? → 2 dimensions
Answer: Use Pattern A (Props)

Question 2: Invalid combinations? → No, all valid
Answer: Confirms Pattern A

Question 3: Different props? → No, all share same props
Answer: Confirms Pattern A

Recommendation: Pattern A (Props)
Rationale: Simple, 2 dimensions, all combinations valid
```

---

## Related Documentation

- **Component Placement:** See `/docs/decision-matrix/component-placement.md`
- **Construct Promotion:** See `/docs/decision-matrix/cross-app-reuse.md`
- **Design Guidelines:** See `/docs/design-guidelines.draft.md`

---

## Revision History

- **2025-01-26**: Initial creation - Decision framework for variant patterns (approved)
