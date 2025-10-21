import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import {
  $getSelection,
  $isRangeSelection,
  TextNode,
  COMMAND_PRIORITY_LOW,
  KEY_DOWN_COMMAND,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { $createHorizontalRuleNode } from '@/nodes/HorizontalRuleNode';
import React from 'react';

interface SlashCommand {
  label: string;
  description: string;
  icon: string;
  execute: () => void;
}

export default function SlashCommandPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [queryString, setQueryString] = useState<string>('');

  const commands: SlashCommand[] = [
    {
      label: 'Heading 1',
      description: 'Large heading',
      icon: 'H1',
      execute: () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode('h1'));
          }
        });
      },
    },
    {
      label: 'Heading 2',
      description: 'Medium heading',
      icon: 'H2',
      execute: () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode('h2'));
          }
        });
      },
    },
    {
      label: 'Heading 3',
      description: 'Small heading',
      icon: 'H3',
      execute: () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode('h3'));
          }
        });
      },
    },
    {
      label: 'Quote',
      description: 'Insert a quote block',
      icon: '❝',
      execute: () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode());
          }
        });
      },
    },
    {
      label: 'Bulleted List',
      description: 'Create an unordered list',
      icon: '•',
      execute: () => {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      },
    },
    {
      label: 'Numbered List',
      description: 'Create an ordered list',
      icon: '1.',
      execute: () => {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      },
    },
    {
      label: 'Table',
      description: 'Insert a table',
      icon: '⊞',
      execute: () => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: '3', rows: '3' });
      },
    },
    {
      label: 'Horizontal Rule',
      description: 'Insert a divider line',
      icon: '―',
      execute: () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const hrNode = $createHorizontalRuleNode();
            selection.insertNodes([hrNode]);
          }
        });
      },
    },
  ];

  const filteredCommands = queryString
    ? commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(queryString.toLowerCase())
      )
    : commands;

  const executeCommand = useCallback(
    (index: number) => {
      if (filteredCommands[index]) {
        // Remove the slash and query text
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const anchor = selection.anchor;
            const anchorNode = anchor.getNode();

            if (anchorNode instanceof TextNode) {
              const textContent = anchorNode.getTextContent();
              const slashIndex = textContent.lastIndexOf('/' + queryString);
              if (slashIndex !== -1) {
                anchorNode.spliceText(slashIndex, queryString.length + 1, '', false);
              }
            }
          }
        });

        // Execute the command
        filteredCommands[index].execute();
        setShowMenu(false);
        setQueryString('');
        setSelectedIndex(0);
      }
    },
    [editor, filteredCommands, queryString]
  );

  useEffect(() => {
    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event: KeyboardEvent) => {
        if (!showMenu) return false;

        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : prev
          );
          return true;
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          return true;
        }

        if (event.key === 'Enter' || event.key === 'Tab') {
          event.preventDefault();
          executeCommand(selectedIndex);
          return true;
        }

        if (event.key === 'Escape') {
          event.preventDefault();
          setShowMenu(false);
          setQueryString('');
          setSelectedIndex(0);
          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, showMenu, filteredCommands, selectedIndex, executeCommand]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          setShowMenu(false);
          return;
        }

        const anchorNode = selection.anchor.getNode();
        if (!(anchorNode instanceof TextNode)) {
          setShowMenu(false);
          return;
        }

        const textContent = anchorNode.getTextContent();
        const anchorOffset = selection.anchor.offset;

        // Look for slash command pattern
        const textBeforeCursor = textContent.slice(0, anchorOffset);
        const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

        if (lastSlashIndex !== -1) {
          const textAfterSlash = textBeforeCursor.slice(lastSlashIndex + 1);

          // Check if this looks like a slash command (no spaces after /)
          if (!/\s/.test(textAfterSlash)) {
            setQueryString(textAfterSlash);
            setShowMenu(true);
            setSelectedIndex(0);

            // Calculate menu position
            const domSelection = window.getSelection();
            if (domSelection && domSelection.rangeCount > 0) {
              const range = domSelection.getRangeAt(0);
              const rect = range.getBoundingClientRect();
              setMenuPosition({
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX,
              });
            }
            return;
          }
        }

        setShowMenu(false);
        setQueryString('');
      });
    });
  }, [editor]);

  if (!showMenu || filteredCommands.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        ...menuStyle,
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
      }}
    >
      {filteredCommands.map((command, index) => (
        <div
          key={command.label}
          onClick={() => executeCommand(index)}
          style={{
            ...menuItemStyle,
            ...(index === selectedIndex ? selectedMenuItemStyle : {}),
          }}
        >
          <div style={iconStyle}>{command.icon}</div>
          <div style={labelContainerStyle}>
            <div style={labelStyle}>{command.label}</div>
            <div style={descriptionStyle}>{command.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const menuStyle: React.CSSProperties = {
  position: 'absolute',
  backgroundColor: 'white',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  minWidth: '280px',
  maxWidth: '320px',
  maxHeight: '400px',
  overflowY: 'auto',
  zIndex: 1000,
  padding: '8px',
};

const menuItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 12px',
  cursor: 'pointer',
  borderRadius: '6px',
  transition: 'background-color 0.15s',
};

const selectedMenuItemStyle: React.CSSProperties = {
  backgroundColor: '#e3f2fd',
};

const iconStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f5f5f5',
  borderRadius: '6px',
  fontSize: '16px',
  fontWeight: '600',
  flexShrink: 0,
};

const labelContainerStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const labelStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#333',
  marginBottom: '2px',
};

const descriptionStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#666',
};
