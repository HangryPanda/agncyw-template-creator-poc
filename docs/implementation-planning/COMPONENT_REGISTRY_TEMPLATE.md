# Component Registry Template

**Purpose**: AI-assistant friendly catalog of all UI components in the codebase for efficient development assistance.

**Last Updated**: 2025-10-25
**Schema Version**: 1.0

---

## Quick Reference Table

| Component | Category | Path (New) | Path (Old) | Primary Use | Key Props |
|-----------|----------|------------|------------|-------------|-----------|
| Button | Primitive | `@/components/primitives` | `@/ui/Button` | Action triggers | `onClick`, `disabled`, `children` |
| Modal | Overlay | `@/components/overlays` | `@/ui/Modal` | Dialog overlays | `onClose`, `title`, `children` |
| ColorPicker | Picker | `@/components/pickers` | `@/ui/ColorPicker` | Color selection | `color`, `onChange` |
| ExcalidrawModal | Lexical | `@/components/lexical` | `@/ui/ExcalidrawModal` | Diagram editor | `initialElements`, `onSave` |

---

## Component Categories

### 1. Primitives (`src/components/primitives/`)
Basic, reusable form controls and interactive elements.

### 2. Overlays (`src/components/overlays/`)
Modal dialogs, dropdowns, and floating UI elements.

### 3. Pickers (`src/components/pickers/`)
Specialized input controls for selecting values (colors, etc.).

### 4. Editors (`src/components/editors/`)
Content editing components.

### 5. Lexical (`src/components/lexical/`)
Lexical editor-specific UI components.

---

## Detailed Component Documentation

### Button.view.tsx

**Category**: Primitive
**Location**: `src/components/primitives/Button.view.tsx`
**CSS**: `src/components/primitives/Button.css`
**Old Path**: `@/ui/Button`

**Purpose**: Standard clickable button with consistent styling.

**Props Interface**:
```typescript
interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  small?: boolean;
  children: React.ReactNode;
  className?: string;
  title?: string;
}
```

**Usage Example**:
```typescript
import { Button } from '@/components/primitives';

<Button onClick={handleSave} disabled={isSaving}>
  Save Template
</Button>

<Button small onClick={handleCancel}>
  Cancel
</Button>
```

**Common Patterns**:
- Use `disabled` prop to prevent actions during async operations
- Use `small` prop for secondary actions
- Always provide descriptive `children` text

**Anti-Patterns**:
- ❌ Don't use for navigation (use links/router)
- ❌ Don't nest buttons inside buttons

**Dependencies**: None

**Used By**: ToolbarPlugin, TemplateMetadataEditor, BackupRestorePanel

---

### Modal.view.tsx

**Category**: Overlay
**Location**: `src/components/overlays/Modal.view.tsx`
**CSS**: `src/components/overlays/Modal.css`
**Old Path**: `@/ui/Modal`

**Purpose**: Full-screen modal overlay for dialogs and forms.

**Props Interface**:
```typescript
interface ModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  closeOnClickOutside?: boolean;
}
```

**Usage Example**:
```typescript
import { Modal } from '@/components/overlays';

<Modal
  title="Edit Template Metadata"
  onClose={handleClose}
  closeOnClickOutside={true}
>
  <form>
    {/* Modal content */}
  </form>
</Modal>
```

**Common Patterns**:
- Always handle `onClose` callback properly
- Use for complex forms and multi-step workflows
- Set `closeOnClickOutside={false}` for forms with unsaved changes

**Anti-Patterns**:
- ❌ Don't nest modals inside modals
- ❌ Don't use for simple confirmations (use Dialog instead)

**Dependencies**: Portal rendering (React.createPortal)

**Used By**: useModal hook, ExcalidrawPlugin, EquationsPlugin

---

### ColorPicker.view.tsx

**Category**: Picker
**Location**: `src/components/pickers/ColorPicker.view.tsx`
**CSS**: `src/components/pickers/ColorPicker.css`
**Old Path**: `@/ui/ColorPicker`

**Purpose**: Interactive color picker with preset colors and custom hex input.

**Props Interface**:
```typescript
interface ColorPickerProps {
  color: string;           // Current color (hex format)
  onChange: (color: string, skipHistoryStack: boolean) => void;
  disabled?: boolean;
}
```

**Usage Example**:
```typescript
import { ColorPicker } from '@/components/pickers';

<ColorPicker
  color={currentColor}
  onChange={(newColor, skipHistory) => {
    setColor(newColor);
    if (!skipHistory) {
      addToUndoStack();
    }
  }}
/>
```

**Common Patterns**:
- Color values are always in hex format (`#RRGGBB`)
- `skipHistoryStack` parameter controls undo/redo behavior
- Provides preset color swatches for common colors

**Anti-Patterns**:
- ❌ Don't use RGB/HSL values (convert to hex first)
- ❌ Don't forget to handle the `skipHistoryStack` parameter

**Dependencies**: None

**Used By**: ToolbarPlugin (text/background color), TableActionMenuPlugin

---

### ExcalidrawModal.view.tsx

**Category**: Lexical
**Location**: `src/components/lexical/ExcalidrawModal.view.tsx`
**CSS**: `src/components/lexical/ExcalidrawModal.css`
**Old Path**: `@/ui/ExcalidrawModal`

