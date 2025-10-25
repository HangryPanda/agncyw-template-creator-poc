# File System Reorganization Progress Tracker

**Started**: 2025-01-24
**Last Updated**: 2025-01-24
**Status**: Phase 1 Complete ✓ - App Using New Structure
**Current Phase**: Ready for Phase 2 or cleanup old files

---

## Summary

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

### Step 2.1: Reorganize Components
- [ ] Create `src/components/primitives/`
- [ ] Create `src/components/workspace/`
- [ ] Move `FormWrapper.tsx` → `src/components/primitives/FormWrapper.view.tsx`
- [ ] Move `ResponsiveDrawer.tsx` → `src/components/primitives/ResponsiveDrawer.view.tsx`
- [ ] Move `CharacterCounter.tsx` → `src/components/primitives/CharacterCounter.view.tsx`
- [ ] Create barrel exports for each bucket

### Step 2.2: Organize Hooks by Domain
We need to rethink our strategy here. I feel these are too generic. They should be specific to our application so we know exactly what they are for. Also each application contains their own hooks
- [ ] Create `src/hooks/data/`
- [ ] Create `src/hooks/ui/`
- [ ] Create `src/hooks/platform/`
- [ ] Move `useTemplateRegistry.ts` → `src/hooks/data/useTemplateRegistry.ts`
- [ ] Move `useTemplateValues.ts` → `src/hooks/data/useTemplateValues.ts`
- [ ] Move `useModal.tsx` → `src/hooks/ui/useModal.tsx`
- [ ] Move `useFlashMessage.tsx` → `src/hooks/ui/useFlashMessage.tsx`
- [ ] Move `useReport.ts` → `src/hooks/platform/useReport.ts`
- [ ] Create barrel exports

### Step 2.3: Organize Assets
- [ ] Create `src/assets/TemplateEditor/`
- [ ] Move app-specific assets if any

### Step 2.4: Verification
- [ ] Run `npm run build`
- [ ] Run `npm run dev`
- [ ] Test shared components work

---

## Phase 3: Backend Structure ⏸️ PENDING
I would like to discuss the naming convention used here. We have backend web db servers (not in this repo, but we do have them in our parent repo) and localStorage backend localStorage so we need to rethink our naming conventions here. 
### Step 3.1: Create Backend Directory Structure
- [ ] Create `backend/app/Http/Controllers/Api/Templates/`
- [ ] Create `backend/app/Services/Templates/`
- [ ] Create `backend/app/Models/`
- [ ] Create `backend/app/Http/Requests/Templates/`
- [ ] Create `backend/database/migrations/templates/`
- [ ] Create `backend/database/seeders/templates/`
- [ ] Create `backend/routes/api/`
- [ ] Create `backend/tests/Feature/Templates/`
- [ ] Create `backend/tests/Unit/Services/Templates/`
- [ ] Create `backend/config/`

### Step 3.2: Create Placeholder PHP Files
- [ ] `backend/app/Http/Controllers/Api/Templates/TemplateController.php`
- [ ] `backend/app/Services/Templates/TemplateService.php`
- [ ] `backend/app/Models/Template.php`
- [ ] `backend/routes/api/templates.php`
- [ ] Create README explaining backend is placeholder

### Step 3.3: Verification
- [ ] Verify directory structure matches plan
- [ ] Ensure backend README is clear

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
