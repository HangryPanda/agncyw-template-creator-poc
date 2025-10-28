# Cross-App Reuse Decision Matrix

> **Purpose**: Governance rules for construct promotion/demotion between app-specific and shared locations
> **Audience**: AI assistants, developers, design system maintainers
> **Last Updated**: 2025-01-26
> **Status**: Approved - Governance Rules 1-3

---

## Executive Summary

This document defines the **governance rules** for when to promote constructs to shared (`core/ui/constructs/`) versus keep them app-specific (`apps/[app-name]/components/`). It provides decision flowcharts, practical examples, and auto-promote lists to eliminate ambiguity.

**Key Insight:** Default to app-specific, promote when needed. Promotion is based on proven need, not speculation.

---

## Approved Governance Rules

### Rule 1: Promotion Criteria - Explicit Instruction or Multi-App Need

**Promote when:**
- ✅ Required in another application
- ✅ User explicitly requests promotion
- ✅ User asks to evaluate existing constructs and find reusable patterns

**Examples:**
- "The CRM app needs tag editing" → Promote InlineTagEditor
- "Promote the Modal to shared" → Explicit instruction
- "Check if CRM has anything we can reuse" → Evaluate and promote matches

---

### Rule 2: Promotion Criteria - Common Use Cases

**Promote when:**
- ✅ Construct fulfills a common use case or design pattern
- ✅ **Shared by default** if it's a universal pattern

**Examples:**
- Button, Input, Select → Always shared (UI primitives)
- Modal, Drawer, Dialog → Always shared (common patterns)
- TagEditor, FormDrawer → Always shared (common patterns)

**Anti-Examples:**
- QuoteCalculator → App-specific (insurance domain logic)
- PipelineKanban → App-specific (CRM domain logic)

---

### Rule 3: Demotion Criteria - Breaking Changes

**Demote when:**
- ❌ Modification breaks the construct
- ❌ No longer used in another application

**Process:**
1. Move from `core/ui/constructs/` to `apps/[app-name]/components/`
2. Update imports
3. Document reason in `FORK_REASON.md`

---

### Enhancement Rule: Non-Breaking Expansion

**Promote when:**
- ✅ Modifying construct to enhance/expand functionality
- ✅ WITHOUT breaking original use case

**Example:**
```tsx
// Before
interface ModalProps {
  children: React.ReactNode
}

// After (non-breaking enhancement)
interface ModalProps {
  children: React.ReactNode
  isLoading?: boolean  // Optional with safe default
}
```

**Outcome:** Keep or promote to shared (safe enhancement)

---

## Decision Matrix

| Scenario | Action | Rule Applied | Reasoning |
|----------|--------|--------------|-----------|
| **Component required in 2+ apps** | ✅ PROMOTE to shared | Rule 1 | Multi-app need proven |
| **User explicitly requests promotion** | ✅ PROMOTE to shared | Rule 1 | Explicit instruction |
| **User asks to find reusable constructs** | ✅ EVALUATE & PROMOTE matches | Rule 1 | Evaluating existing constructs |
| **Construct fulfills common pattern** (Button, Modal, Form inputs) | ✅ PROMOTE to shared | Rule 2 | Universal design pattern |
| **Construct is domain-specific** (QuoteCalculator, PipelineKanban) | ❌ KEEP app-specific | N/A | Business logic, not reusable |
| **Modification enhances WITHOUT breaking** | ✅ PROMOTE to shared | Enhancement Rule | Safe to share, more powerful |
| **Modification breaks original use case** | ❌ DEMOTE to app-specific | Rule 3 | Breaking change = not shared |
| **Construct breaks AND still used elsewhere** | 🔄 FORK or FIX | Rule 3 (inverse) | Coordination required |
| **One-off prototype or spike** | ❌ KEEP app-specific | N/A | Not proven useful yet |

---

## Practical Examples

### Example 1: InlineTagEditor

**Scenario:** Template Editor app has InlineTagEditor. CRM app needs tag editing.

