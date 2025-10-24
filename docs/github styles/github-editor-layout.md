# GitHub File Viewer/Editor Layout Analysis

## Executive Summary

This document analyzes GitHub's file viewer/editor layout structure and provides implementation guidance for adapting the insurance template application to follow this proven design pattern.

**Key Finding**: GitHub's file viewer uses a **THREE-column layout** with a collapsible outline panel:
1. **Left sidebar**: File tree (320px default, 256px min, resizable)
2. **Center content**: Document viewer/editor (flexible width)
3. **Right panel**: Outline/Symbols panel (collapsible, only visible for rich text files with headings)

This structure provides both navigation (file tree) and document structure overview (outline) while keeping the center focused on content.

---

## Why This Layout Works Better

### Current Implementation (Repo Overview Pattern)
```
┌────────┬──────────────────┬────────┐
│ Temps  │  Editor          │ Details│
│ List   │  (center)        │ Panel  │
│ 25%    │  55%             │ 20%    │
└────────┴──────────────────┴────────┘
```

### GitHub File Viewer Pattern (Better for Editor)
```
┌─────────┬──────────────────────────┬─────────┐
│ File    │  Document Viewer/Editor  │ Outline │
│ Tree    │  (full width center)     │ Panel   │
│ 320px   │  Flexible                │ (hidden)│
│         │                          │         │
│ Resize  │  Content focused here    │ Toggle  │
│ Handle  │                          │ Button  │
└─────────┴──────────────────────────┴─────────┘
```

**Benefits**:
- ✅ File tree metaphor works for template list
- ✅ Center content gets maximum space
- ✅ Outline panel provides document structure navigation (only when needed)
- ✅ Right panel is collapsible - hides when not useful
- ✅ Matches user mental model of "editing a document"
- ✅ For templates: Outline could show variables or sections

---

## 1. Layout Architecture

### Main Container Structure

```html
<div class="prc-PageLayout-PageLayoutRoot">
  <div class="prc-PageLayout-PageLayoutWrapper" data-width="full">
    <div class="prc-PageLayout-PageLayoutContent">

      <!-- LEFT PANE: File Tree -->
      <div class="prc-PageLayout-PaneWrapper"
           data-position="start"
           data-sticky="true">
        <div class="prc-PageLayout-Pane"
             data-resizable="true"
             style="--pane-min-width: 256px;
                    --pane-width: 320px;">
          <!-- File tree content -->
        </div>

        <!-- Resizable Divider -->
        <div class="prc-PageLayout-VerticalDivider">
          <div class="prc-PageLayout-DraggableHandle"
               role="slider"
               aria-valuemin="256"
               aria-valuemax="1407"
               aria-valuenow="320">
          </div>
        </div>
      </div>

      <!-- CENTER CONTENT: Document Viewer -->
      <div class="prc-PageLayout-ContentWrapper" data-width="full">
        <div class="prc-PageLayout-Content">
          <!-- Document content -->
        </div>
      </div>

    </div>
  </div>
</div>
```

### CSS Custom Properties

```css
:root {
  /* Spacing */
  --spacing: var(--spacing-none);
  --spacing-row: var(--spacing-none);
  --spacing-column: var(--spacing-none);
  --spacing-divider: var(--spacing-none);

  /* Pane Sizing */
  --pane-min-width: 256px;
  --pane-max-width: calc(100vw - var(--pane-max-width-diff));
  --pane-width-size: var(--pane-width-large);
  --pane-width: 320px;

  /* Header Offset */
  --offset-header: 0px;
}
```

---

## 2. Left Sidebar: File Tree/Template List

### Dimensions

| Property | Value | Notes |
|----------|-------|-------|
| **Default Width** | `320px` | Matches current implementation! |
| **Minimum Width** | `256px` | Can't shrink smaller |
| **Maximum Width** | `calc(100vw - var(--pane-max-width-diff))` | Responsive limit |
| **Resizable** | `true` | User can drag to resize |

### HTML Structure

