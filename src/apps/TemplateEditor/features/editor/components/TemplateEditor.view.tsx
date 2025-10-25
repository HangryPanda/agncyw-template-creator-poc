import { $getSelection, $isRangeSelection, UNDO_COMMAND, REDO_COMMAND } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TemplateVariableNode, $createTemplateVariableNode } from '@/nodes/TemplateVariableNode';
import { TemplateVariable, EditorState } from '@/types';
import { EditorState as LexicalEditorState } from 'lexical';
import { VariablePopover } from './VariablePopover.view';
import { EditorCommandMenu } from './EditorCommandMenu.view';
import PlaygroundNodes from '@/nodes/PlaygroundNodes';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import MarkdownShortcutPlugin from '@/plugins/MarkdownShortcutPlugin';
import AutoLinkPlugin from '@/plugins/AutoLinkPlugin';
import FloatingTextFormatToolbarPlugin from '@/plugins/FloatingTextFormatToolbarPlugin';
import ToolbarPlugin from '@/plugins/ToolbarPlugin';
import FloatingLinkEditorPlugin from '@/plugins/FloatingLinkEditorPlugin';
import TableActionMenuPlugin from '@/plugins/TableActionMenuPlugin';
import DraggableBlockPlugin from '@/plugins/DraggableBlockPlugin';
import { DirtyStatePlugin } from '@/lib/tabs/integrations/lexical';
import { VariableValuesProvider } from '@/context/VariableValuesContext';

interface TemplateEditorProps {
  templateId: string;
  initialState?: EditorState;
  availableVariables: TemplateVariable[];
  onStateChange?: (editorState: EditorState) => void;
  onManageVariables?: () => void;
  mode?: 'create' | 'use';
  values?: Record<string, string>;
  setValue?: (variableName: string, value: string) => void;
  variableToInsert?: string | null;
  onVariableInserted?: () => void;
  onModeToggle?: () => void;
  isOutlineVisible?: boolean;
  onToggleOutline?: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

// Plugin to handle tab navigation and auto-focus in Compose mode
function VariableNavigationPlugin({ mode }: { mode: 'create' | 'use' }): null {
  useEffect(() => {
    if (mode !== 'use') return;

    // Auto-focus first unfilled variable when entering Compose mode
    const timer = setTimeout(() => {
      const firstUnfilled = document.querySelector('.template-variable-unfilled-first') as HTMLElement;
      if (firstUnfilled) {
        firstUnfilled.click(); // Trigger inline editing
      }
    }, 150);

    // Tab navigation handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || mode !== 'use') return;

      const activeElement = document.activeElement;

      // Only handle Tab if we're in a variable or the editor
      const isInVariable = activeElement?.closest('[data-variable-name]');
      const isInEditor = activeElement?.closest('.ContentEditable__root');

      if (!isInVariable && !isInEditor) return;

      e.preventDefault();

      // Find all unfilled variables
      const unfilledVariables = Array.from(
        document.querySelectorAll('.template-variable-unfilled, .template-variable-unfilled-first')
      ) as HTMLElement[];

      if (unfilledVariables.length === 0) return;

      // Find current index
      const currentVariable = activeElement?.closest('[data-variable-name]') as HTMLElement;
      let currentIndex = -1;

      if (currentVariable) {
        currentIndex = unfilledVariables.indexOf(currentVariable);
      }

      // Navigate to next/previous
      let nextIndex: number;
      if (e.shiftKey) {
        // Shift+Tab: go backwards
        nextIndex = currentIndex <= 0 ? unfilledVariables.length - 1 : currentIndex - 1;
      } else {
        // Tab: go forwards
        nextIndex = currentIndex >= unfilledVariables.length - 1 ? 0 : currentIndex + 1;
      }

      const nextVariable = unfilledVariables[nextIndex];
      if (nextVariable) {
        // If it has contentEditable attribute (already editing), focus it
        const editableChild = nextVariable.querySelector('[contenteditable="true"]') as HTMLElement;
        if (editableChild) {
          editableChild.focus();
        } else {
          // Otherwise, click to start editing
          nextVariable.click();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mode]);

  return null;
}

// Plugin to handle external variable insertion
function VariableInsertionPlugin({
  variableToInsert,
  onVariableInserted
}: {
  variableToInsert?: string | null;
  onVariableInserted?: () => void;
}): null {
  const [editor] = useLexicalComposerContext();
  const lastInsertedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!variableToInsert) {
      lastInsertedRef.current = null;
      return;
    }

    // Prevent duplicate insertion of the same variable
    if (lastInsertedRef.current === variableToInsert) {
      return;
    }

    lastInsertedRef.current = variableToInsert;

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const variableNode = $createTemplateVariableNode(variableToInsert);
        selection.insertNodes([variableNode]);
      }
    });

    // Notify parent that insertion is complete
    onVariableInserted?.();
  }, [variableToInsert, editor, onVariableInserted]);

  return null;
}