**Evaluation:**
- Is it required in another app? ✅ YES (CRM app needs it)
- Does it fulfill a common pattern? ✅ YES (tag management is universal)

**Decision:** ✅ PROMOTE to `core/ui/constructs/inline-tag-editor/`

**Rules Applied:** Rule 1 (multi-app need) + Rule 2 (common pattern)

**Migration Steps:**
```bash
# 1. Move files
mv apps/template-editor/components/InlineTagEditor/ core/ui/constructs/inline-tag-editor/

# 2. Update imports in Template Editor app
# apps/template-editor/views/TemplateSidebarView.tsx
- import { InlineTagEditor } from '@/apps/template-editor/components/InlineTagEditor'
+ import { InlineTagEditor } from '@/core/ui/constructs/inline-tag-editor'

# 3. Use in CRM app
# apps/crm/views/ContactDetailsView.tsx
+ import { InlineTagEditor } from '@/core/ui/constructs/inline-tag-editor'
```

---

### Example 2: QuoteCalculator

**Scenario:** Insurance app has QuoteCalculator. CRM app doesn't need it.

**Evaluation:**
- Is it required in another app? ❌ NO
- Does it fulfill a common pattern? ❌ NO (insurance-specific business logic)

**Decision:** ❌ KEEP in `apps/insurance/components/QuoteCalculator.tsx`

**Rules Applied:** None (domain-specific component)

**Rationale:**
- QuoteCalculator contains insurance-specific business rules
- Not reusable across different domains
- Keep close to the app that uses it

---

### Example 3: Modal with Loading State

**Scenario:** Existing shared Modal. User requests adding loading state without breaking existing usage.

**Evaluation:**
- Does modification break existing usage? ❌ NO (optional prop with safe default)
- Does it enhance functionality? ✅ YES (adds loading indicator)

**Decision:** ✅ UPDATE shared Modal, keep in `core/ui/overlays/modal/`

**Rules Applied:** Enhancement Rule (non-breaking expansion)

**Implementation:**
```tsx
// Before
interface ModalProps {
  children: React.ReactNode
}

export function Modal({ children }: ModalProps) {
  return <div className="modal">{children}</div>
}

// After (non-breaking enhancement)
interface ModalProps {
  children: React.ReactNode
  isLoading?: boolean  // Optional with safe default = false
}

export function Modal({ children, isLoading = false }: ModalProps) {
  return (
    <div className="modal">
      {isLoading && <LoadingSpinner />}
      {children}
    </div>
  )
}

// Existing usage still works (backwards compatible)
<Modal>Content</Modal>

// New usage takes advantage of enhancement
<Modal isLoading={isSubmitting}>Content</Modal>
```

**Why this works:** Existing code continues to work without changes. New functionality is opt-in.

---

### Example 4: FormDrawer with Insurance-Specific Validation

**Scenario:** Shared FormDrawer exists. Insurance app needs policy number validation.

**Evaluation:**
- Does modification break existing usage? ✅ YES (would require insurance-specific props)
- Is it still used in other apps? ✅ YES (CRM app uses it)

**Decision:** 🔄 CREATE insurance-specific wrapper, keep core FormDrawer shared

**Rules Applied:** Rule 3 inverse (breaking change + still used elsewhere = fork/extend)

**Implementation:**
```tsx
// Keep shared core (unchanged)
// core/ui/constructs/form-drawer/FormDrawer.tsx
export function FormDrawer({ children, onSubmit }: FormDrawerProps) {
  return (
    <Drawer>
      <form onSubmit={onSubmit}>{children}</form>
    </Drawer>
  )
}

// Create insurance-specific wrapper
// apps/insurance/components/InsuranceFormDrawer.tsx
export function InsuranceFormDrawer({
  policyNumber,
  ...props
}: InsuranceFormDrawerProps) {
  const validate = useInsurancePolicyValidation()

  return (
    <FormDrawer {...props}>
      {policyNumber && <PolicyNumberField validate={validate} />}
      {props.children}
    </FormDrawer>
  )
}

// Usage in insurance app
<InsuranceFormDrawer policyNumber="POL-12345">
  <Input name="amount" />
</InsuranceFormDrawer>

// Usage in CRM app (unchanged)
<FormDrawer onSubmit={handleSubmit}>
  <Input name="contactName" />
</FormDrawer>
```