```html
<div class="prc-PageLayout-PaneWrapper"
     style="--offset-header:0px;
            --spacing-row:var(--spacing-none);
            --spacing-column:var(--spacing-none)"
     data-is-hidden="false"
     data-position="start"
     data-sticky="true">

  <!-- Horizontal Divider (top) -->
  <div class="prc-PageLayout-HorizontalDivider"
       data-variant="none"
       data-position="start"></div>

  <!-- The Actual Pane -->
  <div class="prc-PageLayout-Pane"
       data-resizable="true"
       style="--spacing:var(--spacing-none);
              --pane-min-width:256px;
              --pane-max-width:calc(100vw - var(--pane-max-width-diff));
              --pane-width-size:var(--pane-width-large);
              --pane-width:320px">

    <!-- Template list content goes here -->

  </div>

  <!-- Vertical Divider with Drag Handle -->
  <div class="prc-PageLayout-VerticalDivider"
       data-variant="line"
       data-position="start">

    <div class="prc-PageLayout-DraggableHandle"
         data-dragging="false"
         role="slider"
         aria-label="Draggable pane splitter"
         aria-valuemin="256"
         aria-valuemax="1407"
         aria-valuenow="320"
         aria-valuetext="Pane width 320 pixels"
         tabindex="0">
    </div>

  </div>
</div>
```

### Key Features

1. **Sticky Positioning**: `data-sticky="true"` - Sidebar stays in view during scroll
2. **Accessibility**: ARIA slider role with proper labels and value ranges
3. **State Management**: Data attributes track visibility and resize state
4. **Keyboard Control**: Draggable handle is focusable (tabindex="0")

### CSS Classes for Our Implementation

```tsx
// Template list sidebar component
<div
  className="
    w-[320px]          // Default width
    min-w-[256px]      // Minimum constraint
    max-w-[calc(100vw-var(--max-diff))]
    bg-background      // Dark background
    border-r           // Right border
    border-border      // Theme-aware border color
    sticky             // Stick to top
    top-0              // Offset
    h-screen           // Full height
  "
  data-resizable="true"
  data-is-hidden="false"
>
  {/* ModernTemplateSidebar content */}
</div>
```

---

## 3. Center Content Area

### Container Classes

```html
<div class="prc-PageLayout-ContentWrapper
            CodeView-module__SplitPageLayout_Content"
     data-is-hidden="false">

  <div class="prc-PageLayout-Content"
       data-width="full"
       style="--spacing:var(--spacing-none)">

    <div data-selector="repos-split-pane-content"
         tabindex="0">

      <!-- STICKY HEADER -->
      <div class="container CodeViewHeader-module__Box">
        <div class="px-3 pt-3 pb-0" id="StickyHeader">
          <!-- Toolbar content -->
        </div>
      </div>

      <!-- DOCUMENT CONTENT -->
      <div class="react-code-view-bottom-padding">
        <!-- Template editor content -->
      </div>

    </div>
  </div>
</div>
```

### Background Colors

- **Center content**: `bg-muted/50` (lighter - focal point)
- **Contrast with sidebar**: Sidebar uses `bg-background` (darkest)

This creates the **visual hierarchy** where the eye is drawn to the center content.

---

## 4. Right Panel: Outline/Symbols Panel

### Overview

The **third column** in GitHub's file viewer is a collapsible **Outline Panel** (also called Symbols Panel) that appears on the right side. This panel is **conditionally visible** - it only shows for rich text files (markdown, etc.) that contain extractable headings.

### When It Appears

```json
// Embedded in React app data payload
{
  "payload": {
    "symbolsExpanded": true,    // ← User preference: panel is open
    "blob": {
      "isRichtext": true,       // ← File type: markdown/rich text
      "toc": [                  // ← Table of contents data
        {
          "level": 1,
          "text": "Main Heading",
          "anchor": "main-heading",
          "htmlText": "Main Heading"
        },
        {
          "level": 2,
          "text": "Subheading",
          "anchor": "subheading",
          "htmlText": "Subheading"
        }
      ]
    }
  }
}
```

**Visibility Conditions**:
1. ✅ File is rich text (`isRichtext: true`)
2. ✅ File has extractable headings (`toc` array is populated)
3. ✅ User has enabled outline panel (`symbolsExpanded: true`)

### Content Structure

The outline panel displays:
- **Hierarchical heading structure** (h1, h2, h3, etc.)
- **Clickable navigation** - Each entry links to the corresponding anchor in the document
- **Visual indentation** - Shows document hierarchy
- **Current position indicator** - Highlights which section you're viewing

### For Template Editor

