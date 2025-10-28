# Construct Archive Review Decision Matrix

> **Purpose**: Checklist and decision framework for reviewing archived constructs in `xx-Archive-xx/` folder
> **Audience**: AI subagents, developers, design system maintainers
> **Last Updated**: 2025-01-26
> **Status**: Approved - Subagent Review Process

---

## Executive Summary

This document provides a systematic checklist for AI subagents to review archived constructs and determine if they should be permanently deleted or require further review. The subagent creates a JIRA task with the review details and marks the construct's disposition.

**Archive Folder**: `xx-Archive-xx/` (added to `.gitignore` as safety measure)

**Review Trigger**: After 2 sprints (minimum 4 weeks) in archive folder

---

## Review Checklist

Use this checklist to evaluate each archived construct. Answer all questions before making a disposition decision.

### Section 1: Usage Analysis

- [ ] **Q1.1**: Search codebase for import statements
  - Command: `grep -r "from.*[ConstructName]" src/`
  - Command: `grep -r "import.*[ConstructName]" src/`
  - **Result**: Found _____ import references
  - **Assessment**: ☐ No usage found ☐ Usage found (list files)

- [ ] **Q1.2**: Search for direct file references
  - Command: `grep -r "[construct-file-name]" src/`
  - **Result**: Found _____ file references
  - **Assessment**: ☐ No references ☐ References found (list locations)

- [ ] **Q1.3**: Search for component usage in JSX/TSX
  - Command: `grep -r "<[ConstructName]" src/`
  - **Result**: Found _____ JSX/TSX usages
  - **Assessment**: ☐ No usage ☐ Usage found (list files)

- [ ] **Q1.4**: Check git history for recent modifications
  - Command: `git log --since="4 weeks ago" -- xx-Archive-xx/[construct-path]`
  - **Result**: _____ commits in last 4 weeks
  - **Assessment**: ☐ No activity ☐ Recent activity (investigate why)

- [ ] **Q1.5**: Search for mentions in documentation
  - Command: `grep -r "[ConstructName]" docs/`
  - **Result**: Found _____ documentation references
  - **Assessment**: ☐ No mentions ☐ Mentioned in docs (needs update)

**Section 1 Score**: _____/5 questions answered

---

### Section 2: Deprecation Process Verification

- [ ] **Q2.1**: Check for `@deprecated` JSDoc comment in archived file
  - **Location**: Top of construct file
  - **Assessment**: ☐ Present ☐ Missing

- [ ] **Q2.2**: Verify migration guide exists
  - **Location**: JSDoc or separate `[ConstructName].MIGRATION.md`
  - **Assessment**: ☐ Present ☐ Missing

- [ ] **Q2.3**: Check for deprecation notice in documentation
  - **Location**: `/docs/` or component README
  - **Assessment**: ☐ Present ☐ Missing

- [ ] **Q2.4**: Verify 2-sprint grace period has passed
  - **Check**: Date moved to archive vs current date
  - **Date Archived**: _____________
  - **Current Date**: _____________
  - **Days in Archive**: _____ days
  - **Assessment**: ☐ ≥28 days (4 weeks) ☐ <28 days (keep in archive)

- [ ] **Q2.5**: Check for FORK_REASON.md or deprecation explanation
  - **Location**: `xx-Archive-xx/[construct-path]/`
  - **Assessment**: ☐ Present ☐ Missing

**Section 2 Score**: _____/5 questions answered

---

### Section 3: Technical Assessment

- [ ] **Q3.1**: Does construct contain unique business logic not found elsewhere?
  - **Assessment**: ☐ Unique logic (investigate reuse) ☐ No unique logic

- [ ] **Q3.2**: Does construct have reusable patterns worth extracting?
  - **Examples**: Custom hooks, utility functions, algorithms
  - **Assessment**: ☐ Has reusable patterns (extract first) ☐ No reusable patterns

- [ ] **Q3.3**: Does construct have comprehensive unit tests?
  - **Location**: `[construct-name].test.ts(x)`
  - **Assessment**: ☐ Yes (preserve tests) ☐ No tests

- [ ] **Q3.4**: Does construct address a use case still relevant to the system?
  - **Assessment**: ☐ Use case still relevant (reconsider archive) ☐ Use case obsolete

- [ ] **Q3.5**: Was construct replaced by a better abstraction?
  - **Replacement**: _______________
  - **Assessment**: ☐ Replaced ☐ Not replaced (investigate why archived)

**Section 3 Score**: _____/5 questions answered

---

### Section 4: Dependencies and Impact

