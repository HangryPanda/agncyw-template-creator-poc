urrent Save Mechanism

  Auto-Save Flow:
  1. OnChangePlugin fires on every editor change (typing,
  formatting, etc.)
  2. handleUpdateTemplateContent() is called in App.tsx (line
  230-236)
  3. updateTemplate() immediately persists to templateRegistry
  4. Template Registry writes to localStorage immediately (no
  debounce, no delay)

  Key Finding: You have instant auto-save on every keystroke, not
  debounced auto-save. This is actually closer to "continuous save"
   than traditional auto-save.

  Current Dirty State Mechanism

  Dirty State Tracking:
  1. DirtyStatePlugin listens to Lexical's CAN_UNDO_COMMAND
  2. If the undo stack has items (canUndo === true), the editor is
  marked dirty
  3. When markClean() is called, it clears Lexical's history stack
  via CLEAR_HISTORY_COMMAND

  Key Finding: "Dirty" currently means "has items in undo stack,"
  NOT "has unsaved changes." This is a history-based dirty state,
  not a save-based dirty state.

  The Mismatch

  Your dirty state and save mechanism are decoupled:
  - Save: Happens instantly on every change (writes to
  localStorage)
  - Dirty State: Tracks whether undo stack has entries
  (history-based)
  - Result: A template can be "dirty" (undo stack not empty) even
  though it's already saved to localStorage

  This is actually similar to Google Docs / Notion's approach:
  auto-save happens continuously, but the undo stack persists for
  the session.

  ---
  Best Practices: "Revert" in Auto-Save Systems

  Since you asked about best practices, here's how leading
  productivity apps handle "revert" with auto-save:

  Approach 1: Notion / Google Docs (No "Revert", History-Based)

  - No manual Save button at all
  - No "Revert to Last Saved" button
  - Instead: "Version History" (see all auto-save snapshots)
  - Users can browse history and restore any previous version

  Approach 2: VS Code (Hybrid: Auto-Save + Dirty Indicator)

  - Auto-save writes to disk every 1 second (debounced)
  - Dirty indicator (dot) shows unsaved changes since last
  auto-save
  - "Revert File" goes back to last saved state (last auto-save)
  - Undo/Redo work independently of save state

  Approach 3: Figma (Continuous Save + Named Checkpoints)

  - Continuous auto-save (every change saved instantly)
  - No dirty indicator (everything is always saved)
  - Version History lets you name and browse checkpoints
  - "Restore This Version" goes back to any checkpoint

  Approach 4: Linear / Airtable (Auto-Save + "Discard Changes")

  - Auto-save after debounce (2 seconds)
  - Dirty indicator shows pending auto-save
  - "Discard Changes" reverts to state when editor was opened (not
  last auto-save)

  ---
  Recommendation: Phase 1 Adapted to Your Architecture

  Given your instant auto-save system, here are three
  implementation options:

  Option A: Session-Based Revert (Recommended)

  Best fit for your current architecture

  Concept: "Revert to Session Start" instead of "Revert to Last
  Saved"

  // When tab opens, snapshot the initial state
  const sessionStartState = template.content;

  // Button: "Discard Changes"
  // Behavior: Restore sessionStartState, clear undo stack

  UX:
  - Button label: "Discard Changes" (not "Revert")
  - Tooltip: "Undo all changes made since opening this template"
  - Confirmation dialog: "Discard all changes made in this
  session?"

  Pros:
  - Works with your existing instant auto-save
  - Matches user mental model: "I want to undo everything I just
  did"
  - Simple to implement (just store initial state when tab opens)

  Cons:
  - Only goes back to session start, not to arbitrary save points
  - If user closes and reopens tab, session resets

  ---
  Option B: Undo-Stack Revert (Simplest)

  Minimal changes to existing code

  Concept: "Undo All" — rewind the entire undo stack

  // Button: "Undo All Changes"
  // Behavior: Execute UNDO_COMMAND until canUndo === false

  UX:
  - Button label: "Undo All"
  - Tooltip: "Undo all changes in this editing session"
  - Only enabled when isDirty === true (undo stack not empty)

  Pros:
  - Uses existing Lexical history mechanism
  - Zero new state management needed
  - Respects undo limits (Lexical has max undo stack size)

  Cons:
  - Limited by Lexical's undo stack size (default: 20 entries)
  - If stack overflows, can't go back to session start
  - Doesn't work if user cleared history manually (Cmd+K)

  ---
  Option C: Named Checkpoints (Future-Proof, More Work)

  Inspired by Figma/Notion

  Concept: Add explicit "Save Checkpoint" button that creates named
   snapshots

  interface Checkpoint {
    timestamp: number;
    label: string;
    content: EditorState;
  }

  // Button 1: "Create Checkpoint" (optional, user-initiated)
  // Button 2: "View History" → shows list of checkpoints
  // Auto-create checkpoint on tab open (session start)

  UX:
  - "Create Checkpoint" button (Cmd+S)
  - "View History" dropdown shows checkpoints
  - "Restore" button next to each checkpoint

  Pros:
  - Most powerful and flexible
  - Aligns with modern productivity tools (Notion, Figma)
  - Sets you up for future features (shared checkpoints, named
  versions)

  Cons:
  - Significant implementation work
  - Requires new UI components (history panel)
  - Need to decide: where to store checkpoints? (localStorage?
  memory?)

  ---
  My Recommendation: Start with Option A (Session-Based Revert)

  Why Option A is best for Phase 1:

  1. Works with your instant auto-save — no changes to save
  mechanism needed
  2. Matches user intent — "I want to undo everything I just did"
  3. Simple to implement — just snapshot initial state when tab
  opens
  4. Clear UX — "Discard Changes" is unambiguous
  5. Sets you up for Option C — session start checkpoint becomes
  your first checkpoint

  Implementation Plan for Option A

  Step 1: Add session state to tab manager
  interface TabSession {
    tabId: string;
    initialContent: EditorState; // Snapshot when tab opened
    openedAt: number;
  }

  const [tabSessions, setTabSessions] = useState<Map<string,
  TabSession>>();

  Step 2: Snapshot on tab open
  const handleOpenTab = (tabId: string) => {
    const template = templates.find(t => t.id === tabId);
    if (!template) return;

    // Snapshot initial state
    setTabSessions(prev => new Map(prev).set(tabId, {
      tabId,
      initialContent: structuredClone(template.content), // Deep 
  copy
      openedAt: Date.now(),
    }));

    openTab(tabId);
  };

  Step 3: Add "Discard Changes" button
  const handleDiscardChanges = () => {
    if (!activeTabId) return;

    const session = tabSessions.get(activeTabId);
    if (!session) return;

    const confirmed = window.confirm(
      'Discard all changes made since opening this template?'
    );

    if (!confirmed) return;

    // Restore initial content
    updateTemplate({
      ...selectedTemplate,
      content: session.initialContent,
    });

    // Clear dirty state
    markTabDirty(activeTabId, false);

    // Optional: Clear undo stack to prevent confusion
    editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
  };

  Step 4: UI Button
  <Button
    onClick={handleDiscardChanges}
    variant="ghost"
    disabled={!dirtyTabs.has(activeTabId)}
    title="Discard all changes made since opening this template"
  >
    <RotateCcw className="h-4 w-4 mr-2" />
    Discard Changes
  </Button>

  ---
  Next Steps

  Would you like me to:

  1. Implement Option A (Session-Based Revert) right now?
  2. Implement Option B (Undo-Stack Revert) as a quicker
  alternative?
  3. Audit your tab manager to see if session state is already
  partially there?
  4. Design the UI for where the "Discard Changes" button should
  live?
  5. Plan Option C (Named Checkpoints) as a future Phase 2?

  Let me know which direction you want to go, and I'll implement it
   for you!