**Why this works:** Shared component stays generic. Domain-specific needs are handled by app-specific wrappers.

---

### Example 5: User Asks "Can We Reuse TagEditor from CRM App?"

**Scenario:** Building new feature, user asks Claude to check if CRM app has reusable tag editor.

**Evaluation:**
- Is this explicit instruction to evaluate? ✅ YES
- Does CRM app have TagEditor? ✅ YES
- Can it be used without breaking changes? ✅ YES

**Decision:** ✅ PROMOTE CRM TagEditor to shared construct

**Rules Applied:** Rule 1 (evaluating existing constructs)

**Process:**
1. Claude identifies `apps/crm/components/TagEditor.tsx`
2. Claude evaluates: Is it generic enough? ✅ YES (no CRM-specific logic)
3. Claude promotes to `core/ui/constructs/tag-editor/TagEditor.tsx`
4. Update imports in both CRM and new feature

```bash
# 1. Move to shared
mv apps/crm/components/TagEditor/ core/ui/constructs/tag-editor/

# 2. Update CRM imports
# apps/crm/views/ContactDetailsView.tsx
- import { TagEditor } from '@/apps/crm/components/TagEditor'
+ import { TagEditor } from '@/core/ui/constructs/tag-editor'

# 3. Use in new feature
# apps/template-editor/views/TemplateMetadataView.tsx
+ import { TagEditor } from '@/core/ui/constructs/tag-editor'
```

---

## Decision Flowchart

### For New Components

```
START: Need a component/construct
  |
  ├─ Question 1: Does another app already have this?
  │   │
  │   ├─ YES → Evaluate if reusable (Rule 1)
  │   │   ├─ Generic enough? → PROMOTE to shared
  │   │   └─ Domain-specific? → BUILD new app-specific version
  │   │
  │   └─ NO → Continue to Question 2
  │
  ├─ Question 2: Is this a common design pattern?
  │   │
  │   ├─ YES (Button, Modal, Form, Tag Editor) → BUILD as shared (Rule 2)
  │   │
  │   └─ NO → Continue to Question 3
  │
  ├─ Question 3: Is this domain-specific business logic?
  │   │
  │   ├─ YES (QuoteCalculator, PipelineKanban) → BUILD as app-specific
  │   │
  │   └─ NO → Continue to Question 4
  │
  └─ Question 4: Will this be needed in 2+ apps?
      │
      ├─ HIGH CONFIDENCE → BUILD as shared
      │
      ├─ MAYBE → BUILD as app-specific, promote later if needed
      │
      └─ NO → BUILD as app-specific
```

### For Modifying Existing Shared Constructs

```
START: Need to modify existing shared construct
  |
  ├─ Question 1: Does modification break existing usage?
  │   │
  │   ├─ NO (safe enhancement)
  │   │   └─> UPDATE shared construct (Enhancement Rule)
  │   │
  │   └─ YES (breaking change) → Continue to Question 2
  │
  └─ Question 2: Is construct still used in other apps?
      │
      ├─ NO → DEMOTE to app-specific (Rule 3)
      │
      └─ YES → FORK or COORDINATE
          ├─ Option A: Create app-specific wrapper
          ├─ Option B: Coordinate breaking change with other teams
          └─ Option C: Find non-breaking solution
```

---

## Demotion Process (Rule 3 Application)

**Trigger:** Modifying shared construct in a way that breaks existing usage, and it's no longer used elsewhere.

### Evaluation Matrix