// Keyboard shortcut detection plugin for variables and commands
function MenuControlPlugin({
  availableVariables,
  onManageVariables,
  commandMenuState,
  setCommandMenuState
}: {
  availableVariables: TemplateVariable[];
  onManageVariables?: () => void;
  commandMenuState: { open: boolean; position: { x: number; y: number } };
  setCommandMenuState: React.Dispatch<React.SetStateAction<{ open: boolean; position: { x: number; y: number } }>>;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [showVariablePopover, setShowVariablePopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    return editor.registerTextContentListener(() => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          setShowVariablePopover(false);
          setCommandMenuState({ open: false, position: { x: 0, y: 0 } });
          return;
        }

        const anchorNode = selection.anchor.getNode();
        const anchorOffset = selection.anchor.offset;
        const textContent = anchorNode.getTextContent();
        const beforeCursor = textContent.slice(0, anchorOffset);

        // Check for {{ trigger (for variables)
        if (beforeCursor.endsWith('{{')) {
          const nativeSelection = window.getSelection();
          if (nativeSelection && nativeSelection.rangeCount > 0) {
            const range = nativeSelection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setPopoverPosition({ x: rect.left, y: rect.bottom + 5 });
            setShowVariablePopover(true);
            setCommandMenuState({ open: false, position: { x: 0, y: 0 } });
          }
        }
        // Check for / trigger (for commands/nodes)
        else if (beforeCursor.endsWith('/') && (beforeCursor.length === 1 || beforeCursor[beforeCursor.length - 2] === ' ' || beforeCursor[beforeCursor.length - 2] === '\n')) {
          const nativeSelection = window.getSelection();
          if (nativeSelection && nativeSelection.rangeCount > 0) {
            const range = nativeSelection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setCommandMenuState({ open: true, position: { x: rect.left, y: rect.bottom + 5 } });
            setShowVariablePopover(false);
          }
        }
        // Hide if neither trigger is active
        else if (!beforeCursor.includes('{{') || (beforeCursor.includes('{{') && beforeCursor.includes('}}'))) {
          if (!beforeCursor.endsWith('/')) {
            setShowVariablePopover(false);
            setCommandMenuState({ open: false, position: { x: 0, y: 0 } });
          }
        }
      });
    });
  }, [editor, setCommandMenuState]);

  return (
    <>
      <VariablePopover
        open={showVariablePopover}
        onOpenChange={setShowVariablePopover}
        position={popoverPosition}
        availableVariables={availableVariables}
        onManageVariables={onManageVariables}
      />
      <EditorCommandMenu
        open={commandMenuState.open}
        onOpenChange={(open) => setCommandMenuState({ ...commandMenuState, open })}
        position={commandMenuState.position}
      />
    </>
  );
}