**Adaptation for Templates**:
```tsx
// Instead of document headings, show:
{
  "outlineExpanded": true,
  "templateStructure": {
    "variables": [
      { name: "first_name", label: "First Name" },
      { name: "policy_number", label: "Policy Number" }
    ],
    "sections": [
      { name: "greeting", label: "Greeting Section" },
      { name: "body", label: "Main Body" },
      { name: "signature", label: "Signature" }
    ]
  }
}
```

**Use Cases**:
1. **Variable Overview**: Show all template variables in one place
2. **Section Navigation**: Jump to different parts of a long template
3. **Variable Status**: Show which variables are filled/unfilled
4. **Quick Reference**: See available placeholders without scrolling

### Toggle Button Location

The outline panel toggle button appears in the **top-right toolbar**, near other view options.

**Typical Implementation**:
```tsx
<button
  onClick={toggleOutlinePanel}
  aria-label="Toggle outline panel"
  aria-expanded={outlineExpanded}
  className="p-2 hover:bg-muted rounded-md"
  title="Outline"
>
  <svg className="w-4 h-4" viewBox="0 0 16 16">
    {/* List icon or outline icon */}
    <path d="M0 2.75A.75.75 0 0 1 .75 2h14.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 2.75Zm3 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Zm0-4a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75Z" />
  </svg>
</button>
```

### Sizing

**Note**: Exact dimensions are NOT visible in the static HTML because:
- GitHub uses CSS modules with obfuscated class names
- Panel widths are controlled dynamically by React/JavaScript
- The PageLayout component handles responsive resizing

**Estimated Dimensions** (based on typical GitHub patterns):
- **Default Width**: ~280-320px (similar to file tree)
- **Minimum Width**: Likely 200-256px
- **Maximum Width**: Likely ~400px
- **Resizable**: Possibly yes, but less common for auxiliary panels

### Visual Hierarchy

```
┌──────────┬─────────────────────┬──────────┐
│          │                     │          │
│  DARKER  │  LIGHTER (FOCAL)    │  DARKER  │
│          │                     │          │
│ bg-back  │  bg-muted/50        │ bg-back  │
│ ground   │                     │ ground   │
│          │  Content here       │          │
│          │                     │  Outline │
│ File     │                     │  (when   │
│ Tree     │                     │  needed) │
│          │                     │          │
└──────────┴─────────────────────┴──────────┘
```

**Color Pattern**:
- Both outer columns use `bg-background` (darkest)
- Center content uses `bg-muted/50` (lighter - focal point)
- This creates symmetry and draws eye to center

### Implementation Recommendation

```tsx
// App.tsx - Three-column layout with collapsible right panel
<ResizablePanelGroup direction="horizontal">

  {/* LEFT: Template List (always visible until collapsed) */}
  {!isLeftSidebarCollapsed && (
    <>
      <ResizablePanel defaultSize={20} minSize={15}>
        <ModernTemplateSidebar className="bg-background" />
      </ResizablePanel>
      <ResizableHandle />
    </>
  )}

  {/* CENTER: Editor (flexible, focal point) */}
  <ResizablePanel defaultSize={60} minSize={40}>
    <div className="bg-muted/50 p-6">
      <TemplateEditor />
    </div>
  </ResizablePanel>

  {/* RIGHT: Outline Panel (collapsible, conditional) */}
  {isOutlineVisible && (
    <>
      <ResizableHandle />
      <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
        <TemplateOutlinePanel
          className="bg-background"
          variables={templateVariables}
          sections={templateSections}
          onNavigate={scrollToSection}
        />
      </ResizablePanel>
    </>
  )}

</ResizablePanelGroup>
```

### State Management

```tsx
const [isOutlineVisible, setIsOutlineVisible] = useState(() => {
  // Only show outline if:
  // 1. Template has variables or sections
  // 2. User preference from localStorage
  const hasContent =
    template.variables.length > 0 ||
    template.sections.length > 0;

  const userPreference =
    localStorage.getItem('outlineExpanded') === 'true';

  return hasContent && userPreference;
});

const toggleOutlinePanel = () => {
  setIsOutlineVisible(prev => {
    const newValue = !prev;
    localStorage.setItem('outlineExpanded', String(newValue));
    return newValue;
  });
};
```

---

