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
import { VariablePopover } from './VariablePopover';
import { EditorCommandMenu } from './EditorCommandMenu';
import PlaygroundNodes from '@/nodes/PlaygroundNodes';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import MarkdownShortcutPlugin from '@/plugins/MarkdownShortcutPlugin';
import AutoLinkPlugin from '@/plugins/AutoLinkPlugin';
import FloatingTextFormatToolbarPlugin from '@/plugins/FloatingTextFormatToolbarPlugin';
import FloatingLinkEditorPlugin from '@/plugins/FloatingLinkEditorPlugin';
import TableActionMenuPlugin from '@/plugins/TableActionMenuPlugin';
import DraggableBlockPlugin from '@/plugins/DraggableBlockPlugin';
import { VariableValuesProvider } from '@/context/VariableValuesContext';

interface TemplateEditorProps {
  templateId: string;
  initialState?: EditorState;
  availableVariables: TemplateVariable[];
  onStateChange?: (editorState: EditorState) => void;
  onManageVariables?: () => void;
  mode?: 'create' | 'use';
  values?: Record<string, string>;
  variableToInsert?: string | null;
  onVariableInserted?: () => void;
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
  variableToInsert,
  onVariableInserted
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
        h1: 'text-2xl font-bold mb-4 mt-6',
        h2: 'text-xl font-semibold mb-3 mt-5',
        h3: 'text-lg font-medium mb-2 mt-4',
      },
      text: {
        bold: 'font-semibold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
        code: 'font-mono bg-muted px-1 py-0.5 rounded text-sm',
      },
      list: {
        ul: 'list-disc list-outside ml-6 mb-2',
        ol: 'list-decimal list-outside ml-6 mb-2',
        listitem: 'mb-1',
      },
      link: 'text-primary hover:underline cursor-pointer',
      quote: 'border-l-4 border-muted-foreground/30 pl-4 italic my-4',
      table: 'border-collapse my-2 text-sm',
      tableRow: 'border-b border-border/50',
      tableCell: 'border-r border-border/50 px-3 py-1.5 text-left min-w-[100px] last:border-r-0',
      tableCellHeader: 'border-r border-border/50 px-3 py-1.5 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider',
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

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <VariableValuesProvider values={values} mode={mode}>
        <div ref={onRef} className="rounded-lg border bg-card text-card-foreground relative">
          {/* Clean, distraction-free editor */}
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="min-h-[400px] px-8 py-6 outline-none focus:outline-none text-base
                    selection:bg-primary/20 selection:text-primary-foreground
                    [&_.template-variable]:inline-flex [&_.template-variable]:items-center
                    [&_.template-variable]:px-2 [&_.template-variable]:py-0.5
                    [&_.template-variable]:bg-primary/10 [&_.template-variable]:text-primary
                    [&_.template-variable]:rounded-md [&_.template-variable]:text-sm
                    [&_.template-variable]:font-mono [&_.template-variable]:border
                    [&_.template-variable]:border-primary/20 [&_.template-variable]:mx-0.5
                    [&_.template-variable]:cursor-default [&_.template-variable]:select-none
                    hover:[&_.template-variable]:bg-primary/20 hover:[&_.template-variable]:border-primary/30
                    transition-colors"
                />
              }
              placeholder={
                <div className="absolute top-6 left-8 text-muted-foreground pointer-events-none select-none text-base">
                  Start typing or use <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded border">{'{{'}</kbd> for variables, <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded border">/</kbd> for blocks
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />

            {/* Plugins */}
            <HistoryPlugin />
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
          </div>

          {/* Minimal footer with shortcuts */}
          <div className="px-8 py-3 bg-muted/50 border-t flex items-center justify-between">
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border font-mono text-[10px]">{'{{'}</kbd>
                <span>Variables</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border font-mono text-[10px]">/</kbd>
                <span>Commands</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border font-mono text-[10px]">⌘B</kbd>
                <span>Bold</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border font-mono text-[10px]">⌘I</kbd>
                <span>Italic</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border font-mono text-[10px]">⌘K</kbd>
                <span>Link</span>
              </span>
            </div>
            {onManageVariables && (
              <Button
                onClick={onManageVariables}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                Manage Variables →
              </Button>
            )}
          </div>
        </div>
      </VariableValuesProvider>
    </LexicalComposer>
  );
}