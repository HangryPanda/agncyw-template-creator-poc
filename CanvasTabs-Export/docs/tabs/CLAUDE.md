# Tab Management System

A modular, reusable VS Code-style tab navigation system for React applications with TypeScript.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [File Structure](#file-structure)
5. [Core API Reference](#core-api-reference)
6. [Lexical Integration API](#lexical-integration-api)
7. [Usage Examples](#usage-examples)
8. [TypeScript Types](#typescript-types)
9. [Features](#features)
10. [Testing Strategy](#testing-strategy)
11. [Migration Guide](#migration-guide)

---

## Overview

### What It Is

A complete tab management solution that provides:
- **Generic tab state management** - Works with any data type
- **VS Code-style UI** - Familiar, professional tab bar interface
- **localStorage persistence** - Tab state survives page reloads
- **Dirty state tracking** - Visual indicators for unsaved changes
- **Drag-and-drop reordering** - Intuitive tab organization
- **Keyboard shortcuts** - Power user navigation
- **Context menus** - Right-click for advanced actions

### Why It Exists

This system was built to be **modular and reusable across multiple applications**. Rather than tightly coupling tab management to a specific editor or use case, it separates:
- **Core system** - Generic tab state management (no dependencies on Lexical, templates, etc.)
- **Integrations** - Editor-specific extensions (Lexical dirty tracking, Monaco integration, etc.)

This design allows you to:
- Use the core tab system with any React application
- Import just what you need (core only, or core + integrations)
- Add custom integrations for other editors (Monaco, CodeMirror, etc.)
- Maintain a single, well-tested tab system across projects

### Key Features

✅ **Multi-tab navigation** - Open multiple items simultaneously
✅ **Type-safe** - Full TypeScript generics support
✅ **Persistent** - Configurable localStorage keys
✅ **Smart management** - LRU eviction, intelligent selection on close
✅ **Visual feedback** - Modified indicators, active state, hover effects
✅ **Accessibility** - Keyboard navigation, ARIA labels
✅ **Customizable** - Render props for tab content
✅ **Context menus** - Close, close others, close to right, close all
✅ **Drag-and-drop** - Reorder tabs by dragging

---

## Architecture

### System Layers

```
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│              (App.tsx, Components)                       │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Integration Layer (Optional)                │
│  ┌─────────────────┐  ┌──────────────────┐             │
│  │ Lexical         │  │ Monaco (future)  │             │
│  │ - Dirty state   │  │ - Custom logic   │             │
│  │ - Confirmations │  │ - Editor hooks   │             │
│  └─────────────────┘  └──────────────────┘             │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Core Tab System                        │
│  ┌──────────────────────────────────────────────┐       │
│  │ useTabManager (State Management)             │       │
│  │ - Tab array, active tab                      │       │
│  │ - Open, close, reorder operations            │       │
│  │ - localStorage persistence                   │       │
│  │ - LRU eviction, smart selection              │       │
│  └──────────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────────┐       │
│  │ TabBar (UI Component)                        │       │
│  │ - VS Code-style horizontal tabs              │       │
│  │ - Drag-and-drop support                      │       │
│  │ - Context menu                               │       │
│  │ - Keyboard navigation                        │       │
│  │ - Render props for customization             │       │
│  └──────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

### Core System (`src/lib/tabs/core/`)

**Purpose**: Generic, framework-agnostic tab state management

**Key Characteristics**:
- No dependencies on Lexical, templates, or application-specific logic
- Uses TypeScript generics (`<T>`) for type safety with any ID type
- Configurable localStorage keys for multi-app support
- Can be imported standalone: `import { useTabManager } from '@/lib/tabs/core'`

**Files**:
- `types.ts` - TypeScript interfaces and type definitions
- `useTabManager.ts` - React hook for tab state management (247 lines)
- `TabBar.tsx` - VS Code-style tab bar UI component (387 lines)
- `index.ts` - Barrel exports

### Lexical Integration (`src/lib/tabs/integrations/lexical/`)

**Purpose**: Lexical editor-specific tab management with dirty state tracking

**Key Characteristics**:
- Leverages Lexical History Plugin for accurate dirty state detection
- Adds confirmation dialogs for closing unsaved tabs
- Template-specific tab bar with type icons (email/SMS)
- Wraps core system with editor-aware functionality

**Files**:
- `useLexicalDirtyState.ts` - Hook that monitors Lexical undo stack
- `DirtyStatePlugin.tsx` - Headless plugin for reporting dirty changes
- `useTemplateEditorTabs.ts` - Template-specific wrapper with confirmations
- `TemplateEditorTabs.tsx` - Tab bar with template type icons
- `index.ts` - Barrel exports

---

## Quick Start

### Using Core Tab System (Generic)

Perfect for any React application that needs tab navigation:

```typescript
import { useTabManager, TabBar } from '@/lib/tabs/core';

function MyApp() {
  const {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    setActiveTab,
    reorderTabs,
  } = useTabManager<string>({
    storageKey: 'my_app_tabs',
    persist: true,
    maxTabs: 10,
  });

  // Your items (files, documents, etc.)
  const items = new Map([
    ['file1', { name: 'index.tsx', icon: '📄' }],
    ['file2', { name: 'App.tsx', icon: '⚛️' }],
  ]);

  return (
    <TabBar
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

### Using Lexical Integration

Perfect for Lexical-based template editors with dirty state tracking:

```typescript
import {
  useTemplateEditorTabs,
  TemplateEditorTabs,
  DirtyStatePlugin
} from '@/lib/tabs/integrations/lexical';

function TemplateApp() {
  const {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    setActiveTab,
    dirtyTabs,
    markTabDirty,
  } = useTemplateEditorTabs();

  return (
    <>
      {/* Tab bar with dirty indicators */}
      <TemplateEditorTabs
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
        {/* Other Lexical plugins */}
      </LexicalComposer>
    </>
  );
}
```

---

## File Structure

```
src/lib/tabs/
├── CLAUDE.md                          # This documentation file
├── index.ts                           # Top-level barrel export
│
├── core/                              # Generic tab system
│   ├── types.ts                       # TypeScript type definitions
│   ├── useTabManager.ts               # Tab state management hook
│   ├── TabBar.tsx                     # VS Code-style tab bar component
│   └── index.ts                       # Core barrel exports
│
└── integrations/                      # Editor-specific integrations
    ├── index.ts                       # Integrations barrel export
    │
    └── lexical/                       # Lexical editor integration
        ├── useLexicalDirtyState.ts    # Dirty state tracking hook
        ├── DirtyStatePlugin.tsx       # Headless dirty state plugin
        ├── useTemplateEditorTabs.ts   # Template-specific tab hook
        ├── TemplateEditorTabs.tsx     # Template tab bar component
        └── index.ts                   # Lexical integration exports
```

### Import Paths

```typescript
// Import entire system (core + integrations)
import { useTabManager, TabBar, useTemplateEditorTabs } from '@/lib/tabs';

// Import core only
import { useTabManager, TabBar } from '@/lib/tabs/core';

// Import specific integration
import { useTemplateEditorTabs, DirtyStatePlugin } from '@/lib/tabs/integrations/lexical';
```

---

## Core API Reference

### `useTabManager<T>(options): TabManagerReturn<T>`

Core state management hook for tab navigation.

#### Type Parameters

- `T` - Type of tab IDs (default: `string`)

#### Options

```typescript
interface UseTabManagerOptions<T = string> {
  storageKey: string;              // localStorage key for persistence
  persist?: boolean;               // Enable localStorage (default: true)
  maxTabs?: number;                // Max open tabs (LRU eviction)
  initialTabs?: T[];               // Initial tabs to open
  onTabChange?: (tabId: T | null) => void;  // Callback when active tab changes
  onTabClose?: (tabId: T) => boolean | void; // Callback before close (return false to cancel)
}
```

#### Return Value

```typescript
interface TabManagerReturn<T = string> {
  tabs: T[];                       // Array of open tab IDs
  activeTabId: T | null;           // Currently active tab ID
  openTab: (tabId: T) => void;     // Open tab or switch if already open
  closeTab: (tabId: T) => void;    // Close tab
  setActiveTab: (tabId: T) => void; // Switch to tab
  reorderTabs: (fromIndex: number, toIndex: number) => void; // Reorder tabs
  closeOtherTabs: (tabId: T) => void;     // Close all except specified
  closeTabsToRight: (tabId: T) => void;   // Close tabs to the right
  closeAllTabs: () => void;              // Close all tabs
  isTabOpen: (tabId: T) => boolean;      // Check if tab is open
}
```

#### Example

```typescript
const tabManager = useTabManager<string>({
  storageKey: 'my_app_tabs',
  persist: true,
  maxTabs: 15,
  onTabClose: (tabId) => {
    // Confirm before close
    return window.confirm('Close this tab?');
  },
});
```

### `<TabBar<T, Item> />` Component

VS Code-style tab bar UI component with drag-and-drop and context menus.

#### Props

```typescript
interface TabBarProps<T = string, Item = unknown> {
  // Required
  tabs: T[];                       // Array of tab IDs
  activeTabId: T | null;           // Currently active tab
  items: Map<T, Item>;             // Map of tab ID to item data
  onTabClick: (tabId: T) => void;  // Tab click handler
  onTabClose: (tabId: T) => void;  // Close button handler
  renderTabContent: (item: Item, isActive: boolean) => ReactNode; // Tab content renderer

  // Optional
  onTabReorder?: (from: number, to: number) => void; // Drag-and-drop handler
  getTabKey?: (item: Item) => string;  // Custom key extractor
  modifiedTabs?: Set<T>;               // Tabs with unsaved changes (blue dot)
  showCloseButton?: boolean;           // Show close buttons (default: true)
  enableDragReorder?: boolean;         // Enable drag-and-drop (default: false)
  enableContextMenu?: boolean;         // Enable right-click menu (default: false)
  onCloseOtherTabs?: (tabId: T) => void;     // Context menu: close others
  onCloseTabsToRight?: (tabId: T) => void;   // Context menu: close to right
  onCloseAllTabs?: () => void;               // Context menu: close all
  className?: string;                        // Additional CSS classes
  variant?: 'default' | 'minimal' | 'compact'; // Visual style
}
```

#### Example

```typescript
<TabBar
  tabs={['tab1', 'tab2']}
  activeTabId="tab1"
  items={new Map([
    ['tab1', { name: 'File 1', modified: false }],
    ['tab2', { name: 'File 2', modified: true }],
  ])}
  onTabClick={setActiveTab}
  onTabClose={closeTab}
  modifiedTabs={new Set(['tab2'])}
  enableDragReorder={true}
  enableContextMenu={true}
  renderTabContent={(item, isActive) => (
    <span className={isActive ? 'font-bold' : ''}>
      {item.name}
    </span>
  )}
/>
```

---

## Lexical Integration API

### `useLexicalDirtyState(): UseLexicalDirtyStateReturn`

Monitors Lexical editor's undo stack to detect unsaved changes.

#### How It Works

- Listens to `CAN_UNDO_COMMAND` from Lexical History Plugin
- If `canUndo` is true → editor has unsaved changes
- Call `markClean()` after save to reset undo stack

#### Return Value

```typescript
interface UseLexicalDirtyStateReturn {
  isDirty: boolean;                // True if editor has unsaved changes
  markClean: () => void;           // Clear undo history (call after save)
}
```

#### Example

```typescript
function MyEditor() {
  const { isDirty, markClean } = useLexicalDirtyState();

  const handleSave = () => {
    // Save editor content
    saveContent();
    // Clear dirty state
    markClean();
  };

  return (
    <div>
      {isDirty && <span>Unsaved changes</span>}
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
```

### `<DirtyStatePlugin />` Component

Headless Lexical plugin that reports dirty state changes to parent.

#### Props

```typescript
interface DirtyStatePluginProps {
  onDirtyChange?: (isDirty: boolean) => void;  // Callback when dirty state changes
}
```

#### Example

```typescript
<LexicalComposer>
  <HistoryPlugin />
  <DirtyStatePlugin
    onDirtyChange={(isDirty) => console.log('Dirty:', isDirty)}
  />
</LexicalComposer>
```

### `useTemplateEditorTabs(): UseTemplateEditorTabsReturn`

Template-specific wrapper around `useTabManager` with dirty tracking and confirmation dialogs.

#### Return Value

Extends `TabManagerReturn` with:

```typescript
interface UseTemplateEditorTabsReturn extends TabManagerReturn<string> {
  dirtyTabs: Set<string>;                    // Set of tab IDs with unsaved changes
  markTabDirty: (tabId: string, isDirty: boolean) => void;  // Mark tab dirty/clean
}
```

#### Features

- Shows confirmation dialog when closing tabs with unsaved changes
- Automatically cleans up dirty state when tabs close
- Persists to `insurance_template_editor_tabs` localStorage key
- Max 15 tabs with LRU eviction

#### Example

```typescript
const {
  tabs,
  activeTabId,
  openTab,
  dirtyTabs,
  markTabDirty,
} = useTemplateEditorTabs();

// Mark active tab as dirty
markTabDirty(activeTabId, true);

// Trying to close dirty tab shows: "This template has unsaved changes. Close anyway?"
```

### `<TemplateEditorTabs />` Component

Template-specific tab bar with email/SMS icons and modified indicators.

#### Props

```typescript
interface TemplateEditorTabsProps {
  tabs: string[];                  // Array of template IDs
  activeTabId: string | null;      // Active template ID
  templates: Template[];           // All templates
  modifiedTabs: Set<string>;       // Templates with unsaved changes
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabReorder: (from: number, to: number) => void;
  onCloseOtherTabs?: (tabId: string) => void;
  onCloseTabsToRight?: (tabId: string) => void;
  onCloseAllTabs?: () => void;
}
```

#### Features

- Displays email icon (✉️) or SMS icon (💬) based on template type
- Shows blue dot for modified templates
- Supports all TabBar features (drag-and-drop, context menu, etc.)

---

## Usage Examples

### Example 1: Basic File Browser

```typescript
import { useTabManager, TabBar } from '@/lib/tabs/core';

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'folder';
}

function FileBrowser() {
  const files = new Map<string, FileItem>([
    ['file1', { name: 'index.tsx', path: '/src/index.tsx', type: 'file' }],
    ['file2', { name: 'App.tsx', path: '/src/App.tsx', type: 'file' }],
  ]);

  const {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    setActiveTab,
    reorderTabs,
  } = useTabManager<string>({
    storageKey: 'file_browser_tabs',
    persist: true,
  });

  return (
    <div>
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        items={files}
        onTabClick={setActiveTab}
        onTabClose={closeTab}
        onTabReorder={reorderTabs}
        enableDragReorder={true}
        renderTabContent={(file) => (
          <span>📄 {file.name}</span>
        )}
      />

      <div>
        {files.get(activeTabId)?.path}
      </div>
    </div>
  );
}
```

### Example 2: Code Editor with Dirty Tracking

```typescript
import { useTabManager, TabBar } from '@/lib/tabs/core';
import { useState } from 'react';

function CodeEditor() {
  const [dirtyTabs, setDirtyTabs] = useState<Set<string>>(new Set());
  const [content, setContent] = useState<Map<string, string>>(new Map());

  const {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    setActiveTab,
    onTabClose: (tabId) => {
      if (dirtyTabs.has(tabId)) {
        return window.confirm('Discard unsaved changes?');
      }
      return true;
    },
  } = useTabManager<string>({
    storageKey: 'code_editor_tabs',
  });

  const handleChange = (newContent: string) => {
    setContent(prev => new Map(prev).set(activeTabId, newContent));
    setDirtyTabs(prev => new Set(prev).add(activeTabId));
  };

  const handleSave = () => {
    // Save content...
    setDirtyTabs(prev => {
      const next = new Set(prev);
      next.delete(activeTabId);
      return next;
    });
  };

  return (
    <div>
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        items={fileMap}
        modifiedTabs={dirtyTabs}
        onTabClick={setActiveTab}
        onTabClose={closeTab}
        renderTabContent={(file, isActive) => (
          <span className={isActive ? 'active' : ''}>
            {file.name}
          </span>
        )}
      />

      <textarea
        value={content.get(activeTabId) || ''}
        onChange={(e) => handleChange(e.target.value)}
      />

      <button onClick={handleSave}>Save</button>
    </div>
  );
}
```

### Example 3: Template Editor (Full Integration)

```typescript
import { useTemplateEditorTabs, TemplateEditorTabs, DirtyStatePlugin } from '@/lib/tabs/integrations/lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';

function TemplateEditor() {
  const {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    setActiveTab,
    reorderTabs,
    dirtyTabs,
    markTabDirty,
  } = useTemplateEditorTabs();

  const [templates, setTemplates] = useState<Template[]>([]);

  return (
    <div>
      {/* Tab bar */}
      <TemplateEditorTabs
        tabs={tabs}
        activeTabId={activeTabId}
        templates={templates}
        modifiedTabs={dirtyTabs}
        onTabClick={setActiveTab}
        onTabClose={closeTab}
        onTabReorder={reorderTabs}
      />

      {/* Lexical editor */}
      {activeTabId && (
        <LexicalComposer initialConfig={config}>
          <HistoryPlugin />
          <DirtyStatePlugin
            onDirtyChange={(isDirty) => markTabDirty(activeTabId, isDirty)}
          />
          <RichTextPlugin />
        </LexicalComposer>
      )}
    </div>
  );
}
```

---

## TypeScript Types

### Core Types

```typescript
// Tab item with metadata
interface TabItem<T = string> {
  id: T;                           // Unique tab identifier
  openedAt: number;                // Timestamp when tab was opened
  metadata?: Record<string, unknown>; // Optional custom metadata
}

// Internal tab state
interface TabsState<T = string> {
  tabs: TabItem<T>[];              // Array of tab items
  activeTabId: T | null;           // Currently active tab
  tabOrder: T[];                   // Visual tab order (for drag-and-drop)
}

// Hook options
interface UseTabManagerOptions<T = string> {
  storageKey: string;
  persist?: boolean;
  maxTabs?: number;
  onTabChange?: (tabId: T | null) => void;
  onTabClose?: (tabId: T) => boolean | void;
  initialTabs?: T[];
}

// Hook return value
interface TabManagerReturn<T = string> {
  tabs: T[];
  activeTabId: T | null;
  openTab: (tabId: T) => void;
  closeTab: (tabId: T) => void;
  setActiveTab: (tabId: T) => void;
  reorderTabs: (fromIndex: number, toIndex: number) => void;
  closeOtherTabs: (tabId: T) => void;
  closeTabsToRight: (tabId: T) => void;
  closeAllTabs: () => void;
  isTabOpen: (tabId: T) => boolean;
}
```

### Lexical Integration Types

```typescript
// Dirty state hook return
interface UseLexicalDirtyStateReturn {
  isDirty: boolean;
  markClean: () => void;
}

// Dirty state plugin props
interface DirtyStatePluginProps {
  onDirtyChange?: (isDirty: boolean) => void;
}

// Template editor tabs return (extends core)
interface UseTemplateEditorTabsReturn extends TabManagerReturn<string> {
  dirtyTabs: Set<string>;
  markTabDirty: (tabId: string, isDirty: boolean) => void;
}
```

---

## Features

### 1. Persistence

Tabs automatically save to localStorage and restore on page reload.

**Configuration**:
```typescript
useTabManager({
  storageKey: 'my_unique_key',  // Unique key per app/feature
  persist: true,                // Enable persistence
});
```

**Storage Format**:
```json
{
  "tabs": [
    { "id": "tab1", "openedAt": 1738000000000 },
    { "id": "tab2", "openedAt": 1738000001000 }
  ],
  "activeTabId": "tab1",
  "tabOrder": ["tab1", "tab2"]
}
```

### 2. LRU Eviction

When `maxTabs` is reached, the least recently used tab is automatically closed.

**Configuration**:
```typescript
useTabManager({
  maxTabs: 10,  // Limit to 10 tabs
});
```

**Behavior**:
- Opening a new tab when at max capacity closes the oldest tab
- "Oldest" = tab that hasn't been active for the longest time
- onTabClose callback is called before eviction (can cancel)

### 3. Smart Selection

When closing a tab, intelligently selects the next appropriate tab:

1. If closing active tab:
   - Select tab to the right (if exists)
   - Otherwise, select tab to the left
   - If only tab, clear selection
2. If closing inactive tab:
   - Keep current selection

### 4. Drag-and-Drop Reordering

Reorder tabs by dragging them left or right.

**Enable**:
```typescript
<TabBar
  enableDragReorder={true}
  onTabReorder={(fromIndex, toIndex) => reorderTabs(fromIndex, toIndex)}
/>
```

**Features**:
- Visual feedback during drag (opacity change)
- Drop indicator shows insert position
- Works with mouse and touch

### 5. Context Menu

Right-click on tabs for advanced actions.

**Enable**:
```typescript
<TabBar
  enableContextMenu={true}
  onCloseOtherTabs={closeOtherTabs}
  onCloseTabsToRight={closeTabsToRight}
  onCloseAllTabs={closeAllTabs}
/>
```

**Actions**:
- Close
- Close Others
- Close Tabs to the Right
- Close All Tabs

### 6. Keyboard Shortcuts

Built-in keyboard navigation (implement in parent component):

```typescript
// Example shortcuts
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    const isMod = e.metaKey || e.ctrlKey;

    // Cmd/Ctrl + W: Close active tab
    if (isMod && e.key === 'w') {
      e.preventDefault();
      closeTab(activeTabId);
    }

    // Cmd/Ctrl + Tab: Next tab
    if (isMod && e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const currentIndex = tabs.indexOf(activeTabId);
      const nextIndex = (currentIndex + 1) % tabs.length;
      setActiveTab(tabs[nextIndex]);
    }

    // Cmd/Ctrl + Shift + Tab: Previous tab
    if (isMod && e.shiftKey && e.key === 'Tab') {
      e.preventDefault();
      const currentIndex = tabs.indexOf(activeTabId);
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[prevIndex]);
    }
  };

  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, [tabs, activeTabId, closeTab, setActiveTab]);
```

### 7. Modified Indicators

Visual feedback for tabs with unsaved changes.

**Usage**:
```typescript
<TabBar
  modifiedTabs={new Set(['tab1', 'tab3'])}  // Tabs with unsaved changes
/>
```

**Appearance**:
- Blue dot next to tab name
- Persists until tab is marked clean

---

## Testing Strategy

### Unit Tests

**Core Hook Tests** (`useTabManager.test.ts`):
```typescript
describe('useTabManager', () => {
  test('opens new tab', () => {
    const { result } = renderHook(() => useTabManager({ storageKey: 'test' }));
    act(() => result.current.openTab('tab1'));
    expect(result.current.tabs).toContain('tab1');
  });

  test('closes tab and selects next', () => {
    const { result } = renderHook(() => useTabManager({ storageKey: 'test' }));
    act(() => {
      result.current.openTab('tab1');
      result.current.openTab('tab2');
      result.current.closeTab('tab1');
    });
    expect(result.current.activeTabId).toBe('tab2');
  });

  test('enforces maxTabs limit', () => {
    const { result } = renderHook(() =>
      useTabManager({ storageKey: 'test', maxTabs: 2 })
    );
    act(() => {
      result.current.openTab('tab1');
      result.current.openTab('tab2');
      result.current.openTab('tab3'); // Should evict tab1
    });
    expect(result.current.tabs).toHaveLength(2);
    expect(result.current.tabs).not.toContain('tab1');
  });

  test('persists to localStorage', () => {
    const { result } = renderHook(() =>
      useTabManager({ storageKey: 'test_persist', persist: true })
    );
    act(() => result.current.openTab('tab1'));

    const stored = JSON.parse(localStorage.getItem('test_persist'));
    expect(stored.tabs).toHaveLength(1);
  });
});
```

**Component Tests** (`TabBar.test.tsx`):
```typescript
describe('TabBar', () => {
  test('renders tabs', () => {
    const tabs = ['tab1', 'tab2'];
    const items = new Map([
      ['tab1', { name: 'Tab 1' }],
      ['tab2', { name: 'Tab 2' }],
    ]);

    render(
      <TabBar
        tabs={tabs}
        activeTabId="tab1"
        items={items}
        onTabClick={jest.fn()}
        onTabClose={jest.fn()}
        renderTabContent={(item) => <span>{item.name}</span>}
      />
    );

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  test('calls onTabClick when tab clicked', () => {
    const onTabClick = jest.fn();
    render(
      <TabBar
        tabs={['tab1']}
        activeTabId={null}
        items={new Map([['tab1', { name: 'Tab 1' }]])}
        onTabClick={onTabClick}
        onTabClose={jest.fn()}
        renderTabContent={(item) => <span>{item.name}</span>}
      />
    );

    fireEvent.click(screen.getByText('Tab 1'));
    expect(onTabClick).toHaveBeenCalledWith('tab1');
  });
});
```

### Integration Tests

**Lexical Integration Tests**:
```typescript
describe('Lexical Integration', () => {
  test('tracks dirty state on editor change', () => {
    const onDirtyChange = jest.fn();

    render(
      <LexicalComposer initialConfig={config}>
        <HistoryPlugin />
        <DirtyStatePlugin onDirtyChange={onDirtyChange} />
        <RichTextPlugin />
      </LexicalComposer>
    );

    // Make an edit
    // ... editor interaction

    expect(onDirtyChange).toHaveBeenCalledWith(true);
  });

  test('confirms before closing dirty tab', () => {
    window.confirm = jest.fn(() => false);

    const { result } = renderHook(() => useTemplateEditorTabs());

    act(() => {
      result.current.openTab('tab1');
      result.current.markTabDirty('tab1', true);
      result.current.closeTab('tab1');
    });

    expect(window.confirm).toHaveBeenCalled();
    expect(result.current.tabs).toContain('tab1'); // Not closed
  });
});
```

### Manual Testing Checklist

- [ ] Open multiple tabs
- [ ] Switch between tabs by clicking
- [ ] Close tabs using close button
- [ ] Drag-and-drop tab reordering
- [ ] Right-click context menu actions
- [ ] Keyboard shortcuts (Cmd+W, Cmd+Tab, etc.)
- [ ] Modified indicator appears/disappears
- [ ] Confirmation dialog for closing dirty tabs
- [ ] Tab persistence across page reload
- [ ] LRU eviction when maxTabs reached
- [ ] Smart selection after closing tab

---

## Migration Guide

### Adding to a New Application

**Step 1**: Install dependencies (if not already present)
```bash
npm install react lucide-react
```

**Step 2**: Copy the tab system
```bash
# Copy the entire tabs directory
cp -r src/lib/tabs /path/to/new/project/src/lib/
```

**Step 3**: Update TypeScript paths (if using path aliases)
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/lib/tabs/*": ["src/lib/tabs/*"]
    }
  }
}
```

**Step 4**: Use in your application

**Option A: Generic tabs (no editor integration)**
```typescript
import { useTabManager, TabBar } from '@/lib/tabs/core';
// See Quick Start examples
```

**Option B: With Lexical editor**
```typescript
import { useTemplateEditorTabs, TemplateEditorTabs } from '@/lib/tabs/integrations/lexical';
// See Quick Start examples
```

### Creating a Custom Integration

**Example: Monaco Editor Integration**

1. Create integration directory:
```bash
mkdir -p src/lib/tabs/integrations/monaco
```

2. Create dirty state hook (`useMona coDirtyState.ts`):
```typescript
import { useState, useEffect } from 'react';
import type { editor } from 'monaco-editor';

export function useMonacoDirtyState(editor: editor.IStandaloneCodeEditor) {
  const [isDirty, setIsDirty] = useState(false);
  const [savedVersionId, setSavedVersionId] = useState(0);

  useEffect(() => {
    const model = editor.getModel();
    if (!model) return;

    const disposable = model.onDidChangeContent(() => {
      const currentVersionId = model.getAlternativeVersionId();
      setIsDirty(currentVersionId !== savedVersionId);
    });

    return () => disposable.dispose();
  }, [editor, savedVersionId]);

  const markClean = () => {
    const model = editor.getModel();
    if (model) {
      setSavedVersionId(model.getAlternativeVersionId());
      setIsDirty(false);
    }
  };

  return { isDirty, markClean };
}
```

3. Create custom tab hook:
```typescript
import { useTabManager } from '../../core';
import { useState } from 'react';

export function useMonacoEditorTabs() {
  const [dirtyTabs, setDirtyTabs] = useState<Set<string>>(new Set());

  const tabManager = useTabManager<string>({
    storageKey: 'monaco_editor_tabs',
    persist: true,
    onTabClose: (tabId) => {
      if (dirtyTabs.has(tabId)) {
        return window.confirm('Discard unsaved changes?');
      }
      return true;
    },
  });

  // ... rest of implementation
}
```

4. Export from `index.ts`:
```typescript
export { useMonacoDirtyState } from './useMonacoDirtyState';
export { useMonacoEditorTabs } from './useMonacoEditorTabs';
```

5. Update integrations barrel export:
```typescript
// src/lib/tabs/integrations/index.ts
export * from './lexical';
export * from './monaco';
```

---

## Best Practices

### 1. Storage Keys

Use descriptive, namespaced storage keys to avoid conflicts:

```typescript
// Good
useTabManager({ storageKey: 'myapp_code_editor_tabs' });
useTabManager({ storageKey: 'myapp_template_editor_tabs' });

// Bad
useTabManager({ storageKey: 'tabs' });  // Too generic
```

### 2. onTabClose Callback

Always return a boolean from onTabClose to confirm/cancel:

```typescript
// Good
onTabClose: (tabId) => {
  if (hasUnsavedChanges(tabId)) {
    return window.confirm('Discard changes?');
  }
  return true;
}

// Bad
onTabClose: (tabId) => {
  if (hasUnsavedChanges(tabId)) {
    window.confirm('Discard changes?');  // Return value not used
  }
}
```

### 3. Dirty State Management

Keep dirty state close to the data source:

```typescript
// Good - dirty state derived from editor
<DirtyStatePlugin onDirtyChange={markTabDirty} />

// Bad - manually tracking every change
onChange={(content) => {
  setContent(content);
  setDirty(true);  // Easy to forget
}}
```

### 4. Type Safety

Always use TypeScript generics for type-safe IDs:

```typescript
// Good
useTabManager<string>({ ... });           // String IDs
useTabManager<number>({ ... });           // Number IDs
useTabManager<UUID>({ ... });             // Custom UUID type

// Bad
useTabManager({ ... });  // Defaults to any
```

### 5. Max Tabs

Set a reasonable maxTabs limit to prevent performance issues:

```typescript
// Good
useTabManager({ maxTabs: 10 });   // Desktop app
useTabManager({ maxTabs: 5 });    // Mobile app

// Bad
useTabManager({ maxTabs: 1000 }); // Performance issues
```

---

## Troubleshooting

### Tabs not persisting

**Problem**: Tabs disappear on page reload

**Solutions**:
1. Check `persist: true` is set
2. Verify unique `storageKey` (no conflicts)
3. Check browser localStorage quota (5-10MB limit)
4. Inspect localStorage in DevTools

### Drag-and-drop not working

**Problem**: Can't reorder tabs by dragging

**Solutions**:
1. Verify `enableDragReorder={true}`
2. Check `onTabReorder` callback is provided
3. Ensure browser supports HTML5 drag-and-drop
4. Check for CSS `pointer-events: none` conflicts

### Dirty state not updating

**Problem**: Modified indicator doesn't appear/disappear

**Solutions**:
1. Verify `DirtyStatePlugin` is inside `<LexicalComposer>`
2. Check `HistoryPlugin` is registered before `DirtyStatePlugin`
3. Ensure `onDirtyChange` callback is stable (use useCallback)
4. Call `markClean()` after save operations

### TypeScript errors

**Problem**: Type errors when importing tab system

**Solutions**:
1. Check TypeScript version (requires >=4.7)
2. Verify `"moduleResolution": "node"` in tsconfig.json
3. Update path aliases if using custom paths
4. Ensure barrel exports are up to date

---

## Performance Considerations

### Large Tab Counts

**Recommendation**: Set `maxTabs` based on use case:
- Code editors: 10-20 tabs
- Document viewers: 5-10 tabs
- Mobile apps: 3-5 tabs

**Why**: Each tab renders in the DOM. Too many tabs:
- Slow initial render
- Increased memory usage
- Poor UX (hard to find tabs)

### Render Props Optimization

Memoize expensive tab content rendering:

```typescript
const renderTabContent = useCallback((item) => {
  return <ExpensiveComponent item={item} />;
}, []);

<TabBar
  renderTabContent={renderTabContent}  // Stable reference
/>
```

### localStorage Writes

Tab state writes to localStorage on every change. For high-frequency updates:

```typescript
// Consider debouncing
const debouncedOpenTab = useMemo(
  () => debounce(openTab, 100),
  [openTab]
);
```

---

## Future Enhancements

Potential features for future versions:

1. **Tab Groups** - Group related tabs together
2. **Split Views** - Multiple tab bars side-by-side
3. **Pinned Tabs** - Prevent tabs from being closed
4. **Tab Icons** - Favicon/icon support
5. **Custom Animations** - Configurable transitions
6. **Accessibility** - Full ARIA support, screen reader optimization
7. **Theming** - CSS variables for colors/spacing

---

## License

This tab system is part of the insurance template POC project and follows the project's license.

---

## Support

For questions or issues with the tab system:
1. Check this documentation first
2. Review the TypeScript types in `core/types.ts`
3. See usage examples in `src/App.tsx`
4. Create an issue in the project repository

---

**Last Updated**: 2025-01-24
**Version**: 1.0.0