## 5. Header/Toolbar Components

### Sticky Header Structure

```html
<div class="px-3 pt-3 pb-0" id="StickyHeader">
  <div class="CodeViewHeader-module__Box_1">
    <div class="CodeViewHeader-module__Box_2">

      <!-- NARROW (Mobile) LAYOUT -->
      <div class="react-code-view-header-wrap--narrow">
        <!-- File tree toggle for mobile -->
        <button data-hotkey="Meta+b"
                aria-label="Expand file tree">
          <svg class="octicon-arrow-left">...</svg>
          <span>Files</span>
        </button>
      </div>

      <!-- WIDE (Desktop) LAYOUT -->
      <div class="react-code-view-header-element--wide">

        <!-- 1. File Tree Toggle -->
        <button data-component="IconButton"
                data-hotkey="Meta+b"
                aria-expanded="false"
                aria-controls="repos-file-tree">
          <svg class="octicon-sidebar-collapse">...</svg>
        </button>

        <!-- 2. Branch/Version Selector -->
        <button data-hotkey="w"
                aria-label="main branch"
                class="ref-selector-class">
          <svg class="octicon-git-branch">...</svg>
          <span style="max-width: 125px;">main</span>
          <svg class="octicon-triangle-down">...</svg>
        </button>

        <!-- 3. Breadcrumb Navigation -->
        <nav aria-labelledby="repos-header-breadcrumb-heading">
          <ol>
            <li>
              <a href="/repo">agency-workspace</a>
            </li>
            <li>
              <span>/</span>
              <h1>README.md</h1>
            </li>
          </ol>
        </nav>

        <!-- 4. Copy Path Button -->
        <button aria-label="Copy path">
          <svg class="octicon-copy">...</svg>
        </button>

        <!-- 5. Go to File Search -->
        <input type="text"
               aria-label="Go to file"
               placeholder="Go to file"
               aria-describedby="search-icon">
          <kbd>t</kbd>
        </input>

        <!-- 6. Action Buttons -->
        <button data-hotkey="b,Shift+B">Blame</button>
        <button aria-label="More file actions">
          <svg class="octicon-kebab-horizontal">...</svg>
        </button>

      </div>

    </div>
  </div>
</div>
```

### Component Breakdown

#### 1. **File Tree Toggle**
```tsx
<button
  onClick={toggleSidebar}
  data-hotkey="Meta+b"
  aria-expanded={!isSidebarCollapsed}
  aria-controls="template-list-sidebar"
  className="p-2 hover:bg-muted rounded-md"
>
  <SidebarCollapseIcon className="w-4 h-4" />
</button>
```

#### 2. **Branch/Version Selector** → **Template Version Selector**
```tsx
<button
  onClick={openVersionSelector}
  data-hotkey="w"
  className="flex items-center gap-2 px-3 py-1.5
             bg-muted/50 border rounded-md"
>
  <GitBranchIcon className="w-4 h-4" />
  <span className="max-w-[125px] truncate">v1.2.0</span>
  <ChevronDownIcon className="w-3 h-3" />
</button>
```

#### 3. **Breadcrumb Navigation** → **Template Path**
```tsx
<nav aria-labelledby="template-breadcrumb">
  <ol className="flex items-center gap-2">
    <li>
      <a href="/templates">Templates</a>
    </li>
    <li>/</li>
    <li>
      <h1 className="font-semibold">Follow-up Email</h1>
    </li>
  </ol>
</nav>
```

#### 4. **Copy Path** → **Copy Template**
```tsx
<button
  onClick={copyTemplateName}
  aria-label="Copy template name"
  className="ml-2"
>
  <CopyIcon className="w-4 h-4" />
</button>
```

#### 5. **Go to File** → **Go to Template**
```tsx
<div className="relative">
  <input
    type="text"
    placeholder="Go to template"
    aria-label="Go to template"
    data-hotkey="t,Shift+T"
    className="px-3 py-1.5 border rounded-md"
  />
  <kbd className="absolute right-2">t</kbd>
</div>
```

#### 6. **Action Buttons**
```tsx
<div className="flex items-center gap-2">
  <button data-hotkey="e,Shift+E">Edit</button>
  <button data-hotkey="v,Shift+V">Preview</button>
  <button aria-label="More actions">
    <KebabIcon />
  </button>
</div>
```

