# Canvas Tabs Management System

A modular, reusable VS Code-style tab navigation system for managing workspace canvases in React applications.

## Terminology

**Canvas** = The workspace for a single item (template, document, design file, etc.)
**Canvas Tab** = Visual representation of an open canvas in the tab bar
**Canvas Tabs Control** = The UI component showing all open canvas tabs
**Text Editor** = Lexical editor component within a canvas (distinct from canvas navigation)

This naming avoids confusion with generic "tabs" (HTML tabs, UI component tabs) and clearly indicates this is for workspace/canvas navigation.

---

## Quick Start

### Using Core System (Generic Canvas Navigation)

```typescript
import { useCanvasTabsManager, CanvasTabsControl } from '@/lib/canvasTabs/core';

function MyApp() {
  const {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    setActiveTab,
    reorderTabs,
  } = useCanvasTabsManager<string>({
    storageKey: 'my_app_canvas_tabs',
    persist: true,
    maxTabs: 10,
  });

  const items = new Map([
    ['canvas1', { name: 'Document 1.docx', icon: '📄' }],
    ['canvas2', { name: 'Design 1.fig', icon: '🎨' }],
  ]);

  return (
    <CanvasTabsControl
      tabs={tabs}
      activeTabId={activeTabId}
      items={items}
      onTabClick={setActiveTab}
      onTabClose={closeTab}
      onTabReorder={reorderTabs}
      renderTabContent={(item) => (
        <span>{item.icon} {item.name}</span>
      )}
    />
  );
}
```

### Using Lexical Integration (Template Editor)

```typescript
import {
  useTemplateCanvasTabs,
  TemplateCanvasTabsControl,
  DirtyStatePlugin
} from '@/lib/canvasTabs/integrations/lexical';

function TemplateApp() {
  const {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    setActiveTab,
    dirtyTabs,
    markTabDirty,
  } = useTemplateCanvasTabs();

  return (
    <>
      {/* Canvas tabs control with dirty indicators */}
      <TemplateCanvasTabsControl
        tabs={tabs}
        activeTabId={activeTabId}
        templates={templates}
        modifiedTabs={dirtyTabs}
        onTabClick={setActiveTab}
        onTabClose={closeTab}
      />

      {/* Lexical editor with dirty tracking */}
      <LexicalComposer>
        <DirtyStatePlugin
          onDirtyChange={(isDirty) => markTabDirty(activeTabId, isDirty)}
        />
      </LexicalComposer>
    </>
  );
}
```

---

## Core API

### `useCanvasTabsManager<T>(options)`

Manages canvas tab state.

**Options:**
- `storageKey: string` - localStorage key (e.g., 'myapp_canvas_tabs')
- `persist?: boolean` - Enable persistence (default: true)
- `maxTabs?: number` - Maximum canvas tabs (LRU eviction)
- `onTabChange?: (tabId) => void` - Callback when active canvas changes
- `onTabClose?: (tabId) => boolean | void` - Callback before close (return false to cancel)
- `initialTabs?: T[]` - Initial canvas tabs to open

**Returns:**
- `tabs: T[]` - Array of canvas tab IDs
- `activeTabId: T | null` - Active canvas tab ID
- `openTab: (tabId) => void` - Open canvas tab
- `closeTab: (tabId) => void` - Close canvas tab
- `setActiveTab: (tabId) => void` - Switch canvas tab
- `reorderTabs: (from, to) => void` - Reorder canvas tabs
- `closeOtherTabs: (tabId) => void` - Close other canvas tabs
- `closeTabsToRight: (tabId) => void` - Close canvas tabs to right
- `closeAllTabs: () => void` - Close all canvas tabs
- `isTabOpen: (tabId) => boolean` - Check if canvas tab is open

### `<CanvasTabsControl />`

VS Code-style canvas tabs UI component.

**Props:**
- `tabs: T[]` - Canvas tab IDs
- `activeTabId: T | null` - Active canvas tab
- `items: Map<T, Item>` - Canvas tab data
- `onTabClick: (tabId) => void` - Canvas tab click handler
- `onTabClose: (tabId) => void` - Close button handler
- `renderTabContent: (item, isActive) => ReactNode` - Canvas tab renderer
- `onTabReorder?: (from, to) => void` - Drag-and-drop handler
- `modifiedTabs?: Set<T>` - Canvas tabs with unsaved changes
- `enableDragReorder?: boolean` - Enable drag-and-drop
- `enableContextMenu?: boolean` - Enable right-click menu

---

## Lexical Integration API

### `useTemplateCanvasTabs()`

Template-specific canvas tabs with dirty tracking.

