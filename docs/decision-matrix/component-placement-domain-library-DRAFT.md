# DRAFT: Domain-Specific Library Components Addition

> **Purpose**: Proposed addition to component-placement.md
> **Status**: DRAFT - Awaiting Review
> **Date**: 2025-01-27

---

## Proposed Section: Domain-Specific Library Components

### Overview

**Domain-specific library components** are UI components that belong to a third-party library or framework's UI system (Lexical, shadcn/ui, Radix UI, etc.). These components are distinct from:
- **Generic shared primitives** (`core/ui/primitives/`) - Our own reusable components
- **App-specific constructs** (`apps/[app-name]/components/`) - Business logic components

### Key Insight

When you encounter a component that appears to be a "primitive" (Button, Input, Modal, etc.), ask:

**"Is this part of a third-party library's UI system?"**

- ✅ **YES** → Domain Library Component → Scope to domain folder
- ❌ **NO** → Continue with 5-question decision tree

### Identification Criteria

A component is a **Domain Library Component** if it meets ANY of these:

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

### File Structure

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

### Integration with 5-Question Tree

**UPDATED Decision Flow:**

```
START: I need to create/modify a component
  |
  ├─ PRE-CHECK: Is this part of a third-party library's UI system?
  │   │
  │   ├─ YES → DOMAIN LIBRARY COMPONENT
  │   │   Location: src/components/[domain]/[type]/
  │   │   Naming: [Domain][Component].tsx OR [domain]/[Component].tsx
  │   │   Proceed to determine TYPE (primitive, overlay, construct, etc.)
  │   │   Then place in: src/components/[domain]/[type]/[Name].tsx
  │   │
  │   └─ NO → Continue to Question 1 (existing tree)
  │
  ├─ Question 1: Is this tied to a URL route?
  │   (existing decision tree continues...)
```

### Examples

#### Example 1: Lexical Toolbar Button

**Component:** Custom button for Lexical editor toolbar

**Analysis:**
- ❓ Part of third-party library? → ✅ YES (Lexical editor UI system)
- ❓ What type? → Primitive (single UI control)
- ❓ Generic name? → ✅ YES (Button)

**Decision:**
- ✅ Domain Library Component
- Location: `src/components/lexical/primitives/LexicalButton.tsx`
- Naming: Domain-prefixed (LexicalButton)

**Rationale:**
- Not a generic Button for the entire app
- Specifically designed for Lexical editor toolbar
- Uses Lexical-specific styles and behaviors

---

#### Example 2: shadcn/ui Dialog

**Component:** Dialog component from shadcn/ui library

**Analysis:**
- ❓ Part of third-party library? → ✅ YES (shadcn/ui built on Radix)
- ❓ What type? → Overlay (modal/dialog pattern)
- ❓ Generic name? → ✅ YES (Dialog)

**Decision:**
- ✅ Domain Library Component
- Location: `src/components/ui/overlays/shadcn/Dialog.tsx`
- Naming: Directory-namespaced (shadcn/ provides context)

**Rationale:**
- Part of shadcn/ui library collection
- Many shadcn components to organize
- Directory namespace keeps library components grouped

---

#### Example 3: Custom App Button

**Component:** Reusable button for your app (not from library)

**Analysis:**
- ❓ Part of third-party library? → ❌ NO (custom component)
- Continue to Question 1-5...
- ❓ Single UI control? → ✅ YES (Question 5)
- ❓ Reusable across app? → ✅ YES

**Decision:**
- ✅ Component (from existing decision tree)
- Location: `core/ui/primitives/button/Button.tsx`
- Naming: Generic OK (universally understood primitive)

**Rationale:**
- Not tied to any specific library
- Generic, reusable across entire application
- Part of OUR design system

---

#### Example 4: Lexical ExcalidrawModal

**Component:** Modal for embedding Excalidraw diagrams in Lexical

**Analysis:**
- ❓ Part of third-party library? → ✅ YES (Lexical plugin)
- ❓ What type? → Overlay (modal pattern)
- ❓ Generic name? → ❌ NO (ExcalidrawModal is descriptive)

