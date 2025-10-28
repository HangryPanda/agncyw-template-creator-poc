# Template Composition & Editing UX Design

> **Living Document**: This document evolves with each design session. Never delete previous discussions—always add new sections.

---

## 🚨 Outstanding Questions & Decisions

[ALWAYS UPDATE THIS SECTION FIRST - Move resolved items to their respective discussion sections]

### Awaiting User Input

**All questions from Session 1 have been answered! New questions based on Session 2 decisions:**

#### Template Versioning System Architecture
1. **Version history display**: Where should version history be accessible?
   - In sidebar panel (new section)
   - In template metadata editor (existing modal)
   - In "Template Insights" panel (repurposed outline)
   - Dedicated "History" tab when template is open

2. **Version comparison**: How should users compare versions?
   - Side-by-side diff view (like GitHub)
   - Inline diff with additions/deletions highlighted
   - Full restore preview before confirming

3. **Version auto-save vs manual**: Should every change create a version, or only manual saves?
   - Auto-version on every save (easier, but cluttered)
   - Manual "Create Version" button (explicit, but requires user action)
   - Hybrid: Auto-save + optional "Mark as Version" with notes

4. **Version retention**: How long to keep version history?
   - Unlimited (storage grows over time)
   - Last 30 versions (prevents clutter)
   - Time-based: Last 90 days

#### Template Analytics Implementation
5. **Analytics display location**: Where should analytics be most visible?
   - Template card footer (always visible in sidebar)
   - Template Insights panel (when template is open)
   - Dedicated Analytics Dashboard page
   - All of the above (redundant but comprehensive)

6. **Response tracking UX**: How should users enter campaign responses?
   - Modal prompt: "How many responses did {{template_name}} get today?"
   - Inline input in template card
   - Dedicated "Campaign Tracker" view
   - Semi-automated reminder (shows X hours after template was used)

7. **Response reminder timing**: When to prompt for response count?
   - 4 hours after template used
   - End of business day (5pm)
   - Next morning (9am)
   - User-configurable

8. **Analytics exportability**: Should analytics be exportable?
   - CSV export (for Excel analysis)
   - PDF report (for presentations)
   - Both
   - Not needed

#### Tab Grouping System
9. **Tab grouping strategy**: How should tabs be grouped?
   - Manual: User creates groups and assigns tabs
   - Automatic: By campaign tag (requires tag on template)
   - Automatic: By date opened (today, this week, older)
   - Hybrid: Auto-group by tag, with manual override

10. **Tab group UI pattern**: How should groups be displayed?
    - Vertical tabs with group headers (like VS Code)
    - Separate tab rows per group
    - Color-coded tabs (different color per group)
    - Dropdown menu per group

11. **Tab group persistence**: Should groups persist across sessions?
    - Yes, save to localStorage (persists across browser restarts)
    - Session-only (resets on app close)
    - User choice (toggle in settings)

#### Folder + Tag Hybrid System
12. **Primary navigation method**: Should folders or tags be primary?
    - Folders primary, tags secondary (familiar for users)
    - Tags primary, folders optional (current system)
    - Equal weight (sidebar shows both)

13. **Folder structure**: How deep should folders go?
    - Flat (no nesting, just categories)
    - 2 levels (e.g., "Sales" → "Auto Insurance")
    - Unlimited nesting (full tree structure)

