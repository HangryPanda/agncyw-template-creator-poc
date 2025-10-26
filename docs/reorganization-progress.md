# File System Reorganization Progress Tracker

**Started**: 2025-01-24
**Last Updated**: 2025-01-25
**Status**: ⚠️ NAMING CONVENTION UPDATE - Reconciliation Required
**Current Phase**: Pending - Awaiting naming convention reconciliation

---

## ⚠️ **CRITICAL UPDATE: Naming Convention Change**

**Date**: 2025-01-25

### What Changed

The project has adopted a **hybrid naming convention** that respects React/TypeScript ecosystem standards:

**OLD Approach (No Longer Valid):**
- ❌ Components: `TemplateEditor.view.tsx`
- ❌ Hooks: `use-template-registry.hook.ts`
- ❌ Services: `template-registry.service.ts`
- ❌ All files used kebab-case + dot notation suffixes

**NEW Approach (Current Standard):**
- ✅ Components: `TemplateEditor.tsx` (PascalCase, no suffix)
- ✅ Hooks: `useTemplateRegistry.ts` (useCamelCase, no suffix)
- ✅ Services: `templateRegistryService.ts` (camelCase + Service)
- ✅ Directories: `kebab-case/` (universal)
- ✅ CSS: `kebab-case.css`

**Reference:** See `/docs/naming-quick-reference.md` for complete guidelines

### Impact on This Document

All completed Phase 1 steps used the OLD naming convention. These files need to be renamed to match the NEW convention:

**Phase 1 Completed Files (Need Renaming):**
- ✅ Created but need renaming: 20 `.view.tsx` files → `.tsx`
- ✅ Created but need renaming: 3 `.service.ts` files → `Service.ts` (camelCase)
- ✅ Created but need renaming: 5 `.model.ts` files → `.ts`

**Phase 2-5 Pending Steps:**
- ⚠️ All file naming examples in pending steps are now OUTDATED
- ⚠️ Do NOT follow the `.view.tsx`, `.hook.ts`, `.service.ts` patterns shown below
- ⚠️ Refer to `/docs/naming-quick-reference.md` for correct naming

### Next Actions Required

1. **Rename all Phase 1 completed files** to match new convention
2. **Update all import statements** in consuming files
3. **Verify build still works** after renaming
4. **Update this document** with correct naming examples
5. **Continue Phase 2+** using new naming convention

**DO NOT proceed with Phase 2+ tasks until Phase 1 files are renamed!**

---

## Summary

### Phase 2 Step 2.4.1 Completion Summary ✓

Successfully completed design token reorganization:

**Files Created**:
- `src/styles/tokens/colorSystem.css` - Color palette, semantic colors, dark mode
- `src/styles/tokens/typography.css` - Fonts, sizes, spacing, z-index
- `src/styles/tokens/effects.css` - Shadows, transitions, animations, utility classes
- `src/styles/tokens/index.css` - Barrel export for all tokens

**Improvements**:
- Split generic `design-system.css` into specific, purpose-driven files
- Merged `premium-ui.css` content into `effects.css`
- Eliminated generic naming ("design-system", "premium-ui")
- Used descriptive names that indicate purpose (colorSystem, typography, effects)

**Current State**:
- NEW structure: Design tokens organized by purpose in `src/styles/tokens/`
- OLD structure: Original files still exist (will be deleted in Phase 5)
- Ready for Step 2.4.2: Lexical theme reorganization

### Phase 2 Step 2.0 Summary ✓

Successfully identified and documented existing reusable libraries:

**Tab Management System** (`src/lib/tabs/`):
- ✅ Already follows all best practices (domain-specific naming, core/integrations separation)
- ✅ Comprehensive CLAUDE.md documentation for AI assistants
- ✅ Ready for multi-app workspace migration
- ✅ Serves as exemplary reference for other shared infrastructure
- ✅ No reorganization needed - use as template for other code

### Phase 2 Steps 2.1 & 2.2 Completion Summary ✓

Successfully completed Phase 2 shared infrastructure reorganization:

**Files Created**:
- 3 component files with `.view.tsx` suffix moved to domain directories
- 5 hook files moved to domain-specific directories
- 9 barrel export files created

**Directory Structure**:
- `src/components/forms/` - Form-related UI (FormWrapper, ResponsiveDrawer)
- `src/components/indicators/` - Status indicators (CharacterCounter)
- `src/hooks/templateRegistry/` - Template CRUD and persistence
- `src/hooks/templateValues/` - Template value management
- `src/hooks/modalSystem/` - Modal and notification UI
- `src/hooks/reporting/` - Reporting functionality

