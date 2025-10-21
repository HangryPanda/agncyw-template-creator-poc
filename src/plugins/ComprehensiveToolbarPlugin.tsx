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
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $isHeadingNode, $createQuoteNode, $isQuoteNode, HeadingTagType } from '@lexical/rich-text';
import { $isListNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $createImageNode } from '@/nodes/ImageNode';
import { $createHorizontalRuleNode } from '@/nodes/HorizontalRuleNode';
import { mergeRegister } from '@lexical/utils';
import React from 'react';

export default function ComprehensiveToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false);
  const [isCode, setIsCode] = useState<boolean>(false);
  const [isSubscript, setIsSubscript] = useState<boolean>(false);
  const [isSuperscript, setIsSuperscript] = useState<boolean>(false);
  const [blockType, setBlockType] = useState<string>('paragraph');
  const [isLink, setIsLink] = useState<boolean>(false);
  const [showLinkInput, setShowLinkInput] = useState<boolean>(false);
  const [showImageInput, setShowImageInput] = useState<boolean>(false);
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageAlt, setImageAlt] = useState<string>('');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));

      // Check if selection is a link
      const node = selection.anchor.getNode();
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));

      // Update block type
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      if ($isListNode(element)) {
        const parentList = element;
        const type = parentList.getListType();
        setBlockType(type);
      } else if ($isHeadingNode(element)) {
        const tag = element.getTag();
        setBlockType(tag);
      } else if ($isQuoteNode(element)) {
        setBlockType('quote');
      } else {
        const type = element.getType();
        setBlockType(type);
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      })
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

  const formatStrikethrough = (): void => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
  };

  const formatCode = (): void => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
  };

  const formatSubscript = (): void => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
  };

  const formatSuperscript = (): void => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
  };

  const formatHeading = (headingSize: HeadingTagType): void => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    } else {
      formatParagraph();
    }
  };

  const formatParagraph = (): void => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatQuote = (): void => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    } else {
      formatParagraph();
    }
  };


  const insertBulletList = (): void => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const insertNumberedList = (): void => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const insertTable = (): void => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: '3', rows: '3' });
  };

  const insertLink = (): void => {
    if (!isLink) {
      setShowLinkInput(true);
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  };

  const insertImage = (): void => {
    setShowImageInput(true);
  };

  const insertHorizontalRule = (): void => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const hrNode = $createHorizontalRuleNode();
        selection.insertNodes([hrNode]);
      }
    });
  };

  const handleLinkSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (linkUrl) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
      setShowLinkInput(false);
      setLinkUrl('');
    }
  };

  const handleImageSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (imageUrl) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const imageNode = $createImageNode({
            src: imageUrl,
            altText: imageAlt || 'Image',
            maxWidth: 500,
          });
          selection.insertNodes([imageNode]);
        }
      });
      setShowImageInput(false);
      setImageUrl('');
      setImageAlt('');
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
    <div style={toolbarContainerStyle}>
      <div style={toolbarStyle}>
        {/* Undo/Redo */}
        <div style={toolbarSectionStyle}>
          <button onClick={undo} style={toolbarButtonStyle} title="Undo (Ctrl+Z)">
            ↶
          </button>
          <button onClick={redo} style={toolbarButtonStyle} title="Redo (Ctrl+Y)">
            ↷
          </button>
        </div>

        <div style={dividerStyle} />

        {/* Block Type */}
        <div style={toolbarSectionStyle}>
          <select
            style={selectStyle}
            value={blockType}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'paragraph') formatParagraph();
              else if (value === 'h1') formatHeading('h1');
              else if (value === 'h2') formatHeading('h2');
              else if (value === 'h3') formatHeading('h3');
              else if (value === 'quote') formatQuote();
            }}
          >
            <option value="paragraph">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="quote">Quote</option>
          </select>
        </div>

        <div style={dividerStyle} />

        {/* Text Formatting */}
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
          <button
            onClick={formatStrikethrough}
            style={{
              ...toolbarButtonStyle,
              ...(isStrikethrough ? activeButtonStyle : {}),
            }}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
          <button
            onClick={formatCode}
            style={{
              ...toolbarButtonStyle,
              ...(isCode ? activeButtonStyle : {}),
            }}
            title="Inline Code"
          >
            {'</>'}
          </button>
        </div>

        <div style={dividerStyle} />

        {/* Subscript/Superscript */}
        <div style={toolbarSectionStyle}>
          <button
            onClick={formatSubscript}
            style={{
              ...toolbarButtonStyle,
              ...(isSubscript ? activeButtonStyle : {}),
            }}
            title="Subscript"
          >
            X<sub>₂</sub>
          </button>
          <button
            onClick={formatSuperscript}
            style={{
              ...toolbarButtonStyle,
              ...(isSuperscript ? activeButtonStyle : {}),
            }}
            title="Superscript"
          >
            X<sup>²</sup>
          </button>
        </div>

        <div style={dividerStyle} />

        {/* Insert Elements */}
        <div style={toolbarSectionStyle}>
          <button
            onClick={insertLink}
            style={{
              ...toolbarButtonStyle,
              ...(isLink ? activeButtonStyle : {}),
            }}
            title="Insert Link"
          >
            🔗
          </button>
          <button
            onClick={insertImage}
            style={toolbarButtonStyle}
            title="Insert Image"
          >
            🖼️
          </button>
          <button
            onClick={insertBulletList}
            style={{
              ...toolbarButtonStyle,
              ...(blockType === 'bullet' ? activeButtonStyle : {}),
            }}
            title="Bullet List"
          >
            •
          </button>
          <button
            onClick={insertNumberedList}
            style={{
              ...toolbarButtonStyle,
              ...(blockType === 'number' ? activeButtonStyle : {}),
            }}
            title="Numbered List"
          >
            1.
          </button>
          <button onClick={insertTable} style={toolbarButtonStyle} title="Insert Table">
            ⊞
          </button>
          <button onClick={insertHorizontalRule} style={toolbarButtonStyle} title="Horizontal Rule">
            ―
          </button>
        </div>

        <div style={dividerStyle} />

        {/* Alignment */}
        <div style={toolbarSectionStyle}>
          <button onClick={formatAlignLeft} style={toolbarButtonStyle} title="Align Left">
            ≡
          </button>
          <button onClick={formatAlignCenter} style={toolbarButtonStyle} title="Align Center">
            ≣
          </button>
          <button onClick={formatAlignRight} style={toolbarButtonStyle} title="Align Right">
            ≢
          </button>
        </div>
      </div>

      {/* Link Input Modal */}
      {showLinkInput && (
        <div style={inputContainerStyle}>
          <form onSubmit={handleLinkSubmit} style={formStyle}>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL (https://...)"
              style={inputStyle}
              autoFocus
            />
            <button type="submit" style={submitButtonStyle}>
              Insert
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl('');
              }}
              style={cancelButtonStyle}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Image Input Modal */}
      {showImageInput && (
        <div style={inputContainerStyle}>
          <form onSubmit={handleImageSubmit} style={formStyle}>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL (https://...)"
              style={inputStyle}
              autoFocus
            />
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Alt text (optional)"
              style={inputStyle}
            />
            <button type="submit" style={submitButtonStyle}>
              Insert
            </button>
            <button
              type="button"
              onClick={() => {
                setShowImageInput(false);
                setImageUrl('');
                setImageAlt('');
              }}
              style={cancelButtonStyle}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Tip */}
      <div style={tipStyle}>
        💡 <strong>Tip:</strong> Type <code>/</code> to open command menu • Support for <strong>Bold</strong>, <em>Italic</em>, <u>Underline</u>, <s>Strikethrough</s>, Inline <code>code</code>, X<sub>₂</sub>, X<sup>²</sup>, Images, Links, Tables, Lists, Code Blocks & More!
      </div>
    </div>
  );
}

const toolbarContainerStyle: React.CSSProperties = {
  borderBottom: '1px solid #ddd',
  backgroundColor: '#f9f9f9',
};

const toolbarStyle: React.CSSProperties = {
  display: 'flex',
  padding: '8px 12px',
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

const selectStyle: React.CSSProperties = {
  padding: '6px 8px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  backgroundColor: 'white',
  fontSize: '14px',
  cursor: 'pointer',
  minWidth: '140px',
};

const dividerStyle: React.CSSProperties = {
  width: '1px',
  height: '24px',
  backgroundColor: '#ddd',
  margin: '0 4px',
};

const inputContainerStyle: React.CSSProperties = {
  padding: '12px',
  backgroundColor: '#fff',
  borderTop: '1px solid #ddd',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: '200px',
  padding: '8px 12px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
};

const submitButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: '#1976d2',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: '#757575',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
};

const tipStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: '11px',
  color: '#666',
  backgroundColor: '#f5f5f5',
  borderTop: '1px solid #e0e0e0',
  lineHeight: '1.5',
};