---

## 5. Color Token System

### Primer CSS Color Tokens

| Token | Usage | Our Equivalent |
|-------|-------|----------------|
| `color-bg-default` | Main content background | `bg-background` or `bg-muted/50` |
| `color-bg-subtle` | Muted backgrounds | `bg-muted` |
| `color-bg-accent-emphasis` | Accent/highlight backgrounds | `bg-primary` |
| `color-bg-transparent` | Transparent elements | `bg-transparent` |
| `color-fg-default` | Primary text | `text-foreground` |
| `color-fg-muted` | Secondary text | `text-muted-foreground` |
| `color-fg-subtle` | Tertiary text | `text-muted-foreground/70` |
| `color-fg-on-emphasis` | Text on accent backgrounds | `text-primary-foreground` |
| `color-shadow-large` | Large shadow | `shadow-lg` |

### Visual Hierarchy Pattern

```
┌─────────────────────────────────────────┐
│  Header/Toolbar (bg-muted/30)           │
├──────────┬──────────────────────────────┤
│          │                              │
│  DARKER  │  LIGHTER (FOCAL POINT)      │
│  Sidebar │  Center Content              │
│          │                              │
│ bg-back  │  bg-muted/50                │
│ ground   │                              │
│          │  Eye drawn here first       │
│          │                              │
└──────────┴──────────────────────────────┘
```

---

## 6. Responsive Behavior

### Breakpoints

```tsx
// Mobile (< 768px)
- Sidebar hidden by default
- Mobile toggle button visible
- Narrow header layout
- Bottom drawer for actions

// Tablet (768px - 1024px)
- Sidebar collapsible
- Desktop header layout
- Resizable sidebar

// Desktop (>= 1024px)
- Full layout visible
- All features enabled
```

### Mobile Sidebar Toggle

```tsx
{windowWidth < 768 && (
  <button
    onClick={openSidebarDrawer}
    className="p-2 hover:bg-muted rounded-md"
  >
    <MenuIcon />
    <span>Files</span>
  </button>
)}

{windowWidth >= 768 && (
  <button
    onClick={toggleSidebarCollapse}
    data-hotkey="Meta+b"
  >
    <SidebarCollapseIcon />
  </button>
)}
```

---

## 7. Keyboard Shortcuts

### GitHub's Shortcuts (to replicate)

| Shortcut | Action | Implementation |
|----------|--------|----------------|
| `Meta+b` | Toggle file tree sidebar | `data-hotkey="Meta+b"` |
| `w` | Open branch/version selector | `data-hotkey="w"` |
| `t, Shift+T` | Go to file/template | `data-hotkey="t,Shift+T"` |
| `y, Shift+Y` | Permalink | `data-hotkey="y,Shift+Y"` |
| `e, Shift+E` | Edit mode | (custom) |
| `v, Shift+V` | Preview mode | (custom) |

### Implementation Pattern

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Meta+b - Toggle sidebar
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault();
      toggleSidebar();
    }

    // w - Open version selector
    if (e.key === 'w' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      openVersionSelector();
    }

    // t - Go to template
    if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      openTemplateSearch();
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);
```

---

## 8. Implementation Roadmap

### Phase 1: Layout Refactor ✅ (Already Mostly Done!)

**Current State**:
- ✅ ResizablePanelGroup with left sidebar
- ✅ Left sidebar: 320px default (matches GitHub!)
- ✅ Resizable handle
- ✅ Dark sidebar background
- ✅ Lighter center content

**Needs Adjustment**:
- ❌ Remove right sidebar (Details panel)
- ❌ Move right sidebar content to toolbar
- ❌ Simplify to two-column layout

### Phase 2: Header/Toolbar Enhancement

**To Add**:
1. Template version selector (like branch selector)
2. Breadcrumb navigation for template path
3. "Go to template" search (kbd: `t`)
4. Copy template name button
5. Mode toggle in toolbar (Edit/Preview)

**Components to Create**:
```
src/components/
  ├── TemplateToolbar.tsx        (new - GitHub-style toolbar)
  ├── TemplateBreadcrumb.tsx     (new - navigation breadcrumbs)
  ├── TemplateVersionSelector.tsx (new - version dropdown)
  ├── TemplateSearch.tsx         (new - "Go to template" overlay)
  └── TemplateActions.tsx        (new - action buttons)
