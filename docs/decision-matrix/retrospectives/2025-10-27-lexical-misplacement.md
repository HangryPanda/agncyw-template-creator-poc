# Retrospective: Lexical Component Misplacement

**Date**: 2025-10-27
**Incident**: Lexical UI components placed at wrong directory level
**Impact**: Required full reorganization with 54 file changes
**Status**: Resolved - ca676ef

---

## What Happened

During Phase 2.6 of the file structure reorganization, I (Claude) incorrectly placed Lexical UI components at the top level of `src/components/` instead of under `src/components/lexical/`:

**Incorrect Placement:**
```
src/components/
├── primitives/          ❌ WRONG (top-level, no domain)
│   ├── Button.tsx
│   ├── TextInput.tsx
│   └── Select.tsx
├── overlays/            ❌ WRONG
│   ├── Modal.tsx
│   └── Dialog.tsx
├── pickers/             ❌ WRONG
│   └── ColorPicker.tsx
└── editors/             ❌ WRONG
    └── ContentEditable.tsx
```

**Correct Placement:**
```
src/components/
└── lexical/                    ✅ CORRECT (domain-scoped)
    ├── primitives/
    │   ├── LexicalButton.tsx
    │   ├── LexicalTextInput.tsx
    │   └── LexicalSelect.tsx
    ├── overlays/
    │   ├── LexicalModal.tsx
    │   └── LexicalDialog.tsx
    ├── pickers/
    │   └── LexicalColorPicker.tsx
    └── editors/
        └── LexicalContentEditable.tsx
```

---

## Root Cause Analysis

### Primary Cause: Missing Decision Matrix Question

**Gap Identified**: The component placement decision matrix ([component-placement.md](../component-placement.md)) asks:

```
Question 5: Is this a single UI control?
  └─ YES → It's a COMPONENT
      Location: core/ui/primitives/
```

**What it SHOULD ask FIRST**:

```
Question 0: Is this part of a domain-specific component library?
  ├─ YES → It's a DOMAIN LIBRARY COMPONENT
  │   Location: src/components/[domain]/[type]/
  │   Naming: [Domain][Component].tsx (if generic name)
  │   Examples:
  │     - Lexical editor: src/components/lexical/primitives/LexicalButton.tsx
  │     - shadcn/ui: src/components/ui/primitives/shadcn/Button.tsx
  │
  └─ NO → Continue to existing decision tree (Question 1-5)
```

### Contributing Factors

1. **Decision Matrix Assumption**: The matrix assumes components are either:
   - Shared/reusable (core/ui/primitives/)
   - App-specific (apps/[app-name]/components/)
   - **BUT MISSING**: Domain-specific library components

2. **Library vs. Generic Confusion**:
   - Lexical Button is NOT a generic Button primitive
   - It's part of the Lexical editor's UI system
   - Should be scoped to the `lexical/` domain

3. **No Explicit Library Component Guidance**:
   - Decision matrix has: Page, Layout, View, Construct, Component
   - Missing: "Domain Library Component"

---

## Why This Matters

### Problem 1: Namespace Collision
Without domain scoping, generic names collide:
```typescript
// ❌ AMBIGUOUS - Which Button?
import { Button } from '@/components/primitives/Button'  // Lexical Button? shadcn Button?

// ✅ CLEAR - Domain-scoped
import { LexicalButton } from '@/components/lexical/primitives/LexicalButton'
import { Button } from '@/components/ui/primitives/shadcn/Button'
```

### Problem 2: Ownership Unclear
Top-level placement suggests these are shared primitives, when they're actually:
- **Lexical-specific** - only used within Lexical editor
- **Not reusable** - tightly coupled to Lexical's architecture
- **Domain-owned** - maintained by Lexical editor team/docs

### Problem 3: Scaling Issues
As more libraries are added (Radix, Headless UI, etc.), top-level placement becomes unmaintainable:
```
src/components/
├── primitives/        ← Mix of Lexical, shadcn, Radix, custom?
├── overlays/          ← Which library owns Modal?
└── constructs/        ← Generic or domain-specific?
```

---

## Solution Implemented

### Fix 1: Domain-Scoped Directory Structure

**Before:**
```
src/components/
├── primitives/        (mixed ownership)
├── overlays/          (mixed ownership)
├── pickers/           (mixed ownership)
└── editors/           (mixed ownership)
```

**After:**
```
src/components/
├── lexical/                      (Lexical editor domain)
│   ├── primitives/
│   ├── overlays/
│   ├── pickers/
│   └── editors/
│
├── ui/                           (shadcn/ui domain)
│   ├── primitives/shadcn/
│   ├── overlays/shadcn/
│   └── constructs/shadcn/
│
├── forms/                        (Generic, shared)
└── indicators/                   (Generic, shared)
```

### Fix 2: Domain-Prefixed Naming Convention

Applied the critical naming rule: **Generic names in domain folders MUST include domain prefix**

**Examples:**
- `Button.tsx` → `LexicalButton.tsx` (in lexical/primitives/)
- `Modal.tsx` → `LexicalModal.tsx` (in lexical/overlays/)
- `ColorPicker.tsx` → `LexicalColorPicker.tsx` (in lexical/pickers/)

**Rationale**: Domain prefix makes ownership explicit even when browsing files or seeing autocomplete.

---

