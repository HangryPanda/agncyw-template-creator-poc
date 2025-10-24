import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from '@lexical/rich-text';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list';
import { $createCodeNode, $isCodeNode } from '@lexical/code';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import { $createParagraphNode, $isParagraphNode } from 'lexical';
import { $createTemplateVariableNode } from '@/nodes/TemplateVariableNode';
import { TemplateVariable } from '@/types';
import React, { useCallback, useEffect, useState } from 'react';

interface ToolbarPluginProps {
  availableVariables: TemplateVariable[];
  onManageVariables?: () => void;
  mode?: 'create' | 'use';
  onModeToggle?: () => void;
  isOutlineVisible?: boolean;
  onToggleOutline?: () => void;
}

type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'bullet' | 'number' | 'quote' | 'code';

const blockTypeToBlockName: Record<BlockType, string> = {
  paragraph: 'Normal',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  bullet: 'Bullet List',
  number: 'Numbered List',
  quote: 'Quote',
  code: 'Code Block',
};

export default function ToolbarPlugin({
  availableVariables,
  onManageVariables: _onManageVariables,
  mode = 'create',
  onModeToggle,
  isOutlineVisible = false,
  onToggleOutline,
}: ToolbarPluginProps): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<BlockType>('paragraph');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [showBlockTypeDropdown, setShowBlockTypeDropdown] = useState(false);
  const [showVariablesDropdown, setShowVariablesDropdown] = useState(false);
  const [showPlaceholderMenu, setShowPlaceholderMenu] = useState(false);

  const blockTypeDropdownRef = React.useRef<HTMLDivElement>(null);
  const variablesDropdownRef = React.useRef<HTMLDivElement>(null);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsSubscript(selection.hasFormat('subscript'));

      // Update block type
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      if ($isHeadingNode(element)) {
        const tag = element.getTag();
        setBlockType(tag as BlockType);
      } else if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
        const type = parentList ? parentList.getListType() : element.getListType();
        setBlockType(type as BlockType);
      } else if ($isCodeNode(element)) {
        setBlockType('code');
      } else if ($isParagraphNode(element)) {
        setBlockType('paragraph');
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [editor, updateToolbar]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        blockTypeDropdownRef.current &&
        !blockTypeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowBlockTypeDropdown(false);
        setShowPlaceholderMenu(false);
      }
      if (
        variablesDropdownRef.current &&
        !variablesDropdownRef.current.contains(event.target as Node)
      ) {
        setShowVariablesDropdown(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowBlockTypeDropdown(false);
        setShowVariablesDropdown(false);
        setShowPlaceholderMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const formatText = (format: 'bold' | 'italic' | 'underline' | 'subscript') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
    setShowBlockTypeDropdown(false);
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
    setShowBlockTypeDropdown(false);
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
    setShowBlockTypeDropdown(false);
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
    setShowBlockTypeDropdown(false);
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    }
    setShowBlockTypeDropdown(false);
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createCodeNode());
      });
    }
    setShowBlockTypeDropdown(false);
  };

  const insertVariable = (variableName: string): void => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const variableNode = $createTemplateVariableNode(variableName);
        selection.insertNodes([variableNode]);
      }
    });
    setShowVariablesDropdown(false);
  };

  const formatAlignment = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  };

  return (
    <div style={toolbarContainerStyle}>
      {/* History Controls */}
      <div style={toolbarSectionStyle}>
        <button
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          disabled={!canUndo}
          style={iconButtonStyle}
          title="Undo (⌘Z)"
        >
          <UndoIcon />
        </button>
        <button
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          disabled={!canRedo}
          style={iconButtonStyle}
          title="Redo (⌘⇧Z)"
        >
          <RedoIcon />
        </button>
      </div>

      <Divider />

      {/* Block Type Dropdown */}
      <div style={toolbarSectionStyle}>
        <div style={dropdownContainerStyle} ref={blockTypeDropdownRef}>
          <button
            onClick={() => setShowBlockTypeDropdown(!showBlockTypeDropdown)}
            style={dropdownButtonStyle}
          >
            {blockTypeToBlockName[blockType]}
            <span style={{ marginLeft: '4px' }}>▼</span>
          </button>
          {showBlockTypeDropdown && (
            <div style={dropdownMenuStyle}>
              <button onClick={formatParagraph} style={dropdownItemStyle}>
                Normal
              </button>
              <button onClick={() => formatHeading('h1')} style={dropdownItemStyle}>
                Heading 1
              </button>
              <button onClick={() => formatHeading('h2')} style={dropdownItemStyle}>
                Heading 2
              </button>
              <button onClick={() => formatHeading('h3')} style={dropdownItemStyle}>
                Heading 3
              </button>
              <button onClick={formatBulletList} style={dropdownItemStyle}>
                Bullet List
              </button>
              <button onClick={formatNumberedList} style={dropdownItemStyle}>
                Numbered List
              </button>
              <button onClick={formatQuote} style={dropdownItemStyle}>
                Quote
              </button>
              <button onClick={formatCode} style={dropdownItemStyle}>
                Code Block
              </button>
              <div style={dividerHorizontalStyle} />
              <div style={nestedMenuContainerStyle}>
                <button
                  onMouseEnter={() => setShowPlaceholderMenu(true)}
                  onMouseLeave={() => setShowPlaceholderMenu(false)}
                  style={dropdownItemWithArrowStyle}
                >
                  <span>Placeholder</span>
                  <span style={{ marginLeft: 'auto', paddingLeft: '16px' }}>▶</span>
                </button>
                {showPlaceholderMenu && (
                  <div
                    style={nestedDropdownMenuStyle}
                    onMouseEnter={() => setShowPlaceholderMenu(true)}
                    onMouseLeave={() => setShowPlaceholderMenu(false)}
                  >
                    {availableVariables.map((variable) => (
                      <button
                        key={variable.name}
                        onClick={() => {
                          insertVariable(variable.name);
                          setShowBlockTypeDropdown(false);
                          setShowPlaceholderMenu(false);
                        }}
                        style={dropdownItemStyle}
                        title={variable.description}
                      >
                        {variable.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Divider />

      {/* Text Formatting */}
      <div style={toolbarSectionStyle}>
        <button
          onClick={() => formatText('bold')}
          style={{ ...iconButtonStyle, ...(isBold ? activeButtonStyle : {}) }}
          title="Bold (⌘B)"
        >
          <BoldIcon />
        </button>
        <button
          onClick={() => formatText('italic')}
          style={{ ...iconButtonStyle, ...(isItalic ? activeButtonStyle : {}) }}
          title="Italic (⌘I)"
        >
          <ItalicIcon />
        </button>
        <button
          onClick={() => formatText('underline')}
          style={{ ...iconButtonStyle, ...(isUnderline ? activeButtonStyle : {}) }}
          title="Underline (⌘U)"
        >
          <UnderlineIcon />
        </button>
        <button
          onClick={() => formatText('subscript')}
          style={{ ...iconButtonStyle, ...(isSubscript ? activeButtonStyle : {}) }}
          title="Subtext"
        >
          <SubtextIcon />
        </button>
      </div>

      <Divider />

      {/* Alignment */}
      <div style={toolbarSectionStyle}>
        <button
          onClick={() => formatAlignment('left')}
          style={iconButtonStyle}
          title="Align Left"
        >
          <AlignLeftIcon />
        </button>
        <button
          onClick={() => formatAlignment('center')}
          style={iconButtonStyle}
          title="Align Center"
        >
          <AlignCenterIcon />
        </button>
        <button
          onClick={() => formatAlignment('right')}
          style={iconButtonStyle}
          title="Align Right"
        >
          <AlignRightIcon />
        </button>
        <button
          onClick={() => formatAlignment('justify')}
          style={iconButtonStyle}
          title="Justify"
        >
          <AlignJustifyIcon />
        </button>
      </div>

      <Divider />

      {/* Mode Toggle Button */}
      {onModeToggle && (
        <div style={toolbarSectionStyle}>
          <button
            onClick={onModeToggle}
            style={modeToggleButtonStyle}
            title={mode === 'create' ? 'Switch to Edit Mode' : 'Switch to Compose Mode'}
          >
            {mode === 'create' ? ' 📝 Compose' : '✏️ Edit'}
          </button>
        </div>
      )}

      {/* Outline Toggle Button */}
      {onToggleOutline && (
        <>
          <Divider />
          <div style={toolbarSectionStyle}>
            <button
              onClick={onToggleOutline}
              style={{
                ...iconButtonStyle,
                ...(isOutlineVisible ? { backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' } : {}),
              }}
              title="Toggle Outline Panel"
              aria-label="Toggle outline panel"
              aria-expanded={isOutlineVisible}
            >
              <OutlineIcon />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// SVG Icons as React components
const BoldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
  </svg>
);

const ItalicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
  </svg>
);

const UnderlineIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
  </svg>
);

const SubtextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4h16v3h-2V6H6v2H4V4zm8 4c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4m0-2c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-6 14h12v2H6z" />
  </svg>
);

const UndoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
  </svg>
);

const RedoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z" />
  </svg>
);

const AlignLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" />
  </svg>
);

const AlignCenterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" />
  </svg>
);

const AlignRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" />
  </svg>
);

const AlignJustifyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z" />
  </svg>
);

const OutlineIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M0 2.75A.75.75 0 0 1 .75 2h14.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 2.75Zm3 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Zm0-4a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75Z" />
  </svg>
);

const Divider = () => <div style={dividerStyle} />;

// Styles
const toolbarContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 12px',
  borderBottom: '1px solid hsl(var(--border))',
  backgroundColor: 'hsl(var(--muted) / 0.3)',
  gap: '4px',
  flexWrap: 'wrap',
};

const toolbarSectionStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
};

const iconButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  border: 'none',
  backgroundColor: 'transparent',
  color: 'hsl(var(--foreground))',
  cursor: 'pointer',
  borderRadius: '4px',
  transition: 'background-color 0.2s',
};

const activeButtonStyle: React.CSSProperties = {
  backgroundColor: 'hsl(var(--accent))',
  color: 'hsl(var(--accent-foreground))',
};

const dividerStyle: React.CSSProperties = {
  width: '1px',
  height: '24px',
  backgroundColor: 'hsl(var(--border))',
  margin: '0 4px',
};

const dropdownContainerStyle: React.CSSProperties = {
  position: 'relative',
};

const dropdownButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '6px 12px',
  border: '1px solid hsl(var(--border))',
  backgroundColor: 'hsl(var(--background))',
  color: 'hsl(var(--foreground))',
  cursor: 'pointer',
  borderRadius: '4px',
  fontSize: '13px',
  fontWeight: '500',
  minWidth: '120px',
  justifyContent: 'space-between',
};

const modeToggleButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '6px 12px',
  border: '1px solid oklch(from var(--brand-purple) l c h / 0.3)',
  backgroundColor: 'oklch(from var(--brand-purple) l c h / 0.1)',
  color: 'var(--brand-purple)',
  cursor: 'pointer',
  borderRadius: '4px',
  fontSize: '13px',
  fontWeight: '500',
  minWidth: '120px',
  justifyContent: 'center',
  gap: '4px',
  transition: 'all 0.2s',
};

const dropdownMenuStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  marginTop: '4px',
  backgroundColor: 'var(--bg-section)',
  border: '1px solid hsl(var(--border))',
  borderRadius: '6px',
  boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
  zIndex: 1000,
  minWidth: '160px',
  maxHeight: '300px',
  overflowY: 'auto',
};

const variableDropdownMenuStyle: React.CSSProperties = {
  ...dropdownMenuStyle,
  minWidth: '200px',
};

const dropdownItemStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px 12px',
  border: 'none',
  backgroundColor: 'transparent',
  color: 'hsl(var(--foreground))',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '13px',
  transition: 'background-color 0.2s',
};

const dropdownItemWithArrowStyle: React.CSSProperties = {
  ...dropdownItemStyle,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const dividerHorizontalStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: 'hsl(var(--border))',
  margin: '4px 0',
};

const nestedMenuContainerStyle: React.CSSProperties = {
  position: 'relative',
};

const nestedDropdownMenuStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: '100%',
  marginLeft: '4px',
  backgroundColor: 'var(--bg-section)',
  border: '1px solid hsl(var(--border))',
  borderRadius: '6px',
  boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
  zIndex: 1001,
  minWidth: '200px',
  maxHeight: '300px',
  overflowY: 'auto',
};