| Breaks Existing? | Used Elsewhere? | Action |
|------------------|----------------|--------|
| NO (safe enhancement) | YES | ✅ UPDATE shared construct |
| NO (safe enhancement) | NO | ✅ UPDATE shared construct |
| YES (breaking change) | YES | 🔄 COORDINATE or FORK |
| YES (breaking change) | NO | ❌ DEMOTE to app-specific |

### Demotion Steps

1. **Move files**
   ```bash
   mv core/ui/constructs/tag-editor/ apps/insurance/components/TagEditor/
   ```

2. **Update imports**
   ```tsx
   // apps/insurance/views/TemplateMetadataView.tsx
   - import { TagEditor } from '@/core/ui/constructs/tag-editor'
   + import { TagEditor } from '@/apps/insurance/components/TagEditor'
   ```

3. **Document reason** in `FORK_REASON.md`
   ```markdown
   # Fork Reason: TagEditor

   **Original Location:** `core/ui/constructs/tag-editor/`
   **Demoted To:** `apps/insurance/components/TagEditor/`
   **Date:** 2025-01-26
   **Reason:** Added insurance-specific policy number validation that broke generic API. No longer used in CRM app (they switched to different implementation).

   **Breaking Changes:**
   - Added required `policyNumber` prop
   - Added insurance-specific validation logic
   - Changed tag color scheme to match insurance branding

   **Impact:** CRM app no longer uses this component.
   ```

---

## Auto-Promote Lists

### Always Shared (Rule 2)

These patterns should **ALWAYS** be built in `core/ui/`:

**UI Primitives:**
- Button
- Input
- Select
- Checkbox
- Radio
- Toggle
- Badge
- Tooltip

**Common Patterns:**
- Modal
- Dialog
- Drawer
- Dropdown
- Popover
- DataTable
- List
- VirtualList
- FormField
- FormGroup
- FormDrawer
- TagEditor
- TagInput
- TagList
- Toast
- Alert
- Notification
- Tabs
- Accordion
- Collapse
- LoadingSpinner
- Skeleton
- ProgressBar

**Rationale:** These are universal patterns used across all types of applications.

---

### Always App-Specific

These patterns should **ALWAYS** remain in `apps/[app-name]/components/`:

**Insurance Domain:**
- QuoteCalculator
- PolicyEditor
- ClaimForm
- CoverageSelector
- PremiumCalculator

**CRM Domain:**
- PipelineKanban
- ContactCard
- DealEditor
- LeadScoreDisplay
- ActivityTimeline

**App-Specific Flows:**
- OnboardingWizard (app-specific sequence)
- DashboardMetrics (app-specific KPIs)
- SettingsPanel (app-specific settings)

**Rationale:** These contain domain-specific business logic that isn't reusable across different types of applications.

---

## Promotion Evaluation Checklist

Use this checklist when deciding whether to promote a construct:

### Promotion Checklist

- [ ] **Is it required in another app?** (Rule 1)
  - If YES → Strong case for promotion

- [ ] **Does it fulfill a common use case?** (Rule 2)
  - If YES → Strong case for promotion
  - Check auto-promote list

- [ ] **Is it domain-specific business logic?**
  - If YES → Keep app-specific
  - Check always app-specific list

- [ ] **Does it contain hardcoded app-specific data?**
  - If YES → Keep app-specific or refactor first

- [ ] **Can it be made generic without breaking existing usage?**
  - If NO → Keep app-specific or create wrapper

- [ ] **Will it need different implementations per app?**
  - If YES → Keep app-specific

- [ ] **Is this a one-off prototype?**
  - If YES → Keep app-specific until proven useful

**When in doubt:** Default to app-specific. Promote later when need is proven.

---

## Related Documentation

- **Component Placement:** See `/docs/decision-roadmaps/component-placement.md`
- **Variant Patterns:** See `/docs/decision-roadmaps/variant-api-patterns.md`
- **Design Guidelines:** See `/docs/design-guidelines.draft.md`
- **Developer Instructions:** See `/CLAUDE.md`

---

## Revision History

- **2025-01-26**: Initial creation - Governance Rules 1-3, decision matrices, practical examples (approved)
