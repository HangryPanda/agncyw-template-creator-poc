# Component Reorganization Plan - Root Level Components

**Date**: 2025-10-27
**Scope**: 26 components at `/src/components/` root level
**Goal**: Apply multi-layered grouping and component placement decision matrix

---

## Classification Analysis

### CONSTRUCTS (Multi-component assemblies)
**Location**: `core/ui/constructs/[name]/` OR `apps/template-editor/components/[name]/`

1. **InlineTagEditor.tsx** → `core/ui/constructs/inline-tag-editor/`
   - Popover with tag creation, selection, editing
   - Common pattern (reusable)

2. **InlineTitleEditor.tsx** → Check if template-specific or generic
   - If template-specific → `apps/template-editor/components/inline-title-editor/`
   - If generic → `core/ui/constructs/inline-title-editor/`

3. **InlineVariableEditor.tsx** → `apps/template-editor/components/inline-variable-editor/`
   - Template-specific variable editing

4. **TemplateMetadataEditor.tsx** → `apps/template-editor/components/template-metadata-editor/`
   - Template-specific metadata form

5. **TagManager.tsx** → `core/ui/constructs/tag-manager/`
   - Common tag management pattern

6. **VariableManager.tsx** → `apps/template-editor/components/variable-manager/`
   - Template-specific variable management

7. **BackupRestorePanel.tsx** → `apps/template-editor/components/backup-restore-panel/`
   - Template-specific backup/restore UI

8. **AdvancedFilters.tsx** → Check content
   - If generic filtering → `core/ui/constructs/advanced-filters/`
   - If template-specific → `apps/template-editor/components/advanced-filters/`

9. **EditorCommandMenu.tsx** → `apps/template-editor/components/editor-command-menu/`
   - Template editor command palette

10. **GlobalSearch.tsx** → Check if template-specific or app-level
    - If app-level → `core/ui/constructs/global-search/`
    - If template-specific → `apps/template-editor/components/global-search/`

11. **TemplateEditor.tsx** → `apps/template-editor/components/template-editor/`
    - Assembles Lexical editor with plugins (main construct)

12. **FormWrapper.tsx** → Check content
    - Could be Layout or Construct

---

### VIEWS (Fill layout slots, state-driven composition)
**Location**: `core/ui/views/` OR `apps/template-editor/views/`

13. **TemplateSidebar.tsx** → `apps/template-editor/views/template-sidebar/`
    - Fills sidebar slot, groups templates by tags

14. **ModernTemplateSidebar.tsx** → Check if replacement for TemplateSidebar
    - Same location or archive if deprecated

15. **EnhancedTemplateSidebar.tsx** → Check if replacement for TemplateSidebar
    - Same location or archive if deprecated

16. **TemplateOutlinePanel.tsx** → `apps/template-editor/views/template-outline-panel/`
    - Fills panel slot, shows template structure

17. **TemplatePreview.tsx** → `apps/template-editor/views/template-preview/`
    - Fills preview slot, shows rendered template

18. **ComposePreview.tsx** → `apps/template-editor/views/compose-preview/`
    - Fills compose preview slot

---

### COMPONENTS (Single UI controls)
**Location**: `core/ui/primitives/[name]/`

19. **CharacterCounter.tsx** → `core/ui/primitives/character-counter/`
    - Single UI control (counter display)

20. **ThemeToggle.tsx** → `core/ui/primitives/theme-toggle/`
    - Single UI control (toggle button)

21. **ResponsiveDrawer.tsx** → `core/ui/overlays/responsive-drawer/`
    - Overlay component (drawer/sidebar)

22. **VariablePopover.tsx** → Check if template-specific or generic popover
    - If generic → `core/ui/overlays/variable-popover/`
    - If template-specific → `apps/template-editor/components/variable-popover/`

23. **SelectFieldConfig.tsx** → Check content
    - Likely form component

---

### NEED ANALYSIS (Check content to classify)

24. **VariableList.tsx** → Need to check if Component or Construct
25. **VariableListDisplay.tsx** → Need to check if Component or Construct
26. **ColorSystemDemo.tsx** → Likely demo/example (archive or move to docs)

---

## Multi-App Considerations

**Decision**: Which components should be in `core/ui/` (shared) vs `apps/template-editor/` (app-specific)?

### Promote to `core/ui/` (Shared):
- InlineTagEditor (common pattern)
- TagManager (common pattern)
- CharacterCounter (common primitive)
- ThemeToggle (common primitive)
- ResponsiveDrawer (common overlay)
- FormWrapper (if generic layout)
- GlobalSearch (if app-level feature)
- AdvancedFilters (if generic filtering)

### Keep in `apps/template-editor/`:
- TemplateEditor
- TemplateMetadataEditor
- TemplateSidebar (and variants)
- TemplateOutlinePanel
- TemplatePreview, ComposePreview
- InlineVariableEditor
- VariableManager
- BackupRestorePanel
- EditorCommandMenu
- VariablePopover (if template-specific)

---

## Naming Audit

**Components needing kebab-case directories**:
- All will be moved to kebab-case subdirectories following naming conventions

**Example transformation**:
```
Before: src/components/InlineTagEditor.tsx
After:  core/ui/constructs/inline-tag-editor/InlineTagEditor.tsx
```

---

## Next Steps

1. **Analyze remaining unclear components** (VariableList, VariableListDisplay, etc.)
2. **Decide shared vs app-specific** for each
3. **Create directory structure** with kebab-case names
4. **Move files** using `git mv` to preserve history
5. **Update imports** across codebase
6. **Create barrel exports** for each directory
7. **Verify build** passes
8. **Update documentation**

---

## Questions to Resolve

1. **Multiple Sidebar versions**: TemplateSidebar, ModernTemplateSidebar, EnhancedTemplateSidebar
   - Are these iterations/replacements?
   - Should older versions be archived?

2. **Variable components**: VariableManager, VariableList, VariableListDisplay, VariablePopover, InlineVariableEditor
   - Should these be grouped under a `variables/` parent category?
   - Which are constructs vs components?

3. **FormWrapper**: Is this a Layout (defines slots) or Construct (assembles form UI)?

4. **Global components**: GlobalSearch, AdvancedFilters
   - App-level features or template-specific?

5. **ColorSystemDemo**: Keep as example or archive?
