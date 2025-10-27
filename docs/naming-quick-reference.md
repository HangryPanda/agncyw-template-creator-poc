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
| **Component** | `PascalCase.tsx` | `InlineTagEditor.tsx`<br>`LexicalButton.tsx`* | `export function InlineTagEditor()` |
| **Hook** | `useCamelCase.ts` | `useTemplateRegistry.ts`<br>`useModal.ts` | `export function useTemplateRegistry()` |
| **Service** | `camelCaseService.ts` | `localStorageService.ts`⚠️<br>`apiService.ts`🔐 | `export class LocalStorageService` |
| **Type** | `types.ts` or `PascalCase.ts` | `types.ts`<br>`Template.ts` | `export interface Template` |
| **Utility** | `camelCase.ts` | `formatDate.ts`<br>`colorSystem.ts` | `export function formatDate()` |
| **CSS** | `kebab-case.css` | `lexical-button.css`<br>`inline-tag-editor.vars.css` | N/A |
| **Config** | `camelCase.ts` | `templateEditor.theme.ts` | `export const theme = {}` |

**\*CRITICAL RULE - Domain-Specific Generic Names:**
Generic component names (Button, Modal, Select, Input, etc.) in domain-specific folders **MUST** include domain prefix.

---

## CRITICAL: Domain-Specific Generic Names Rule

### The Problem
Generic component names like `Button`, `Modal`, `Select`, etc. don't convey ownership or purpose when placed in domain-specific folders.

**Bad Example:**
```
src/components/lexical/primitives/Button.tsx       ← Which Button?
src/components/ui/primitives/shadcn/Button.tsx     ← Naming conflict!
```

### The Solution: `[Domain][Component]` Pattern

**Rule:** When a generic name exists in a domain-specific folder, **ALWAYS** prefix with domain name.

✅ **Correct Pattern:**
```typescript
// Lexical editor components
src/components/lexical/primitives/LexicalButton.tsx
src/components/lexical/primitives/LexicalTextInput.tsx
src/components/lexical/overlays/LexicalModal.tsx
src/components/lexical/overlays/LexicalDialog.tsx

// Usage
import { LexicalButton } from '@/components/lexical/primitives/LexicalButton';
```

❌ **Anti-Pattern:**
```typescript
// ❌ TOO GENERIC - unclear ownership
src/components/lexical/primitives/Button.tsx
src/components/lexical/overlays/Modal.tsx

// ❌ Causes confusion
import { Button } from '@/components/lexical/primitives/Button';  // Which Button system?
```

### When to Apply This Rule

**Apply domain prefix when:**
- ✅ Component has a generic/common name (Button, Input, Modal, Select, Switch, Card, etc.)
- ✅ Component lives in a domain-specific folder (`lexical/`, `payment/`, `auth/`, etc.)
- ✅ Multiple versions of the same component type exist (Lexical Button vs shadcn Button)

**Skip domain prefix when:**
- ✅ Component name is already descriptive (`TemplateEditor`, `InlineTagEditor`)
- ✅ Component name is inherently domain-specific (`ExcalidrawModal`, `KatexRenderer`)
- ✅ Component uses compound descriptive name (`DropdownColorPicker`, `VariableInsertionPopover`)

### Real-World Example: Lexical Components Rename

**Before (Incorrect):**
```
src/components/lexical/
├── primitives/
│   ├── Button.tsx          ❌ Generic name
│   ├── TextInput.tsx       ❌ Generic name
│   └── Select.tsx          ❌ Generic name
└── overlays/
    ├── Modal.tsx           ❌ Generic name
    └── Dialog.tsx          ❌ Generic name
```

**After (Correct):**
```
src/components/lexical/
├── primitives/
│   ├── LexicalButton.tsx        ✅ Domain-prefixed
│   ├── LexicalTextInput.tsx     ✅ Domain-prefixed
│   └── LexicalSelect.tsx        ✅ Domain-prefixed
└── overlays/
    ├── LexicalModal.tsx         ✅ Domain-prefixed
    └── LexicalDialog.tsx        ✅ Domain-prefixed
```

### Namespace Alternative (shadcn/ui Example)

Instead of prefixing every component, you can use directory-based namespacing:

```
src/components/ui/
├── primitives/
│   └── shadcn/              ← Namespace directory
│       ├── Button.tsx       ✅ OK because namespaced
│       └── Input.tsx        ✅ OK because namespaced
└── overlays/
    └── shadcn/              ← Namespace directory
        └── Dialog.tsx       ✅ OK because namespaced
```

**Usage:**
```typescript
import { Button } from '@/components/ui/primitives/shadcn/Button';  // Clear path shows it's shadcn
```

Both approaches are valid. Choose based on:
- **Prefix approach**: Better for editor autocomplete, clear at import site
- **Namespace directory**: Better for grouping many library components together

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
// Frontend - Domain-prefixed generic names
import { LexicalButton } from '@/components/lexical/primitives/LexicalButton'
import { LexicalModal } from '@/components/lexical/overlays/LexicalModal'

// Frontend - Descriptive names (no prefix needed)
import { InlineTagEditor } from '@/core/ui/constructs/inline-tag-editor/InlineTagEditor'
import { TemplateEditor } from '@/apps/TemplateEditor/components/TemplateEditor'

// Frontend - Hooks and services
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
// ❌ Wrong: Generic name without domain prefix
import { Button } from '@/components/lexical/primitives/Button'
import { Modal } from '@/components/lexical/overlays/Modal'

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
