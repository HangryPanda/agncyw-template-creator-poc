# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an insurance template creator POC for "Quote Not Written" campaigns. It allows insurance agents to create and use email/SMS templates with fill-in-the-blank fields for personalized outreach at scale.

**Tech Stack:** React 18, TypeScript, Vite, Lexical editor

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (default: http://localhost:5173)
npm run dev

# Build for production (runs TypeScript compiler first, then Vite)
npm run build

# Preview production build
npm run preview
```

## TypeScript Configuration

The project uses **strict TypeScript** with additional linting rules:
- `strict: true` - Full type safety enforcement
- `noUnusedLocals: true` - Error on unused variables
- `noUnusedParameters: true` - Error on unused function parameters
- `noFallthroughCasesInSwitch: true` - Require break/return in switch cases

**IMPORTANT:** Avoid using `any` type. Follow strict typing conventions throughout the codebase.

## Architecture

### Tab Management System

The application uses a modular, reusable tab navigation system inspired by VS Code. See **[complete documentation](src/lib/tabs/CLAUDE.md)** for full API reference and usage examples.

**Key Features:**
- VS Code-style horizontal tabs with drag-and-drop reordering
- localStorage persistence across browser sessions
- Dirty state tracking with unsaved change indicators
- Keyboard shortcuts (Cmd/Ctrl+W to close, Cmd/Ctrl+Tab to switch)
- Context menu (close, close others, close to right, close all)
- Generic core system + Lexical-specific integration

**File Structure:**
```
src/lib/tabs/
├── core/                          # Generic, reusable tab system
│   ├── useTabManager.ts           # State management hook
│   ├── TabBar.tsx                 # VS Code-style UI component
│   └── types.ts                   # TypeScript definitions
└── integrations/lexical/          # Lexical editor integration
    ├── useLexicalDirtyState.ts    # Dirty state tracking
    ├── DirtyStatePlugin.tsx       # Headless dirty state plugin
    ├── useTemplateEditorTabs.ts   # Template-specific wrapper
    └── TemplateEditorTabs.tsx     # Template tab bar component
```

**Quick Integration:**
```typescript
import {
  useTemplateEditorTabs,
  TemplateEditorTabs,
  DirtyStatePlugin
} from '@/lib/tabs/integrations/lexical';

const { tabs, activeTabId, openTab, closeTab, dirtyTabs, markTabDirty } = useTemplateEditorTabs();

// Render tabs
<TemplateEditorTabs
  tabs={tabs}
  activeTabId={activeTabId}
  templates={templates}
  modifiedTabs={dirtyTabs}
  onTabClick={setActiveTab}
  onTabClose={closeTab}
/>

// Track dirty state in Lexical
<LexicalComposer>
  <DirtyStatePlugin onDirtyChange={(isDirty) => markTabDirty(activeTabId, isDirty)} />
</LexicalComposer>
```

For detailed documentation, examples, and API reference, see [src/lib/tabs/CLAUDE.md](src/lib/tabs/CLAUDE.md).

### Lexical Custom Node System

The core architecture revolves around **Lexical's DecoratorNode** system for creating custom template variables:

1. **TemplateVariableNode** ([src/nodes/TemplateVariableNode.tsx](src/nodes/TemplateVariableNode.tsx))
   - Extends `DecoratorNode<JSX.Element>` from Lexical
   - Renders as blue pill-style components: `{{variable_name}}`
   - Provides JSON serialization/deserialization for state persistence
   - Must be registered in the Lexical composer's `nodes` array

2. **Editor State Flow**
   - App.tsx stores templates as `EditorState` objects (JSON representation of Lexical's AST)
   - TemplateEditor.tsx wraps Lexical composer and handles state changes via `OnChangePlugin`
   - State is serialized using `editorState.toJSON()` for persistence
   - State is deserialized by passing JSON string to `initialConfig.editorState`

### Component Hierarchy

```
App.tsx (State Management)
├── Mode toggle: "create" vs "use"
├── Tab management: "email" vs "sms"
├── EMAIL_TEMPLATE and SMS_TEMPLATE (pre-built EditorState objects)
└── INSURANCE_VARIABLES (array of TemplateVariable definitions)
    │
    ├─> TemplateEditor.tsx (Create Mode)
    │   ├── LexicalComposer (with TemplateVariableNode registered)
    │   ├── RichTextPlugin (contentEditable + placeholder)
    │   ├── HistoryPlugin (undo/redo)
    │   ├── OnChangePlugin (onChange callback to App.tsx)
    │   └── ToolbarPlugin (variable insertion buttons)
    │       └── Uses $createTemplateVariableNode() to insert nodes
    │
    └─> TemplatePreview.tsx (Use Mode)
        ├── Form inputs for each variable
        ├── renderTemplate() - walks EditorState AST and replaces variables
        └── Copy to clipboard functionality
```

### Data Flow

1. **Creating Templates:**
   - User clicks variable button in ToolbarPlugin
   - `$createTemplateVariableNode(variableName)` creates new node
   - Node is inserted at cursor position via `selection.insertNodes([variableNode])`
   - OnChangePlugin fires, serializes state via `editorState.toJSON()`
   - App.tsx receives EditorState and updates `emailTemplate` or `smsTemplate` state

2. **Using Templates:**
   - App.tsx passes current `EditorState` to TemplatePreview
   - User fills form inputs with customer data
   - `renderTemplate()` recursively walks the AST tree (`root.children`)
   - Template variables (`type: 'template-variable'`) are replaced with user input values
   - Final text is copied to clipboard

### Key Type Definitions ([src/types/index.ts](src/types/index.ts))

```typescript
TemplateVariable {
  name: string;        // Variable identifier (e.g., 'first_name')
  label: string;       // Display name (e.g., 'First Name')
  description: string; // Help text
  example: string;     // Default/example value
}

SerializedTemplateVariableNode {
  variableName: string;
  type: 'template-variable';
  version: number;
}

EditorState {
  root: {
    children: any[];  // AST nodes (paragraphs, text, template-variables)
    // ... Lexical metadata fields
  }
}
```

## Working with Lexical

**Important Lexical Concepts:**

1. **Custom Nodes must extend DecoratorNode, TextNode, or ElementNode**
   - TemplateVariableNode extends DecoratorNode for inline custom components

2. **Nodes must implement:**
   - `static getType()` - unique identifier string
   - `static clone()` - creates copy of node
   - `createDOM()` - returns HTMLElement for rendering
   - `updateDOM()` - return false if DOM never needs updates
   - `exportJSON()` - serialize to JSON
   - `static importJSON()` - deserialize from JSON

3. **Editor Updates:**
   - Always wrap mutations in `editor.update(() => { ... })`
   - Use `$getSelection()` and check `$isRangeSelection()` before inserting nodes
   - Use `$` prefix convention for Lexical helper functions

4. **Plugin Pattern:**
   - Plugins use `useLexicalComposerContext()` to access editor instance
   - Register plugins as children of `<LexicalComposer>`

## Extending the Application

### Adding New Variables

Edit `INSURANCE_VARIABLES` array in [src/App.tsx](src/App.tsx):

```typescript
const INSURANCE_VARIABLES: TemplateVariable[] = [
  // ... existing variables
  {
    name: 'new_field',
    label: 'New Field',
    description: 'Description here',
    example: 'Example value'
  },
];
```

### Creating New Templates

Template definitions are located in [src/config/defaultTemplates.ts](src/config/defaultTemplates.ts). Templates are `EditorState` objects with nested paragraph and text/template-variable nodes.

## 🔑 Template Registry System (Critical Architecture)

**IMPORTANT:** The app uses a **Template Registry** system that manages multiple template types across separate localStorage keys while providing a unified API.

### Architecture Overview

The Template Registry provides an abstraction layer over localStorage that supports:
- **Multiple template types**: System, Agency, and User templates
- **Automatic migrations**: Seamlessly migrates data from old storage structure
- **Version-based conflict resolution**: Newer versions win during imports
- **Backup/Restore**: Export and import templates as JSON files
- **Default template restoration**: Auto-restores missing system templates

### Template Types

```typescript
type TemplateType = 'system' | 'agency' | 'user';

interface Template {
  // ... existing fields
  templateType: TemplateType;  // Distinguishes template ownership
  version: number;              // For conflict resolution
  schemaVersion: number;        // For migration tracking
}
```

1. **System Templates** (`templates_system` key)
   - Provided by the app (e.g., "Getting Started Guide")
   - Can be deleted but auto-restore if missing
   - Defined in [src/config/defaultTemplates.ts](src/config/defaultTemplates.ts)

2. **Agency Templates** (`templates_agency` key)
   - Defined by agency owners/managers (future feature)
   - Will sync from agency settings when backend is implemented

3. **User Templates** (`templates_user` key)
   - Custom templates created by individual users
   - Always preserved during imports/migrations

### Storage Keys

The registry manages three localStorage keys:
```typescript
{
  storageKeys: {
    system: 'templates_system',
    agency: 'templates_agency',
    user: 'templates_user',
  }
}
```

### Core Services

#### 1. **TemplateRegistry** ([src/services/TemplateRegistry.ts](src/services/TemplateRegistry.ts))

Provides unified CRUD operations across all template types:

```typescript
import { templateRegistry } from '@/services/TemplateRegistry';

// Get all templates (merged from all storage keys)
const allTemplates = templateRegistry.getAll();

// Get templates by type
const systemTemplates = templateRegistry.getByType('system');

// Create new template (auto-routes to correct storage key)
templateRegistry.create({
  id: 'my_template',
  templateType: 'user',
  version: 1,
  // ... other fields
});

// Update template (auto-increments version)
templateRegistry.update(updatedTemplate);

// Delete template
templateRegistry.delete(templateId);

// Restore missing system templates
templateRegistry.restoreSystemDefaults();

// Initialize (run migrations + restore defaults)
templateRegistry.initialize();
```

#### 2. **Migration Engine** ([src/services/templateMigrations.ts](src/services/templateMigrations.ts))

Handles data migrations and schema version tracking:

```typescript
import { migrationEngine } from '@/services/templateMigrations';

// Check if migration is needed
if (migrationEngine.needsLegacyMigration()) {
  // Automatically migrates old 'insurance_templates' key to new structure
  migrationEngine.runLegacyMigration();
}

// Get current migration version
const version = migrationEngine.getCurrentVersion();
```

**Legacy Migration (v0 → v1):**
- Moves templates from `insurance_templates` to `templates_user`
- Adds `templateType: 'user'`, `version: 1`, `schemaVersion: 1` to all templates
- Marks migration as applied to prevent re-running

#### 3. **Backup/Restore Service** ([src/services/templateBackup.ts](src/services/templateBackup.ts))

Enables local backup and restore functionality:

```typescript
import { templateBackupService } from '@/services/templateBackup';

// Export all templates to JSON object
const backup = templateBackupService.exportTemplates();

// Download as JSON file (triggers browser download)
templateBackupService.downloadBackup();
// Creates: templates_backup_YYYYMMDD.json

// Parse uploaded backup file
const backup = templateBackupService.parseBackupFile(jsonString);

// Import with merge strategy (version-based conflict resolution)
const result = templateBackupService.importTemplates(backup, {
  strategy: 'merge',
});

// Import with replace strategy (preserves user templates)
const result = templateBackupService.importTemplates(backup, {
  strategy: 'replace',
  preserveUserTemplates: true,
});
```

**Backup File Structure:**
```typescript
{
  exportDate: "2025-01-24T10:00:00Z",
  appVersion: "1.0.0",
  schemaVersion: 1,
  templates: {
    system: Template[],
    agency: Template[],
    user: Template[]
  },
  counts: {
    system: 3,
    agency: 0,
    user: 10,
    total: 13
  }
}
```

#### 4. **React Hook** ([src/hooks/useTemplateRegistry.ts](src/hooks/useTemplateRegistry.ts))

React-friendly interface to the registry:

```typescript
import { useTemplateRegistry } from '@/hooks/useTemplateRegistry';

function MyComponent() {
  const {
    templates,           // All templates (merged)
    isInitialized,       // Loading state
    createTemplate,      // Create new template
    updateTemplate,      // Update existing template
    deleteTemplate,      // Delete template
    restoreSystemDefaults, // Restore missing system templates
    downloadBackup,      // Export to JSON file
    importBackup,        // Import from backup
  } = useTemplateRegistry();

  // Use templates in your component
}
```

### Adding New System Templates

1. **Define the template** in [src/config/defaultTemplates.ts](src/config/defaultTemplates.ts):

```typescript
const NEW_TEMPLATE: EditorState = {
  root: {
    children: [/* ... */],
    // ...
  },
};

export const SYSTEM_TEMPLATES: Omit<Template, 'createdAt' | 'updatedAt'>[] = [
  // ... existing templates
  {
    id: 'new_template_id',
    name: 'New Template Name',
    type: 'email',
    content: NEW_TEMPLATE,
    tags: [],
    templateType: 'system',
    version: 1,
    schemaVersion: CURRENT_SCHEMA_VERSION,
  },
];
```

2. **Automatic restoration**: On next app load, `templateRegistry.initialize()` will automatically add missing system templates.

### Backup & Restore UI

The [BackupRestorePanel](src/components/BackupRestorePanel.tsx) component provides:
- **Export**: Download all templates as JSON
- **Import**: Upload backup with strategy selection (merge/replace)
- **Restore System Defaults**: Re-add missing system templates
- **Template Counts**: Display by type (system/agency/user)

### Migration Strategy

When adding new fields to `Template`:

1. Increment `CURRENT_SCHEMA_VERSION` in [src/config/defaultTemplates.ts](src/config/defaultTemplates.ts)
2. Add migration to [src/services/templateMigrations.ts](src/services/templateMigrations.ts):

```typescript
{
  version: 2,
  name: 'AddNewField',
  up: (templates: Template[]) => {
    return templates.map(t => ({
      ...t,
      newField: defaultValue,
      schemaVersion: 2,
    }));
  },
}
```

3. Migration runs automatically on next load

### Adding Rich Text Features

To add bold, italic, lists, etc.:
1. Import Lexical's built-in node types (e.g., `ListNode`, `ListItemNode`)
2. Register them in `initialConfig.nodes` array in TemplateEditor
3. Add corresponding buttons/controls in ToolbarPlugin
4. Use Lexical's `$` commands (e.g., `$setBlocksType()`)

## Inline Styles

This project uses **inline React styles** (React.CSSProperties) rather than CSS files. When adding new components, follow this pattern for consistency.

## Build Output

Production builds are output to `dist/` directory. Vite handles:
- TypeScript compilation
- Asset bundling and optimization
- Tree shaking
- Code splitting

The build process runs `tsc && vite build`, so TypeScript errors will block the build.
