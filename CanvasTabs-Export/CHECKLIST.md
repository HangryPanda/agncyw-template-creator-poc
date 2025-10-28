# CanvasTabs Installation Checklist

Use this checklist to verify successful installation of the CanvasTabs system.

## Pre-Installation

- [ ] **Target project uses React 18.0.0+**
- [ ] **Target project uses TypeScript 4.7.0+**
- [ ] **Target project has a `src/lib/` directory** (or equivalent)
- [ ] **Backup target project** (optional but recommended)

## Core Installation

- [ ] **Copied `src/lib/tabs/` to target project**
  - Verify path: `/path/to/project/src/lib/tabs/`
  - Should contain `core/`, `integrations/`, and `index.ts`

- [ ] **Installed lucide-react**
  ```bash
  npm install lucide-react
  ```
  - Verify: Check `package.json` includes `lucide-react`

- [ ] **Configured TypeScript path aliases**
  - Updated `tsconfig.json` with `@/lib/tabs` alias
  - If using Vite: Updated `vite.config.ts` with path resolve

- [ ] **Imported and used core system**
  ```typescript
  import { useTabManager, TabBar } from '@/lib/tabs/core';
  ```
  - No TypeScript errors
  - No import errors in terminal

## Lexical Integration (Optional)

Only complete if using Lexical editor:

- [ ] **Installed Lexical packages**
  ```bash
  npm install lexical @lexical/react
  ```
  - Verify: Check `package.json` includes both packages

- [ ] **Created Template type definition**
  - File: `src/types/index.ts`
  - Contains `Template` interface
  - Contains `EditorState` interface

- [ ] **Imported Lexical integration**
  ```typescript
  import { useTemplateEditorTabs } from '@/lib/tabs/integrations/lexical';
  ```
  - No TypeScript errors
  - No import errors

- [ ] **Used in Lexical editor**
  - `<DirtyStatePlugin />` inside `<LexicalComposer>`
  - `<HistoryPlugin />` registered before dirty plugin
  - `markTabDirty` callback wired up

## Styling

- [ ] **Tailwind CSS configured** (if using Tailwind)
  - `tailwind.config.js` includes `src/lib/tabs/**/*.{tsx,ts}` in content
  - Custom colors defined (background, foreground, muted, etc.)

- [ ] **Alternative styling setup** (if not using Tailwind)
  - Converted Tailwind classes to CSS modules, or
  - Converted Tailwind classes to styled-components, or
  - Created custom CSS file

## Functional Testing

- [ ] **Can open tabs**
  - Click to open a tab
  - Tab appears in tab bar
  - Tab becomes active

- [ ] **Can close tabs**
  - Click close button (X icon)
  - Tab disappears from tab bar
  - Next appropriate tab becomes active

- [ ] **Can switch tabs**
  - Click different tab
  - Active tab changes
  - Content area updates

- [ ] **Tabs persist** (if enabled)
  - Open tabs
  - Refresh page
  - Tabs restore to previous state

- [ ] **Drag-and-drop works** (if enabled)
  - Drag tab left or right
  - Tab position changes
  - Order persists

- [ ] **Context menu works** (if enabled)
  - Right-click tab
  - Menu appears with options
  - "Close Others", "Close to Right", etc. work

- [ ] **Modified indicator works** (if using dirty state)
  - Make changes in editor
  - Blue dot appears on tab
  - Save changes, dot disappears

- [ ] **Close confirmation works** (if using dirty state)
  - Make changes in editor
  - Try to close tab
  - Confirmation dialog appears

## Performance

- [ ] **No console errors**
  - Check browser console
  - No errors related to tabs system

- [ ] **No TypeScript errors**
  - Run `npm run build` or `tsc --noEmit`
  - No errors in tabs files

- [ ] **Reasonable performance**
  - Open 10+ tabs
  - No lag when switching tabs
  - No lag when dragging tabs

## localStorage (if persistence enabled)

- [ ] **Data stored correctly**
  - Open browser DevTools > Application > localStorage
  - Find key (e.g., `my_app_tabs`)
  - Data is valid JSON
  - Contains `tabs`, `activeTabId`, `tabOrder`

- [ ] **Data loads correctly**
  - Refresh page
  - Tabs restore from localStorage
  - Active tab restored correctly

## Documentation

- [ ] **Read INSTALLATION.md**
  - Understand installation steps
  - Understand usage examples

- [ ] **Reviewed docs/tabs/CLAUDE.md**
  - Understand API reference
  - Know where to find help

## Integration-Specific (Lexical)

Only complete if using Lexical integration:

- [ ] **Dirty state tracks correctly**
  - Type in editor
  - Blue dot appears immediately
  - Undo to original state, dot disappears

- [ ] **History plugin integrated**
  - Can undo/redo in editor
  - Undo to original = not dirty

- [ ] **Save clears dirty state**
  - Make changes
  - Save
  - Blue dot disappears

- [ ] **Template icons render**
  - Email templates show envelope icon
  - SMS templates show message icon

## Common Issues Resolved

- [ ] **"Module not found" errors**
  - Fixed path aliases in tsconfig.json
  - Fixed path aliases in vite.config.ts

- [ ] **"Cannot find module '@/types'" errors**
  - Created `src/types/index.ts`
  - Defined `Template` and `EditorState` types

- [ ] **Icons not rendering**
  - Installed `lucide-react`
  - Or replaced with alternative icon library

- [ ] **Tailwind classes not working**
  - Added tabs directory to Tailwind content
  - Or converted to alternative styling

- [ ] **TypeScript strict mode errors**
  - Ensured all imports use correct types
  - No `any` types used (unless intentional)

## Final Verification

- [ ] **Core functionality works in development**
  - `npm run dev` starts without errors
  - Tabs render correctly
  - All features work as expected

- [ ] **Production build succeeds**
  - `npm run build` completes without errors
  - No build warnings related to tabs

- [ ] **Production preview works**
  - `npm run preview` starts correctly
  - Tabs work in production build

## Post-Installation

- [ ] **Customize for your use case**
  - Updated `storageKey` to be unique
  - Customized `maxTabs` limit if needed
  - Added custom styling if needed

- [ ] **Integrated with your app**
  - Tabs connected to your data
  - Tabs control your views/editors
  - Event handlers wired up

- [ ] **Tested edge cases**
  - Close all tabs
  - Open max tabs (LRU eviction)
  - Rapid tab opening/closing

## Optional Enhancements

- [ ] **Added keyboard shortcuts**
  - Cmd/Ctrl + W to close tab
  - Cmd/Ctrl + Tab to switch tabs

- [ ] **Customized tab rendering**
  - Custom icons per tab type
  - Custom badges or indicators
  - Custom styling

- [ ] **Added analytics/tracking**
  - Track tab opens
  - Track tab closes
  - Track tab switches

---

## Completion Status

**Date Installed**: ___________

**Installed By**: ___________

**Core System Working**: ☐ Yes ☐ No

**Lexical Integration Working**: ☐ Yes ☐ No ☐ N/A

**Issues Encountered**: ___________________________________________

**Notes**: ___________________________________________

---

✅ **Installation Complete!**

Next steps:
- See [INSTALLATION.md](./INSTALLATION.md) for detailed usage examples
- See [docs/tabs/CLAUDE.md](./docs/tabs/CLAUDE.md) for full API reference
- Customize the system for your specific needs
