# File System Reorganization Progress Tracker

**Started**: 2025-10-24
**Last Updated**: 2025-10-27 00:15:56
**Status**: ✅ Phase 1, Phase 2.3, Phase 2.5.2, Phase 2.6 Complete
**Current Phase**: Phase 2 - Shared Frontend Infrastructure (Step 2.7 - Final Verification)

---

## ✅ **COMPLETED: Phase 1 Reconciliation, Phase 2.3, Phase 2.5.2 & Phase 2.6**

**Completed Dates**:
- Phase 1.R & 2.3: 2025-10-26
- Phase 2.5.2 & 2.6: 2025-10-27

### Summary of Completed Work

**Phase 1.R: Naming Convention Reconciliation (25 files renamed)**
- ✅ 17 components: `.view.tsx` → `.tsx`
- ✅ 3 services: `.service.ts` → `Service.ts` (camelCase)
- ✅ 5 types: `.model.ts` → `.ts` (PascalCase)
- ✅ All barrel exports updated
- ✅ All imports updated
- ✅ Build verification: SUCCESS

**Phase 2.3: Canvas Tabs Refactor (15 new files created)**
- ✅ Renamed `src/lib/tabs/` → `src/lib/canvasTabs/`
- ✅ useTabManager → useCanvasTabsManager
- ✅ TabBar → CanvasTabsControl
- ✅ useTemplateEditorTabs → useTemplateCanvasTabs
- ✅ TemplateEditorTabs → TemplateCanvasTabsControl
- ✅ All type names updated (TabItem → CanvasTabItem, etc.)
- ✅ localStorage key updated
- ✅ Comprehensive new documentation
- ✅ Build verification: SUCCESS

**Phase 2.5.2: Lexical Editor Themes Reorganization (9 files affected)**
- ✅ Created `src/themes/lexicalEditor/` directory
- ✅ Renamed `PlaygroundEditorTheme` → `templateEditor.theme` (ts + css)
- ✅ Renamed `CommentEditorTheme` → `commentEditor.theme` (ts + css)
- ✅ Renamed `StickyEditorTheme` → `stickyNote.theme` (ts + css)
- ✅ Updated internal imports within theme files
- ✅ Updated imports in 2 consuming files (StickyComponent, CommentPlugin)
- ✅ Created barrel export (index.ts)
- ✅ Build verification: SUCCESS

**Phase 2.6: UI Components Reorganization (17 components + 12 CSS files)**
- ✅ Created domain-specific directories: primitives/, overlays/, pickers/, editors/, lexical/
- ✅ Moved 5 primitive components (Button, TextInput, Select, Switch, FileInput)
- ✅ Moved 4 overlay components (Modal, Dialog, DropDown, FlashMessage)
- ✅ Moved 2 picker components (ColorPicker, DropdownColorPicker)
- ✅ Moved 1 editor component (ContentEditable)
- ✅ Moved 5 Lexical components (ExcalidrawModal, EquationEditor, KatexEquationAlterer, KatexRenderer, ImageResizer)
- ✅ Created 5 barrel exports (one per domain)
- ✅ Updated 22 files with new import paths (batch updated with sed)
- ✅ Fixed cross-domain imports (ColorPicker, DropdownColorPicker, ExcalidrawModal)
- ✅ Build verification: SUCCESS

**Git Commits:**
- `1c7d843` - Phase 1 Reconciliation
- `ead86cc` - Canvas Tabs Refactor
- `3e05328` - Lexical Editor Themes Reorganization
- [pending] - UI Components Reorganization

---

## Naming Convention & Decision Matrices

### Hybrid Naming Convention (Current Standard)

**Components:** `TemplateEditor.tsx` (PascalCase, no suffix)
**Hooks:** `useTemplateRegistry.ts` (useCamelCase, no suffix)
**Services:** `templateRegistryService.ts` (camelCase + Service)
**Types:** `Template.ts` (PascalCase, no suffix)
**Directories:** `kebab-case/` (universal)
**CSS:** `kebab-case.css`

**Reference:** See `/docs/naming-quick-reference.md` for complete guidelines

---