```

### Phase 3: Remove Right Sidebar

**Move Details to Toolbar**:
```tsx
// OLD: Right sidebar shows template type, star status, etc.
<div className="right-sidebar">
  <TemplateDetails />
</div>

// NEW: Details in toolbar badges
<div className="toolbar">
  <span className="badge">
    {template.type === 'email' ? '✉️ Email' : '💬 SMS'}
  </span>
  {template.isStarred && <Star />}
  <span className="text-sm text-muted-foreground">
    Updated {formatDate(template.updatedAt)}
  </span>
</div>
```

### Phase 4: Variable/Placeholder Panel

**Current**: Left panel (FormWrapper) with variables

**New Approach**: Keep the FormWrapper where it is! This actually works well:
- Left sidebar: Template list (like file tree)
- Left panel inside content: Variables (like GitHub's outline panel)
- Center: Editor

This gives us **three areas** but still **two main columns**:

```
┌──────────┬───────┬──────────────────┐
│ Template │ Vars  │ Editor           │
│ List     │ Panel │ (main content)   │
│ (sidebar)│ 320px │ Flexible         │
└──────────┴───────┴──────────────────┘
```

---

## 9. Recommended Component Structure

### App.tsx Layout (Simplified Two-Column)

```tsx
<div className="h-screen flex flex-col bg-background">
  {/* Full-width header */}
  <header className="bg-muted/30 border-b">
    <TemplateToolbar
      template={selectedTemplate}
      mode={mode}
      onModeChange={setMode}
      onToggleSidebar={toggleSidebar}
    />
  </header>

  {/* Two-column layout */}
  <div className="flex-1 overflow-hidden">
    <ResizablePanelGroup direction="horizontal">

      {/* LEFT: Template List Sidebar */}
      {!isSidebarCollapsed && (
        <>
          <ResizablePanel
            defaultSize={25}
            minSize={20}
            maxSize={35}
            className="min-w-[256px]"
          >
            <ModernTemplateSidebar
              templates={templates}
              selectedId={selectedTemplateId}
              onSelect={setSelectedTemplateId}
              className="bg-background" // Darkest
            />
          </ResizablePanel>
          <ResizableHandle />
        </>
      )}

      {/* CENTER: Document Viewer/Editor */}
      <ResizablePanel defaultSize={75}>
        <div className="h-full flex">

          {/* Optional: Variables Panel (inside center) */}
          {mode === 'use' && (
            <div className="w-[320px] bg-background border-r">
              <FormWrapper
                template={selectedTemplate}
                variables={allVariables}
              />
            </div>
          )}

          {/* Main Editor */}
          <div className="flex-1 bg-muted/50 overflow-auto">
            <div className="max-w-4xl mx-auto p-6">
              <TemplateEditor
                template={selectedTemplate}
                mode={mode}
              />
            </div>
          </div>

        </div>
      </ResizablePanel>

    </ResizablePanelGroup>
  </div>