**Imports Updated**: ✅ All imports updated in App.tsx and feature components
**Build Status**: ✅ `npm run build` succeeds with 0 errors
**Naming Convention**: ✅ Domain-specific names (not generic like "data", "ui", "platform")

**Current State**:
- NEW structure: All components and hooks using domain-specific organization
- OLD structure: Original files still exist (can be deleted in Phase 5)
- Both structures coexist without conflicts

### Phase 1 Completion Summary ✓

Successfully completed all Phase 1 tasks:

**Files Created**:
- 20 component files copied with `.view.tsx` suffix
- 3 service files copied with `.service.ts` suffix
- 5 model files created (split from src/types/index.ts)
- 1 data file copied (defaultTemplates.ts)
- 9 barrel export files created

**Directory Structure**:
- `src/apps/TemplateEditor/` - Main app structure with features
- `src/apps/_shared/template/` - Shared template utilities

**App.tsx Updated**: ✅ All imports now use new structure
**Build Status**: ✅ `npm run build` succeeds with 0 errors
**Dev Server**: ✅ Running at http://localhost:5176/ with HMR working

**Current State**:
- NEW structure: All files working, App.tsx using new imports
- OLD structure: Original files still exist (can be deleted safely)
- Both structures coexist without conflicts

**Next Steps**:
1. Test the application thoroughly to ensure everything works
2. Delete old duplicate files from src/components/, src/services/, src/config/
3. Continue with Phase 2 (shared frontend infrastructure reorganization)

---

## Overview

Reorganizing insurance template POC to prepare for multi-app workspace integration.

**Strategy**: Incremental implementation with verification at each phase
**Naming**: Aggressive - applying .view.tsx, .service.ts, .model.ts suffixes
**Exclusions**: docs/ and src/plugins/ (Lexical) unchanged

---

## Phase 1: Create App Structure ✓ COMPLETED

### Step 1.1: Take Structure Snapshot ✓ COMPLETED
- [x] Created `docs/before-structure.txt` snapshot

### Step 1.2: Create Directory Structure ✓ COMPLETED
- [x] Create `src/apps/TemplateEditor/` with subdirectories:
  - [x] `components/`
  - [x] `features/`
  - [x] `features/editor/`
  - [x] `features/editor/components/`
  - [x] `features/editor/hooks/`
  - [x] `features/preview/`
  - [x] `features/preview/components/`
  - [x] `features/preview/services/`
  - [x] `features/sidebar/`
  - [x] `features/sidebar/components/`
  - [x] `features/metadata/`
  - [x] `features/metadata/components/`
  - [x] `services/`
  - [x] `state/`
  - [x] `data/`
  - [x] `types/`

### Step 1.3: Create Shared Template Structure ✓ COMPLETED
- [x] Create `src/apps/_shared/template/` with subdirectories:
  - [x] `adapters/`
  - [x] `services/`
  - [x] `types/`
  - [x] `utils/`

### Step 1.4: Copy Components to Features ✓ COMPLETED
- [x] **Editor Feature** (`features/editor/components/`):
  - [x] `TemplateEditor.tsx` → `TemplateEditor.view.tsx`
  - [x] `EditorCommandMenu.tsx` → `EditorCommandMenu.view.tsx`
  - [x] `VariablePopover.tsx` → `VariablePopover.view.tsx`

- [x] **Preview Feature** (`features/preview/components/`):
  - [x] `TemplatePreview.tsx` → `TemplatePreview.view.tsx`
  - [x] `ComposePreview.tsx` → `ComposePreview.view.tsx`

- [x] **Sidebar Feature** (`features/sidebar/components/`):
  - [x] `ModernTemplateSidebar.tsx` → `ModernTemplateSidebar.view.tsx`
  - [x] `GlobalSearch.tsx` → `GlobalSearch.view.tsx`
  - [x] `TagManager.tsx` → `TagManager.view.tsx`
  - [x] `BackupRestorePanel.tsx` → `BackupRestorePanel.view.tsx`
  - [x] `EnhancedTemplateSidebar.tsx` → `EnhancedTemplateSidebar.view.tsx`
  - [x] `AdvancedFilters.tsx` → `AdvancedFilters.view.tsx`

- [x] **Metadata Feature** (`features/metadata/components/`):
  - [x] `TemplateMetadataEditor.tsx` → `TemplateMetadataEditor.view.tsx`
  - [x] `InlineTagEditor.tsx` → `InlineTagEditor.view.tsx`
  - [x] `InlineVariableEditor.tsx` → `InlineVariableEditor.view.tsx`
  - [x] `InlineTitleEditor.tsx` → `InlineTitleEditor.view.tsx`
  - [x] `VariableManager.tsx` → `VariableManager.view.tsx`
  - [x] `VariableList.tsx` → `VariableList.view.tsx`