## Decision Matrix Reference - CRITICAL FOR COMPONENT CREATION, REFACTORING, OR RENAMING

**You MUST use these decision matrices when creating or refactoring components. Each matrix addresses a specific decision point in your workflow.**

### 1. Component Placement Decision Matrix
**File**: `/docs/decision-roadmaps/component-placement.md`

**When to Use**: Every time you need to create or modify a component

**Use this matrix to answer**: "Where does this file go?"

**Decision Tree** (5 questions):
1. Is this tied to a URL route? → **PAGE** (`apps/[app-name]/pages/`)
2. Does this define structural slots? → **LAYOUT** (`core/ui/layouts/` or `apps/[app-name]/layouts/`)
3. Does this fill a layout slot with state-driven rendering? → **VIEW** (`core/ui/views/` or `apps/[app-name]/views/`)
4. Does this assemble multiple components? → **CONSTRUCT** (`core/ui/constructs/` or `apps/[app-name]/components/`)
5. Is this a single UI control? → **COMPONENT** (`core/ui/primitives/`)

**Critical Naming Rule**: ALWAYS use descriptive names (`TemplateEditor.tsx`, `TemplateSidebarView.tsx`), NEVER generic names (`Editor.tsx`, `Sidebar.tsx`). Pattern: `[Domain][Entity][Action/Type]`

**Examples in Matrix**: TemplateEditorPage, ThreeColumnLayout, TemplateSidebarView, InlineTagEditor, Button

---

### 2. Variant Component Handling Decision Matrix
**File**: `/docs/decision-roadmaps/variant-component-handling.md`

**When to Use**: When designing a component that needs variations (size, style, behavior)

**Use this matrix to answer**: "Should I use Props, Compound Components, or Presets?"

**Decision Tree**:
- 1-2 variant dimensions → **Pattern A (Props)** (`<Button size="md" variant="primary" />`)
- 3-4 dimensions + all combinations valid → **Pattern A (Props)**
- 3-4 dimensions + invalid combinations exist → **Pattern C (Presets)** (`<Modal preset={MODAL_PRESETS.dialog} />`)
- Variants have different props/behavior → **Pattern B (Compound)** (`<Button.Primary />`)
- Common combinations used 80%+ → **Pattern A + C (Hybrid)**

**Examples in Matrix**:
- Button (1-2 dimensions) → Props
- Modal (3-4 dimensions, common patterns) → Props + Presets
- TagEditor (different props per variant) → Compound Components

---

### 3. Cross-App Reuse Decision Matrix
**File**: `/docs/decision-roadmaps/cross-app-reuse.md`

**When to Use**: When deciding if a construct should be promoted to shared or kept app-specific

**Use this matrix to answer**: "Should this be in `core/ui/constructs/` (shared) or `apps/[app]/components/` (app-specific)?"

**Governance Rules**:
- **Rule 1 (PROMOTE)**: Required in another app OR user asks to evaluate existing constructs
- **Rule 2 (PROMOTE)**: Fulfills common use case/design pattern (Button, Modal, Form, TagEditor - always shared)
- **Rule 3 (DEMOTE)**: Modification breaks it AND no longer used elsewhere
- **Enhancement Rule (PROMOTE)**: Expanding functionality WITHOUT breaking original use case

**Auto-Promote List** (always build as shared):
- UI Primitives: Button, Input, Select, Checkbox, Badge, Tooltip
- Common Patterns: Modal, Dialog, Drawer, Dropdown, DataTable, FormDrawer, TagEditor
- **NEVER shared**: Domain-specific business logic (QuoteCalculator, PipelineKanban, PolicyEditor)

**Examples in Matrix**: InlineTagEditor (promote - common pattern), QuoteCalculator (keep app-specific - insurance domain logic), Modal with loading state (promote - non-breaking enhancement)

---

### 4. Construct Archive Review Matrix
**File**: `/docs/decision-roadmaps/construct-archive-review.md`

**When to Use**: When reviewing constructs in `xx-Archive-xx/` folder to determine deletion readiness (typically after 2 sprints/4 weeks)

**Use this matrix to answer**: "Should this archived construct be permanently deleted or needs further review?"

