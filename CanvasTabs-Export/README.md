# CanvasTabs - Modular Tab Management System for React

A complete, production-ready VS Code-style tab navigation system for React applications with TypeScript support.

## What's Included

This export contains a fully functional tab management system with:

- **Core Tab System** - Generic, reusable tab navigation for any React app
- **Lexical Integration** - Dirty state tracking for Lexical editor
- **Complete Documentation** - Installation guide and API reference
- **TypeScript** - Full type safety with generics
- **Zero Configuration** - Copy, install dependencies, and use

## Quick Links

- **[INSTALLATION.md](./INSTALLATION.md)** - Step-by-step installation guide for AI assistants
- **[docs/tabs/CLAUDE.md](./docs/tabs/CLAUDE.md)** - Complete API reference and usage guide

## Features

✅ **VS Code-Style Interface** - Familiar horizontal tabs with professional design
✅ **Drag-and-Drop** - Reorder tabs by dragging
✅ **Context Menus** - Right-click for close, close others, close to right, close all
✅ **Dirty State Tracking** - Visual indicators for unsaved changes
✅ **localStorage Persistence** - Tab state survives page reloads
✅ **Smart Management** - LRU eviction, intelligent tab selection
✅ **Keyboard Shortcuts** - Power user navigation support
✅ **Type-Safe** - Full TypeScript generics support
✅ **Modular Design** - Use core only, or add editor integrations

## Installation (Quick Start)

### 1. Copy Files

```bash
cp -r src/lib/tabs /path/to/your-project/src/lib/
```

### 2. Install Dependencies

```bash
# Core dependencies (required)
npm install lucide-react

# Lexical integration (optional)
npm install lexical @lexical/react
```

### 3. Configure TypeScript (recommended)

```json
{
  "compilerOptions": {
    "paths": {
      "@/lib/tabs": ["./src/lib/tabs"],
      "@/lib/tabs/*": ["./src/lib/tabs/*"]
    }
  }
}
```

### 4. Use in Your App

```typescript
import { useTabManager, TabBar } from '@/lib/tabs/core';

function MyApp() {
  const { tabs, activeTabId, openTab, closeTab, setActiveTab, reorderTabs } =
    useTabManager({
      storageKey: 'my_app_tabs',
      persist: true,
    });

  return (
    <TabBar
      tabs={tabs}
      activeTabId={activeTabId}
      items={myItemsMap}
      onTabClick={setActiveTab}
      onTabClose={closeTab}
      onTabReorder={reorderTabs}
      renderTabContent={(item) => <span>{item.name}</span>}
    />
  );
}
```

## Project Structure

```
CanvasTabs-Export/
├── README.md                  # This file
├── INSTALLATION.md            # Complete installation guide
├── docs/
│   └── tabs/
│       └── CLAUDE.md          # Full API reference
└── src/
    └── lib/
        └── tabs/
            ├── index.ts               # Top-level exports
            ├── core/                  # Generic tab system
            │   ├── types.ts           # TypeScript definitions
            │   ├── useTabManager.ts   # State management hook
            │   ├── TabBar.tsx         # UI component
            │   └── index.ts
            └── integrations/          # Editor integrations
                ├── index.ts
                └── lexical/           # Lexical editor integration
                    ├── useLexicalDirtyState.ts
                    ├── DirtyStatePlugin.tsx
                    ├── useTemplateEditorTabs.ts
                    ├── TemplateEditorTabs.tsx
                    └── index.ts
```

## Usage Examples

### Basic Generic Tabs

Perfect for file explorers, document viewers, or any tab-based navigation:

```typescript
import { useTabManager, TabBar } from '@/lib/tabs/core';

const files = new Map([
  ['file1', { name: 'index.tsx' }],
  ['file2', { name: 'App.tsx' }],
]);

const { tabs, activeTabId, openTab, closeTab } = useTabManager({
  storageKey: 'file_tabs',
});

<TabBar
  tabs={tabs}
  activeTabId={activeTabId}
  items={files}
  onTabClick={setActiveTab}
  onTabClose={closeTab}
  renderTabContent={(file) => <span>{file.name}</span>}
/>;
```

### With Dirty State Tracking

For editors that need to track unsaved changes:

```typescript
import { useTabManager, TabBar } from '@/lib/tabs/core';
import { useState } from 'react';

const [dirtyTabs, setDirtyTabs] = useState<Set<string>>(new Set());

const { tabs, activeTabId, openTab, closeTab } = useTabManager({
  storageKey: 'editor_tabs',
  onTabClose: (tabId) => {
    if (dirtyTabs.has(tabId)) {
      return window.confirm('Unsaved changes. Close anyway?');
    }
    return true;
  },
});

<TabBar
  tabs={tabs}
  activeTabId={activeTabId}
  items={files}
  modifiedTabs={dirtyTabs}
  onTabClick={setActiveTab}
  onTabClose={closeTab}
  renderTabContent={(file) => <span>{file.name}</span>}
/>;
```

### Lexical Editor Integration

Complete example with Lexical editor and automatic dirty tracking:

```typescript
import {
  useTemplateEditorTabs,
  TemplateEditorTabs,
  DirtyStatePlugin,
} from '@/lib/tabs/integrations/lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';

const { tabs, activeTabId, openTab, closeTab, dirtyTabs, markTabDirty } =
  useTemplateEditorTabs();

<>
  <TemplateEditorTabs
    tabs={tabs}
    activeTabId={activeTabId}
    templates={templates}
    modifiedTabs={dirtyTabs}
    onTabClick={setActiveTab}
    onTabClose={closeTab}
  />

  <LexicalComposer initialConfig={config}>
    <DirtyStatePlugin
      onDirtyChange={(isDirty) => markTabDirty(activeTabId, isDirty)}
    />
  </LexicalComposer>
</>;
```

## Dependencies

### Core Dependencies (Always Required)

- **react**: ^18.0.0
- **lucide-react**: ^0.263.1 (icon library)
- **typescript**: ^4.7.0

### Lexical Integration (Optional)

- **lexical**: ^0.12.0
- **@lexical/react**: ^0.12.0

## Tech Stack Compatibility

This system is designed for:

- **React**: 18.0.0+
- **TypeScript**: 4.7.0+
- **Vite** (recommended, but works with any bundler)
- **Tailwind CSS** (recommended for styling)

## Key Features Explained

### 1. Generic Core System

The core tab system is framework-agnostic and works with any data type:

```typescript
// Works with strings
useTabManager<string>({ storageKey: 'tabs' });

// Works with numbers
useTabManager<number>({ storageKey: 'tabs' });

// Works with custom types
useTabManager<UUID>({ storageKey: 'tabs' });
```

### 2. localStorage Persistence

Tabs automatically persist across page reloads:

```typescript
useTabManager({
  storageKey: 'my_app_tabs', // Unique key per app/feature
  persist: true, // Enable persistence
});
```

### 3. LRU Eviction

Automatically closes least recently used tabs when limit is reached:

```typescript
useTabManager({
  maxTabs: 10, // Limit to 10 tabs
});
```

### 4. Drag-and-Drop Reordering

Reorder tabs by dragging them left or right:

```typescript
<TabBar enableDragReorder={true} onTabReorder={reorderTabs} />
```

### 5. Context Menu

Right-click tabs for advanced actions:

```typescript
<TabBar
  enableContextMenu={true}
  onCloseOtherTabs={closeOtherTabs}
  onCloseTabsToRight={closeTabsToRight}
  onCloseAllTabs={closeAllTabs}
/>
```

### 6. Modified Indicators

Visual feedback for tabs with unsaved changes:

```typescript
<TabBar modifiedTabs={new Set(['tab1', 'tab3'])} />
```

## API Overview

### Core Hooks

- **`useTabManager(options)`** - State management for tabs
- **`useTabManager.tabs`** - Array of open tab IDs
- **`useTabManager.activeTabId`** - Currently active tab
- **`useTabManager.openTab(id)`** - Open or switch to tab
- **`useTabManager.closeTab(id)`** - Close tab
- **`useTabManager.reorderTabs(from, to)`** - Reorder tabs

### Core Components

- **`<TabBar />`** - VS Code-style tab bar UI
- **`renderTabContent`** - Custom render prop for tab content
- **`modifiedTabs`** - Set of tabs with unsaved changes

### Lexical Integration

- **`useTemplateEditorTabs()`** - Template-specific tab hook with confirmations
- **`<TemplateEditorTabs />`** - Tab bar with template icons
- **`<DirtyStatePlugin />`** - Headless plugin for dirty tracking
- **`useLexicalDirtyState()`** - Hook to track dirty state in Lexical

## Documentation

### For AI Assistants

**Primary Resource**: [INSTALLATION.md](./INSTALLATION.md)

This guide provides:
- Explicit file paths and commands
- Step-by-step installation instructions
- Complete usage examples
- Troubleshooting solutions
- Type definition requirements

### For Developers

**Primary Resource**: [docs/tabs/CLAUDE.md](./docs/tabs/CLAUDE.md)

This guide provides:
- Complete API reference
- Architecture explanation
- Advanced usage examples
- Testing strategies
- Migration guides

## Common Use Cases

1. **File Explorer** - Multi-file editing interface
2. **Code Editor** - VS Code-style tab navigation
3. **Document Viewer** - Multiple document tabs
4. **Template Editor** - Email/SMS template management
5. **Dashboard** - Tabbed data views
6. **Settings Panel** - Categorized settings tabs

## TypeScript Support

Full TypeScript support with generics:

```typescript
// Generic tab IDs
useTabManager<string>({ storageKey: 'tabs' });

// Custom item types
interface MyItem {
  name: string;
  data: any;
}
const items: Map<string, MyItem> = new Map();

<TabBar<string, MyItem>
  tabs={tabs}
  items={items}
  renderTabContent={(item: MyItem) => <span>{item.name}</span>}
/>
```

## Browser Compatibility

- **Chrome**: ✅ All features supported
- **Firefox**: ✅ All features supported
- **Safari**: ✅ All features supported
- **Edge**: ✅ All features supported

**Note**: Requires HTML5 drag-and-drop API for reordering feature.

## License

This tab system is part of the insurance template POC project. Use freely in your projects.

## Support

For installation help:
1. See [INSTALLATION.md](./INSTALLATION.md) for step-by-step guide
2. Check [docs/tabs/CLAUDE.md](./docs/tabs/CLAUDE.md) for API reference
3. Review usage examples in this README

## Version

**Current Version**: 1.0.0
**Last Updated**: 2025-01-27

---

Built with ❤️ for React developers