### Step 1.5: Copy Services ✓ COMPLETED
- [x] **App Services** (`src/apps/TemplateEditor/services/`):
  - [x] None yet (placeholder)

- [x] **Shared Services** (`src/apps/_shared/template/services/`):
  - [x] `src/services/TemplateRegistry.ts` → `templateRegistry.service.ts`
  - [x] `src/services/templateBackup.ts` → `templateBackup.service.ts`
  - [x] `src/services/templateMigrations.ts` → `templateMigrations.service.ts`
  - [x] Fixed all service imports to use new paths
  - [x] Created `index.ts` barrel export

### Step 1.6: Split & Copy Types ✓ COMPLETED
- [x] **Shared Types** (`src/apps/_shared/template/types/`):
  - [x] Extract from `src/types/index.ts` → `template.model.ts`
  - [x] Extract from `src/types/index.ts` → `variable.model.ts`
  - [x] Extract from `src/types/index.ts` → `tag.model.ts`
  - [x] Extract from `src/types/index.ts` → `editorState.model.ts`
  - [x] Extract from `src/types/index.ts` → `registry.model.ts`
  - [x] Created `index.ts` barrel export
  - [x] Updated all service imports to use new type paths

### Step 1.7: Copy Config/Data ✓ COMPLETED
- [x] **App Data** (`src/apps/TemplateEditor/data/`):
  - [x] `src/config/defaultTemplates.ts` → `defaultTemplates.ts`
  - [x] Created `index.ts` barrel export

### Step 1.8: Create Feature Barrel Exports ✓ COMPLETED
- [x] `src/apps/TemplateEditor/features/editor/index.ts`
- [x] `src/apps/TemplateEditor/features/preview/index.ts`
- [x] `src/apps/TemplateEditor/features/sidebar/index.ts`
- [x] `src/apps/TemplateEditor/features/metadata/index.ts`
- [x] `src/apps/TemplateEditor/features/index.ts`
- [x] `src/apps/TemplateEditor/index.ts`
- [x] `src/apps/_shared/template/index.ts`
- [x] Fixed export types (default vs named) for all components

### Step 1.9: Update App.tsx to Use New Structure ✓ COMPLETED
- [x] Updated all component imports to use new paths
- [x] Updated type imports from `@/apps/_shared/template/types`
- [x] Updated EMPTY_TEMPLATE import from new data location
- [x] All imports verified working

### Step 1.10: Build & Runtime Verification ✓ COMPLETED
- [x] Run `npm run build` - ✅ SUCCESS (0 errors)
- [x] Run `npm run dev` - ✅ Running at http://localhost:5176/
- [x] HMR (Hot Module Replacement) - ✅ Working
- [x] All component imports resolved correctly

**Note**: Skipped creating separate TemplateEditorApp.tsx as updating App.tsx directly was simpler and maintains existing functionality without breaking changes.

---

## Phase 2: Shared Frontend Infrastructure ⏸️ PENDING

### Step 2.0: Document Existing Reusable Libraries ✓ COMPLETED
Already well-organized reusable libraries that serve as examples of best practices:

**Canvas Tab Management System** (`src/lib/tabs/` → will become `src/lib/canvasTabs/`) - ✅ EXEMPLARY
- [x] Location: `src/lib/tabs/` - Well-structured but needs better naming
- [x] Structure:
  - [x] `core/` - Generic, framework-agnostic tab state management
    - [x] `useTabManager.ts` - React hook for tab state
    - [x] `TabBar.tsx` - VS Code-style UI component
    - [x] `types.ts` - TypeScript interfaces
    - [x] `index.ts` - Barrel exports
  - [x] `integrations/` - Editor-specific extensions
    - [x] `lexical/` - Lexical editor integration (dirty state tracking)
      - [x] `useLexicalDirtyState.ts` - Monitors Lexical undo stack
      - [x] `DirtyStatePlugin.tsx` - Headless dirty state plugin
      - [x] `useTemplateEditorTabs.ts` - Template-specific wrapper
      - [x] `TemplateEditorTabs.tsx` - Template tab bar component
      - [x] `index.ts` - Barrel exports
  - [x] `CLAUDE.md` - Comprehensive AI-friendly documentation
  - [x] `index.ts` - Top-level barrel export