**Decision:**
- ✅ Domain Library Component
- Location: `src/components/lexical/ExcalidrawModal.tsx`
- Naming: No prefix needed (already descriptive)

**Rationale:**
- Part of Lexical ecosystem
- Name already conveys domain (Excalidraw) and purpose (Modal)
- Following descriptive naming principle

---

### Common Pitfalls

#### Pitfall 1: Treating Library Components as Generic Primitives

❌ **Wrong:**
```
src/components/primitives/
├── Button.tsx              (Which Button? Lexical? shadcn? Custom?)
├── TextInput.tsx           (Ambiguous ownership)
└── Select.tsx              (Could be from any library)
```

✅ **Correct:**
```
src/components/
├── lexical/primitives/
│   ├── LexicalButton.tsx   (Clear: Lexical's Button)
│   └── LexicalTextInput.tsx
├── ui/primitives/shadcn/
│   ├── Button.tsx          (Clear: shadcn Button via directory)
│   └── Select.tsx
└── core/ui/primitives/
    └── button/
        └── Button.tsx      (Clear: Our custom Button)
```

---

#### Pitfall 2: Missing Domain Scoping

❌ **Wrong:**
```typescript
// Lexical components scattered at top level
src/components/
├── primitives/Button.tsx        // Is this ours or Lexical's?
├── overlays/Modal.tsx           // Unclear ownership
└── pickers/ColorPicker.tsx      // Part of Lexical or generic?
```

✅ **Correct:**
```typescript
// Domain-scoped structure
src/components/
└── lexical/                     // Domain boundary clear
    ├── primitives/
    ├── overlays/
    └── pickers/
```

---

#### Pitfall 3: Inconsistent Naming

❌ **Wrong:**
```typescript
// Mixing domain-prefixed and non-prefixed in same domain
src/components/lexical/primitives/
├── LexicalButton.tsx       // Domain-prefixed
├── TextInput.tsx           // Missing prefix
└── LexicalSelect.tsx       // Domain-prefixed
```

✅ **Correct:**
```typescript
// Consistent domain-prefixing
src/components/lexical/primitives/
├── LexicalButton.tsx
├── LexicalTextInput.tsx
└── LexicalSelect.tsx
```

---

### AI Assistant Checklist

When encountering a component, check:

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

If ALL answers are NO → Continue to existing 5-question decision tree

---

### Proposed Placement in component-placement.md

**Suggested Location:** Insert new section after "Component Hierarchy Overview" (line 44) and before "5-Question Decision Tree" (line 47)

**Section Title:** "Pre-Check: Domain-Specific Library Components"

**Rationale:**
- Catches domain library components BEFORE entering the 5-question tree
- Prevents misclassification of library primitives as generic primitives
- Maintains existing 5-question tree for non-library components

---

### Related Updates Needed

If this addition is approved, also update:

1. **Quick Reference (line 3-4):**
   ```markdown
   - Quick Integration:** `[Domain][Entity][Action/Type]`
   + Quick Check: Library component? → Domain folder. Otherwise use decision tree.
   ```

2. **Component Hierarchy Overview (line 15-43):**
   Add Domain Library Component as a variant of Component with special scoping rules

3. **Decision Checklist (line 640-660):**
   Add pre-check question before Question 1

---

### Summary

**Problem:** Component-placement matrix didn't address domain-specific library components, leading to misplacement of Lexical UI components.

**Solution:** Add "Pre-Check" for domain library components that:
1. Identifies third-party library components
2. Routes them to domain-scoped directories
3. Applies domain-prefixed naming for generic names
4. Then continues to existing 5-question tree for type classification

**Impact:** Prevents namespace collisions, clarifies ownership, enables scaling as more libraries are added.

**Status:** DRAFT - Awaiting user review and approval

---

## Questions for Review

1. Should this be a "Pre-Check" or "Question 0" in the decision tree?
2. Is the Domain-Prefixed vs Directory-Namespaced guidance clear?
3. Should we include a list of common libraries (Lexical, shadcn, Radix, Headless UI)?
4. Any other edge cases or examples needed?