- [ ] **Q4.1**: Does construct have external dependencies that need cleanup?
  - **Examples**: npm packages, API integrations, third-party services
  - **Assessment**: ☐ Has dependencies (list) ☐ No external dependencies

- [ ] **Q4.2**: Are there database migrations or schema changes tied to this construct?
  - **Assessment**: ☐ Yes (coordinate with backend) ☐ No

- [ ] **Q4.3**: Does construct have associated CSS/styles that need removal?
  - **Location**: Co-located CSS or global stylesheets
  - **Assessment**: ☐ Yes (remove with construct) ☐ No

- [ ] **Q4.4**: Are there E2E or integration tests referencing this construct?
  - **Command**: `grep -r "[ConstructName]" tests/ e2e/`
  - **Assessment**: ☐ Yes (update tests) ☐ No

- [ ] **Q4.5**: Does construct appear in Storybook or design system documentation?
  - **Location**: `.stories.tsx` or design system docs
  - **Assessment**: ☐ Yes (remove stories) ☐ No

**Section 4 Score**: _____/5 questions answered

---

## Disposition Decision Matrix

### Automatic Decisions

| Condition | Disposition | Action |
|-----------|-------------|--------|
| **Q1 (any usage found)** | ❌ DO NOT DELETE | Move back to active codebase, investigate why usage exists |
| **Q2.4 (< 28 days in archive)** | ⏸️ KEEP IN ARCHIVE | Wait for full 2-sprint grace period |
| **Q3.2 (reusable patterns found)** | ⏸️ NEEDS FURTHER REVIEW | Extract reusable patterns before deletion |
| **Q3.4 (use case still relevant)** | ⏸️ NEEDS FURTHER REVIEW | Reconsider archival decision |
| **Q4.2 (database dependencies)** | ⏸️ NEEDS FURTHER REVIEW | Coordinate with backend team |

### Evaluation Matrix

**If no automatic decisions apply**, use this scoring matrix:

| Score Range | Disposition | Explanation |
|-------------|-------------|-------------|
| **16-20 (80%+)** | ✅ READY FOR DELETION | All checks passed, safe to delete |
| **12-15 (60-79%)** | ⚠️ NEEDS FURTHER REVIEW | Some gaps in process, investigate before deletion |
| **0-11 (<60%)** | ❌ NOT READY | Significant gaps, do not delete yet |

**Total Score**: _____/20

---

## JIRA Task Template

When creating the JIRA task, use this template:

```markdown
# Archived Construct Review: [ConstructName]

## Summary
Review of archived construct to determine deletion readiness.

## Construct Details
- **Name**: [ConstructName]
- **Path**: xx-Archive-xx/[construct-path]
- **Date Archived**: [YYYY-MM-DD]
- **Days in Archive**: [X] days
- **Archived By**: [developer/team]

## Review Checklist Results

### Section 1: Usage Analysis (Score: X/5)
- Import references: [X found / None found]
- File references: [X found / None found]
- JSX/TSX usage: [X found / None found]
- Recent git activity: [Yes / No]
- Documentation mentions: [X found / None found]

**Key Findings**: [Summary of any usage found]

### Section 2: Deprecation Process (Score: X/5)
- @deprecated JSDoc: [Present / Missing]
- Migration guide: [Present / Missing]
- Deprecation notice in docs: [Present / Missing]
- 2-sprint grace period: [Passed / Not passed]
- FORK_REASON.md: [Present / Missing]

**Key Findings**: [Summary of process compliance]

### Section 3: Technical Assessment (Score: X/5)
- Unique business logic: [Yes / No]
- Reusable patterns: [Yes (list) / No]
- Unit tests: [Present / Missing]
- Use case still relevant: [Yes / No]
- Replaced by: [Replacement / Not replaced]

**Key Findings**: [Summary of technical considerations]

### Section 4: Dependencies & Impact (Score: X/5)
- External dependencies: [List / None]
- Database dependencies: [Yes / No]
- Associated CSS/styles: [Yes / No]
- E2E/integration tests: [Yes / No]
- Storybook/design docs: [Yes / No]

**Key Findings**: [Summary of cleanup required]

## Disposition Decision

**Total Score**: X/20 (X%)

**Decision**: [✅ READY FOR DELETION / ⚠️ NEEDS FURTHER REVIEW / ❌ NOT READY]

**Rationale**: [Explain the decision based on checklist results]

## Required Actions Before Deletion

- [ ] Remove associated CSS/styles from: [locations]
- [ ] Remove E2E/integration tests from: [locations]
- [ ] Remove Storybook stories from: [locations]
- [ ] Update documentation to remove mentions: [docs to update]
- [ ] [Any other cleanup tasks identified]

## Recommendation

[Provide clear recommendation: DELETE NOW / WAIT AND REVIEW AGAIN / MOVE BACK TO ACTIVE]

## Next Steps

1. [Action 1]
2. [Action 2]
3. [Action 3]

---

**Reviewed By**: [AI Subagent Name]
**Review Date**: [YYYY-MM-DD]
**JIRA Task**: [TASK-XXX]
```