**Returns:** Extends `useCanvasTabsManager` with:
- `dirtyTabs: Set<string>` - Canvas tabs with unsaved changes
- `markTabDirty: (tabId, isDirty) => void` - Mark canvas tab dirty/clean

**Features:**
- Confirmation dialog for closing dirty canvas tabs
- Persists to `insurance_template_canvas_tabs` localStorage key
- Max 15 canvas tabs with LRU eviction

### `<TemplateCanvasTabsControl />`

Template-specific canvas tabs control with email/SMS icons.

**Props:**
- `tabs: string[]` - Template canvas tab IDs
- `activeTabId: string | null` - Active template canvas tab
- `templates: Template[]` - All templates
- `modifiedTabs: Set<string>` - Templates with unsaved changes
- `onTabClick, onTabClose, onTabReorder` - Event handlers

**Features:**
- Email icon (✉️) or SMS icon (💬) based on template type
- Blue dot for modified templates
- Full drag-and-drop and context menu support

---

## File Structure

```
src/lib/canvasTabs/
├── CANVAS_TABS.md                    # This documentation
├── index.ts                          # Top-level barrel export
│
├── core/                             # Generic canvas tabs system
│   ├── types.ts                      # TypeScript definitions
│   ├── useCanvasTabsManager.ts       # Canvas tab state management
│   ├── CanvasTabsControl.tsx         # VS Code-style UI component
│   └── index.ts                      # Core barrel exports
│
└── integrations/                     # Editor-specific integrations
    ├── index.ts                      # Integrations barrel export
    │
    └── lexical/                      # Lexical editor integration
        ├── useLexicalDirtyState.ts   # Dirty state tracking
        ├── DirtyStatePlugin.tsx      # Headless dirty state plugin
        ├── useTemplateCanvasTabs.ts  # Template-specific wrapper
        ├── TemplateCanvasTabsControl.tsx  # Template canvas tabs UI
        └── index.ts                  # Lexical integration exports
```

---

## Migration from Old `tabs` System

### Import Path Changes

**Before:**
```typescript
import { useTabManager, TabBar } from '@/lib/tabs/core';
import { useTemplateEditorTabs, TemplateEditorTabs } from '@/lib/tabs/integrations/lexical';
```

**After:**
```typescript
import { useCanvasTabsManager, CanvasTabsControl } from '@/lib/canvasTabs/core';
import { useTemplateCanvasTabs, TemplateCanvasTabsControl } from '@/lib/canvasTabs/integrations/lexical';
```

### Function/Component Name Changes

| Old Name | New Name |
|----------|----------|
| `useTabManager` | `useCanvasTabsManager` |
| `TabBar` | `CanvasTabsControl` |
| `useTemplateEditorTabs` | `useTemplateCanvasTabs` |
| `TemplateEditorTabs` | `TemplateCanvasTabsControl` |

### localStorage Key Change

**Before:** `insurance_template_editor_tabs`
**After:** `insurance_template_canvas_tabs`

**Note:** Existing tab state will be migrated automatically on first load.

---

## Best Practices

### 1. Storage Keys

Use descriptive, namespaced storage keys:

```typescript
// Good
useCanvasTabsManager({ storageKey: 'myapp_code_canvas_tabs' });
useCanvasTabsManager({ storageKey: 'myapp_template_canvas_tabs' });

// Bad
useCanvasTabsManager({ storageKey: 'tabs' });  // Too generic
```

### 2. onTabClose Callback

Always return boolean to confirm/cancel close:

```typescript
onTabClose: (tabId) => {
  if (hasUnsavedChanges(tabId)) {
    return window.confirm('Discard changes?');
  }
  return true;
}
```

### 3. Type Safety

Use TypeScript generics for type-safe canvas tab IDs:

```typescript
useCanvasTabsManager<string>({ ... });  // String IDs
useCanvasTabsManager<number>({ ... });  // Number IDs
useCanvasTabsManager<UUID>({ ... });    // Custom UUID type
```

---

## Features

- **Persistence** - Canvas tabs survive page reloads via localStorage
- **LRU Eviction** - Automatically closes least recently used canvas when maxTabs reached
- **Smart Selection** - Intelligently selects next canvas tab when closing active one
- **Drag-and-Drop** - Reorder canvas tabs by dragging
- **Context Menu** - Right-click for close actions
- **Modified Indicators** - Visual feedback for unsaved changes
- **Dirty State Tracking** - Lexical integration monitors undo stack

---

**Last Updated**: 2025-01-26
**Version**: 2.0.0 (Canvas Tabs Refactor)
