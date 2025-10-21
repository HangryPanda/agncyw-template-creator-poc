import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND, COMMAND_PRIORITY_LOW } from 'lexical';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { mergeRegister } from '@lexical/utils';

export default function FloatingToolbarPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [isText, setIsText] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const text = selection.getTextContent();
            setIsText(text.length > 0);

            // Update format states
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
            setIsCode(selection.hasFormat('code'));

            // Show toolbar if text is selected
            if (text.length > 0 && !selection.isCollapsed()) {
              const nativeSelection = window.getSelection();
              if (nativeSelection && nativeSelection.rangeCount > 0) {
                const range = nativeSelection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                setPosition({
                  x: rect.left + rect.width / 2,
                  y: rect.top - 10,
                });
                setShowToolbar(true);
              }
            } else {
              setShowToolbar(false);
            }
          } else {
            setShowToolbar(false);
          }
        });

        // Update undo/redo state
        setCanUndo(editor.getEditorState()._selection !== null);
        setCanRedo(editor.getEditorState()._selection !== null);
      }),
      editor.registerCommand(
        UNDO_COMMAND,
        () => {
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        REDO_COMMAND,
        () => {
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor]);

  if (!showToolbar) return null;

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 flex items-center gap-1 p-1 bg-popover border rounded-lg shadow-lg"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <Button
        size="sm"
        variant={isBold ? 'default' : 'ghost'}
        className="h-7 w-7 p-0"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        title="Bold (⌘B)"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 12h9a4 4 0 010 8H6V4h7a4 4 0 010 8" />
        </svg>
      </Button>
      <Button
        size="sm"
        variant={isItalic ? 'default' : 'ghost'}
        className="h-7 w-7 p-0"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        title="Italic (⌘I)"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m0 16h-4m4-16l-4 16" />
        </svg>
      </Button>
      <Button
        size="sm"
        variant={isUnderline ? 'default' : 'ghost'}
        className="h-7 w-7 p-0"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        title="Underline (⌘U)"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v7a5 5 0 0010 0V4M5 21h14" />
        </svg>
      </Button>
      <Button
        size="sm"
        variant={isStrikethrough ? 'default' : 'ghost'}
        className="h-7 w-7 p-0"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        title="Strikethrough"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12H4m16 0h-8m0 0c2.5 0 4-1.5 4-3.5S14.5 5 12 5s-4 1.5-4 3.5m4 3c-2.5 0-4 1.5-4 3.5s1.5 3.5 4 3.5 4-1.5 4-3.5" />
        </svg>
      </Button>
      <Button
        size="sm"
        variant={isCode ? 'default' : 'ghost'}
        className="h-7 w-7 p-0"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        title="Code"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </Button>
    </div>
  );
}