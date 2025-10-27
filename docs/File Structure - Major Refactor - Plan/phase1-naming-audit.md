# Phase 1 Naming Convention Audit

**Date**: 2025-01-25
**Purpose**: Document all Phase 1 files that need renaming to match hybrid naming convention

---

## Files Requiring Renaming

### **Components (17 files): `.view.tsx` → `.tsx`**

#### Editor Feature (3 files)
```
OLD: src/apps/TemplateEditor/features/editor/components/EditorCommandMenu.view.tsx
NEW: src/apps/TemplateEditor/features/editor/components/EditorCommandMenu.tsx

OLD: src/apps/TemplateEditor/features/editor/components/TemplateEditor.view.tsx
NEW: src/apps/TemplateEditor/features/editor/components/TemplateEditor.tsx

OLD: src/apps/TemplateEditor/features/editor/components/VariablePopover.view.tsx
NEW: src/apps/TemplateEditor/features/editor/components/VariablePopover.tsx
```

#### Metadata Feature (6 files)
```
OLD: src/apps/TemplateEditor/features/metadata/components/InlineTagEditor.view.tsx
NEW: src/apps/TemplateEditor/features/metadata/components/InlineTagEditor.tsx

OLD: src/apps/TemplateEditor/features/metadata/components/InlineTitleEditor.view.tsx
NEW: src/apps/TemplateEditor/features/metadata/components/InlineTitleEditor.tsx

OLD: src/apps/TemplateEditor/features/metadata/components/InlineVariableEditor.view.tsx
NEW: src/apps/TemplateEditor/features/metadata/components/InlineVariableEditor.tsx

OLD: src/apps/TemplateEditor/features/metadata/components/TemplateMetadataEditor.view.tsx
NEW: src/apps/TemplateEditor/features/metadata/components/TemplateMetadataEditor.tsx

OLD: src/apps/TemplateEditor/features/metadata/components/VariableList.view.tsx
NEW: src/apps/TemplateEditor/features/metadata/components/VariableList.tsx

OLD: src/apps/TemplateEditor/features/metadata/components/VariableManager.view.tsx
NEW: src/apps/TemplateEditor/features/metadata/components/VariableManager.tsx
```

#### Preview Feature (2 files)
```
OLD: src/apps/TemplateEditor/features/preview/components/ComposePreview.view.tsx
NEW: src/apps/TemplateEditor/features/preview/components/ComposePreview.tsx

OLD: src/apps/TemplateEditor/features/preview/components/TemplatePreview.view.tsx
NEW: src/apps/TemplateEditor/features/preview/components/TemplatePreview.tsx
```

#### Sidebar Feature (6 files)
```
OLD: src/apps/TemplateEditor/features/sidebar/components/AdvancedFilters.view.tsx
NEW: src/apps/TemplateEditor/features/sidebar/components/AdvancedFilters.tsx

OLD: src/apps/TemplateEditor/features/sidebar/components/BackupRestorePanel.view.tsx
NEW: src/apps/TemplateEditor/features/sidebar/components/BackupRestorePanel.tsx

OLD: src/apps/TemplateEditor/features/sidebar/components/EnhancedTemplateSidebar.view.tsx
NEW: src/apps/TemplateEditor/features/sidebar/components/EnhancedTemplateSidebar.tsx

OLD: src/apps/TemplateEditor/features/sidebar/components/GlobalSearch.view.tsx
NEW: src/apps/TemplateEditor/features/sidebar/components/GlobalSearch.tsx

OLD: src/apps/TemplateEditor/features/sidebar/components/ModernTemplateSidebar.view.tsx
NEW: src/apps/TemplateEditor/features/sidebar/components/ModernTemplateSidebar.tsx

OLD: src/apps/TemplateEditor/features/sidebar/components/TagManager.view.tsx
NEW: src/apps/TemplateEditor/features/sidebar/components/TagManager.tsx
```

---

### **Services (3 files): `.service.ts` → `Service.ts` (camelCase)**

```
OLD: src/apps/_shared/template/services/templateBackup.service.ts
NEW: src/apps/_shared/template/services/templateBackupService.ts

OLD: src/apps/_shared/template/services/templateMigrations.service.ts
NEW: src/apps/_shared/template/services/templateMigrationsService.ts

OLD: src/apps/_shared/template/services/templateRegistry.service.ts
NEW: src/apps/_shared/template/services/templateRegistryService.ts
```

---

### **Types (5 files): `.model.ts` → `.ts`**

