# Component Classification Plan - Root Level Components

**Date**: 2025-10-27
**Purpose**: Classify and reorganize 24 root-level components in `/src/components/`
**Status**: DRAFT - Awaiting Review

---

## Components to Classify (24 total)

### GROUP 1: Template-Specific Constructs (App-Specific)
**Location**: `apps/template-editor/components/`

These assemble multiple components with template-specific business logic:

1. **TemplateEditor** - Assembles Lexical + plugins + toolbar + variable system
2. **TemplateMetadataEditor** - Assembles form fields for template metadata
3. **TemplateTagManager** - Tag CRUD operations for templates
4. **TemplateVariableManager** - Variable CRUD operations
5. **TemplateVariableFormWrapper** - Wraps variable forms with template context
6. **TemplateAdvancedFilters** - Complex filtering UI for templates
7. **TemplateGlobalSearch** - Search functionality for templates
8. **TemplateSelectFieldConfig** - Configuration UI for select fields

**Rationale**: All have "Template" prefix and contain template-specific business logic

---

### GROUP 2: Generic Reusable Constructs (Shared)
**Location**: `core/ui/constructs/`

These are generic patterns that could be reused across apps:

9. **InlineTagEditor** - Generic inline tag editing (no template-specific logic)
10. **InlineTitleEditor** - Generic inline title editing
11. **InlineVariableEditor** - Generic inline variable editing
12. **BackupRestorePanel** - Generic backup/restore UI pattern
13. **EditorCommandMenu** - Command palette pattern (could be reused)

**Rationale**: No domain-specific logic, reusable patterns

---

### GROUP 3: Template-Specific Views (App-Specific)
**Location**: `apps/template-editor/views/`

These fill layout slots and render based on template state:

14. **TemplateOutlinePanel** - Shows template structure (right panel)
15. **TemplatePreview** - Preview mode for templates
16. **ComposePreview** - Compose/use mode preview

**Rationale**: Fill specific panels, render based on template state

---

### GROUP 4: Primitives/Components (Shared)
**Location**: `core/ui/primitives/` or appropriate subdirectory

Single UI controls with no business logic:

17. **ThemeToggle** - Single toggle control
18. **ResponsiveDrawer** - Generic drawer primitive
19. **TemplateCharacterCounter** - Character count display
20. **TemplateVariablePopover** - Popover for variable insertion

**Note**: Some have "Template" prefix but are actually generic primitives

---

### GROUP 5: Display/List Components
**Location**: `apps/template-editor/components/` (if template-specific) OR `core/ui/constructs/` (if generic)

Need to determine if these are generic lists or template-specific:

21. **TemplateVariableList** - List display for variables
22. **TemplateVariableListDisplay** - Alternative list display

**Question**: Are these generic list patterns or template-specific?

---

### GROUP 6: Special Cases

23. **ColorSystemDemo** - Demo/documentation component
   - **Location**: Should be in `/docs` or `/examples`, not `/components`
   - **Action**: Move to documentation folder or delete

24. **PageSwitcher** - Likely a navigation component
   - **Location**: Need to analyze - could be Layout or Construct
   - **Action**: Read and classify

---

## Decision Points Needing Clarification

### 1. "Template" Prefix Components
Some components have "Template" prefix but might be generic:
- **TemplateCharacterCounter** - Is this specific to templates or just a character counter?
- **TemplateVariablePopover** - Is this template-specific or generic variable insertion?
- **TemplateSelectFieldConfig** - Template-specific or generic select field config?

**Recommendation**: Remove "Template" prefix if they're actually generic

### 2. Inline Editors
Three inline editors:
- InlineTagEditor
- InlineTitleEditor
- InlineVariableEditor

**Question**: Should these be grouped under a common parent?
```
core/ui/constructs/
└── inline-editors/
    ├── InlineTagEditor.tsx
    ├── InlineTitleEditor.tsx
    └── InlineVariableEditor.tsx
```

### 3. Variable-Related Components
Four variable components:
- TemplateVariableManager
- TemplateVariableFormWrapper
- TemplateVariableList
- TemplateVariableListDisplay

**Question**: Should these be grouped under a common parent?
```
apps/template-editor/components/
└── variables/
    ├── TemplateVariableManager.tsx
    ├── TemplateVariableFormWrapper.tsx
    ├── TemplateVariableList.tsx
    └── TemplateVariableListDisplay.tsx
```

---

## Proposed Directory Structure

```
src/
├── apps/
│   └── template-editor/
│       ├── components/              (App-specific constructs)
│       │   ├── TemplateEditor.tsx
│       │   ├── TemplateMetadataEditor.tsx
│       │   ├── TemplateTagManager.tsx
│       │   ├── TemplateAdvancedFilters.tsx
│       │   ├── TemplateGlobalSearch.tsx
│       │   ├── TemplateSelectFieldConfig.tsx
│       │   └── variables/           (Variable-related grouped)
│       │       ├── TemplateVariableManager.tsx
│       │       ├── TemplateVariableFormWrapper.tsx
│       │       ├── TemplateVariableList.tsx
│       │       └── TemplateVariableListDisplay.tsx
│       │
│       └── views/                   (App-specific views)
│           ├── TemplateOutlinePanel.tsx
│           ├── TemplatePreview.tsx
│           └── ComposePreview.tsx
│
└── core/
    └── ui/
        ├── primitives/
        │   ├── ThemeToggle.tsx
        │   ├── ResponsiveDrawer.tsx
        │   └── CharacterCounter.tsx    (renamed from TemplateCharacterCounter)
        │
        └── constructs/
            ├── BackupRestorePanel.tsx
            ├── EditorCommandMenu.tsx
            ├── VariablePopover.tsx     (renamed from TemplateVariablePopover)
            └── inline-editors/         (Grouped inline editors)
                ├── InlineTagEditor.tsx
                ├── InlineTitleEditor.tsx
                └── InlineVariableEditor.tsx
```

---

## Actions Required

1. **Review classifications** - Confirm each component's type
2. **Confirm grouping strategy** - Approve inline-editors/ and variables/ grouping
3. **Rename generic components** - Remove "Template" prefix where appropriate
4. **Handle ColorSystemDemo** - Move to docs or delete
5. **Classify PageSwitcher** - Read and determine correct location
6. **Execute reorganization** - Move files and update imports
7. **Update barrel exports** - Create index.ts files for grouped folders
8. **Verify build** - Ensure no broken imports

---

## Questions for User

1. Should inline editors be grouped under `inline-editors/`?
2. Should variable components be grouped under `variables/`?
3. Are CharacterCounter and VariablePopover truly generic (no template-specific logic)?
4. What should we do with ColorSystemDemo?
5. Any other grouping preferences?