## Lessons Learned

### For AI Assistants

1. **Domain-Specific Libraries are NOT Generic Primitives**
   - Lexical, shadcn, Radix are domain-specific libraries
   - They should be scoped to domain directories
   - Even if they contain "primitives" like Button, Input, etc.

2. **Ask Domain Question First**
   - Before asking "Is this a Component?"
   - Ask "Is this part of a domain-specific library?"
   - Domain trumps component type

3. **Generic Names Need Context**
   - Generic names (Button, Modal, Input) are ambiguous
   - In domain folders, they MUST have domain prefix
   - Exception: If namespaced by directory (shadcn/Button.tsx)

### For Decision Matrix

**Add new Question 0 (before existing questions)**:

```
Question 0: Is this part of a domain-specific component library?
  ├─ YES → DOMAIN LIBRARY COMPONENT
  │   Location: src/components/[domain]/[type]/
  │   Naming: [Domain][Component].tsx (for generic names)
  │   Examples:
  │     - Lexical: src/components/lexical/primitives/LexicalButton.tsx
  │     - shadcn: src/components/ui/primitives/shadcn/Button.tsx
  │
  └─ NO → Continue to Question 1 (existing decision tree)
```

---

## Proposed Decision Matrix Update

### New Component Type: Domain Library Component

**Definition:** Component that is part of a third-party or domain-specific UI library (Lexical, shadcn, Radix, etc.)

**Responsibilities:**
- Provide domain-specific UI controls
- Maintain consistency with library's design system
- Used exclusively within domain context

**Location:** `src/components/[domain]/[type]/`

**Naming Convention:**
- **Option A (Prefix)**: `[Domain][Component].tsx` (e.g., `LexicalButton.tsx`)
- **Option B (Directory Namespace)**: `[Component].tsx` in `[domain]/` directory (e.g., `shadcn/Button.tsx`)

**AI Indicators:**
- Component is from a third-party library (Lexical, shadcn, Radix)
- Component is part of a domain-specific design system
- Component has generic name (Button, Modal, Input) but domain-specific implementation
- Component is tightly coupled to library/framework

**Examples:**

**Lexical Editor Components:**
```
src/components/lexical/
├── primitives/
│   ├── LexicalButton.tsx        (domain-prefixed)
│   ├── LexicalTextInput.tsx
│   └── LexicalSelect.tsx
├── overlays/
│   ├── LexicalModal.tsx
│   └── LexicalDialog.tsx
├── pickers/
│   └── LexicalColorPicker.tsx
└── editors/
    └── LexicalContentEditable.tsx
```

**shadcn/ui Components:**
```
src/components/ui/
├── primitives/shadcn/           (directory-namespaced)
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Select.tsx
├── overlays/shadcn/
│   ├── Dialog.tsx
│   └── Popover.tsx
└── constructs/shadcn/
    ├── Card.tsx
    └── Resizable.tsx
```

---

## Action Items

### Immediate (Completed ✅)
- [x] Move Lexical components to `src/components/lexical/`
- [x] Rename components with `Lexical` prefix
- [x] Update all imports (50+ files)
- [x] Update barrel exports
- [x] Document naming rule in naming-quick-reference.md
- [x] Verify build passes

### Short-term (Proposed)
- [ ] Update component-placement.md with Question 0
- [ ] Add "Domain Library Component" section to component-placement.md
- [ ] Add examples to decision tree
- [ ] Update AI checklist with domain question

### Long-term
- [ ] Create domain library component template
- [ ] Add domain component detection to linting rules
- [ ] Document common domain libraries (Lexical, shadcn, Radix, etc.)

---

## Metrics

**Impact:**
- 54 files changed
- 12 components renamed
- 12 CSS files renamed
- 50+ import statements updated
- 4 barrel exports created/updated

**Time Cost:**
- Initial incorrect placement: ~15 minutes
- Reorganization fix: ~45 minutes
- Documentation updates: ~30 minutes
- **Total rework time**: ~90 minutes

**Prevention Value:**
- Future domain libraries will be placed correctly on first attempt
- Decision matrix now handles 3rd category: domain libraries
- AI assistants have explicit guidance

---

## Conclusion

This incident revealed a critical gap in our decision matrix: **it didn't account for domain-specific component libraries**. The fix involved:

1. Adding domain-scoped directories (`lexical/`, `ui/shadcn/`)
2. Applying domain prefixes to generic names (`LexicalButton.tsx`)
3. Establishing "Question 0" in the decision tree

**Key Insight**: Component classification isn't just about type (Page, Layout, View, Construct, Component) — it's also about **domain ownership**. Domain-specific libraries need their own namespace to avoid collisions and clarify ownership.

**Recommendation**: Update component-placement.md to include Question 0 before the existing 5-question decision tree.

---

## Related Documentation

- [Component Placement Decision Matrix](../component-placement.md) - Needs Question 0 update
- [Naming Quick Reference](../../naming-quick-reference.md) - Updated with domain-specific rule
- [Reorganization Progress](../File%20Structure%20-%20Major%20Refactor%20-%20Plan/reorganization-progress.md) - Phase 2.6 correction notes
- [Commit ca676ef](https://github.com/.../ca676ef) - Fix implementation

---

**Status**: Resolved
**Next Steps**: Update component-placement.md with proposed changes
