# 🚀 CanvasTabs - Start Here

Welcome to the CanvasTabs export! This is a complete, production-ready tab management system for React applications.

## For AI Assistants

If you're an AI assistant helping to install this system, **start here**:

### Step 1: Read the Installation Guide
👉 **[INSTALLATION.md](./INSTALLATION.md)** - Complete step-by-step instructions

This guide contains:
- Explicit file paths and commands
- All dependencies with installation commands
- Complete code examples
- TypeScript configuration
- Troubleshooting solutions

### Step 2: Use the Checklist
👉 **[CHECKLIST.md](./CHECKLIST.md)** - Verify each installation step

This checklist ensures:
- All files copied correctly
- All dependencies installed
- TypeScript configured properly
- Features working as expected

### Step 3: Reference the API
👉 **[docs/tabs/CLAUDE.md](./docs/tabs/CLAUDE.md)** - Full technical documentation

Refer to this for:
- Complete API reference
- Type definitions
- Advanced usage patterns
- Integration examples

---

## For Human Developers

If you're a human developer installing this system:

### Quick Start (5 minutes)
👉 **[README.md](./README.md)** - Overview and quick examples

This covers:
- What CanvasTabs does
- Quick installation steps
- Usage examples
- Feature overview

### Dependencies
See **[package.template.json](./package.template.json)** for all required packages.

**Core dependencies** (always required):
```bash
npm install lucide-react
```

**Lexical integration** (optional):
```bash
npm install lexical @lexical/react
```

---

## What's Included

```
📦 CanvasTabs-Export/
│
├── 📄 START_HERE.md           ← You are here
├── 📄 README.md               ← Overview and quick start
├── 📄 INSTALLATION.md         ← Complete installation guide (AI-focused)
├── 📄 CHECKLIST.md            ← Installation verification
├── 📄 EXPORT_SUMMARY.md       ← What was exported and why
├── 📄 package.template.json   ← Dependency reference
│
├── 📁 docs/
│   └── 📁 tabs/
│       └── 📄 CLAUDE.md       ← Full API documentation
│
└── 📁 src/
    └── 📁 lib/
        └── 📁 tabs/           ← Tab system source code
            ├── 📁 core/       ← Generic tab system (no dependencies)
            └── 📁 integrations/
                └── 📁 lexical/ ← Lexical editor integration
```

---

## Installation Overview

### Option A: Core System Only (No Editor)

Use this for file explorers, document viewers, or any generic tab navigation:

```bash
# 1. Copy files
cp -r src/lib/tabs /path/to/your-project/src/lib/

# 2. Install dependencies
cd /path/to/your-project
npm install lucide-react

# 3. Use in your app
import { useTabManager, TabBar } from '@/lib/tabs/core';
```

See [INSTALLATION.md](./INSTALLATION.md) for complete instructions.

### Option B: With Lexical Editor

Use this for Lexical-based editors with dirty state tracking:

```bash
# 1. Copy files (same as above)
cp -r src/lib/tabs /path/to/your-project/src/lib/

# 2. Install dependencies
cd /path/to/your-project
npm install lucide-react lexical @lexical/react

# 3. Create Template type (see INSTALLATION.md for details)
# 4. Use in your app
import { useTemplateEditorTabs } from '@/lib/tabs/integrations/lexical';
```

See [INSTALLATION.md](./INSTALLATION.md) for complete instructions.

---

## Key Features

✅ VS Code-style horizontal tabs
✅ Drag-and-drop reordering
✅ Context menu (right-click)
✅ Dirty state tracking
✅ localStorage persistence
✅ TypeScript generics support
✅ Keyboard shortcuts
✅ LRU eviction
✅ Lexical integration

---

## Documentation Priority

1. **New to this system?** → Start with [README.md](./README.md)
2. **AI assistant installing?** → Follow [INSTALLATION.md](./INSTALLATION.md)
3. **Verifying installation?** → Use [CHECKLIST.md](./CHECKLIST.md)
4. **Need API reference?** → See [docs/tabs/CLAUDE.md](./docs/tabs/CLAUDE.md)
5. **Want to know what's included?** → Read [EXPORT_SUMMARY.md](./EXPORT_SUMMARY.md)

---

## Quick Example

```typescript
import { useTabManager, TabBar } from '@/lib/tabs/core';

function App() {
  const files = new Map([
    ['file1', { name: 'index.tsx' }],
    ['file2', { name: 'App.tsx' }],
  ]);

  const { tabs, activeTabId, openTab, closeTab, setActiveTab } = useTabManager({
    storageKey: 'my_tabs',
    persist: true,
  });

  return (
    <TabBar
      tabs={tabs}
      activeTabId={activeTabId}
      items={files}
      onTabClick={setActiveTab}
      onTabClose={closeTab}
      renderTabContent={(file) => <span>{file.name}</span>}
    />
  );
}
```

---

## Need Help?

1. Check [INSTALLATION.md](./INSTALLATION.md) - Most common issues are covered
2. Review [CHECKLIST.md](./CHECKLIST.md) - Verify each step
3. See [docs/tabs/CLAUDE.md](./docs/tabs/CLAUDE.md) - Full API reference
4. Check [EXPORT_SUMMARY.md](./EXPORT_SUMMARY.md) - What's included and what's not

---

## Tech Stack Requirements

- **React**: 18.0.0+
- **TypeScript**: 4.7.0+
- **Node**: 16.0.0+ (for npm)

**Recommended but optional**:
- Vite (any bundler works)
- Tailwind CSS (for styling)

---

**Version**: 1.0.0
**Last Updated**: 2025-10-27

---

**Ready to get started?**
- AI Assistant: 👉 [INSTALLATION.md](./INSTALLATION.md)
- Developer: 👉 [README.md](./README.md)
