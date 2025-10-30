# Lexical Plugin Refactoring Plan

## Document Purpose
This is a living document for planning and tracking refactoring tasks for Lexical plugins and editor components in the insurance template POC. Use the task templates below to specify refactoring work for Claude to perform.

---

## Project Context

### Current Plugin Inventory
**Existing Plugins (list what we have now):**
- [ ] ToolbarPlugin
- [ ] OnChangePlugin
- [ ] FloatingTextFormatToolbarPlugin
- [ ] DraggableBlockPlugin
- [ ] Other: _______________

**Current Pain Points:**
- What's difficult to maintain?
- What's causing bugs or type errors?
- What's hard to extend?

---

## TASK TEMPLATE (Copy and fill out for each refactoring task)

### Task #[NUMBER]: [Brief Title]

#### 1. WHAT TO REFACTOR
**Plugin/Component Name:**
- File path: `src/plugins/_____.tsx`
- Related files:

**What needs to change:**
- [ ] Code organization/structure
- [ ] Type safety improvements
- [ ] Performance optimization
- [ ] Feature addition/removal
- [ ] API/interface changes
- [ ] Other: _______________

#### 2. WHY REFACTOR
**Current Problems:**
1. [Describe specific issue #1]
2. [Describe specific issue #2]

**Goals/Success Criteria:**
- What should work better after refactoring?
- What specific improvements are expected?
- Any performance targets?

#### 3. DESIRED END STATE
**Functional Requirements:**
- What should the plugin DO after refactoring?
- Should any behavior change? If so, how?
- Should it work with new features?

**Technical Requirements:**
- TypeScript strictness: Should it follow strict typing? Any specific types needed?
- Dependencies: Should it use different libraries or Lexical APIs?
- File structure: Single file or split into multiple modules?
- Naming conventions: Any specific patterns to follow?

#### 4. CONSTRAINTS & CONSIDERATIONS
**Must NOT Break:**
- [ ] Existing templates (EMAIL_TEMPLATE, SMS_TEMPLATE)
- [ ] TemplateVariableNode functionality
- [ ] Other editor plugins
- [ ] User workflows in create/use modes
- [ ] Other: _______________

**Backwards Compatibility:**
- Does existing editor state need to still work?
- Can we change serialization format?

**Dependencies:**
- Does this depend on other tasks being completed first?
- Will other components need updates after this?

#### 5. IMPLEMENTATION PREFERENCES
**Approach Preference (if any):**
- Any specific patterns or architectures to follow?
- Reference implementations to look at?
- Specific Lexical APIs to use/avoid?

**Code Style:**
- Inline styles vs CSS modules vs styled-components?
- Functional vs class components?
- Custom hooks to extract?

**Testing Needs:**
- Should Claude verify it works in dev mode?
- Specific scenarios to test manually?
- Edge cases to consider?

#### 6. QUESTIONS FOR CLAUDE TO ANSWER BEFORE STARTING
**Context Questions:**
- [ ] What does this plugin currently do?
- [ ] What are the current type issues?
- [ ] How does it integrate with other plugins?
- [ ] What Lexical APIs does it use?

**Clarification Needed:**
- [List any ambiguities Claude should ask about before implementing]

#### 7. ACCEPTANCE CHECKLIST
After refactoring is complete, verify:
- [ ] TypeScript compiles with no errors
- [ ] No unused variables/parameters
- [ ] Follows strict typing (no `any` types)
- [ ] Dev server runs without errors
- [ ] Existing templates still render correctly
- [ ] Variable insertion still works
- [ ] [Add specific functional tests]
- [ ] Code is documented with comments where needed

---

## EXAMPLE TASK (Reference - delete when creating real tasks)

### Task #1: Extract Toolbar Button Logic into Reusable Hook

#### 1. WHAT TO REFACTOR
**Plugin/Component Name:**
- File path: `src/plugins/ToolbarPlugin.tsx`
- Related files: N/A

**What needs to change:**
- [x] Code organization/structure
- [x] Type safety improvements
- [ ] Performance optimization
- [ ] Feature addition/removal
- [ ] API/interface changes

#### 2. WHY REFACTOR
**Current Problems:**
1. Repeated button logic for each variable makes ToolbarPlugin long and hard to maintain
2. No type safety for variable button props
3. Hard to add new toolbar buttons without duplicating code

**Goals/Success Criteria:**
- Extract reusable `useToolbarButton` hook
- Type-safe button configuration
- Easier to add new toolbar buttons in the future

#### 3. DESIRED END STATE
**Functional Requirements:**
- All variable buttons should work exactly as they do now
- Hook should handle click events and node insertion
- Should work with any TemplateVariable

**Technical Requirements:**
- TypeScript strictness: Full strict typing, define `ToolbarButtonConfig` interface
- Dependencies: Use existing Lexical APIs, no new dependencies
- File structure: Keep in same file unless hook is reusable elsewhere
- Naming conventions: `useToolbarButton` or `useVariableInsertion`

#### 4. CONSTRAINTS & CONSIDERATIONS
**Must NOT Break:**
- [x] Existing templates (EMAIL_TEMPLATE, SMS_TEMPLATE)
- [x] TemplateVariableNode functionality
- [ ] Other editor plugins
- [x] User workflows in create/use modes

**Backwards Compatibility:**
- N/A - internal refactoring only

**Dependencies:**
- None - standalone improvement

#### 5. IMPLEMENTATION PREFERENCES
**Approach Preference:**
- Extract common logic into custom React hook
- Keep button rendering in component, move click handler logic to hook

**Code Style:**
- Inline styles (match existing patterns)
- Functional components only
- Extract hook if it makes code cleaner

**Testing Needs:**
- Verify in dev mode that all variable buttons still insert correctly
- Test undo/redo still works
- Test multiple variables in sequence

#### 6. QUESTIONS FOR CLAUDE TO ANSWER BEFORE STARTING
**Context Questions:**
- [x] What does ToolbarPlugin currently do?
- [x] How are buttons currently implemented?
- [x] What logic is duplicated?

**Clarification Needed:**
- Should the hook also handle button styling/state?
- Should it return JSX or just event handlers?

#### 7. ACCEPTANCE CHECKLIST
After refactoring is complete, verify:
- [ ] TypeScript compiles with no errors
- [ ] No unused variables/parameters
- [ ] Follows strict typing (no `any` types)
- [ ] Dev server runs without errors
- [ ] All variable buttons insert correctly
- [ ] Undo/redo works
- [ ] Code is cleaner and more maintainable

---

## ACTIVE TASKS

### Task #1: [YOUR TASK HERE]
[Fill out template above]

### Task #2: [YOUR TASK HERE]
[Fill out template above]

---

## COMPLETED TASKS

### ~~Task #X: [Completed Task Name]~~
**Completed:** [Date]
**Summary:** [Brief description of what was changed]
**Commit:** [Commit hash if applicable]

---

## NOTES & LEARNINGS

### Refactoring Patterns That Work
- [Document successful approaches]

### Gotchas & Edge Cases
- [Document issues encountered and solutions]

### Future Considerations
- [Ideas for further improvements]