```
OLD: src/apps/_shared/template/types/editorState.model.ts
NEW: src/apps/_shared/template/types/EditorState.ts

OLD: src/apps/_shared/template/types/registry.model.ts
NEW: src/apps/_shared/template/types/Registry.ts

OLD: src/apps/_shared/template/types/tag.model.ts
NEW: src/apps/_shared/template/types/Tag.ts

OLD: src/apps/_shared/template/types/template.model.ts
NEW: src/apps/_shared/template/types/Template.ts

OLD: src/apps/_shared/template/types/variable.model.ts
NEW: src/apps/_shared/template/types/Variable.ts
```

---

## Import Updates Required

### **App.tsx (6 imports)**

```typescript
// OLD
import TemplateEditor from './apps/TemplateEditor/features/editor/components/TemplateEditor.view';
import ModernTemplateSidebar from './apps/TemplateEditor/features/sidebar/components/ModernTemplateSidebar.view';
import TemplateMetadataEditor from './apps/TemplateEditor/features/metadata/components/TemplateMetadataEditor.view';
import GlobalSearch from './apps/TemplateEditor/features/sidebar/components/GlobalSearch.view';
import InlineTagEditor from './apps/TemplateEditor/features/metadata/components/InlineTagEditor.view';
import InlineVariableEditor from './apps/TemplateEditor/features/metadata/components/InlineVariableEditor.view';

// NEW
import TemplateEditor from './apps/TemplateEditor/features/editor/components/TemplateEditor';
import ModernTemplateSidebar from './apps/TemplateEditor/features/sidebar/components/ModernTemplateSidebar';
import TemplateMetadataEditor from './apps/TemplateEditor/features/metadata/components/TemplateMetadataEditor';
import GlobalSearch from './apps/TemplateEditor/features/sidebar/components/GlobalSearch';
import InlineTagEditor from './apps/TemplateEditor/features/metadata/components/InlineTagEditor';
import InlineVariableEditor from './apps/TemplateEditor/features/metadata/components/InlineVariableEditor';
```

### **Barrel Export Files (4+ files)**

These barrel exports (`index.ts`) will need updates:
- `src/apps/TemplateEditor/features/editor/index.ts`
- `src/apps/TemplateEditor/features/metadata/index.ts`
- `src/apps/TemplateEditor/features/preview/index.ts`
- `src/apps/TemplateEditor/features/sidebar/index.ts`
- `src/apps/_shared/template/services/index.ts`
- `src/apps/_shared/template/types/index.ts`

---

## Files That Import Services/Types

Need to check for imports of:
- `templateRegistry.service` → `templateRegistryService`
- `templateBackup.service` → `templateBackupService`
- `templateMigrations.service` → `templateMigrationsService`
- Any `.model` type imports → Remove `.model`

Likely locations:
- Components in `features/sidebar/components/BackupRestorePanel.tsx`
- Any hooks in `src/hooks/`
- Any feature-specific services

---

## Renaming Strategy

### **Safest Approach:**

1. **Rename files one feature at a time**
   - Start with editor/ (3 files)
   - Then metadata/ (6 files)
   - Then preview/ (2 files)
   - Then sidebar/ (6 files)
   - Then services/ (3 files)
   - Finally types/ (5 files)

2. **After each feature rename:**
   - Update imports in barrel exports
   - Update imports in App.tsx (if applicable)
   - Test with `npm run build`

3. **Use git to track changes:**
   ```bash
   git mv old-file.view.tsx new-file.tsx
   # This preserves git history better than delete+create
   ```

### **Faster Approach (Higher Risk):**

1. Rename all files at once using script
2. Update all imports using find/replace
3. Test build
4. Fix any missed imports

---

## Verification Checklist

After renaming, verify:

- [ ] All `.view.tsx` files renamed to `.tsx`
- [ ] All `.service.ts` files renamed to `Service.ts` (camelCase)
- [ ] All `.model.ts` files renamed to `.ts` (PascalCase)
- [ ] App.tsx imports updated (no `.view` extensions)
- [ ] All barrel exports (`index.ts`) updated
- [ ] No broken imports in any file
- [ ] `npm run build` succeeds
- [ ] `npm run dev` works
- [ ] App loads in browser without errors

---

## Rollback Plan

If anything breaks:

```bash
# Discard all changes and return to last commit
git restore .

# Or if you've committed but need to undo
git reset --hard HEAD~1
```

---

## Summary

**Total files to rename:** 25
- 17 components (`.view.tsx` → `.tsx`)
- 3 services (`.service.ts` → `Service.ts`)
- 5 types (`.model.ts` → `.ts`)

**Total import updates needed:** ~15-20 locations
- 6 in App.tsx
- 4+ in barrel exports
- 5-10 in components/hooks that import services/types