- [x] **Key Features**:
  - [x] Modular and reusable across applications
  - [x] TypeScript generics for type safety
  - [x] localStorage persistence
  - [x] Drag-and-drop reordering
  - [x] Context menus and keyboard shortcuts
  - [x] Dirty state tracking
  - [x] Separation of concerns (core vs integrations)
- [x] **Why It's Exemplary**:
  - ✅ Clear separation: core (generic) vs integrations (specific)
  - ✅ Comprehensive documentation (CLAUDE.md)
  - ✅ Barrel exports at every level
  - ✅ TypeScript strict mode compliance
  - ✅ Ready for multi-app workspace migration
- [x] **Current Import Paths** (will be updated):
  - Core only: `import { useTabManager, TabBar } from '@/lib/tabs/core'`
  - Lexical integration: `import { useTemplateEditorTabs } from '@/lib/tabs/integrations/lexical'`
  - Everything: `import { ... } from '@/lib/tabs'`

**Notes**:
- This system follows structural best practices but needs better naming
- "tabs" is too generic - conflicts with "editor" terminology
- Will be renamed to "canvasTabs" (inspired by VS Code's workbench + design tools)
- Use as reference/template when organizing other shared infrastructure
- Critical for multi-app workspace - designed to be reusable
- Already includes AI-friendly documentation (CLAUDE.md)

### Step 2.1: Reorganize Shared Components ✓ COMPLETED
- [x] Create `src/components/forms/` - Form-related UI components
- [x] Create `src/components/indicators/` - Status and feedback indicators
- [x] Create `src/components/layout/` - Layout components (if needed) - SKIPPED (not needed yet)
- [x] Move `FormWrapper.tsx` → `src/components/forms/FormWrapper.view.tsx`
- [x] Move `ResponsiveDrawer.tsx` → `src/components/forms/ResponsiveDrawer.view.tsx`
- [x] Move `CharacterCounter.tsx` → `src/components/indicators/CharacterCounter.view.tsx`
- [x] Create `src/components/forms/index.ts` barrel export
- [x] Create `src/components/indicators/index.ts` barrel export
- [x] Create `src/components/index.ts` barrel export

### Step 2.2: Organize Hooks by Application Domain ✓ COMPLETED
Hooks are organized by their specific application domain/feature, not generic categories.
- [x] Create `src/hooks/templateRegistry/` - Template CRUD and persistence
- [x] Create `src/hooks/templateValues/` - Template value management
- [x] Create `src/hooks/modalSystem/` - Modal and notification UI
- [x] Create `src/hooks/reporting/` - Reporting functionality
- [x] Move `useTemplateRegistry.ts` → `src/hooks/templateRegistry/useTemplateRegistry.ts`
- [x] Move `useTemplateValues.ts` → `src/hooks/templateValues/useTemplateValues.ts`
- [x] Move `useModal.tsx` → `src/hooks/modalSystem/useModal.tsx`
- [x] Move `useFlashMessage.tsx` → `src/hooks/modalSystem/useFlashMessage.tsx`
- [x] Move `useReport.ts` → `src/hooks/reporting/useReport.ts`
- [x] Create `src/hooks/templateRegistry/index.ts` barrel export
- [x] Create `src/hooks/templateValues/index.ts` barrel export
- [x] Create `src/hooks/modalSystem/index.ts` barrel export
- [x] Create `src/hooks/reporting/index.ts` barrel export
- [x] Create `src/hooks/index.ts` barrel export
- [x] Update all imports in App.tsx and feature components
- [x] Fixed import paths in FormWrapper.view.tsx, TemplatePreview.view.tsx, BackupRestorePanel.view.tsx

### Step 2.3: Rename Canvas Tab Management System
Rename `src/lib/tabs/` to `src/lib/canvasTabs/` with improved naming conventions.

**Rationale**:
- "tabs" is too generic and conflicts with "editor" terminology
- "canvas" clearly represents the workspace where users create/edit (templates, documents, designs)
- "canvasTabs" = navigation between multiple open canvases
- Inspired by VS Code's workbench architecture and design tools (Figma, Sketch)
- Avoids confusion: Canvas (workspace) vs Text Editor (Lexical component within canvas)

**Step 2.3.1: Create New Directory Structure**
- [ ] Create `src/lib/canvasTabs/` directory
- [ ] Create `src/lib/canvasTabs/core/` directory
- [ ] Create `src/lib/canvasTabs/integrations/` directory
- [ ] Create `src/lib/canvasTabs/integrations/lexical/` directory

**Step 2.3.2: Copy and Rename Core Files**
- [ ] `src/lib/tabs/core/useTabManager.ts` → `src/lib/canvasTabs/core/useCanvasTabsManager.ts`
  - [ ] Rename function: `useTabManager` → `useCanvasTabsManager`
  - [ ] Update internal variable names (tabs → canvasTabs where contextually appropriate)
- [ ] `src/lib/tabs/core/TabBar.tsx` → `src/lib/canvasTabs/core/CanvasTabsControl.tsx`
  - [ ] Rename component: `TabBar` → `CanvasTabsControl`
  - [ ] Update interface: `TabBarProps` → `CanvasTabsControlProps`
  - [ ] Update CSS class names: `tab-bar` → `canvas-tabs-control`
- [ ] `src/lib/tabs/core/types.ts` → `src/lib/canvasTabs/core/types.ts`
  - [ ] Rename interface: `TabItem` → `CanvasTabItem`
  - [ ] Rename interface: `TabsState` → `CanvasTabsState`
  - [ ] Rename interface: `UseTabManagerOptions` → `UseCanvasTabsManagerOptions`
  - [ ] Rename interface: `TabManagerReturn` → `CanvasTabsManagerReturn`
- [ ] `src/lib/tabs/core/index.ts` → `src/lib/canvasTabs/core/index.ts`
  - [ ] Update all export names to new naming convention

**Step 2.3.3: Copy and Rename Lexical Integration Files**
- [ ] `src/lib/tabs/integrations/lexical/useLexicalDirtyState.ts` → `src/lib/canvasTabs/integrations/lexical/useLexicalDirtyState.ts`
  - [ ] No renaming needed (remains lexical-specific)
- [ ] `src/lib/tabs/integrations/lexical/DirtyStatePlugin.tsx` → `src/lib/canvasTabs/integrations/lexical/DirtyStatePlugin.tsx`
  - [ ] No renaming needed (remains lexical-specific)
- [ ] `src/lib/tabs/integrations/lexical/useTemplateEditorTabs.ts` → `src/lib/canvasTabs/integrations/lexical/useTemplateCanvasTabs.ts`
  - [ ] Rename function: `useTemplateEditorTabs` → `useTemplateCanvasTabs`
  - [ ] Rename interface: `UseTemplateEditorTabsReturn` → `UseTemplateCanvasTabsReturn`
  - [ ] Update localStorage key: `insurance_template_editor_tabs` → `insurance_template_canvas_tabs`
- [ ] `src/lib/tabs/integrations/lexical/TemplateEditorTabs.tsx` → `src/lib/canvasTabs/integrations/lexical/TemplateCanvasTabsControl.tsx`
  - [ ] Rename component: `TemplateEditorTabs` → `TemplateCanvasTabsControl`
  - [ ] Rename interface: `TemplateEditorTabsProps` → `TemplateCanvasTabsControlProps`
- [ ] `src/lib/tabs/integrations/lexical/index.ts` → `src/lib/canvasTabs/integrations/lexical/index.ts`
  - [ ] Update all export names

**Step 2.3.4: Copy Top-Level Files**
- [ ] `src/lib/tabs/integrations/index.ts` → `src/lib/canvasTabs/integrations/index.ts`
- [ ] `src/lib/tabs/index.ts` → `src/lib/canvasTabs/index.ts`
- [ ] `src/lib/tabs/CLAUDE.md` → `src/lib/canvasTabs/CANVAS_TABS.md`
  - [ ] Update all documentation to use new terminology
  - [ ] Update title: "Tab Management System" → "Canvas Tab Management System"
  - [ ] Update all code examples with new import paths
  - [ ] Update all references: "tab" → "canvas tab" where contextually appropriate

**Step 2.3.5: Update All Imports Across Codebase**
- [ ] Update `src/App.tsx`:
  - [ ] Change: `import { TemplateEditorTabs, useTemplateEditorTabs } from '@/lib/tabs/integrations/lexical'`
  - [ ] To: `import { TemplateCanvasTabsControl, useTemplateCanvasTabs } from '@/lib/canvasTabs/integrations/lexical'`
  - [ ] Update variable names: `useTemplateEditorTabs()` → `useTemplateCanvasTabs()`
  - [ ] Update JSX: `<TemplateEditorTabs ... />` → `<TemplateCanvasTabsControl ... />`
- [ ] Update `src/apps/TemplateEditor/features/editor/components/TemplateEditor.view.tsx`:
  - [ ] Update any imports from `@/lib/tabs`
- [ ] Update `src/components/TemplateEditor.tsx`:
  - [ ] Update any imports from `@/lib/tabs`
- [ ] Update root `CLAUDE.md`:
  - [ ] Update Tab Management System section with new paths and naming
  - [ ] Update code examples
- [ ] Update `tsconfig.json` path aliases (if needed):
  - [ ] Verify `@/lib/canvasTabs` resolves correctly

**Step 2.3.6: Verification**
- [ ] Run `npm run build` - zero errors
- [ ] Run `npm run dev` - verify app loads
- [ ] Test all canvas tab functionality:
  - [ ] Open multiple templates (canvas tabs)
  - [ ] Switch between canvas tabs
  - [ ] Close canvas tabs
  - [ ] Drag-and-drop reorder canvas tabs
  - [ ] Right-click context menu
  - [ ] Dirty state indicators (unsaved changes)
  - [ ] localStorage persistence (reload page)
  - [ ] Confirmation dialog when closing dirty canvas
- [ ] Verify keyboard shortcuts work (Cmd/Ctrl+W, Cmd/Ctrl+Tab)
- [ ] Check browser localStorage for new key: `insurance_template_canvas_tabs`

**Step 2.3.7: Document New Terminology**
- [ ] Add terminology section to `CANVAS_TABS.md`:
  - **Canvas** = The workspace for a single template/document/design
  - **Canvas Tab** = Visual representation of an open canvas in the tab bar
  - **Canvas Tabs Control** = The UI component showing all open canvas tabs
  - **Text Editor** = Lexical editor component within a canvas (distinct from canvas navigation)
  - **Template Canvas** = A canvas specifically for editing templates
  - **Document Canvas** = A canvas for editing documents (future)

### Step 2.4: Organize Assets
- [ ] Create `src/assets/TemplateEditor/`
- [ ] Move app-specific assets if any

### Step 2.5: Reorganize Styles and Themes
Reorganize styling to use descriptive, purpose-driven naming instead of generic terms.

**Step 2.5.1: Reorganize Design Tokens** ✓ COMPLETED
- [x] Create `src/styles/tokens/` - Design token directory
- [x] Split `design-system.css` → `src/styles/tokens/colorSystem.css` (color palette & semantic colors)
- [x] Split `design-system.css` → `src/styles/tokens/typography.css` (fonts & text styles)
- [x] Split `premium-ui.css` → `src/styles/tokens/effects.css` (shadows, transitions, animations)
- [x] Create `src/styles/base/` - Base styles directory
- [x] Move global styles → `src/styles/base/global.css` (if needed) - SKIPPED (not needed)
- [x] Create `src/styles/tokens/index.css` - Barrel export for all tokens
- [ ] Update imports in main.tsx or index.css

**Step 2.5.2: Reorganize Lexical Editor Themes**
- [ ] Create `src/themes/lexicalEditor/` - Lexical-specific theme directory
- [ ] Rename `PlaygroundEditorTheme.ts` → `src/themes/lexicalEditor/templateEditor.theme.ts`
- [ ] Rename `PlaygroundEditorTheme.css` → `src/themes/lexicalEditor/templateEditor.theme.css`
- [ ] Rename `CommentEditorTheme.ts` → `src/themes/lexicalEditor/commentEditor.theme.ts`
- [ ] Rename `CommentEditorTheme.css` → `src/themes/lexicalEditor/commentEditor.theme.css`
- [ ] Rename `StickyEditorTheme.ts` → `src/themes/lexicalEditor/stickyNote.theme.ts`
- [ ] Rename `StickyEditorTheme.css` → `src/themes/lexicalEditor/stickyNote.theme.css`
- [ ] Update all CSS class names inside theme files (PlaygroundEditorTheme__ → TemplateEditorTheme__)
- [ ] Update all imports in components that use these themes
- [ ] Create `src/themes/lexicalEditor/index.ts` barrel export

### Step 2.6: Audit and Reorganize UI Components
Audit the generic `src/ui/` folder and reorganize into domain-specific, purpose-driven groups.

**Step 2.6.1: Analyze Current UI Components**
- [ ] Document all 29 UI components and their purpose
- [ ] Identify usage patterns (form controls, overlays, pickers, specialized)
- [ ] Determine grouping strategy based on component domain
- [ ] Create `src/components/COMPONENT_REGISTRY.md` - AI-assistant friendly component catalog with:
  - [ ] Component inventory table (name, path, purpose, category, props signature)
  - [ ] Usage examples for each component
  - [ ] Common patterns and anti-patterns
  - [ ] Import path mappings (old `@/ui/*` → new `@/components/*`)
  - [ ] Dependencies between components
  - [ ] Styling approach (CSS file locations)
  - [ ] TypeScript prop interfaces with descriptions

**Step 2.6.2: Create Domain-Specific UI Directory Structure**
Organize by component purpose rather than generic "ui" folder:
- [ ] Create `src/components/primitives/` - Basic reusable controls (Button, TextInput, Select, Switch, FileInput)
- [ ] Create `src/components/overlays/` - Modal, Dialog, DropDown components
- [ ] Create `src/components/pickers/` - ColorPicker, DropdownColorPicker components
- [ ] Create `src/components/editors/` - ContentEditable, specialized editor components
- [ ] Create `src/components/lexical/` - Lexical-specific UI (ExcalidrawModal, EquationEditor, KatexEquationAlterer, KatexRenderer, ImageResizer)

**Step 2.6.3: Copy UI Components to New Structure with .view.tsx Suffix**
- [ ] **Primitives** (`src/components/primitives/`):
  - [ ] `Button.tsx` → `Button.view.tsx`
  - [ ] `TextInput.tsx` → `TextInput.view.tsx`
  - [ ] `Select.tsx` → `Select.view.tsx`
  - [ ] `Switch.tsx` → `Switch.view.tsx`
  - [ ] `FileInput.tsx` → `FileInput.view.tsx`
  - [ ] Move corresponding CSS files (Button.css, Select.css, Input.css)
- [ ] **Overlays** (`src/components/overlays/`):
  - [ ] `Modal.tsx` → `Modal.view.tsx`
  - [ ] `Dialog.tsx` → `Dialog.view.tsx`
  - [ ] `DropDown.tsx` → `DropDown.view.tsx`
  - [ ] `FlashMessage.tsx` → `FlashMessage.view.tsx`
  - [ ] Move corresponding CSS files (Modal.css, Dialog.css, DropDown.css, FlashMessage.css)
- [ ] **Pickers** (`src/components/pickers/`):
  - [ ] `ColorPicker.tsx` → `ColorPicker.view.tsx`
  - [ ] `DropdownColorPicker.tsx` → `DropdownColorPicker.view.tsx`
  - [ ] Move corresponding CSS files (ColorPicker.css)
- [ ] **Editors** (`src/components/editors/`):
  - [ ] `ContentEditable.tsx` → `ContentEditable.view.tsx`
  - [ ] Move corresponding CSS files (ContentEditable.css)
- [ ] **Lexical Components** (`src/components/lexical/`):
  - [ ] `ExcalidrawModal.tsx` → `ExcalidrawModal.view.tsx`
  - [ ] `EquationEditor.tsx` → `EquationEditor.view.tsx`
  - [ ] `KatexEquationAlterer.tsx` → `KatexEquationAlterer.view.tsx`
  - [ ] `KatexRenderer.tsx` → `KatexRenderer.view.tsx`
  - [ ] `ImageResizer.tsx` → `ImageResizer.view.tsx`
  - [ ] Move corresponding CSS files (ExcalidrawModal.css, EquationEditor.css, KatexEquationAlterer.css)

**Step 2.6.4: Create Barrel Exports for New UI Structure**
- [ ] Create `src/components/primitives/index.ts` - Export all primitive components
- [ ] Create `src/components/overlays/index.ts` - Export all overlay components
- [ ] Create `src/components/pickers/index.ts` - Export all picker components
- [ ] Create `src/components/editors/index.ts` - Export all editor components
- [ ] Create `src/components/lexical/index.ts` - Export all Lexical-specific components
- [ ] Update `src/components/index.ts` - Re-export from all subdirectories

**Step 2.6.5: Update Imports Across Codebase**
Update all imports from `@/ui/*` to new paths:
- [ ] Update imports in `src/plugins/` directory (~15 files)
- [ ] Update imports in `src/nodes/` directory (~5 files)
- [ ] Update imports in `src/hooks/` directory (~2 files)
- [ ] Update imports in `src/context/` directory (~1 file)
- [ ] Update imports in `src/ui/KatexEquationAlterer.tsx` (internal import)
- [ ] Verify all imports use new structure (e.g., `@/components/primitives`, `@/components/overlays`)

**Step 2.6.6: Verification**
- [ ] Run `npm run build` - zero errors
- [ ] Run `npm run dev` - verify app loads
- [ ] Test UI components in various contexts (toolbar, plugins, modals)
- [ ] Verify CSS files are loaded correctly

### Step 2.7: Final Phase 2 Verification
- [ ] Run `npm run build` - zero errors
- [ ] Run `npm run dev` - verify app loads
- [ ] Test shared components work
- [ ] Verify all styles load correctly
- [ ] Test all reorganized hooks, UI components, and design tokens

---

## Phase 3: localStorage Infrastructure ⏸️ PENDING

Organize localStorage persistence layer with clear, domain-specific naming. This is the **local storage** implementation, not server-side backend (which exists in parent repo).

### Step 3.1: Create localStorage Directory Structure
- [ ] Create `src/localStorage/` - Root for all localStorage-based persistence
- [ ] Create `src/localStorage/templateRegistry/` - Template storage implementation
- [ ] Create `src/localStorage/templateRegistry/adapters/` - Storage adapters
- [ ] Create `src/localStorage/templateRegistry/migrations/` - Schema migrations
- [ ] Create `src/localStorage/userPreferences/` - User settings (future)
- [ ] Create `src/localStorage/drafts/` - Auto-saved drafts (future)
- [ ] Create `src/localStorage/cache/` - Cached data (future)

### Step 3.2: Move Existing localStorage Services
- [ ] Move `src/apps/_shared/template/services/templateRegistry.service.ts` → `src/localStorage/templateRegistry/templateRegistry.service.ts`
- [ ] Move `src/apps/_shared/template/services/templateBackup.service.ts` → `src/localStorage/templateRegistry/templateBackup.service.ts`
- [ ] Move `src/apps/_shared/template/services/templateMigrations.service.ts` → `src/localStorage/templateRegistry/migrations/templateMigrations.service.ts`
- [ ] Update all imports in hooks and components
- [ ] Create `src/localStorage/templateRegistry/index.ts` barrel export
- [ ] Create `src/localStorage/index.ts` barrel export

### Step 3.3: Create README Documentation
- [ ] Create `src/localStorage/README.md` - Explain localStorage vs server backend
- [ ] Create `src/localStorage/templateRegistry/README.md` - Document template storage architecture

### Step 3.4: Verification
- [ ] Run `npm run build` - zero errors
- [ ] Run `npm run dev` - verify app loads
- [ ] Test template CRUD operations work with new paths
- [ ] Verify migrations still run correctly

---

## Phase 4: Documentation ⏸️ PENDING

### Step 4.1: App Documentation
- [ ] Create `src/apps/TemplateEditor/CLAUDE.md`
- [ ] Document purpose, entry points, architecture
- [ ] Document state management, services, dependencies
- [ ] Document known risks

### Step 4.2: Architecture Diagrams
- [ ] Create `docs/architecture/template-editor.md`
- [ ] Add component hierarchy diagram
- [ ] Add state management flow diagram
- [ ] Add integration points diagram

### Step 4.3: Update Root Documentation
- [ ] Update root `CLAUDE.md` with new structure
- [ ] Add links to app-specific docs

---

## Phase 5: Cleanup ⏸️ PENDING

### Step 5.1: Update Main App Entry
- [ ] Update `src/App.tsx` to import from `TemplateEditorApp`
- [ ] Verify all imports work

### Step 5.2: Delete Old Files
- [ ] Delete old components from `src/components/`
- [ ] Delete old services from `src/services/`
- [ ] Delete old hooks from `src/hooks/` root
- [ ] Delete old types from `src/types/` (keep what's shared)
- [ ] Delete old config from `src/config/`

### Step 5.3: Final Verification
- [ ] Run `npm run build` - zero errors
- [ ] Run `npm run dev` - app loads perfectly
- [ ] Test all features:
  - [ ] Create template
  - [ ] Edit template
  - [ ] Save template
  - [ ] Delete template
  - [ ] Search templates
  - [ ] Tag management
  - [ ] Backup/restore
  - [ ] Tab navigation
  - [ ] Keyboard shortcuts

### Step 5.4: Structure Snapshot
- [ ] Create `docs/after-structure.txt`
- [ ] Compare before/after
- [ ] Document structure changes

---

## Files Moved/Created Summary

### Created Directories: 0/50+
### Files Moved: 0/30+
### Barrel Exports Created: 0/20+
### Import Statements Updated: 0/100+

---

## Known Issues / Blockers

_None yet_

---

## Notes

- **Phase 1 Focus**: Get app structure in place with all components copied
- **Verification Strategy**: Test build after each major step
- **Rollback Plan**: Git commit after each completed phase
- **Import Update Strategy**: Update internal imports as files are copied

---

## Next Session Resume Point

**Current Step**: About to start Step 1.2 - Create directory structure
**Last Completed**: Step 1.1 - Structure snapshot taken
**Next Action**: Create `src/apps/TemplateEditor/` directory tree
