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

Follow the pattern in [src/App.tsx](src/App.tsx) where `EMAIL_TEMPLATE` and `SMS_TEMPLATE` are defined. Templates are `EditorState` objects with nested paragraph and text/template-variable nodes.

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