---

## Subagent Instructions

### Step 1: Execute Review

1. Navigate to `xx-Archive-xx/` folder
2. For each construct in the folder:
   - Run all checklist commands
   - Document findings in checklist
   - Calculate scores for each section
   - Apply disposition decision matrix

### Step 2: Create JIRA Task

1. Use JIRA Task Template above
2. Fill in all sections with findings
3. Include disposition decision with rationale
4. Add required actions checklist
5. Tag task with: `construct-review`, `archived-construct`, `[construct-name]`
6. Assign to: Design System Lead or Tech Lead

### Step 3: Update Archive Status

Create status file in archive: `xx-Archive-xx/[construct-path]/.REVIEW_STATUS.md`

```markdown
# Review Status: [ConstructName]

**Review Date**: [YYYY-MM-DD]
**Reviewer**: [AI Subagent Name]
**Disposition**: [READY FOR DELETION / NEEDS FURTHER REVIEW / NOT READY]
**JIRA Task**: [TASK-XXX]
**Next Review Date**: [YYYY-MM-DD] (if needs further review)

## Quick Summary
[1-2 sentence summary of findings and decision]
```

### Step 4: Notification

If disposition is **READY FOR DELETION**:
- Notify design system maintainers
- Provide JIRA task link
- Request final approval before deletion

If disposition is **NEEDS FURTHER REVIEW**:
- Schedule follow-up review in 2 weeks
- Document specific items that need investigation
- Notify relevant team members

If disposition is **NOT READY**:
- Move construct back to active codebase if still in use
- Document why construct should not be in archive
- Notify team that archived construct is still active

---

## Examples

### Example 1: Ready for Deletion

**Construct**: `OldTagEditor`

**Checklist Results**:
- Section 1: 5/5 (no usage found)
- Section 2: 5/5 (all deprecation steps followed)
- Section 3: 4/5 (no unique logic, replaced by InlineTagEditor)
- Section 4: 5/5 (no dependencies, all tests removed)

**Total Score**: 19/20 (95%)

**Disposition**: ✅ READY FOR DELETION

**Rationale**: No usage found, proper deprecation process followed, fully replaced by better abstraction, no dependencies to clean up.

---

### Example 2: Needs Further Review

**Construct**: `QuoteCalculatorV1`

**Checklist Results**:
- Section 1: 5/5 (no usage found)
- Section 2: 4/5 (migration guide missing)
- Section 3: 2/5 (contains unique actuarial formulas, no replacement)
- Section 4: 3/5 (has database migrations)

**Total Score**: 14/20 (70%)

**Disposition**: ⚠️ NEEDS FURTHER REVIEW

**Rationale**: Contains unique actuarial formulas that may be needed. Should extract formulas to utility library before deletion. Database migrations need backend team coordination.

**Actions Required**:
1. Extract actuarial formulas to `@/utils/actuarial-calculations.ts`
2. Create migration guide showing how to use new utility
3. Coordinate with backend team on database cleanup
4. Review again after actions completed

---

### Example 3: Not Ready for Deletion

**Construct**: `ModalV2`

**Checklist Results**:
- Section 1: 0/5 (12 import references found in active code)
- Section 2: 3/5 (deprecation notice exists but still in use)
- Section 3: 4/5 (replaced by ModalV3)
- Section 4: 2/5 (Storybook stories still reference it)

**Total Score**: 9/20 (45%)

**Disposition**: ❌ NOT READY - MOVE BACK TO ACTIVE

**Rationale**: Construct is still actively used in 12 locations. Should not be in archive. Team needs to complete migration to ModalV3 before archiving.

**Actions Required**:
1. Move `ModalV2` back to `core/ui/overlays/modal-v2/`
2. Create JIRA task to migrate remaining 12 usages to ModalV3
3. Update deprecation notice with concrete migration deadline
4. Re-archive after all usages migrated

---

## Related Documentation

- **Deprecation Strategy**: See Decision #6 in `/docs/design-guidelines.draft.md`
- **Component Placement**: See `/docs/decision-matrix/component-placement.md`
- **Cross-App Reuse**: See `/docs/decision-matrix/cross-app-reuse.md`

---

## Revision History

- **2025-01-26**: Initial creation - Subagent review checklist and decision matrix (approved)