</div>
```

### TemplateToolbar.tsx (New Component)

```tsx
export function TemplateToolbar({
  template,
  mode,
  onModeChange,
  onToggleSidebar
}: TemplateToolbarProps) {
  return (
    <div className="px-6 py-3">
      <div className="flex items-center justify-between">

        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            data-hotkey="Meta+b"
            className="p-2 hover:bg-muted rounded-md"
          >
            <SidebarIcon className="w-4 h-4" />
          </button>

          <TemplateVersionSelector
            current="v1.0"
            versions={['v1.0', 'v0.9', 'v0.8']}
            onSelect={handleVersionSelect}
          />

          <TemplateBreadcrumb
            template={template}
          />

          <button
            onClick={copyTemplateName}
            aria-label="Copy template name"
          >
            <CopyIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <TemplateSearch
            templates={templates}
            onSelect={handleSelect}
          />

          <ModeToggle
            mode={mode}
            onChange={onModeChange}
          />

          <TemplateActions
            template={template}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        </div>

      </div>
    </div>
  );
}
```

---

## 10. Migration Checklist

### Step 1: Prepare Backup
- [ ] Commit current three-column layout
- [ ] Create feature branch: `feature/github-editor-layout`
- [ ] Tag current version: `v1.0-three-column`

### Step 2: Layout Changes
- [ ] Remove right sidebar (Details panel)
- [ ] Keep left sidebar (Template list)
- [ ] Simplify to two-column ResizablePanelGroup
- [ ] Move FormWrapper inside center content (not separate panel)

### Step 3: Create New Components
- [ ] `TemplateToolbar.tsx` - Main toolbar component
- [ ] `TemplateBreadcrumb.tsx` - Breadcrumb navigation
- [ ] `TemplateVersionSelector.tsx` - Version dropdown
- [ ] `TemplateSearch.tsx` - "Go to template" overlay
- [ ] `TemplateActions.tsx` - Action buttons (edit, delete, etc.)

### Step 4: Move Details to Toolbar
- [ ] Template type badge (email/SMS) → Toolbar
- [ ] Star status → Toolbar
- [ ] Last updated date → Toolbar
- [ ] Variable count → Toolbar or remove
- [ ] Remove old right sidebar component

### Step 5: Keyboard Shortcuts
- [ ] Implement `Meta+b` for sidebar toggle
- [ ] Implement `w` for version selector
- [ ] Implement `t` for template search
- [ ] Add hotkey hints to buttons

### Step 6: Responsive Updates
- [ ] Test mobile layout
- [ ] Ensure drawer works for template list
- [ ] Test tablet breakpoint
- [ ] Verify desktop experience

### Step 7: Polish
- [ ] Update color contrast (darker sidebar, lighter center)
- [ ] Add tooltips to toolbar buttons
- [ ] Test keyboard navigation
- [ ] Update documentation

---

## 11. Color Mapping Reference

### Current Theme → GitHub Pattern

```tsx
// Sidebar (Template List)
className="bg-background"           // Darkest - like GitHub file tree

// Center Content
className="bg-muted/50"             // Lighter - focal point

// Toolbar/Header
className="bg-muted/30 border-b"    // Subtle separation

// Variables Panel (if shown)
className="bg-background border-r"  // Match sidebar darkness

// Borders
className="border-border"           // Theme-aware
```

---

## 12. Expected Outcome

### Before (Current Three-Column)
- Template list | Editor | Details panel
- Cramped editing space
- Details panel rarely used
- Three areas competing for attention

### After (GitHub Two-Column)
- Template list | Full-width editor + toolbar
- Spacious editing experience
- Details moved to compact toolbar
- Clear visual hierarchy
- Familiar mental model (like editing a document)

---

## Conclusion

GitHub's file viewer layout is superior for a template editor because:

1. **Simpler**: Two columns instead of three
2. **More space**: Full width for editor content
3. **Better hierarchy**: Sidebar recedes, editor is focal point
4. **Familiar pattern**: Users know how to navigate file viewers
5. **Resizable**: Users can customize sidebar width
6. **Accessible**: Proper ARIA labels and keyboard shortcuts
7. **Responsive**: Works on mobile, tablet, desktop

**Next Steps**: Follow the migration checklist above to refactor the insurance template app to use this proven layout pattern.

---

## Appendix: Key CSS Variables

```css
/* Pane sizing */
--pane-min-width: 256px;
--pane-width: 320px;
--pane-max-width: calc(100vw - var(--pane-max-width-diff));

/* Spacing */
--spacing: var(--spacing-none);
--spacing-row: var(--spacing-none);
--spacing-column: var(--spacing-none);

/* Offsets */
--offset-header: 0px;

/* Dividers */
--spacing-divider: var(--spacing-none);
```

## Appendix: ARIA Attributes for Accessibility

```html
<!-- Resizable handle -->
<div
  role="slider"
  aria-label="Draggable pane splitter"
  aria-valuemin="256"
  aria-valuemax="1407"
  aria-valuenow="320"
  aria-valuetext="Pane width 320 pixels"
  tabindex="0"
>
</div>

<!-- Sidebar toggle -->
<button
  aria-expanded="false"
  aria-controls="template-list-sidebar"
  aria-label="Expand template list"
>
  <svg aria-hidden="true">...</svg>
</button>

<!-- Breadcrumb navigation -->
<nav aria-labelledby="template-breadcrumb-heading">
  <h2 id="template-breadcrumb-heading" class="sr-only">
    Template Navigation
  </h2>
  <ol>...</ol>
</nav>
```
