import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $createParagraphNode,
} from 'lexical';
import {
  $setBlocksType,
} from '@lexical/selection';
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingTagType,
} from '@lexical/rich-text';
import { $isListNode } from '@lexical/list';
import { mergeRegister } from '@lexical/utils';
import React from 'react';

const LowPriority = 1;

export default function FormattingToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [blockType, setBlockType] = useState<string>('paragraph');
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));

      // Update block type
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = element;
          const type = parentList.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        UNDO_COMMAND,
        () => {
          setCanUndo(editor.getEditorState().read(() => true));
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        REDO_COMMAND,
        () => {
          setCanRedo(editor.getEditorState().read(() => true));
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const formatBold = (): void => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const formatItalic = (): void => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const formatUnderline = (): void => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  };

  const formatHeading = (headingSize: HeadingTagType): void => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatParagraph = (): void => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatAlignLeft = (): void => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
  };

  const formatAlignCenter = (): void => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
  };

  const formatAlignRight = (): void => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
  };

  const undo = (): void => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const redo = (): void => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  return (
    <div style={toolbarStyle}>
      <div style={toolbarSectionStyle}>
        <button
          onClick={undo}
          disabled={!canUndo}
          style={{
            ...toolbarButtonStyle,
            ...(canUndo ? {} : disabledButtonStyle),
          }}
          title="Undo"
        >
          ↶
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          style={{
            ...toolbarButtonStyle,
            ...(canRedo ? {} : disabledButtonStyle),
          }}
          title="Redo"
        >
          ↷
        </button>
      </div>

      <div style={dividerStyle} />

      <div style={toolbarSectionStyle}>
        <select
          style={selectStyle}
          value={blockType}
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'paragraph') {
              formatParagraph();
            } else if (value === 'h1' || value === 'h2' || value === 'h3') {
              formatHeading(value as HeadingTagType);
            }
          }}
        >
          <option value="paragraph">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
      </div>

      <div style={dividerStyle} />

      <div style={toolbarSectionStyle}>
        <button
          onClick={formatBold}
          style={{
            ...toolbarButtonStyle,
            ...(isBold ? activeButtonStyle : {}),
          }}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={formatItalic}
          style={{
            ...toolbarButtonStyle,
            ...(isItalic ? activeButtonStyle : {}),
          }}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          onClick={formatUnderline}
          style={{
            ...toolbarButtonStyle,
            ...(isUnderline ? activeButtonStyle : {}),
          }}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
      </div>

      <div style={dividerStyle} />

      <div style={toolbarSectionStyle}>
        <button
          onClick={formatAlignLeft}
          style={toolbarButtonStyle}
          title="Align Left"
        >
          ≡
        </button>
        <button
          onClick={formatAlignCenter}
          style={toolbarButtonStyle}
          title="Align Center"
        >
          ≣
        </button>
        <button
          onClick={formatAlignRight}
          style={toolbarButtonStyle}
          title="Align Right"
        >
          ≢
        </button>
      </div>
    </div>
  );
}

const toolbarStyle: React.CSSProperties = {
  display: 'flex',
  padding: '8px 12px',
  borderBottom: '1px solid #ddd',
  backgroundColor: '#f9f9f9',
  gap: '4px',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const toolbarSectionStyle: React.CSSProperties = {
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
};

const toolbarButtonStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #ddd',
  backgroundColor: 'white',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'all 0.2s',
  color: '#333',
};

const activeButtonStyle: React.CSSProperties = {
  backgroundColor: '#e3f2fd',
  borderColor: '#1976d2',
  color: '#1976d2',
};

const disabledButtonStyle: React.CSSProperties = {
  opacity: 0.4,
  cursor: 'not-allowed',
};

const selectStyle: React.CSSProperties = {
  padding: '6px 8px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  backgroundColor: 'white',
  fontSize: '14px',
  cursor: 'pointer',
};

const dividerStyle: React.CSSProperties = {
  width: '1px',
  height: '24px',
  backgroundColor: '#ddd',
  margin: '0 4px',
};
