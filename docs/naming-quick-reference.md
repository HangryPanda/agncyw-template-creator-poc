# Naming Conventions Quick Reference

## Frontend (React/TypeScript)

### Directory Names
**Rule:** Always `kebab-case`

```
✅ inline-tag-editor/
✅ template-registry/
✅ local-storage/
❌ InlineTagEditor/
❌ templateRegistry/
```

### File Names by Type

| Type | Pattern | Example | Export |
|------|---------|---------|--------|
| **Component** | `PascalCase.tsx` | `Button.tsx`<br>`InlineTagEditor.tsx` | `export function Button()` |
| **Hook** | `useCamelCase.ts` | `useTemplateRegistry.ts`<br>`useModal.ts` | `export function useTemplateRegistry()` |
| **Service** | `camelCaseService.ts` | `localStorageService.ts`⚠️<br>`apiService.ts`🔐 | `export class LocalStorageService` |
| **Type** | `types.ts` or `PascalCase.ts` | `types.ts`<br>`Template.ts` | `export interface Template` |
| **Utility** | `camelCase.ts` | `formatDate.ts`<br>`colorSystem.ts` | `export function formatDate()` |
| **CSS** | `kebab-case.css` | `button.css`<br>`inline-tag-editor.vars.css` | N/A |
| **Config** | `camelCase.ts` | `templateEditor.theme.ts` | `export const theme = {}` |

---

## Backend (Laravel/PHP)

### Directory Names
**Rule:** Always `kebab-case`

```
✅ coverage-snapshot/
✅ db-storage/
✅ boat-quote/
❌ CoverageSnapshot/
❌ dbStorage/
```

### File Names
**Rule:** `kebab-case.php` (files) + `PascalCase` (classes inside)

| Type | File Name | Class Name | Example |
|------|-----------|------------|---------|
| **Model** | `kebab-case.model.php` | `PascalCase` | `coverage-snapshot.model.php`<br>`class CoverageSnapshot extends Model` |
| **Controller** | `kebab-case.controller.php` | `PascalCase` | `coverage-snapshot.controller.php`<br>`class CoverageSnapshotController` |
| **Service** | `kebab-case.service.php` | `PascalCase` | `db-storage.service.php`<br>`class DbStorageService` |
| **Repository** | `kebab-case.repository.php` | `PascalCase` | `coverage-snapshot.repository.php`<br>`class CoverageSnapshotRepository` |

---

## Side-by-Side Comparison

### Frontend Feature Structure
```
features/coverage-snapshot/           # kebab-case dir
├── components/
│   ├── CoverageSnapshot.tsx          # PascalCase component
│   └── CoverageSnapshotForm.tsx      # PascalCase component
├── hooks/
│   └── useCoverageSnapshot.ts        # useCamelCase hook
├── services/
│   ├── localStorageService.ts        # ⚠️ camelCase + Service
│   ├── apiService.ts                 # 🔐 camelCase + Service
│   └── stateService.ts               # camelCase + Service
└── types.ts                          # types file
```

### Backend Domain Structure
```
Domains/coverage-snapshot/            # kebab-case dir
├── Models/
│   └── coverage-snapshot.model.php   # kebab-case file
│       // class CoverageSnapshot     # PascalCase class
├── Controllers/
│   └── coverage-snapshot.controller.php
│       // class CoverageSnapshotController
├── Services/
│   ├── coverage-snapshot.service.php
│   └── coverage-snapshot-db.service.php
└── Routes/
    └── coverage-snapshot.routes.php
```

---

## Common Patterns

### ✅ Correct Examples

```typescript
// Frontend
import { Button } from '@/core/ui/primitives/button/Button'
import { InlineTagEditor } from '@/core/ui/constructs/inline-tag-editor/InlineTagEditor'
import { useTemplateRegistry } from '@/hooks/template-registry/useTemplateRegistry'
import { localStorageService } from '@/features/coverage-snapshot/services/localStorageService'
```

```php
// Backend
use App\Domains\CoverageSnapshot\Models\CoverageSnapshot;
use App\Domains\CoverageSnapshot\Controllers\CoverageSnapshotController;
use App\Shared\DbStorage\DbStorageService;
```

### ❌ Common Mistakes

```typescript
// ❌ Wrong: kebab-case component
import { button } from '@/core/ui/primitives/button/button.component'

// ❌ Wrong: PascalCase hook
import { UseTemplateRegistry } from '@/hooks/UseTemplateRegistry'

// ❌ Wrong: Ambiguous service naming
import { storage } from '@/features/coverage-snapshot/storage'

// ❌ Wrong: PascalCase directory
import { Button } from '@/core/ui/primitives/Button/Button'
```

---

## Compliance-Critical: Service Naming

### Why Explicit Service Names Matter

**Regulated industries (insurance, healthcare, banking) require crystal-clear storage boundaries:**

```typescript
// ❌ DANGEROUS - Ambiguous
import { storage } from './storage'           // Which storage?
import { api } from './api'                   // What kind of API?

// ✅ SAFE - Explicit
import { localStorageService } from './localStorageService'  // ⚠️ Browser, NO PII
import { apiService } from './apiService'                    // 🔐 Server, PII allowed
import { stateService } from './stateService'                // React state
```

**Compliance Rule:** All storage services MUST have JSDoc warnings:

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
```

---

## Migration Checklist

When refactoring existing code:

### Frontend
- [ ] Rename component directories to `kebab-case`
- [ ] Rename component files to `PascalCase.tsx` (no `.component.tsx` suffix)
- [ ] Rename hooks to `useCamelCase.ts` (no `.hook.ts` suffix)
- [ ] Rename services to `camelCaseService.ts` (explicit naming)
- [ ] Rename CSS files to `kebab-case.css`
- [ ] Update all import statements
- [ ] Add compliance warnings to storage services

### Backend
- [ ] Ensure directories are `kebab-case`
- [ ] Ensure PHP files are `kebab-case.type.php`
- [ ] Ensure classes inside files are `PascalCase`
- [ ] Update namespace imports

---

## Summary

**Frontend Philosophy:** Match export names, use language conventions
- Components → `PascalCase.tsx`
- Hooks → `useCamelCase.ts`
- Services → `camelCaseService.ts` (verbose for safety)
- Directories → `kebab-case/`

**Backend Philosophy:** Separate file naming from class naming
- Files → `kebab-case.type.php`
- Classes → `PascalCase`
- Directories → `kebab-case/`

**Universal:** All directories use `kebab-case` across both frontend and backend.