export default function TemplateEditor({
  templateId: _templateId, // Reserved for future use (e.g., template-specific features)
  initialState,
  availableVariables,
  onStateChange,
  onManageVariables,
  mode = 'create',
  values = {},
  setValue = () => {},
  variableToInsert,
  onVariableInserted,
  onModeToggle,
  isOutlineVisible,
  onToggleOutline,
  onDirtyChange,
}: TemplateEditorProps): JSX.Element {
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLElement | undefined>(undefined);
  const [commandMenuState, setCommandMenuState] = useState({ open: false, position: { x: 0, y: 0 } });

  const onRef = useCallback((ref: HTMLDivElement | null) => {
    if (ref !== null) {
      setFloatingAnchorElem(ref);
    }
  }, []);

  const initialConfig = {
    namespace: 'TemplateEditor',
    theme: {
      // Clean, minimal theme using shadcn CSS variables
      paragraph: 'leading-relaxed mb-2',
      heading: {
        h1: 'text-2xl font-bold mb-4 mt-6 text-foreground',
        h2: 'text-xl font-semibold mb-3 mt-5 text-foreground',
        h3: 'text-lg font-medium mb-2 mt-4 text-foreground',
      },
      text: {
        bold: 'font-semibold',
        italic: 'italic',
        underline: 'underline decoration-brand-purple decoration-2',
        strikethrough: 'line-through',
        code: 'font-mono bg-secondary/50 text-secondary-foreground px-1.5 py-0.5 rounded text-sm border border-secondary',
      },
      list: {
        ul: 'list-disc list-outside ml-6 mb-2',
        ol: 'list-decimal list-outside ml-6 mb-2',
        listitem: 'mb-1',
      },
      link: 'text-brand-blue hover:text-brand-purple hover:underline cursor-pointer transition-colors',
      quote: 'border-l-4 border-brand-purple/40 bg-secondary/30 pl-4 py-2 italic my-4',
      table: 'border-collapse my-2 text-sm',
      tableRow: 'border-b border-border/50 hover:bg-muted/30 transition-colors',
      tableCell: 'border-r border-border/50 px-3 py-1.5 text-left min-w-[100px] last:border-r-0',
      tableCellHeader: 'border-r border-border/50 px-3 py-1.5 text-left font-medium bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider',
    },
    onError: (error: Error) => {
      console.error('Editor error:', error);
    },
    nodes: [
      TemplateVariableNode,
      ...PlaygroundNodes,
    ],
    editorState: initialState ? JSON.stringify(initialState) : undefined,
  };

  const handleChange = (editorState: LexicalEditorState): void => {
    // Only auto-save in 'create' mode
    // In 'use' mode, changes are not saved to the template automatically
    if (mode === 'create') {
      editorState.read(() => {
        const json = editorState.toJSON() as EditorState;
        onStateChange?.(json);
      });
    }
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Extract all variable names from availableVariables
  const allVariableNames = availableVariables.map(v => v.name);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <VariableValuesProvider
        values={values}
        mode={mode}
        setValue={setValue}
        allVariableNames={allVariableNames}
      >
        <div
          ref={onRef}
          className={`relative rounded-lg overflow-visible ${
            mode === 'create'
              ? ''
              : ''
          }`}
        >
          <div
            className={`rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              mode === 'create'
                ? 'border-brand-blue/30 bg-card shadow-md hover:border-brand-blue/50 hover:shadow-lg'
                : 'border-brand-green/30 bg-card shadow-md hover:border-brand-green/50 hover:shadow-lg'
            }`}
          >
            {/* Formatting Toolbar */}
            <ToolbarPlugin
              availableVariables={availableVariables}
              onManageVariables={onManageVariables}
              mode={mode}
              onModeToggle={onModeToggle}
              isOutlineVisible={isOutlineVisible}
              onToggleOutline={onToggleOutline}
            />

            {/* Clean, distraction-free editor */}
            <div className="relative bg-background">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className={`min-h-[400px] px-8 py-6 outline-none focus:outline-none text-base
                    transition-all duration-200 ${
                      mode === 'create'
                        ? 'selection:bg-brand-blue/20 selection:text-brand-blue'
                        : 'selection:bg-brand-green/20 selection:text-brand-green'
                    }`}
                />
              }
              placeholder={
                <div className="absolute top-6 left-8 text-muted-foreground pointer-events-none select-none text-base">
                  Start typing or use <kbd className="px-2 py-1 text-xs font-mono bg-brand-purple/10 text-brand-purple border border-brand-purple/30 rounded shadow-sm">{'{{'}</kbd> for variables, <kbd className="px-2 py-1 text-xs font-mono bg-brand-orange/10 text-brand-orange border border-brand-orange/30 rounded shadow-sm">/</kbd> for blocks
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />

            {/* Plugins */}
            <HistoryPlugin />
            <DirtyStatePlugin onDirtyChange={onDirtyChange} />
            <OnChangePlugin onChange={handleChange} />
            <ListPlugin />
            <CheckListPlugin />
            <LinkPlugin validateUrl={validateUrl} />
            <AutoLinkPlugin />
            <TablePlugin />
            <TabIndentationPlugin />
            <MarkdownShortcutPlugin />
            <FloatingTextFormatToolbarPlugin
              anchorElem={floatingAnchorElem ?? document.body}
              setIsLinkEditMode={setIsLinkEditMode}
            />
            <FloatingLinkEditorPlugin
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
              anchorElem={floatingAnchorElem ?? document.body}
            />
            <TableActionMenuPlugin
              anchorElem={floatingAnchorElem ?? document.body}
            />
            <DraggableBlockPlugin anchorElem={floatingAnchorElem ?? document.body} />
            <MenuControlPlugin
              availableVariables={availableVariables}
              onManageVariables={onManageVariables}
              commandMenuState={commandMenuState}
              setCommandMenuState={setCommandMenuState}
            />
            <VariableInsertionPlugin
              variableToInsert={variableToInsert}
              onVariableInserted={onVariableInserted}
            />
            <VariableNavigationPlugin mode={mode} />
          </div>

          {/* Enhanced footer with color-coded shortcuts */}
          <div className={`px-8 py-3 border-t-2 flex items-center justify-between transition-colors ${
            mode === 'create'
              ? 'bg-gradient-to-r from-brand-blue/5 via-brand-purple/5 to-brand-blue/5 border-brand-blue/20'
              : 'bg-gradient-to-r from-brand-green/5 via-brand-green/10 to-brand-green/5 border-brand-green/20'
          }`}>
            <div className="flex items-center gap-6 text-xs">
              <span className="flex items-center gap-2 group hover:scale-105 transition-transform">
                <kbd className="px-2 py-1 bg-brand-purple/10 text-brand-purple border border-brand-purple/30 rounded font-mono text-[11px] font-medium shadow-sm group-hover:shadow-md group-hover:bg-brand-purple/20 transition-all">{'{{'}</kbd>
                <span className="text-muted-foreground group-hover:text-brand-purple transition-colors font-medium">Variables</span>
              </span>
              <span className="flex items-center gap-2 group hover:scale-105 transition-transform">
                <kbd className="px-2 py-1 bg-brand-orange/10 text-brand-orange border border-brand-orange/30 rounded font-mono text-[11px] font-medium shadow-sm group-hover:shadow-md group-hover:bg-brand-orange/20 transition-all">/</kbd>
                <span className="text-muted-foreground group-hover:text-brand-orange transition-colors font-medium">Commands</span>
              </span>
              <span className="flex items-center gap-2 group hover:scale-105 transition-transform">
                <kbd className="px-2 py-1 bg-secondary border border-border rounded font-mono text-[11px] font-medium shadow-sm group-hover:shadow-md transition-all">⌘B</kbd>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">Bold</span>
              </span>
              <span className="flex items-center gap-2 group hover:scale-105 transition-transform">
                <kbd className="px-2 py-1 bg-secondary border border-border rounded font-mono text-[11px] font-medium shadow-sm group-hover:shadow-md transition-all">⌘I</kbd>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">Italic</span>
              </span>
              <span className="flex items-center gap-2 group hover:scale-105 transition-transform">
                <kbd className="px-2 py-1 bg-brand-blue/10 text-brand-blue border border-brand-blue/30 rounded font-mono text-[11px] font-medium shadow-sm group-hover:shadow-md group-hover:bg-brand-blue/20 transition-all">⌘K</kbd>
                <span className="text-muted-foreground group-hover:text-brand-blue transition-colors font-medium">Link</span>
              </span>
            </div>
            {onManageVariables && (
              <Button
                onClick={onManageVariables}
                variant="ghost"
                size="sm"
                className="text-xs font-medium text-brand-purple hover:text-brand-purple hover:bg-brand-purple/10 transition-all hover:scale-105"
              >
                Manage Variables →
              </Button>
            )}
          </div>
          </div>
        </div>
      </VariableValuesProvider>
    </LexicalComposer>
  );
}