**Not typically used during component creation** - this is for maintenance/cleanup workflows only.

---

## How to Apply Decision Matrices in Your Workflow

### Step 1: Creating a New Component
1. **FIRST**: Use **Component Placement Matrix** (#1) to determine component type and location
2. **THEN**: Use **Cross-App Reuse Matrix** (#3) to decide if it should be shared or app-specific
3. **IF component has variations**: Use **Variant Component Handling Matrix** (#2) to choose the right pattern

### Step 2: Modifying Existing Component
1. **FIRST**: Use **Component Placement Matrix** (#1) to verify correct location
2. **IF making it more flexible**: Use **Variant Component Handling Matrix** (#2) to add variants correctly
3. **IF used in multiple apps**: Check **Cross-App Reuse Matrix** (#3) to ensure promotion criteria still met

### Step 3: Example Workflow

**Scenario**: Design a tag editor for the template metadata sidebar

**Apply Matrix #1** (Component Placement):
- Q1: Tied to URL route? NO
- Q2: Defines structural slots? NO
- Q3: Fills layout slot with state-driven rendering? NO
- Q4: Assembles multiple components? YES → **It's a CONSTRUCT**
- **Location**: `apps/template-editor/components/` (start app-specific) OR `core/ui/constructs/` (if common pattern)

**Apply Matrix #3** (Cross-App Reuse):
- Is tag editing a common pattern? YES (Rule 2)
- **Decision**: Build as shared in `core/ui/constructs/inline-tag-editor/`
- **Naming**: `InlineTagEditor.tsx` (descriptive, not `TagManager.tsx`)

**Apply Matrix #2** (Variant API):
- Needs variations: inline mode, panel mode, readonly mode
- Do variants have different props? YES (inline has `onBlur`, panel has `onSave`/`onCancel`, readonly has only `tags`)
- **Decision**: Pattern B (Compound Components)
- **API**: `<TagEditor.Inline />`, `<TagEditor.Panel />`, `<TagEditor.Readonly />`

---
---

## Phase 1 Reconciliation: Naming Convention Fix

**Status**: ✅ COMPLETED (2025-10-26)
**Git Commit**: `1c7d843`
**Build Status**: ✅ SUCCESS

### Summary of Required Changes

**Files to Rename**: 25 total
- 17 components: `.view.tsx` → `.tsx` (PascalCase)
- 3 services: `.service.ts` → `Service.ts` (camelCase)
- 5 types: `.model.ts` → `.ts` (PascalCase)

**Import Updates**: ~15-20 locations
- 6 imports in `App.tsx`
- 4+ barrel exports (`index.ts` files)
- 5-10 component/hook imports of services/types

### Step-by-Step Reconciliation Plan

#### **Phase 1.R1: Rename Editor Feature Components ✅ COMPLETED**

**Files to rename (3):**
```bash
git mv src/apps/TemplateEditor/features/editor/components/EditorCommandMenu.view.tsx \
       src/apps/TemplateEditor/features/editor/components/EditorCommandMenu.tsx

git mv src/apps/TemplateEditor/features/editor/components/TemplateEditor.view.tsx \
       src/apps/TemplateEditor/features/editor/components/TemplateEditor.tsx

git mv src/apps/TemplateEditor/features/editor/components/VariablePopover.view.tsx \
       src/apps/TemplateEditor/features/editor/components/VariablePopover.tsx
```

**Update imports in:**
- [x] `src/apps/TemplateEditor/features/editor/index.ts` (barrel export)
- [x] `src/App.tsx` (TemplateEditor import)

**Verify:**
- [x] `npm run build` succeeds

---

#### **Phase 1.R2: Rename Metadata Feature Components ✅ COMPLETED**

**Files to rename (6):**
```bash
# In src/apps/TemplateEditor/features/metadata/components/
git mv InlineTagEditor.view.tsx InlineTagEditor.tsx
git mv InlineTitleEditor.view.tsx InlineTitleEditor.tsx
git mv InlineVariableEditor.view.tsx InlineVariableEditor.tsx
git mv TemplateMetadataEditor.view.tsx TemplateMetadataEditor.tsx
git mv VariableList.view.tsx VariableList.tsx
git mv VariableManager.view.tsx VariableManager.tsx
```

**Update imports in:**
- [x] `src/apps/TemplateEditor/features/metadata/index.ts` (barrel export)
- [x] `src/App.tsx` (3 imports: TemplateMetadataEditor, InlineTagEditor, InlineVariableEditor)

**Verify:**
- [x] `npm run build` succeeds

---

#### **Phase 1.R3: Rename Preview Feature Components ✅ COMPLETED**

**Files to rename (2):**
```bash
# In src/apps/TemplateEditor/features/preview/components/
git mv ComposePreview.view.tsx ComposePreview.tsx
git mv TemplatePreview.view.tsx TemplatePreview.tsx
```

**Update imports in:**
- [x] `src/apps/TemplateEditor/features/preview/index.ts` (barrel export)

**Verify:**
- [x] `npm run build` succeeds

---

#### **Phase 1.R4: Rename Sidebar Feature Components ✅ COMPLETED**

**Files to rename (6):**
```bash
# In src/apps/TemplateEditor/features/sidebar/components/
git mv AdvancedFilters.view.tsx AdvancedFilters.tsx
git mv BackupRestorePanel.view.tsx BackupRestorePanel.tsx
git mv EnhancedTemplateSidebar.view.tsx EnhancedTemplateSidebar.tsx
git mv GlobalSearch.view.tsx GlobalSearch.tsx
git mv ModernTemplateSidebar.view.tsx ModernTemplateSidebar.tsx
git mv TagManager.view.tsx TagManager.tsx
```

**Update imports in:**
- [x] `src/apps/TemplateEditor/features/sidebar/index.ts` (barrel export)
- [x] `src/App.tsx` (2 imports: ModernTemplateSidebar, GlobalSearch)

**Verify:**
- [x] `npm run build` succeeds

---

#### **Phase 1.R5: Rename Shared Services ✅ COMPLETED**

**Files to rename (3):**
```bash
# In src/apps/_shared/template/services/
git mv templateBackup.service.ts templateBackupService.ts
git mv templateMigrations.service.ts templateMigrationsService.ts
git mv templateRegistry.service.ts templateRegistryService.ts
```

**Update imports in:**
- [x] `src/apps/_shared/template/services/index.ts` (barrel export)
- [x] `src/hooks/templateRegistry/useTemplateRegistry.ts` (if exists)
- [x] `src/apps/TemplateEditor/features/sidebar/components/BackupRestorePanel.tsx`
- [x] Any other components importing these services

**Verify:**
- [x] `npm run build` succeeds

---

#### **Phase 1.R6: Rename Shared Types ✅ COMPLETED**

**Files to rename (5):**
```bash
# In src/apps/_shared/template/types/
git mv editorState.model.ts EditorState.ts
git mv registry.model.ts Registry.ts
git mv tag.model.ts Tag.ts
git mv template.model.ts Template.ts
git mv variable.model.ts Variable.ts
```

**Update imports in:**
- [x] `src/apps/_shared/template/types/index.ts` (barrel export)
- [x] All components importing these types (search for `.model`)
- [x] All services importing these types

**Verify:**
- [x] `npm run build` succeeds

---

#### **Phase 1.R7: Final Verification ✅ COMPLETED**

- [x] No `.view.tsx` files remain in `src/apps/`
- [x] No `.service.ts` files remain in `src/apps/`
- [x] No `.model.ts` files remain in `src/apps/`
- [x] `npm run build` succeeds with 0 errors
- [x] `npm run dev` works
- [x] App loads in browser without errors
- [x] All features work as expected

---

### Rollback Plan

If any step breaks the build:

```bash
# Undo all changes since last commit
git restore .

# Or if you've already committed
git reset --hard HEAD~1
```

### After Successful Reconciliation ✅ COMPLETED

1. ✅ Marked all Phase 1.R steps as complete in this document
2. ✅ Committed changes (Git commit: `1c7d843`)
3. ✅ Updated Phase 1 steps to reflect correct naming
4. ✅ Continued with Phase 2.3 (Canvas Tabs refactor) using correct naming convention

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

### Step 2.3: Rename Canvas Tab Management System ✅ COMPLETED

**Status**: ✅ COMPLETED (2025-10-26)
**Git Commit**: `ead86cc`
**Build Status**: ✅ SUCCESS

Renamed `src/lib/tabs/` to `src/lib/canvasTabs/` with improved naming conventions.

**Rationale**:
- "tabs" is too generic and conflicts with "editor" terminology
- "canvas" clearly represents the workspace where users create/edit (templates, documents, designs)
- "canvasTabs" = navigation between multiple open canvases
- Inspired by VS Code's workbench architecture and design tools (Figma, Sketch)
- Avoids confusion: Canvas (workspace) vs Text Editor (Lexical component within canvas)

**Step 2.3.1: Create New Directory Structure** ✅
- [x] Create `src/lib/canvasTabs/` directory
- [x] Create `src/lib/canvasTabs/core/` directory
- [x] Create `src/lib/canvasTabs/integrations/` directory
- [x] Create `src/lib/canvasTabs/integrations/lexical/` directory

**Step 2.3.2: Copy and Rename Core Files** ✅
- [x] `src/lib/tabs/core/useTabManager.ts` → `src/lib/canvasTabs/core/useCanvasTabsManager.ts`
  - [x] Rename function: `useTabManager` → `useCanvasTabsManager`
  - [x] Update internal variable names (tabs → canvasTabs where contextually appropriate)
- [x] `src/lib/tabs/core/TabBar.tsx` → `src/lib/canvasTabs/core/CanvasTabsControl.tsx`
  - [x] Rename component: `TabBar` → `CanvasTabsControl`
  - [x] Update interface: `TabBarProps` → `CanvasTabsControlProps`
  - [x] Update CSS class names: `tab-bar` → `canvas-tabs-control`
- [x] `src/lib/tabs/core/types.ts` → `src/lib/canvasTabs/core/types.ts`
  - [x] Rename interface: `TabItem` → `CanvasTabItem`
  - [x] Rename interface: `TabsState` → `CanvasTabsState`
  - [x] Rename interface: `UseTabManagerOptions` → `UseCanvasTabsManagerOptions`
  - [x] Rename interface: `TabManagerReturn` → `CanvasTabsManagerReturn`
- [x] `src/lib/tabs/core/index.ts` → `src/lib/canvasTabs/core/index.ts`
  - [x] Update all export names to new naming convention

**Step 2.3.3: Copy and Rename Lexical Integration Files** ✅
- [x] `src/lib/tabs/integrations/lexical/useLexicalDirtyState.ts` → `src/lib/canvasTabs/integrations/lexical/useLexicalDirtyState.ts`
  - [x] No renaming needed (remains lexical-specific)
- [x] `src/lib/tabs/integrations/lexical/DirtyStatePlugin.tsx` → `src/lib/canvasTabs/integrations/lexical/DirtyStatePlugin.tsx`
  - [x] No renaming needed (remains lexical-specific)
- [x] `src/lib/tabs/integrations/lexical/useTemplateEditorTabs.ts` → `src/lib/canvasTabs/integrations/lexical/useTemplateCanvasTabs.ts`
  - [x] Rename function: `useTemplateEditorTabs` → `useTemplateCanvasTabs`
  - [x] Rename interface: `UseTemplateEditorTabsReturn` → `UseTemplateCanvasTabsReturn`
  - [x] Update localStorage key: `insurance_template_editor_tabs` → `insurance_template_canvas_tabs`
- [x] `src/lib/tabs/integrations/lexical/TemplateEditorTabs.tsx` → `src/lib/canvasTabs/integrations/lexical/TemplateCanvasTabsControl.tsx`
  - [x] Rename component: `TemplateEditorTabs` → `TemplateCanvasTabsControl`
  - [x] Rename interface: `TemplateEditorTabsProps` → `TemplateCanvasTabsControlProps`
- [x] `src/lib/tabs/integrations/lexical/index.ts` → `src/lib/canvasTabs/integrations/lexical/index.ts`
  - [x] Update all export names

**Step 2.3.4: Copy Top-Level Files** ✅
- [x] `src/lib/tabs/integrations/index.ts` → `src/lib/canvasTabs/integrations/index.ts`
- [x] `src/lib/tabs/index.ts` → `src/lib/canvasTabs/index.ts`
- [x] `src/lib/tabs/CLAUDE.md` → `src/lib/canvasTabs/CANVAS_TABS.md`
  - [x] Update all documentation to use new terminology
  - [x] Update title: "Tab Management System" → "Canvas Tab Management System"
  - [x] Update all code examples with new import paths
  - [x] Update all references: "tab" → "canvas tab" where contextually appropriate

**Step 2.3.5: Update All Imports Across Codebase** ✅
- [x] Update `src/App.tsx`:
  - [x] Change: `import { TemplateEditorTabs, useTemplateEditorTabs } from '@/lib/tabs/integrations/lexical'`
  - [x] To: `import { TemplateCanvasTabsControl, useTemplateCanvasTabs } from '@/lib/canvasTabs/integrations/lexical'`
  - [x] Update variable names: `useTemplateEditorTabs()` → `useTemplateCanvasTabs()`
  - [x] Update JSX: `<TemplateEditorTabs ... />` → `<TemplateCanvasTabsControl ... />`
- [x] Update `src/apps/TemplateEditor/features/editor/components/TemplateEditor.tsx`:
  - [x] Update any imports from `@/lib/tabs`
- [x] Update `src/components/TemplateEditor.tsx`:
  - [x] Update any imports from `@/lib/tabs`
- [x] Update root `CLAUDE.md`:
  - [x] Update Tab Management System section with new paths and naming
  - [x] Update code examples
- [x] Update `tsconfig.json` path aliases (if needed):
  - [x] Verify `@/lib/canvasTabs` resolves correctly

**Step 2.3.6: Verification** ✅
- [x] Run `npm run build` - zero errors
- [x] Run `npm run dev` - verify app loads
- [x] Test all canvas tab functionality:
  - [x] Open multiple templates (canvas tabs)
  - [x] Switch between canvas tabs
  - [x] Close canvas tabs
  - [x] Drag-and-drop reorder canvas tabs
  - [x] Right-click context menu
  - [x] Dirty state indicators (unsaved changes)
  - [x] localStorage persistence (reload page)
  - [x] Confirmation dialog when closing dirty canvas
- [x] Verify keyboard shortcuts work (Cmd/Ctrl+W, Cmd/Ctrl+Tab)
- [x] Check browser localStorage for new key: `insurance_template_canvas_tabs`

**Step 2.3.7: Document New Terminology** ✅
- [x] Add terminology section to `CANVAS_TABS.md`:
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

**Step 2.5.2: Reorganize Lexical Editor Themes** ✅ COMPLETED (2025-10-27)
- [x] Create `src/themes/lexicalEditor/` - Lexical-specific theme directory
- [x] Rename `PlaygroundEditorTheme.ts` → `src/themes/lexicalEditor/templateEditor.theme.ts`
- [x] Rename `PlaygroundEditorTheme.css` → `src/themes/lexicalEditor/templateEditor.theme.css`
- [x] Rename `CommentEditorTheme.ts` → `src/themes/lexicalEditor/commentEditor.theme.ts`
- [x] Rename `CommentEditorTheme.css` → `src/themes/lexicalEditor/commentEditor.theme.css`
- [x] Rename `StickyEditorTheme.ts` → `src/themes/lexicalEditor/stickyNote.theme.ts`
- [x] Rename `StickyEditorTheme.css` → `src/themes/lexicalEditor/stickyNote.theme.css`
- [x] Update internal imports in theme files (PlaygroundEditorTheme → templateEditor.theme)
- [x] Update all imports in components that use these themes (2 files: StickyComponent.tsx, CommentPlugin/index.tsx)
- [x] Create `src/themes/lexicalEditor/index.ts` barrel export

**Note:** CSS class names were NOT changed (still use PlaygroundEditorTheme__, CommentEditorTheme__, StickyEditorTheme__ prefixes) to avoid breaking existing CSS styles. This is acceptable as the CSS files are properly renamed and the class names are implementation details.

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
