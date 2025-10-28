# CanvasTabs Installation Guide

**AI Assistant Instructions**: This guide provides explicit, step-by-step instructions for installing the CanvasTabs tab management system into a new React project.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation Steps](#installation-steps)
4. [File Structure](#file-structure)
5. [Required Dependencies](#required-dependencies)
6. [Configuration](#configuration)
7. [Usage Examples](#usage-examples)
8. [Lexical Integration Setup](#lexical-integration-setup)
9. [Type Definitions](#type-definitions)
10. [Troubleshooting](#troubleshooting)

---

## Overview

CanvasTabs is a modular, reusable VS Code-style tab navigation system for React applications. It consists of:

- **Core System** (`src/lib/tabs/core/`) - Generic tab management (no dependencies on editors)
- **Lexical Integration** (`src/lib/tabs/integrations/lexical/`) - Lexical editor-specific features with dirty state tracking

You can use the core system alone, or include the Lexical integration if you're building a Lexical-based editor.

---

## Prerequisites

### Required Tech Stack

- **React**: 18.0.0 or higher
- **TypeScript**: 4.7.0 or higher
- **Vite** (recommended, but not required)

### Project Structure

Your target project should have:
```
target-project/
├── src/
│   ├── lib/          # Will contain the tabs system
│   └── types/        # Will contain type definitions
├── tsconfig.json
└── package.json
```

---

## Installation Steps

### Step 1: Copy Files to Target Project

Copy the entire `src/lib/tabs/` directory from this export to your target project:

```bash
# From the CanvasTabs-Export directory
cp -r src/lib/tabs /path/to/target-project/src/lib/
```

**Result**: Your project should now have:
```
target-project/
└── src/
    └── lib/
        └── tabs/
            ├── core/
            │   ├── types.ts
            │   ├── useTabManager.ts
            │   ├── TabBar.tsx
            │   └── index.ts
            ├── integrations/
            │   ├── lexical/
            │   │   ├── useLexicalDirtyState.ts
            │   │   ├── DirtyStatePlugin.tsx
            │   │   ├── useTemplateEditorTabs.ts
            │   │   ├── TemplateEditorTabs.tsx
            │   │   └── index.ts
            │   └── index.ts
            └── index.ts
```

### Step 2: Install Required Dependencies

Install the necessary npm packages:

```bash
cd /path/to/target-project

# Core dependencies (required)
npm install lucide-react

# Lexical dependencies (only if using Lexical integration)
npm install lexical @lexical/react
```

### Step 3: Configure TypeScript Path Aliases (Recommended)

Update your `tsconfig.json` to include path aliases for easier imports:

```json
{
  "compilerOptions": {
    "paths": {
      "@/lib/tabs": ["./src/lib/tabs"],
      "@/lib/tabs/*": ["./src/lib/tabs/*"],
      "@/types": ["./src/types"]
    }
  }
}
```

**Note**: If using Vite, also update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Step 4: Add Required Type Definitions (Lexical Integration Only)

If using the Lexical integration, you need to define the `Template` type. Create or update `src/types/index.ts`:

```typescript
// src/types/index.ts

/**
 * Template type for Lexical integration
 * Customize this based on your application's needs
 */
export interface Template {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  type: 'email' | 'sms';         // Template type (customize as needed)
  content: EditorState;          // Lexical EditorState
  tags: string[];                // Array of tag IDs
  createdAt: number;             // Timestamp
  updatedAt: number;             // Timestamp
  isStarred?: boolean;           // Optional: starred flag
  lastUsedAt?: number;           // Optional: last usage timestamp
  useCount?: number;             // Optional: usage counter
}

/**
 * Lexical EditorState interface
 * This is a simplified version - actual EditorState is more complex
 */
export interface EditorState {
  root: {
    children: any[];
    direction: 'ltr' | 'rtl' | null;
    format: string;
    indent: number;
    type: string;
    version: number;
  };
}
```

**Important**: If you're NOT using the Lexical integration, you can skip this step.

---

## File Structure

After installation, your project will have the following structure:

```
target-project/
├── src/
│   ├── lib/
│   │   └── tabs/
│   │       ├── index.ts                  # Top-level barrel export
│   │       ├── core/                     # Generic tab system
│   │       │   ├── types.ts              # TypeScript type definitions
│   │       │   ├── useTabManager.ts      # Tab state management hook (247 lines)
│   │       │   ├── TabBar.tsx            # VS Code-style tab bar UI (387 lines)
│   │       │   └── index.ts              # Core barrel exports
│   │       └── integrations/             # Editor-specific integrations
│   │           ├── index.ts
│   │           └── lexical/              # Lexical editor integration
│   │               ├── useLexicalDirtyState.ts     # Dirty state tracking
│   │               ├── DirtyStatePlugin.tsx        # Headless dirty plugin
│   │               ├── useTemplateEditorTabs.ts    # Template-specific hook
│   │               ├── TemplateEditorTabs.tsx      # Template tab bar
│   │               └── index.ts
│   └── types/
│       └── index.ts                      # Type definitions (if using Lexical)
├── tsconfig.json
└── package.json
```

---

## Required Dependencies

### Core Dependencies (Always Required)

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "typescript": "^4.7.0"
  }
}
```

**What they're for**:
- `react`: Core React library
- `lucide-react`: Icon library (used for close button and template icons)
- `typescript`: TypeScript compiler

### Lexical Integration Dependencies (Optional)

Only install these if you're using the Lexical integration:

```json
{
  "dependencies": {
    "lexical": "^0.12.0",
    "@lexical/react": "^0.12.0"
  }
}
```

**What they're for**:
- `lexical`: Lexical editor core
- `@lexical/react`: Lexical React bindings (includes `LexicalComposer`, `HistoryPlugin`, etc.)

---

## Configuration

### Import Path Options

You have three import path options:

**Option 1: Import everything (core + integrations)**
```typescript
import { useTabManager, TabBar, useTemplateEditorTabs } from '@/lib/tabs';
```

**Option 2: Import core only**
```typescript
import { useTabManager, TabBar } from '@/lib/tabs/core';
```

**Option 3: Import specific integration**
```typescript
import { useTemplateEditorTabs, DirtyStatePlugin } from '@/lib/tabs/integrations/lexical';
```

**AI Note**: Use Option 2 if the project doesn't use Lexical. Use Option 3 for Lexical-specific imports.

### Tailwind CSS Configuration (Recommended)

The `TabBar` component uses Tailwind CSS utility classes. If your project uses Tailwind, ensure it's configured:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/lib/tabs/**/*.{js,jsx,ts,tsx}', // Include tabs directory
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        border: 'hsl(var(--border))',
        primary: 'hsl(var(--primary))',
        destructive: 'hsl(var(--destructive))',
        popover: 'hsl(var(--popover))',
      },
    },
  },
};
```

**AI Note**: If the project doesn't use Tailwind, you'll need to convert the styling to CSS modules or inline styles.

---

## Usage Examples

### Example 1: Basic Generic Tabs (Core System)

Use this for any React application that needs tab navigation (no editor required).

```typescript
// src/components/FileExplorer.tsx
import { useTabManager, TabBar } from '@/lib/tabs/core';

interface FileItem {
  name: string;
  path: string;
  extension: string;
}

function FileExplorer() {
  // Create a map of file IDs to file data
  const files = new Map<string, FileItem>([
    ['file1', { name: 'index.tsx', path: '/src/index.tsx', extension: 'tsx' }],
    ['file2', { name: 'App.tsx', path: '/src/App.tsx', extension: 'tsx' }],
    ['file3', { name: 'README.md', path: '/README.md', extension: 'md' }],
  ]);

  // Initialize tab manager
  const {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    setActiveTab,
    reorderTabs,
    closeOtherTabs,
    closeTabsToRight,
    closeAllTabs,
  } = useTabManager<string>({
    storageKey: 'file_explorer_tabs',
    persist: true,
    maxTabs: 10,
  });

  return (
    <div className="flex flex-col h-screen">
      {/* Tab bar */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        items={files}
        onTabClick={setActiveTab}
        onTabClose={closeTab}
        onTabReorder={reorderTabs}
        onCloseOtherTabs={closeOtherTabs}
        onCloseTabsToRight={closeTabsToRight}
        onCloseAllTabs={closeAllTabs}
        enableDragReorder={true}
        enableContextMenu={true}
        renderTabContent={(file, isActive) => (
          <span className={isActive ? 'font-semibold' : ''}>
            {file.name}
          </span>
        )}
      />

      {/* File content area */}
      <div className="flex-1 p-4">
        {activeTabId && files.get(activeTabId) && (
          <div>
            <h2>Viewing: {files.get(activeTabId)!.path}</h2>
            {/* Render file content here */}
          </div>
        )}
      </div>

      {/* Sidebar with file list */}
      <aside className="w-64 border-l">
        <h3>Files</h3>
        <ul>
          {Array.from(files.entries()).map(([id, file]) => (
            <li key={id} onClick={() => openTab(id)}>
              {file.name}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default FileExplorer;
```

### Example 2: Code Editor with Dirty State Tracking

Use this for a code editor or text editor with unsaved changes tracking.

```typescript
// src/components/CodeEditor.tsx
import { useTabManager, TabBar } from '@/lib/tabs/core';
import { useState, useCallback } from 'react';

interface CodeFile {
  id: string;
  name: string;
  content: string;
}

function CodeEditor() {
  const [files, setFiles] = useState<Map<string, CodeFile>>(new Map([
    ['file1', { id: 'file1', name: 'index.ts', content: 'console.log("Hello");' }],
    ['file2', { id: 'file2', name: 'utils.ts', content: 'export const add = (a, b) => a + b;' }],
  ]));

  const [dirtyTabs, setDirtyTabs] = useState<Set<string>>(new Set());
  const [savedContent, setSavedContent] = useState<Map<string, string>>(new Map());

  const {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    setActiveTab,
    reorderTabs,
  } = useTabManager<string>({
    storageKey: 'code_editor_tabs',
    persist: true,
    onTabClose: (tabId) => {
      // Confirm before closing if dirty
      if (dirtyTabs.has(tabId)) {
        return window.confirm('You have unsaved changes. Close anyway?');
      }
      return true;
    },
  });

  const handleContentChange = useCallback((fileId: string, newContent: string) => {
    setFiles(prev => {
      const next = new Map(prev);
      const file = next.get(fileId);
      if (file) {
        next.set(fileId, { ...file, content: newContent });
      }
      return next;
    });

    // Mark as dirty if content differs from saved version
    const saved = savedContent.get(fileId);
    const isDirty = saved !== newContent;
    setDirtyTabs(prev => {
      const next = new Set(prev);
      if (isDirty) {
        next.add(fileId);
      } else {
        next.delete(fileId);
      }
      return next;
    });
  }, [savedContent]);

  const handleSave = useCallback((fileId: string) => {
    const file = files.get(fileId);
    if (!file) return;

    // Simulate save operation
    console.log('Saving file:', file.name, file.content);

    // Mark as saved
    setSavedContent(prev => new Map(prev).set(fileId, file.content));
    setDirtyTabs(prev => {
      const next = new Set(prev);
      next.delete(fileId);
      return next;
    });
  }, [files]);

  const activeFile = activeTabId ? files.get(activeTabId) : null;

  return (
    <div className="flex flex-col h-screen">
      {/* Tab bar with dirty indicators */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        items={files}
        modifiedTabs={dirtyTabs}
        onTabClick={setActiveTab}
        onTabClose={closeTab}
        onTabReorder={reorderTabs}
        enableDragReorder={true}
        renderTabContent={(file, isActive) => (
          <span className={isActive ? 'font-semibold' : ''}>
            {file.name}
          </span>
        )}
      />

      {/* Editor area */}
      <div className="flex-1 flex flex-col">
        {activeFile ? (
          <>
            <div className="border-b p-2 flex justify-between items-center">
              <span>{activeFile.name}</span>
              <button
                onClick={() => handleSave(activeFile.id)}
                disabled={!dirtyTabs.has(activeFile.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Save {dirtyTabs.has(activeFile.id) && '*'}
              </button>
            </div>
            <textarea
              className="flex-1 p-4 font-mono"
              value={activeFile.content}
              onChange={(e) => handleContentChange(activeFile.id, e.target.value)}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            No file selected
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeEditor;
```

### Example 3: Simple Tab Navigation

Minimal example with no persistence or advanced features.

```typescript
// src/components/SimpleTabNav.tsx
import { useTabManager, TabBar } from '@/lib/tabs/core';

interface TabData {
  title: string;
  content: string;
}

function SimpleTabNav() {
  const tabs = new Map<string, TabData>([
    ['home', { title: 'Home', content: 'Welcome to the home page!' }],
    ['about', { title: 'About', content: 'Learn more about us.' }],
    ['contact', { title: 'Contact', content: 'Get in touch with us.' }],
  ]);

  const {
    tabs: openTabs,
    activeTabId,
    openTab,
    closeTab,
    setActiveTab,
  } = useTabManager<string>({
    storageKey: 'simple_tabs',
    persist: false, // Disable persistence
    initialTabs: ['home'], // Start with home tab open
  });

  return (
    <div>
      <TabBar
        tabs={openTabs}
        activeTabId={activeTabId}
        items={tabs}
        onTabClick={setActiveTab}
        onTabClose={closeTab}
        renderTabContent={(tab) => <span>{tab.title}</span>}
        showCloseButton={true}
        enableDragReorder={false}
        enableContextMenu={false}
      />

      <div className="p-4">
        {activeTabId && tabs.get(activeTabId)?.content}
      </div>

      {/* Tab opener buttons */}
      <div className="flex gap-2 p-4">
        {Array.from(tabs.entries()).map(([id, tab]) => (
          <button
            key={id}
            onClick={() => openTab(id)}
            className="px-3 py-1 border rounded"
          >
            Open {tab.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SimpleTabNav;
```

---

## Lexical Integration Setup

### Complete Lexical Editor with Tab Management

This example shows how to integrate the tab system with a Lexical editor, including dirty state tracking and confirmation dialogs.

**Prerequisites**:
1. Lexical packages installed (`lexical`, `@lexical/react`)
2. `Template` type defined in `src/types/index.ts`
3. Lexical integration files copied to project

### Step 1: Create Template Editor Component

```typescript
// src/components/TemplateEditor.tsx
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { EditorState } from 'lexical';

import { DirtyStatePlugin } from '@/lib/tabs/integrations/lexical';
import type { Template } from '@/types';

interface TemplateEditorProps {
  template: Template;
  onContentChange: (templateId: string, editorState: EditorState) => void;
  onDirtyChange: (templateId: string, isDirty: boolean) => void;
}

function TemplateEditor({ template, onContentChange, onDirtyChange }: TemplateEditorProps) {
  const initialConfig = {
    namespace: 'TemplateEditor',
    editorState: JSON.stringify(template.content),
    theme: {
      // Your Lexical theme configuration
    },
    onError: (error: Error) => {
      console.error('Lexical error:', error);
    },
    nodes: [
      // Register your custom nodes here
    ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative flex-1 flex flex-col">
        {/* Toolbar would go here */}

        <RichTextPlugin
          contentEditable={
            <ContentEditable className="flex-1 p-4 outline-none" />
          }
          placeholder={
            <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
              Start typing your template...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <HistoryPlugin />

        <OnChangePlugin
          onChange={(editorState) => {
            onContentChange(template.id, editorState);
          }}
        />

        <DirtyStatePlugin
          onDirtyChange={(isDirty) => onDirtyChange(template.id, isDirty)}
        />
      </div>
    </LexicalComposer>
  );
}

export default TemplateEditor;
```

### Step 2: Create Template Manager Component

```typescript
// src/components/TemplateManager.tsx
import { useState } from 'react';
import { EditorState } from 'lexical';

import {
  useTemplateEditorTabs,
  TemplateEditorTabs,
} from '@/lib/tabs/integrations/lexical';
import type { Template } from '@/types';
import TemplateEditor from './TemplateEditor';

function TemplateManager() {
  // Sample templates
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'template1',
      name: 'Welcome Email',
      type: 'email',
      content: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Welcome to our service!',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'paragraph',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      },
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 'template2',
      name: 'Follow-up SMS',
      type: 'sms',
      content: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Thanks for reaching out!',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'paragraph',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      },
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ]);

  // Tab management with dirty state tracking
  const {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    setActiveTab,
    reorderTabs,
    closeOtherTabs,
    closeTabsToRight,
    closeAllTabs,
    dirtyTabs,
    markTabDirty,
  } = useTemplateEditorTabs();

  const handleContentChange = (templateId: string, editorState: EditorState) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === templateId
          ? { ...t, content: editorState.toJSON(), updatedAt: Date.now() }
          : t
      )
    );
  };

  const handleDirtyChange = (templateId: string, isDirty: boolean) => {
    markTabDirty(templateId, isDirty);
  };

  const activeTemplate = activeTabId
    ? templates.find((t) => t.id === activeTabId)
    : null;

  return (
    <div className="flex flex-col h-screen">
      {/* Tab bar */}
      <TemplateEditorTabs
        tabs={tabs}
        activeTabId={activeTabId}
        templates={templates}
        modifiedTabs={dirtyTabs}
        onTabClick={setActiveTab}
        onTabClose={closeTab}
        onTabReorder={reorderTabs}
        onCloseOtherTabs={closeOtherTabs}
        onCloseTabsToRight={closeTabsToRight}
        onCloseAllTabs={closeAllTabs}
      />

      {/* Editor area */}
      <div className="flex-1 flex">
        {/* Sidebar with template list */}
        <aside className="w-64 border-r p-4">
          <h3 className="font-semibold mb-4">Templates</h3>
          <ul className="space-y-2">
            {templates.map((template) => (
              <li
                key={template.id}
                onClick={() => openTab(template.id)}
                className="p-2 rounded hover:bg-gray-100 cursor-pointer"
              >
                {template.name}
                {dirtyTabs.has(template.id) && (
                  <span className="ml-2 text-blue-500">*</span>
                )}
              </li>
            ))}
          </ul>
        </aside>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {activeTemplate ? (
            <TemplateEditor
              key={activeTemplate.id}
              template={activeTemplate}
              onContentChange={handleContentChange}
              onDirtyChange={handleDirtyChange}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a template to edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TemplateManager;
```

### Step 3: Use in Your App

```typescript
// src/App.tsx
import TemplateManager from './components/TemplateManager';

function App() {
  return (
    <div className="h-screen">
      <TemplateManager />
    </div>
  );
}

export default App;
```

---

## Type Definitions

### Core Types

All core types are exported from `src/lib/tabs/core/types.ts`:

```typescript
import type {
  TabItem,
  TabsState,
  UseTabManagerOptions,
  TabManagerReturn,
} from '@/lib/tabs/core';
```

**Key Types**:
- `TabItem<T>` - Represents a single tab
- `TabsState<T>` - Complete state of the tab system
- `UseTabManagerOptions<T>` - Configuration options for `useTabManager`
- `TabManagerReturn<T>` - Return value of `useTabManager` hook

### Lexical Integration Types

Lexical integration types are exported from `src/lib/tabs/integrations/lexical`:

```typescript
import type {
  UseLexicalDirtyStateReturn,
  DirtyStatePluginProps,
  UseTemplateEditorTabsReturn,
  TemplateEditorTabsProps,
} from '@/lib/tabs/integrations/lexical';
```

### Template Type (Application-Specific)

If using the Lexical integration, define a `Template` type in your project:

```typescript
// src/types/index.ts
export interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms'; // Customize based on your needs
  content: EditorState;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  // Add any additional fields your application needs
}
```

---

## Troubleshooting

### Issue: "Module not found: Can't resolve '@/lib/tabs'"

**Solution**: Ensure path aliases are configured in `tsconfig.json` and `vite.config.ts` (or webpack config).

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

```typescript
// vite.config.ts
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Issue: "lucide-react icons not rendering"

**Solution**: Verify `lucide-react` is installed:

```bash
npm install lucide-react
```

If using a different icon library, update `TabBar.tsx` to use your icons:

```typescript
// Change from:
import { X } from 'lucide-react';

// To (example with react-icons):
import { IoClose } from 'react-icons/io5';
```

### Issue: "Cannot find module '@/types'"

**Solution**: Create the types directory and index file:

```bash
mkdir -p src/types
touch src/types/index.ts
```

Then add the `Template` type definition (see [Type Definitions](#type-definitions)).

### Issue: "Tabs not persisting across page reloads"

**Solution**: Check that:
1. `persist: true` is set in `useTabManager` options
2. localStorage is not disabled in the browser
3. The `storageKey` is unique and not conflicting with other storage keys

### Issue: "Dirty state not working with Lexical"

**Solution**: Ensure:
1. `HistoryPlugin` is registered BEFORE `DirtyStatePlugin`
2. You're calling `onDirtyChange` in the `DirtyStatePlugin`
3. The `markTabDirty` function is being called with the correct tab ID

### Issue: "TypeScript errors about missing type definitions"

**Solution**:
1. Check that TypeScript version is 4.7.0 or higher
2. Ensure `"moduleResolution": "node"` is in `tsconfig.json`
3. Run `npm install` to ensure all packages are installed
4. Restart your TypeScript language server (VS Code: Cmd+Shift+P > "Restart TS Server")

### Issue: "Tailwind classes not working"

**Solution**: Ensure Tailwind is configured to scan the tabs directory:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/lib/tabs/**/*.{js,jsx,ts,tsx}', // Add this line
  ],
};
```

### Issue: "Drag-and-drop not working"

**Solution**:
1. Verify `enableDragReorder={true}` is set
2. Ensure `onTabReorder` callback is provided
3. Check browser compatibility (HTML5 drag-and-drop API)

---

## Additional Resources

- **Full Documentation**: See `docs/tabs/CLAUDE.md` for complete API reference and advanced usage
- **TypeScript Types**: See `src/lib/tabs/core/types.ts` for all type definitions
- **Lexical Documentation**: https://lexical.dev/docs/intro
- **React Documentation**: https://react.dev/

---

## Support

For issues or questions:
1. Check this installation guide
2. Review the full documentation in `docs/tabs/CLAUDE.md`
3. Check the TypeScript types in `src/lib/tabs/core/types.ts`
4. Review the usage examples above

---

**Last Updated**: 2025-01-27
**CanvasTabs Version**: 1.0.0