**Purpose**: Full-screen Excalidraw diagram editor modal for Lexical editor.

**Props Interface**:
```typescript
interface ExcalidrawModalProps {
  initialElements?: ExcalidrawElementFragment[];
  initialAppState?: AppState;
  isShown: boolean;
  onClose: () => void;
  onSave: (elements: ExcalidrawElementFragment[], appState: AppState) => void;
  closeOnClickOutside?: boolean;
}
```

**Usage Example**:
```typescript
import { ExcalidrawModal } from '@/components/lexical';

<ExcalidrawModal
  isShown={isModalOpen}
  initialElements={existingElements}
  onSave={(elements, appState) => {
    updateExcalidrawNode(elements, appState);
    setIsModalOpen(false);
  }}
  onClose={() => setIsModalOpen(false)}
/>
```

**Common Patterns**:
- Used exclusively with Lexical's ExcalidrawNode
- Handles diagram state persistence
- Provides Save/Discard buttons

**Anti-Patterns**:
- ❌ Don't use outside of Lexical editor context
- ❌ Don't mutate `initialElements` directly

**Dependencies**:
- `@excalidraw/excalidraw` package
- ExcalidrawNode (Lexical custom node)

**Used By**: ExcalidrawPlugin

---

## Component Composition Patterns

### Modal + Form Pattern
```typescript
import { Modal, Button, TextInput } from '@/components';

<Modal title="Create Template" onClose={handleClose}>
  <form onSubmit={handleSubmit}>
    <TextInput
      label="Template Name"
      value={name}
      onChange={setName}
    />
    <div className="button-group">
      <Button onClick={handleClose}>Cancel</Button>
      <Button onClick={handleSubmit}>Create</Button>
    </div>
  </form>
</Modal>
```

### Dropdown + ColorPicker Pattern
```typescript
import { DropdownColorPicker } from '@/components/pickers';

// Pre-composed component that combines DropDown + ColorPicker
<DropdownColorPicker
  buttonClassName="toolbar-item"
  buttonLabel="Text Color"
  color={textColor}
  onChange={handleColorChange}
/>
```

---

## Import Path Migration Map

When refactoring, use these mappings:

| Old Import | New Import |
|------------|------------|
| `import { Button } from '@/ui/Button'` | `import { Button } from '@/components/primitives'` |
| `import { Modal } from '@/ui/Modal'` | `import { Modal } from '@/components/overlays'` |
| `import { ColorPicker } from '@/ui/ColorPicker'` | `import { ColorPicker } from '@/components/pickers'` |
| `import { ContentEditable } from '@/ui/ContentEditable'` | `import { ContentEditable } from '@/components/editors'` |
| `import { ExcalidrawModal } from '@/ui/ExcalidrawModal'` | `import { ExcalidrawModal } from '@/components/lexical'` |

**Barrel Export** (after reorganization):
```typescript
import {
  Button,
  TextInput,
  Select,
  Modal,
  ColorPicker
} from '@/components';
```

---

## Styling Conventions

### CSS File Naming
- Component: `Button.view.tsx`
- CSS File: `Button.css` (same directory)

### CSS Class Naming
- Use descriptive class names: `.modal-backdrop`, `.color-picker-swatch`
- Avoid generic names: `.container`, `.wrapper`
- Prefix Lexical-specific classes: `.lexical-modal-*`

### Importing CSS
```typescript
// Import in component file
import './Button.css';
```

---

## Component Development Guidelines

### For AI Assistants

1. **Always check this registry before creating new components** to avoid duplicates
2. **Use existing primitives** before building custom solutions
3. **Follow naming conventions**: `ComponentName.view.tsx`
4. **Co-locate CSS files** with components
5. **Update this registry** when adding new components
6. **Use TypeScript strict mode** - no `any` types
7. **Provide prop interfaces** with JSDoc comments

### Example New Component Checklist
- [ ] Check registry for existing similar component
- [ ] Create `ComponentName.view.tsx` in appropriate category folder
- [ ] Create `ComponentName.css` in same directory
- [ ] Define TypeScript prop interface with JSDoc
- [ ] Export from category `index.ts`
- [ ] Update `COMPONENT_REGISTRY.md` with documentation
- [ ] Add usage examples
- [ ] Document common patterns and anti-patterns

---

## Registry Maintenance

**When to update this file**:
- ✅ Adding a new component
- ✅ Changing component props interface
- ✅ Moving component to new location
- ✅ Deprecating a component
- ✅ Discovering new usage patterns
- ✅ Identifying anti-patterns

**How to update**:
1. Update Quick Reference Table
2. Add/update Detailed Component Documentation section
3. Update Import Path Migration Map if paths changed
4. Add new patterns to Component Composition Patterns
5. Update Last Updated timestamp

---

## Deprecated Components

*None yet - track deprecated components here during refactoring*

---

## Future Enhancements

Potential additions to component library:
- [ ] Tooltip component (currently using native `title` attribute)
- [ ] Toast notification system (currently using FlashMessage)
- [ ] Loading spinner component
- [ ] Breadcrumb navigation
- [ ] Pagination component