14. **Folder + tag interaction**: How do folders and tags work together?
    - Tags filter within current folder
    - Folders and tags are independent (both filter global list)
    - Tags can span folders (e.g., #urgent tag shows templates from all folders)

#### Custom Variable Creation Flow
15. **Variable creation location**: Where should users create custom variables?
    - In template editor (inline, as-needed)
    - In dedicated "Variable Manager" (centralized)
    - Both (inline for quick, manager for organized)

16. **Custom variable required fields**: What info is needed to create a variable?
    - Name only (minimal)
    - Name + label (display name)
    - Name + label + description + example (comprehensive)

17. **Custom variable validation**: Should variable names be validated?
    - Alphanumeric + underscore only (strict)
    - Allow spaces (converted to underscores)
    - No validation (user responsibility)

18. **Custom variable scope**: Where are custom variables available?
    - Global (available in all templates)
    - Template-specific (only in the template where created)
    - User choice on creation (toggle "Make available in all templates")

#### Template Approval Workflow
19. **Approval submission process**: How do users submit templates for approval?
    - Button in template metadata: "Submit to Agency Templates"
    - Context menu on template card: "Share with Agency"
    - Dedicated "Share" modal with message to approver

20. **Approval UI for managers**: Where do team leads review submissions?
    - "Pending Approvals" section in sidebar
    - Separate "Template Approvals" page
    - Email notification with approve/reject links (external)

21. **Approval notifications**: How are users notified of approval status?
    - In-app notification banner
    - Toast message on next login
    - Email notification
    - All of the above

22. **Approval feedback loop**: Can approvers suggest changes?
    - Yes, with inline comments
    - Yes, with rejection message only
    - No, just approve/reject

#### Keyboard Shortcuts Enhancement
23. **Additional shortcuts needed**: Based on your list (Tab, Enter, Ctrl+S, Ctrl+K, /, arrows), what else is needed?
    - Ctrl+N: New template
    - Ctrl+D: Duplicate template
    - Ctrl+F: Find in template content
    - Ctrl+Shift+V: Open variable picker
    - Esc: Close current panel/modal

24. **Keyboard shortcut customization**: Should users customize shortcuts?
    - Yes, fully customizable (settings panel)
    - No, keep consistent for all users (easier support)

#### Screen Reader Support Specifics
25. **Screen reader priority areas**: Which areas need screen reader support FIRST?
    - Template editor (most critical)
    - Template sidebar navigation
    - Variable insertion and editing
    - All of the above (comprehensive)

26. **ARIA requirements**: What level of ARIA implementation?
    - Basic: Landmarks and labels only
    - Standard: WCAG 2.1 AA (required for most vendors)
    - Advanced: WCAG 2.1 AAA (exceeds most requirements)

#### Recently Closed Tabs Recovery
27. **Recently closed access method**: How should users access closed tabs?
    - Keyboard shortcut: Ctrl+Shift+T (like browsers)
    - Context menu on tab bar: "Reopen Closed Tab"
    - "Recently Closed" section in sidebar
    - All of the above

28. **Recently closed retention**: How many closed tabs to remember?
    - Last 10 (typical browser behavior)
    - Last 20 (power user friendly)
    - Unlimited during session (clears on app close)

29. **Recently closed persistence**: Should closed tabs persist across sessions?
    - Yes, save to localStorage (persist across restarts)
    - No, session-only (clears on app close)

30. **Recently closed display**: How should closed tabs be displayed?
    - List with template name + close time
    - List with template name + preview
    - Grouped by when closed (today, yesterday, this week)

#### Word Count vs Character Count
31. **Primary metric**: Should word count be the ONLY metric?
    - Word count only (simplest, aligns with preference)
    - Word count + character count (comprehensive)
    - Word count + reading time estimate (e.g., "~30 sec read")

32. **Metric display location**: Where should word count be displayed?
    - Editor footer (always visible while editing)
    - Template Insights panel (when template is open)
    - Template card (in sidebar preview)
    - All of the above

33. **Additional writing stats**: Should other metrics be shown?
    - Sentence count
    - Paragraph count
    - Variable count (already planned)
    - Reading grade level (e.g., "8th grade reading level")
    - None (keep it simple)

### Under Consideration

**Updated based on Session 2 feedback:**

✅ **APPROVED - Moving to implementation:**
- Template Analytics (P0 - Critical, v1.2)
- Template Versioning System (P0 - Critical, v1.2)
- Template Snippets (P2, v1.3)
- Tab Grouping by Campaign (P2, v1.2)
- Folder + Tag Hybrid Organization (P2, v1.3)

🤔 **STILL UNDER CONSIDERATION:**
- **Smart Suggestions via Browser AI**: Leverage Chrome/Edge local AI APIs (nice-to-have, explore in v2.0)
- **Batch Operations**: Apply changes to multiple templates at once (need to think more)
- **Command Menu Expansion**: Improve/expand `/` command plugins (already exists, just needs enhancement)

❌ **REJECTED - Not needed for MVP:**
- Inline Spell Check (Edge does this automatically)
- Real-time Collaboration (too complex for MVP)
- Template Testing (not needed) 

---

## Design Sessions & Decisions

### Session 1: Initial UX Audit & Recommendations
**Discussion Date**: October 28, 2025
**Status**: Awaiting User Feedback

#### Context Discovered

**Architecture Overview:**
- **Editor Framework**: Lexical (Meta's modern rich text editor)
- **Component System**: Feature-based architecture with clear separation
  - Apps (TemplateEditor)
  - Core UI (primitives, constructs, layouts)
  - Domain logic (variables, templates, storage)
- **Storage Strategy**: localStorage with Template Registry system
  - System templates (app-provided, auto-restore)
  - Agency templates (future: org-level)
  - User templates (personal, preserved)
- **Design System**: Side panel-first (360px-800px), 13px base typography, 4px spacing scale
- **Template Types**: Email and SMS with variable insertion

**Current User Workflows:**

1. **Create Mode** (Template Building):
   - Select Email/SMS type
   - Use Lexical editor with variable insertion
   - Variables rendered as blue pill components `{{variable_name}}`
   - Save as template to registry
   - Switch between templates via tab system

2. **Use Mode** (Message Composition):
   - Load template
   - Fill form inputs for each variable
   - Preview with variables replaced
   - Copy final message to clipboard

**Technical Highlights:**
- Custom `TemplateVariableNode` extending Lexical's `DecoratorNode`
- Inline editing of variables with Enter/Escape handling
- Smart cursor positioning after variable insertion
- contentEditable disabled on inputs (brilliant password manager avoidance!)
- Undo/redo with Lexical's HistoryPlugin
- Auto-save with dirty state tracking
- VS Code-inspired tab system with drag-and-drop

#### UX Observations

**✅ Current Strengths:**

1. **Excellent Variable Insertion Pattern**
   - `{{` trigger is intuitive for users familiar with templating
   - Inline editing on click is efficient
   - Clear visual distinction (blue pills)

2. **Solid Information Architecture**
   - Clear mode separation (Create vs Use)
   - Logical sidebar grouping (variables, outline, settings)
   - Tags for template organization

3. **Thoughtful Technical Decisions**
   - Disabling contentEditable to avoid password manager interference = genius
   - Using Lexical's AST for reliable state management
   - Separate storage keys for template types (system/agency/user)

4. **Good Productivity Features**
   - Keyboard shortcuts (Cmd+W to close tabs, Cmd+Tab to switch)
   - Auto-save with dirty indicators
   - Command palette for quick actions
   - Backup/restore functionality

5. **Responsive Side Panel Design**
   - 13px base font optimized for information density
   - 4px spacing scale allows compact layouts
   - Breakpoint system for 360px-800px range

**❌ Current Pain Points:**

1. **Terminology Confusion**
   - **"Editor" vs "Compose" modes unclear**
     - "Editor" could mean editing templates OR editing messages
     - "Compose" is specific but doesn't clearly distinguish from "Create"
   - **Solution**: Rename to "Template Builder" and "Message Composer" with helpful tooltips

2. **Variable Insertion Overload**
   - **Three methods to insert variables**: `{{` trigger, toolbar button, sidebar
   - **Problem**: Decision paralysis—users wonder which method to use
   - **Evidence**: Toolbar has BOTH a "Placeholder Variables" dropdown AND a "Templates" dropdown—overlapping purposes
   - **Solution**: Pick ONE primary method, make others secondary

3. **Variable Discoverability in Compose Mode**
   - **Problem**: Variables look like static text—users may not realize they're editable
   - **Evidence**: No hover state, cursor doesn't change to pointer
   - **Solution**: Add hover effects (scale, glow, cursor change)

4. **No Preview Before Sending**
   - **Problem**: In Compose mode, users fill form then copy—no final preview step
   - **Risk**: Typos or formatting issues not caught before sending
   - **Solution**: Add collapsible preview panel showing final message

5. **Character Counter Only for SMS**
   - **Problem**: Counter only appears for SMS type, but email length matters too
   - **Insight**: Long emails get cut off in mobile previews (typically ~140 chars)
   - **Solution**: Always show character count in editor footer

6. **Tab Overload Potential**
   - **Problem**: With 15+ templates, tabs become overwhelming
   - **Evidence**: Current tab system has no limits or grouping
   - **Solution**: Add "Recently Used" section, pin favorites, max 10 open tabs

7. **Variable Form UX in Compose Mode**
   - **Problem**: Long variable lists create scroll fatigue
   - **Evidence**: INSURANCE_VARIABLES has 15+ fields
   - **Solution**: Collapsible sections, autofocus first empty field

8. **No Undo for Template Deletion**
   - **Problem**: Deleting templates from sidebar is permanent
   - **Risk**: Accidental deletion of important templates
   - **Solution**: Add "Recently Deleted" section (30-day retention)

9. **Tag Management Friction**
   - **Problem**: No inline tag creation—must open metadata editor
   - **Evidence**: InlineTagEditor exists but not integrated into main flow
   - **Solution**: Add tag input directly in template card

10. **Outline Panel Underutilized**
    - **Problem**: TemplateOutlinePanel shows headings, but templates rarely use headings
    - **Opportunity**: Repurpose as "Template Structure" showing variables + word count

#### Recommendations

**Priority 1: Quick Wins (High Impact, Low Effort)**

1. **Rename Modes for Clarity** ⚡
   - Change "Editor" → "Template Builder"
   - Change "Compose" → "Message Composer"
   - Add tooltips: "Build reusable templates" | "Fill and send messages"
   - **Impact**: Reduces cognitive load, clearer mental model
   - **Effort**: 1 hour (update strings + add tooltips)

2. **Add Hover States to Variables in Compose Mode** ⚡
   - Add CSS: `cursor: pointer`, `scale(1.05)`, `ring-2 ring-brand-blue/30`
   - Show pencil icon on hover
   - **Impact**: Makes editing discoverable without instructions
   - **Effort**: 30 minutes (CSS + icon logic)

3. **Always Show Character Counter** ⚡
   - Move counter to editor footer (always visible)
   - For email: show char count + estimated mobile preview length (140 chars)
   - For SMS: show char count + segment count (160 per segment)
   - **Impact**: Prevents overly long messages
   - **Effort**: 2 hours (refactor TemplateCharacterCounter)

4. **Simplify Variable Insertion** ⚡
   - **Remove** toolbar "Placeholder Variables" dropdown
   - **Keep**: `{{` trigger (primary) + sidebar (secondary, for browsing)
   - Add tooltip in empty editor: "Type {{ to insert a variable"
   - **Impact**: Reduces decision paralysis
   - **Effort**: 1 hour (remove toolbar menu, add empty state hint)

5. **Add Preview Panel in Compose Mode** ⚡
   - Collapsible panel below form (ResizablePanel)
   - Shows final message with variables filled
   - Updates live as user types in form
   - **Impact**: Catch errors before sending, build confidence
   - **Effort**: 3 hours (new ComposePreviewPanel component)

**Priority 2: Strategic Improvements (High Impact, Medium Effort)**

6. **Improve Variable Form UX** 🎯
   - Group variables into collapsible sections:
     - "Client Information" (first_name, last_name, etc.)
     - "Policy Details" (policy_type, coverage_amount, etc.)
     - "Agent Information" (agent_name, agent_phone, etc.)
   - Autofocus first empty field
   - Add "Fill with example data" button for testing
   - **Impact**: Reduces form filling fatigue
   - **Effort**: 6 hours (refactor TemplatePreview form logic)

7. **Redesign Tab System** 🎯
   - Add "Recently Used" section in sidebar (last 5 templates)
   - Add "Pinned" section for favorites
   - Limit open tabs to 10 (warn before opening more)
   - Add "Close All" and "Close Others" to context menu
   - **Impact**: Reduces cognitive overload
   - **Effort**: 8 hours (enhance useTemplateEditorTabs hook)

8. **Add Inline Tag Management** 🎯
   - Show tags in template card footer
   - Click to add/remove tags inline (no modal)
   - Autocomplete from existing tags
   - **Impact**: Faster template organization
   - **Effort**: 4 hours (integrate InlineTagEditor into card)

9. **Repurpose Outline Panel** 🎯
   - Rename to "Template Insights"
   - Show:
     - Variable count (e.g., "8 variables to fill")
     - Character count + SMS segments
     - Last modified date
     - Usage count (if analytics added)
   - **Impact**: Contextual awareness while composing
   - **Effort**: 5 hours (refactor TemplateOutlinePanel)

10. **Add Recently Deleted Safety Net** 🎯
    - Add "Recently Deleted" section in sidebar
    - Keep deleted templates for 30 days
    - Add "Restore" and "Permanently Delete" actions
    - **Impact**: Prevents accidental data loss
    - **Effort**: 6 hours (extend TemplateRegistry with soft delete)

**Priority 3: Future Enhancements (High Impact, High Effort)**

11. **Template Snippets System** 🚀
    - Create reusable message fragments (e.g., legal disclaimers, greetings)
    - Insert via `/` command (like Notion)
    - Store separately from full templates
    - **Impact**: Compose faster with consistent language
    - **Effort**: 16 hours (new snippet system)

12. **Smart Variable Suggestions** 🚀
    - Analyze template type (email vs SMS) + tags
    - Suggest relevant variables while typing
    - E.g., auto-suggest {{policy_type}} when user types "your policy"
    - **Impact**: Speeds up template creation
    - **Effort**: 20 hours (NLP analysis + suggestion UI)

13. **Batch Template Operations** 🚀
    - Multi-select templates in sidebar
    - Bulk actions: add tags, change type, export, delete
    - **Impact**: Manage large template libraries efficiently
    - **Effort**: 12 hours (multi-select UI + bulk actions)

14. **Template Analytics Dashboard** 🚀
    - Track usage metrics: times used, last used, success rate
    - Show "Most Used" and "Never Used" templates
    - Suggest archiving unused templates
    - **Impact**: Optimize template library over time
    - **Effort**: 24 hours (analytics system + dashboard)

15. **Advanced Search & Filters** 🚀
    - Full-text search across template content
    - Filter by: type, tags, date created, usage count
    - Save search presets
    - **Impact**: Find templates faster in large libraries
    - **Effort**: 10 hours (enhance TemplateGlobalSearch)

16. **Collaboration Features** 🚀
    - Real-time co-editing (Yjs integration)
    - Comments on templates
    - Share templates with specific teammates
    - **Impact**: Team-based workflows
    - **Effort**: 40+ hours (WebSocket backend + collaboration UI)

#### Design Patterns Library

**Variable Insertion Patterns** (To be refined based on user feedback)

Current pattern:
- Trigger: `{{` opens variable menu
- Select: Arrow keys + Enter
- Render: Blue pill with label
- Edit: Click to open inline input

Proposed improvements:
- Add keyboard shortcut: `Cmd+Shift+V` to open variable picker
- Add recent variables section (last 5 used)
- Add variable descriptions in picker (not just labels)

**Template Card Pattern**

Current:
```
[Template Name]
Tags: [tag1] [tag2]
[Preview text...]
```

Proposed:
```
[Template Name]               [Type badge: Email/SMS]
[Inline tag editor: +tag]
[Preview text... (first 100 chars)]
[Footer: Last used: 2 days ago | Used 12 times]
```

**Compose Form Pattern**

Current: Vertical list of all variables

Proposed:
```
Client Information ▼
  First Name: [____]
  Last Name:  [____]

Policy Details ▼
  Policy Type: [____]
  Coverage:    [____]

[Preview Panel ▼]
```

#### Open Questions for User

*See "Outstanding Questions & Decisions" section above for full list.*

**Top 5 Most Critical:**
1. What should modes be called? (Template Builder vs Design Mode?)
2. Which variable insertion method feels most natural to YOUR users?
3. How many templates does a typical user manage?
4. What happens after composing a message? (Email integration? CRM export?)
5. Do users need to CREATE custom variables, or only use predefined ones?

---

### Session 2: User Feedback & Prioritization
**Discussion Date**: October 28, 2025
**Decision Date**: October 28, 2025
**Status**: ✅ Complete

#### Summary of Decisions Made

**All 26 questions from Session 1 have been answered!** This session focuses on documenting decisions, updating priorities, and identifying new questions for the next implementation phase.

#### Critical Discovery: Template Performance Tracking is Core

**User Quote:** *"One of the core features is tracking template performance and tweaking/refining which templates drive the best results across campaigns."*

**Implication:** Template versioning and analytics are **NOT** nice-to-have features—they are **CORE** to the product value proposition. Priority has been elevated from P3 (v2.0) to **P0 (Critical, v1.2)**.

#### Decisions by Category

**✅ TERMINOLOGY & MENTAL MODELS**

1. **Mode Names: APPROVED**
   - **Decision**: "Template Builder" + "Message Composer"
   - **Rationale**: User confirmed these names provide clarity
   - **Action**: Rename in UI + add tooltips ("Build reusable templates" | "Fill and send messages")
   - **Priority**: P1 (v1.1)

2. **Target Users: DEFINED**
   - **Decision**: Insurance agents and team members, tech level 6/10
   - **Rationale**: Moderate tech-savviness—need balance of power features + discoverability
   - **Impact**: Don't oversimplify UI, but provide helpful onboarding/tooltips
   - **Design Consideration**: Progressive disclosure works well for this user level

3. **Template Ownership: ROADMAP DEFINED**
   - **Decision**: Multi-tier ownership structure
     - **v1.x**: Personal templates (user-only)
     - **v1.3-2.0**: Agency templates (org-wide, requires approval workflow)
     - **v3.0**: Cross-agency/public templates (knowledge sharing platform)
   - **Rationale**: Phased rollout allows MVP first, then team features, then ecosystem
   - **Priority**: Personal (v1.1), Agency (v1.3), Public (v3.0)

4. **Usage Frequency: BEHAVIOR INSIGHTS**
   - **Decision**: Users reuse daily, create infrequently
   - **User Quote**: *"I would like to encourage creating new templates by adding analytics—usage count this week."*
   - **Implication**: Analytics is not just tracking—it's a **behavior driver** to encourage template creation
   - **Action**: Show "This template used 12 times this week" prominently on template cards
   - **Priority**: P0 (v1.2) - Critical for driving desired behavior

**✅ VARIABLE SYSTEM**

5. **Variable Insertion Methods: KEEP ALL THREE**
   - **Decision**: Keep `{{` trigger + toolbar button + sidebar
   - **Rationale**: User prefers flexibility over simplification
   - **Reversal**: Session 1 recommended removing toolbar dropdown—REJECTED
   - **Action**: Keep all three, but add tooltips to guide new users to primary method (`{{`)
   - **Priority**: P1 (v1.1) - Add tooltips only

6. **Variable Grouping: ALREADY IMPLEMENTED**
   - **Decision**: Group variables with accordion lists
   - **User Quote**: *"I grouped them to add accordion lists to help minimize cognitive load."*
   - **Validation**: User already thought through this—good UX instinct
   - **Action**: Ensure grouping is prominent in both sidebar AND compose form
   - **Priority**: P1 (v1.1) - Enhance existing grouping

7. **Custom Variables: REQUIRED**
   - **Decision**: Support BOTH predefined + custom variables
   - **Rationale**: Predefined covers common cases, custom allows flexibility
   - **New Questions**: Where to create? What fields required? Global or template-scoped?
   - **Priority**: P2 (v1.3) - Needs design spec first

8. **Conditional Variables: NOT NECESSARY**
   - **Decision**: No if/then logic needed
   - **Rationale**: Adds complexity without clear use case
   - **Action**: Remove from roadmap
   - **Priority**: N/A (REJECTED)

**✅ TEMPLATE MANAGEMENT**

9. **Template Volume: 10-50 TYPICAL, 50+ POWER USERS**
   - **Decision**: Design for 10-50 templates, support 50+ for edge cases
   - **Implication**: Tab limits would hurt power users—DO NOT limit tabs
   - **Reversal**: Session 1 recommended 10-tab limit—REJECTED
   - **Action**: Provide organizational tools (folders, tags, search) instead of artificial limits
   - **Priority**: P2 (v1.3) - Folder + tag system

10. **Organization: FOLDERS + TAGS HYBRID**
    - **Decision**: Implement BOTH folders AND tags
    - **User Quote**: *"Users are not typically familiar with tag use. But very familiar with folders."*
    - **Rationale**: Tags are powerful but unfamiliar—folders provide familiar mental model
    - **Recommendation**: Folders primary, tags secondary (filter/cross-cutting)
    - **New Questions**: Folder depth? Primary navigation method? Interaction pattern?
    - **Priority**: P2 (v1.3) - Needs design spec first

11. **Template Versioning: 🔴 CRITICAL FEATURE**
    - **Decision**: Full version history with performance tracking
    - **User Quote**: *"Absolutely. One of the core features is tracking template performance and tweaking/refining which templates drive the best results across campaigns."*
    - **Elevation**: Moved from P3 (v2.0) to **P0 (Critical, v1.2)**
    - **Rationale**: Not a nice-to-have—CORE product value
    - **Scope**: Version history + diff view + restore + performance comparison
    - **New Questions**: Display location? Auto-save vs manual? Retention policy?
    - **Priority**: **P0 (v1.2)** - Must build immediately after v1.1

12. **Template Sharing: APPROVAL WORKFLOW REQUIRED**
    - **Decision**: Users can submit templates to Team Leads for agency-wide approval
    - **User Quote**: *"They can submit to Agent or Team Lead to add to Agency Default templates."*
    - **Scope**: Submission UI + approval queue + notifications + feedback loop
    - **New Questions**: Submission process? Approval UI? Notification method? Change requests?
    - **Priority**: P2 (v1.3) - After folders/versioning

13. **Template Archiving: REQUIRED**
    - **Decision**: Support archiving (hide without delete)
    - **Rationale**: Users accumulate templates over time—need to reduce clutter without losing data
    - **Pattern**: Archive section in sidebar (collapsed by default)
    - **Priority**: P2 (v1.2)

**✅ COMPOSE/USAGE FLOW**

14. **Preview Timing: ON-DEMAND TOGGLE**
    - **Decision**: Collapsible preview panel (not always visible)
    - **Rationale**: Saves screen space, user can show/hide as needed
    - **Pattern**: ResizablePanel below compose form, remembers user preference
    - **Priority**: P1 (v1.1)

15. **Export Options: CLIPBOARD ONLY (FOR NOW)**
    - **Decision**: Copy to clipboard only in MVP
    - **Future**: Email/CRM/SMS integrations after 3rd party vendor approval
    - **Rationale**: Vendor approval process takes time—don't block MVP
    - **Roadmap**: v1.x clipboard, v2.0+ integrations
    - **Priority**: P1 (v1.1) - Keep simple

16. **Recipient Management: SINGLE RECIPIENT (FLEXIBLE INPUT)**
    - **Decision**: Single recipient, but allow multiple names typed into one field
    - **User Quote**: *"I just assumed the single recipient could be expanded to include multiple customer names just by typing them in. No need to add additional variable fields that would add another click/navigation point."*
    - **Rationale**: Keep flow simple, avoid adding complexity
    - **Pattern**: Accept comma-separated names in one input
    - **Priority**: P1 (v1.1) - Document behavior

17. **Compose from Scratch: ✅ REQUIRED**
    - **Decision**: Users must be able to compose messages WITHOUT templates
    - **Rationale**: Not every message fits a template—need flexibility
    - **Action**: Add "Blank Message" option in mode switcher
    - **Pattern**: Opens empty editor in Message Composer mode
    - **Priority**: P1 (v1.1) - **NEW FEATURE** (high priority)

**✅ CHARACTER COUNTING → WORD COUNTING**

18-20. **Word Count Preferred Over Character Count**
    - **Decision**: Replace character counter with WORD counter
    - **User Quote**: *"I think word count is more effective measurement to indicate how long a message is."*
    - **Rationale**: RCS protocol = no SMS limits, word count more intuitive for message length
    - **Reversal**: Session 1 recommended "always show character counter"—CHANGED to word counter
    - **New Questions**: Word count only, or + character count? Add reading time? Other stats?
    - **Priority**: P1 (v1.1) - Simple refactor

**✅ TAB MANAGEMENT**

21. **Tab Limits: NO LIMITS**
    - **Decision**: Do NOT impose artificial tab limits
    - **Rationale**: Power users manage 50+ templates, need flexibility
    - **Reversal**: Session 1 recommended 10-tab limit—REJECTED
    - **Alternative Solution**: Provide organizational tools (grouping, recently used) instead
    - **Priority**: P2 (v1.2) - Tab grouping system

22. **Tab Grouping: ✅ WANTED (NEEDS DESIGN HELP)**
    - **Decision**: Implement tab grouping by campaign/project
    - **User Quote**: *"That'd be awesome, but I didn't want to expend the brain power to figure out how to implement this properly. If you can do it for me, that'd be great."*
    - **Opportunity**: User explicitly requested design help—high engagement signal
    - **New Questions**: Auto vs manual grouping? UI pattern? Persistence?
    - **Priority**: P2 (v1.2) - Needs design spec ASAP

23. **Recently Closed Tabs: REQUIRED**
    - **Decision**: Support recovering closed tabs (like browser Ctrl+Shift+T)
    - **Rationale**: Prevents accidental tab close frustration
    - **New Questions**: Access method? Retention count? Persistence across sessions?
    - **Priority**: P2 (v1.2)

**✅ ACCESSIBILITY & PRODUCTIVITY**

24. **Keyboard Shortcuts: SPECIFIC LIST PROVIDED**
    - **Decision**: Critical shortcuts identified
      - Tab navigation
      - Enter to submit
      - Ctrl+S to save
      - Ctrl+K to search
      - `/` to open command menu
      - Arrow navigation
    - **Action**: Audit current shortcuts, fill gaps (Ctrl+N, Ctrl+D, Ctrl+F, Esc)
    - **New Questions**: Additional shortcuts needed? User customization?
    - **Priority**: P2 (v1.2)

25. **Screen Reader Support: ✅ REQUIRED FOR VENDOR APPROVAL**
    - **Decision**: Implement screen reader support (WCAG 2.1 AA)
    - **User Quote**: *"Need to get 3rd party vendor approval so I think this would help."*
    - **Rationale**: Vendor approval likely requires accessibility compliance
    - **Scope**: ARIA labels, keyboard navigation, semantic HTML, focus management
    - **New Questions**: Priority areas? WCAG level (AA vs AAA)?
    - **Priority**: P2 (v1.3) - Before vendor submission

26. **Mobile Usage: ❌ NOT SUPPORTED (SECURITY)**
    - **Decision**: Desktop-only, no mobile/tablet support
    - **User Quote**: *"Would be a security nightmare. I plan on limiting logins from specific domains—leaning on enterprise hardware security policies for data security compliance. This is primarily for State Farm agencies."*
    - **Rationale**: Sensitive insurance data requires enterprise security—mobile too risky
    - **Impact**: No need for mobile-responsive design (side panel widths sufficient)
    - **Priority**: N/A (REJECTED for security reasons)

#### Priority Shifts Summary

**Elevated to P0 (Critical - Must Build):**
1. **Template Versioning System** (was P3/v2.0 → now **P0/v1.2**)
   - Full version history with performance comparison
   - Effort: 32-40 hours
   - Rationale: Core product value, drives user behavior

2. **Template Analytics Dashboard** (was P3/v2.0 → now **P0/v1.2**)
   - Usage metrics (count this week, total uses, last used)
   - Campaign response tracking (semi-automated reminder)
   - Export to CSV/PDF
   - Effort: 24-32 hours
   - Rationale: Encourages template creation, validates template effectiveness

**New P1 Features (Quick Wins):**
3. **Word Count Display** (was character count)
   - Replace character counter with word counter
   - Effort: 2 hours
   - Status: APPROVED

4. **Compose from Scratch** (NEW feature)
   - "Blank Message" option in mode switcher
   - Effort: 2-3 hours
   - Status: REQUIRED

**Elevated to P2 (Strategic):**
5. **Folder + Tag Hybrid System** (was under consideration → now **P2/v1.3**)
   - Folders primary (familiar), tags secondary (powerful)
   - Effort: 12-16 hours
   - Rationale: Users unfamiliar with tags, need familiar mental model

6. **Tab Grouping System** (was under consideration → now **P2/v1.2**)
   - Group tabs by campaign/project
   - Auto + manual grouping options
   - Effort: 8-12 hours
   - Rationale: User explicitly requested design help

**Rejected/Downgraded:**
7. **Remove Toolbar Dropdown** (REJECTED)
   - Session 1 recommended removal → User prefers keeping all 3 methods
   - Status: KEEP as-is, add tooltips only

8. **Tab Limits** (REJECTED)
   - Session 1 recommended 10-tab limit → User manages 50+ templates
   - Status: NO limits, provide organizational tools instead

9. **Conditional Variables** (REJECTED)
   - User: "I don't think this is really necessary"
   - Status: Remove from roadmap

10. **Real-time Collaboration** (REJECTED for MVP)
    - User: "Depends on complexity. I don't think we need for MVP."
    - Status: Defer to v3.0+

11. **Template Testing** (REJECTED)
    - User: "None"
    - Status: Remove from roadmap

#### Behavioral Insights

**User Persona Refinement:**
- **Tech Level**: 6/10 (moderate) - not beginners, not developers
- **Usage Pattern**: Daily reusers, infrequent creators
- **Motivation Gap**: Need incentive to CREATE templates (analytics solves this)
- **Organizational Preference**: Folders (familiar) > Tags (powerful but unfamiliar)
- **Security Context**: State Farm agencies—enterprise security requirements
- **Device Context**: Desktop-only (no mobile due to data sensitivity)

**Design Implications:**
1. **Don't Limit Flexibility**: Keep multiple variable insertion methods, no tab limits
2. **Familiar Patterns Win**: Folders over tags-only, word count over character count
3. **Data-Driven Behavior**: Show usage metrics prominently to encourage template creation
4. **Progressive Complexity**: Simple for daily reuse, powerful for template refinement
5. **Performance Lab Mindset**: Version history + analytics = experimentation platform

#### New Questions for Session 3

**33 new design questions identified** (see Outstanding Questions section above):
- Template Versioning (4 questions)
- Template Analytics (4 questions)
- Tab Grouping (3 questions)
- Folder + Tag System (3 questions)
- Custom Variables (4 questions)
- Approval Workflow (4 questions)
- Keyboard Shortcuts (2 questions)
- Screen Reader Support (2 questions)
- Recently Closed Tabs (4 questions)
- Word Count Display (3 questions)

**Next Steps:**
1. Create detailed design specs for P0 features (versioning + analytics)
2. Design tab grouping system (user requested help)
3. Design folder + tag hybrid navigation
4. Answer Session 3 questions to proceed with implementation

---

## Implementation Priority Matrix

**Last Updated**: October 28, 2025 (Session 2)

### P0 - Critical Features (Must Build)

| # | Feature/Pattern | Impact | Effort | Target Version | Decision Date | Status |
|---|----------------|--------|--------|----------------|---------------|--------|
| 1 | **Template Versioning System** | 🔴 CRITICAL | High (32-40h) | v1.2 | Oct 28, 2025 | ✅ APPROVED |
|   | - Version history with performance comparison | | | | | |
|   | - Side-by-side diff view | | | | | |
|   | - Restore previous versions | | | | | |
|   | - Track which versions performed best | | | | | |
|   | **Rationale**: Core product value—users need to track template performance and refine based on data | | | | | |
| 2 | **Template Analytics Dashboard** | 🔴 CRITICAL | High (24-32h) | v1.2 | Oct 28, 2025 | ✅ APPROVED |
|   | - Usage count (this week, total) | | | | | |
|   | - Last used timestamp | | | | | |
|   | - Campaign response tracking (semi-automated reminder) | | | | | |
|   | - Export to CSV/PDF | | | | | |
|   | **Rationale**: Drives template creation behavior by showing which templates work best | | | | | |

### P1 - Quick Wins (High Impact, Low Effort)

| # | Feature/Pattern | Impact | Effort | Target Version | Decision Date | Status |
|---|----------------|--------|--------|----------------|---------------|--------|
| 3 | Rename modes to "Template Builder" / "Message Composer" | High | Low (1h) | v1.1 | Oct 28, 2025 | ✅ APPROVED |
| 4 | Add hover states to variables in Compose mode | High | Low (30m) | v1.1 | Oct 28, 2025 | ✅ APPROVED |
| 5 | **Replace character counter with WORD counter** | High | Low (2h) | v1.1 | Oct 28, 2025 | ✅ APPROVED |
|   | **Changed from Session 1**: Was "always show character counter" | | | | | |
| 6 | Add variable insertion tooltips (keep all 3 methods) | Med | Low (30m) | v1.1 | Oct 28, 2025 | ✅ APPROVED |
|   | **Changed from Session 1**: Was "remove toolbar dropdown" (REJECTED) | | | | | |
| 7 | Add collapsible preview panel in Compose mode | High | Low (3h) | v1.1 | Oct 28, 2025 | ✅ APPROVED |
| 8 | **Add "Blank Message" compose option** | High | Low (2-3h) | v1.1 | Oct 28, 2025 | ✅ REQUIRED |
|   | **NEW FEATURE**: Compose from scratch without template | | | | | |

### P2 - Strategic Improvements (High Impact, Medium/High Effort)

| # | Feature/Pattern | Impact | Effort | Target Version | Decision Date | Status |
|---|----------------|--------|--------|----------------|---------------|--------|
| 9 | Group variables into collapsible sections (enhance existing) | High | Med (4-6h) | v1.2 | Oct 28, 2025 | ✅ APPROVED |
| 10 | **Tab Grouping System** | High | Med (8-12h) | v1.2 | Oct 28, 2025 | ✅ APPROVED |
|   | - Auto-group by campaign tag + manual override | | | | | |
|   | - Persistent across sessions (localStorage) | | | | | |
|   | **User requested design help**: "That'd be awesome, but I didn't want to expend the brain power..." | | | | | |
| 11 | Recently Closed Tabs Recovery | Med | Med (4-6h) | v1.2 | Oct 28, 2025 | ✅ APPROVED |
|   | - Ctrl+Shift+T shortcut + sidebar section | | | | | |
| 12 | Template Archiving | Med | Med (4h) | v1.2 | Oct 28, 2025 | ✅ APPROVED |
| 13 | Add inline tag management to template cards | Med | Med (4h) | v1.2 | Oct 28, 2025 | ✅ APPROVED |
| 14 | Repurpose outline panel as "Template Insights" | Med | Med (5h) | v1.2 | Oct 28, 2025 | ✅ APPROVED |
|   | - Show word count, variable count, usage stats | | | | | |
| 15 | Add "Recently Deleted" safety net | High | Med (6h) | v1.2 | Oct 28, 2025 | ✅ APPROVED |
| 16 | Enhanced Keyboard Shortcuts | Med | Med (4-6h) | v1.2 | Oct 28, 2025 | ✅ APPROVED |
|   | - Ctrl+N, Ctrl+D, Ctrl+F, Esc, etc. | | | | | |
|   | **User specified**: Tab, Enter, Ctrl+S, Ctrl+K, /, arrows | | | | | |
| 17 | **Folder + Tag Hybrid System** | High | High (12-16h) | v1.3 | Oct 28, 2025 | ✅ APPROVED |
|   | - Folders primary (familiar), tags secondary (powerful) | | | | | |
|   | **Rationale**: "Users are not typically familiar with tag use. But very familiar with folders." | | | | | |
| 18 | Custom Variable Creation Flow | High | High (8-12h) | v1.3 | Oct 28, 2025 | ✅ APPROVED |
|   | - Inline creation + Variable Manager | | | | | |
| 19 | Template Approval Workflow | High | High (12-16h) | v1.3 | Oct 28, 2025 | ✅ APPROVED |
|   | - Submit to Agency Templates | | | | | |
|   | - Approval queue for Team Leads | | | | | |
| 20 | Screen Reader Support (WCAG 2.1 AA) | High | High (16-20h) | v1.3 | Oct 28, 2025 | ✅ REQUIRED |
|   | **Rationale**: Needed for 3rd party vendor approval | | | | | |
| 21 | Advanced Search & Filters | Med | Med (10h) | v1.3 | Oct 28, 2025 | ✅ APPROVED |

### P3 - Future Enhancements (Post-MVP)

| # | Feature/Pattern | Impact | Effort | Target Version | Decision Date | Status |
|---|----------------|--------|--------|----------------|---------------|--------|
| 22 | Template Snippets System | High | High (16h) | v2.0 | Oct 28, 2025 | ✅ APPROVED |
|   | - Reusable message fragments | | | | | |
| 23 | Smart Suggestions (Browser AI APIs) | Med | High (20h) | v2.0 | Oct 28, 2025 | 🤔 Under Consideration |
|   | **User note**: "We could leverage Google Chrome and Microsoft local browser based AI Agent APIs—Very much a nice to have." | | | | | |
| 24 | Batch Template Operations | Med | High (12h) | v2.0 | Oct 28, 2025 | 🤔 Need to think more |
| 25 | Command Menu Expansion | Low | Med (6-8h) | v2.0 | Oct 28, 2025 | 🤔 Under Consideration |
|   | **User note**: "Already have this with `/` command—just needs expansion" | | | | | |
| 26 | Cross-Agency Template Sharing | High | Very High (40h+) | v3.0 | Oct 28, 2025 | ✅ ROADMAP |
|   | - Public template marketplace | | | | | |
|   | - Knowledge sharing across State Farm agencies | | | | | |

### REJECTED Features (Not Needed)

| # | Feature/Pattern | Reason | Decision Date | Status |
|---|----------------|--------|---------------|--------|
| R1 | Remove toolbar variable dropdown | User prefers keeping all 3 methods (flexibility) | Oct 28, 2025 | ❌ REJECTED |
| R2 | Limit tabs to 10 | Power users manage 50+ templates—limits hurt UX | Oct 28, 2025 | ❌ REJECTED |
| R3 | Conditional variables (if/then logic) | "I don't think this is really necessary" | Oct 28, 2025 | ❌ REJECTED |
| R4 | Real-time collaboration | Too complex for MVP—defer to v3.0+ | Oct 28, 2025 | ❌ REJECTED FOR MVP |
| R5 | Template testing (send test messages) | Not needed | Oct 28, 2025 | ❌ REJECTED |
| R6 | Inline spell check | Edge does this automatically | Oct 28, 2025 | ❌ REJECTED |
| R7 | Mobile/tablet support | Security nightmare for insurance data | Oct 28, 2025 | ❌ REJECTED |

**Versioning Strategy (Updated):**

- **v1.1 (Quick Wins)**: 1-2 weeks
  - Mode renaming, word counter, hover states, tooltips
  - Preview panel, compose from scratch
  - Total effort: ~10 hours

- **v1.2 (Core Features with Analytics & Versioning)**: 3-4 weeks
  - **🔴 CRITICAL**: Template versioning system (32-40h)
  - **🔴 CRITICAL**: Template analytics dashboard (24-32h)
  - Tab grouping, recently closed tabs, archiving
  - Enhanced shortcuts, inline tags, template insights
  - Recently deleted safety net
  - Total effort: ~85-110 hours

- **v1.3 (Organization & Compliance)**: 3-4 weeks
  - Folder + tag hybrid system
  - Custom variable creation
  - Template approval workflow
  - Screen reader support (vendor approval)
  - Advanced search & filters
  - Total effort: ~60-80 hours

- **v2.0 (Power Features)**: 2-3 months
  - Template snippets
  - Smart suggestions (browser AI)
  - Batch operations
  - Command menu expansion

- **v3.0 (Ecosystem)**: 3-6 months
  - Cross-agency template sharing
  - Public template marketplace
  - Knowledge sharing platform

---

## Design Decisions Log

### Session 2 Decisions (October 28, 2025)

**All 26 questions answered—priorities completely revised based on user feedback.**

#### Critical Priority Shifts

1. **Template Versioning** (Elevated P3 → P0)
   - **What**: Full version history with performance comparison, diff view, restore
   - **Why**: User quote: "One of the core features is tracking template performance and tweaking/refining which templates drive the best results across campaigns."
   - **Impact**: Changed from "nice-to-have" to CORE product value
   - **When**: October 28, 2025
   - **Who**: User decision

2. **Template Analytics** (Elevated P3 → P0)
   - **What**: Usage metrics, campaign response tracking, CSV/PDF export
   - **Why**: Drives template creation behavior—users reuse daily but create infrequently
   - **Impact**: Analytics acts as behavior driver, not just reporting tool
   - **When**: October 28, 2025
   - **Who**: User decision

3. **Word Count Over Character Count** (Changed from Session 1)
   - **What**: Replace character counter with word counter in editor footer
   - **Why**: RCS protocol removes SMS limits, word count more intuitive for message length
   - **Impact**: Aligns with user mental model (words > characters for measuring "length")
   - **When**: October 28, 2025
   - **Who**: User decision

#### Organizational Strategy Decisions

4. **Folders + Tags Hybrid** (Elevated from "Under Consideration" → P2)
   - **What**: Implement BOTH folders (primary) and tags (secondary)
   - **Why**: User quote: "Users are not typically familiar with tag use. But very familiar with folders."
   - **Impact**: Familiar mental model wins over powerful-but-unfamiliar pattern
   - **When**: October 28, 2025
   - **Who**: User decision

5. **Tab Grouping** (Elevated from "Under Consideration" → P2)
   - **What**: Group tabs by campaign/project with auto + manual options
   - **Why**: User quote: "That'd be awesome, but I didn't want to expend the brain power to figure out how to implement this properly. If you can do it for me, that'd be great."
   - **Impact**: User explicitly requested design help—high engagement signal
   - **When**: October 28, 2025
   - **Who**: User request

6. **No Tab Limits** (Reversed from Session 1)
   - **What**: Do NOT impose 10-tab limit
   - **Why**: Power users manage 50+ templates—artificial limits hurt workflow
   - **Impact**: Provide organizational tools (grouping, search) instead of constraints
   - **When**: October 28, 2025
   - **Who**: User decision

#### Variable System Decisions

7. **Keep All 3 Variable Insertion Methods** (Reversed from Session 1)
   - **What**: Keep `{{` trigger + toolbar button + sidebar
   - **Why**: User prefers flexibility over simplification
   - **Impact**: Add tooltips to guide new users, don't remove options
   - **When**: October 28, 2025
   - **Who**: User decision

8. **Custom Variables Required** (Elevated from "Question" → P2)
   - **What**: Support BOTH predefined + custom variable creation
   - **Why**: Predefined covers common cases, custom allows edge cases
   - **Impact**: Needs design spec for creation flow, validation, scope
   - **When**: October 28, 2025
   - **Who**: User decision

9. **No Conditional Variables** (Removed from roadmap)
   - **What**: Do NOT implement if/then logic
   - **Why**: User quote: "I don't think this is really necessary"
   - **Impact**: Simplifies system, removes complexity with no clear use case
   - **When**: October 28, 2025
   - **Who**: User decision

#### Workflow Decisions

10. **Compose from Scratch** (NEW required feature)
    - **What**: Add "Blank Message" option to compose without template
    - **Why**: Not every message fits a template—need flexibility
    - **Impact**: Opens empty editor in Message Composer mode
    - **When**: October 28, 2025
    - **Who**: User decision

11. **Preview: On-Demand Toggle** (Confirmed)
    - **What**: Collapsible preview panel (not always visible)
    - **Why**: Saves screen space in side panel, user controls visibility
    - **Impact**: ResizablePanel below form, remembers preference
    - **When**: October 28, 2025
    - **Who**: User decision

12. **Clipboard-Only Export** (Confirmed for MVP)
    - **What**: Copy to clipboard only (no email/CRM/SMS integrations yet)
    - **Why**: 3rd party vendor approval takes time—don't block MVP
    - **Impact**: Integrations deferred to v2.0+ after vendor approval
    - **When**: October 28, 2025
    - **Who**: User decision

#### Technical Decisions

13. **RCS Protocol = No SMS Limits** (Specification clarified)
    - **What**: No 160-character SMS limits (RCS supports PDFs and photos)
    - **Why**: Modern messaging protocol removes legacy constraints
    - **Impact**: Character counting less critical, word count more relevant
    - **When**: October 28, 2025
    - **Who**: User technical clarification

14. **Desktop-Only (No Mobile)** (Security decision)
    - **What**: Desktop-only, no mobile/tablet support
    - **Why**: User quote: "Would be a security nightmare. This is primarily for State Farm agencies."
    - **Impact**: No need for mobile-responsive design, enterprise security focus
    - **When**: October 28, 2025
    - **Who**: User security policy decision

15. **Screen Reader Support Required** (Elevated to P2)
    - **What**: WCAG 2.1 AA compliance (ARIA labels, keyboard nav, semantic HTML)
    - **Why**: Needed for 3rd party vendor approval
    - **Impact**: Accessibility compliance becomes v1.3 gate requirement
    - **When**: October 28, 2025
    - **Who**: User vendor requirement

#### User Persona Insights

16. **Tech Level 6/10** (Moderate)
    - **What**: Insurance agents and team members, moderate tech-savviness
    - **Why**: Not beginners, not developers—need balance of power + discoverability
    - **Impact**: Progressive disclosure works well, don't oversimplify
    - **When**: October 28, 2025
    - **Who**: User persona definition

17. **Daily Reusers, Infrequent Creators** (Behavior insight)
    - **What**: Users reuse templates daily but create new ones infrequently
    - **Why**: Analytics will encourage template creation by showing what works
    - **Impact**: Design for reuse first, but incentivize creation via data
    - **When**: October 28, 2025
    - **Who**: User behavioral insight

18. **10-50 Templates Typical, 50+ for Power Users** (Scale insight)
    - **What**: Typical user manages 10-50 templates, edge cases 50+
    - **Why**: Need organizational tools for scale, not artificial limits
    - **Impact**: Tab grouping, folders, search become critical
    - **When**: October 28, 2025
    - **Who**: User scale definition

#### Future Features Planned

19. **Template Approval Workflow** (P2, v1.3)
    - **What**: Users submit templates to Team Leads for agency-wide approval
    - **Why**: Quality control for shared templates
    - **Impact**: Needs submission UI, approval queue, notifications
    - **When**: October 28, 2025
    - **Who**: User workflow definition

20. **Cross-Agency Sharing** (P3, v3.0)
    - **What**: Public template marketplace for knowledge sharing across State Farm agencies
    - **Why**: Drive best practices across organization
    - **Impact**: Distant future feature, requires community features
    - **When**: October 28, 2025
    - **Who**: User vision statement

#### Rejected Features

21. **No Real-time Collaboration** (Rejected for MVP)
    - **What**: Do NOT implement real-time co-editing
    - **Why**: User quote: "Depends on complexity. I don't think we need for MVP."
    - **Impact**: Defer to v3.0+ if still needed
    - **When**: October 28, 2025
    - **Who**: User decision

22. **No Template Testing** (Rejected)
    - **What**: Do NOT implement test message sending
    - **Why**: User quote: "None"
    - **Impact**: Remove from roadmap entirely
    - **When**: October 28, 2025
    - **Who**: User decision

23. **No Inline Spell Check** (Rejected)
    - **What**: Do NOT implement custom spell checking
    - **Why**: Microsoft Edge does this automatically
    - **Impact**: Rely on browser native functionality
    - **When**: October 28, 2025
    - **Who**: User technical note

---

## UX Principles for This Project

[To be refined based on user feedback and design sessions]

### Core Principles Discovered

1. **Side Panel-First Design**
   - Optimize for 360px-800px widths
   - Primary target: 480px (comfortable for most users)
   - Information density matters: 13px base font, tight spacing

2. **Keyboard-First Productivity**
   - Power users should never need mouse
   - Shortcuts for common actions (Cmd+W, Cmd+Tab, {{)
   - Command palette for discoverability

3. **Progressive Disclosure**
   - Don't overwhelm with all options at once
   - Show advanced features only when needed
   - Contextual help and tooltips

4. **Forgiving by Default**
   - Auto-save everything
   - Undo/redo always available
   - Soft deletes with recovery period
   - Dirty indicators prevent data loss

5. **Content-First**
   - Editor takes center stage
   - Minimize chrome and decoration
   - Let the message be the focus

**NEW PRINCIPLES FROM SESSION 2:**

6. **Data-Driven Template Refinement**
   - Show usage metrics prominently to drive behavior
   - Analytics isn't just reporting—it's a behavior driver
   - Performance comparison enables experimentation ("performance lab" mindset)
   - User quote: "I would like to encourage creating new templates by adding analytics"

7. **Flexible Workflows Over Opinionated Constraints**
   - Keep multiple methods for same task ({{ + toolbar + sidebar)
   - Don't impose artificial limits (no 10-tab cap)
   - Provide organizational tools instead of restrictions
   - User prefers flexibility even if it means more options

8. **Familiar Metaphors + Powerful Features**
   - Folders (familiar) over tags-only (powerful but unfamiliar)
   - Word count (intuitive) over character count (technical)
   - Balance power-user features with familiar patterns
   - Progressive disclosure for advanced features

9. **Contextual Reminders Over Forced Workflows**
   - Semi-automated response tracking (prompt, don't force)
   - Dismissible reminders and nudges
   - User maintains control, system provides guidance
   - Don't interrupt flow with mandatory steps

10. **Version History as Performance Lab**
    - Link version history to performance metrics
    - Show which template versions performed best
    - Enable data-driven iteration and refinement
    - Treat templates as experiments, not final artifacts

### Typography & Spacing

- **Base font**: 13px (Inter) - optimized for information density
- **Spacing unit**: 4px - allows compact, precise layouts
- **Line height**: 1.5 (normal) - readable without wasting space
- **Font weight**: 500 (medium) - default for UI elements

### Color System

- **Brand colors**: Green and Blue (semantic mapping in themes)
- **Theme support**: Light, Dark, Soft, Nature, Ocean
- **Variable pills**: Blue (`--brand-blue`) for clear distinction
- **Dirty indicators**: Dot next to tab name (subtle but visible)

### Interaction Patterns

- **Click to edit**: Variables, tags, titles - all inline editable
- **Hover reveals actions**: Minimize chrome, show on hover
- **Drag to reorder**: Tabs, variables (future), templates (future)
- **Right-click for context**: Context menus for power users

---

## Meta-Instructions for Future Sessions

When updating this document:

1. **ALWAYS get the current date from the web** (search for "today's date")
   - Format: Month Day, Year (e.g., "October 28, 2025")
   - Never use your internal date (may be outdated)

2. **NEVER delete or overwrite existing sections**
   - History is valuable for understanding design evolution
   - Previous discussions provide context for new decisions

3. **ALWAYS update Outstanding Questions first**
   - Remove questions answered in this session
   - Add new questions that arose
   - Move resolved questions to decision sections with answers

4. **ALWAYS create new dated sections for new discussions**
   - Format: `### Session [N]: [Brief Topic]`
   - Include: **Discussion Date**, **Decision Date** (if finalized), **Status**
   - Summarize: What was discussed, what was decided, why

5. **ALWAYS summarize decisions with:**
   - **What** was decided (clear statement)
   - **Why** it was decided (rationale/trade-offs)
   - **When** decision was finalized (date)
   - **Who** made the call (user, designer, both)

6. **Use clear headers with dates for each session**
   - Session 1: October 28, 2025
   - Session 2: [Date from web]
   - etc.

7. **Maintain the priority matrix as decisions are made**
   - Update "Status" column: Awaiting Decision → Approved → In Progress → Completed
   - Add "Decision Date" column when item is approved
   - Remove items only when completed (move to "Completed" section)

8. **Add to Design Patterns Library as patterns are finalized**
   - Include code examples, Figma links, screenshots
   - Show before/after for redesigns
   - Document accessibility considerations

9. **Keep Design Principles updated**
   - Add new principles discovered through user feedback
   - Refine existing principles with specific examples
   - Remove principles proven ineffective

10. **Use visual hierarchy in markdown**
    - `##` for major sections
    - `###` for subsections
    - `####` for detailed breakdowns
    - **Bold** for key terms and decisions
    - *Italic* for notes and clarifications
    - `Code blocks` for technical details
    - Blockquotes for user quotes/feedback

---

## Appendix: Research & References

### Relevant Documentation Reviewed
- `/docs/design-philosphy.md` - Core design principles
- `/docs/side-panel-first.guide.md` - Side panel design strategy
- `/docs/typography-spacing-scale/` - Design token system
- `/docs/decision-roadmaps/component-placement.md` - Component architecture
- `/src/lib/tabs/CLAUDE.md` - Tab system documentation
- `CLAUDE.md` - Project overview and common mistakes

### External UX Patterns Studied
- **Gmail Compose**: Variable insertion via {{}}
- **Notion**: `/` commands for quick actions
- **VS Code**: Tab management, keyboard shortcuts
- **Superhuman**: Keyboard-first productivity
- **Linear**: Clean UI, progressive disclosure
- **Mailchimp**: Template builder + merge tags

### Industry Best Practices
- **Character limits**: SMS 160 chars (GSM-7), Email mobile preview ~140 chars
- **Form UX**: Autofocus first field, group related inputs, show progress
- **Undo/Redo**: Ctrl+Z / Ctrl+Shift+Z (or Cmd on Mac)
- **Tab limits**: Browser tabs typically cap at 10-20 visible tabs
- **Soft deletes**: 30-day retention standard for "Recently Deleted"

### Accessibility Standards
- **WCAG 2.1 AA**: Target compliance level
- **Keyboard navigation**: All actions accessible via keyboard
- **Color contrast**: 4.5:1 minimum for text
- **Focus indicators**: Visible on all interactive elements
- **Screen reader support**: ARIA labels, semantic HTML

---

**Next Steps:**
1. User reviews this document and answers outstanding questions
2. Designer updates document with user feedback (new session section)
3. Prioritize recommendations based on user goals
4. Create detailed design specs for approved items
5. Begin implementation of Priority 1 items

---

*Document created: October 28, 2025*
*Last updated: October 28, 2025 (Session 2)*
*Version: 2.0 (User Feedback & Prioritization)*

---

## Document Change Log

**Version 2.0 (October 28, 2025) - Session 2: User Feedback & Prioritization**
- All 26 Session 1 questions answered
- 33 new Session 3 questions identified
- Priority matrix completely revised (P0-P3 + Rejected)
- Template versioning + analytics elevated to P0 (Critical)
- 23 design decisions documented
- 5 new UX principles added
- Comprehensive behavioral insights captured

**Version 1.0 (October 28, 2025) - Session 1: Initial UX Audit**
- Initial codebase exploration and UX audit
- 26 questions for user feedback
- 16 initial recommendations
- Design patterns library started
- Implementation priority matrix created
