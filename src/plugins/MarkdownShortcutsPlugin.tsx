import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from '@lexical/rich-text';
import {
  $createListItemNode,
  $createListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_SPACE_COMMAND,
  TextNode,
} from 'lexical';
import { useEffect } from 'react';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';

const MARKDOWN_SHORTCUTS = {
  // Headings
  '# ': 'h1',
  '## ': 'h2',
  '### ': 'h3',
  '#### ': 'h4',
  '##### ': 'h5',
  '###### ': 'h6',
  // Lists
  '- ': 'bullet',
  '* ': 'bullet',
  '+ ': 'bullet',
  '1. ': 'number',
  // Other blocks
  '> ': 'quote',
  '--- ': 'hr',
  '*** ': 'hr',
  '___ ': 'hr',
} as const;

// Inline markdown patterns
const INLINE_PATTERNS = [
  {
    pattern: /\*\*([^*]+)\*\*/,
    format: 'bold',
  },
  {
    pattern: /__([^_]+)__/,
    format: 'bold',
  },
  {
    pattern: /\*([^*]+)\*/,
    format: 'italic',
  },
  {
    pattern: /_([^_]+)_/,
    format: 'italic',
  },
  {
    pattern: /`([^`]+)`/,
    format: 'code',
  },
  {
    pattern: /~~([^~]+)~~/,
    format: 'strikethrough',
  },
];

export default function MarkdownShortcutsPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeListener = editor.registerCommand(
      KEY_SPACE_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }

        const anchorNode = selection.anchor.getNode();
        if (!anchorNode.getType() || anchorNode.getType() !== 'text') {
          return false;
        }

        const parentNode = anchorNode.getParent();
        if (!parentNode || parentNode.getType() !== 'paragraph') {
          return false;
        }

        const text = anchorNode.getTextContent();

        // Check for block-level markdown shortcuts
        for (const [trigger, type] of Object.entries(MARKDOWN_SHORTCUTS)) {
          if (text === trigger.trim()) {
            event?.preventDefault();

            // Remove the markdown trigger text
            anchorNode.remove();

            switch (type) {
              case 'h1':
              case 'h2':
              case 'h3':
              case 'h4':
              case 'h5':
              case 'h6':
                $setBlocksType(selection, () => $createHeadingNode(type as HeadingTagType));
                break;
              case 'bullet':
                editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
                break;
              case 'number':
                editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
                break;
              case 'quote':
                $setBlocksType(selection, () => $createQuoteNode());
                break;
              case 'hr':
                editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
                break;
            }
            return true;
          }
        }

        // Check for inline markdown patterns
        for (const { pattern, format } of INLINE_PATTERNS) {
          const match = text.match(pattern);
          if (match && match.index !== undefined) {
            event?.preventDefault();

            const matchedText = match[1];
            const startIndex = match.index;
            const endIndex = startIndex + match[0].length;

            // Create new text node with the content
            const newTextNode = $createTextNode(matchedText);

            // Apply formatting
            newTextNode.setFormat(format as any);

            // Replace the markdown text with formatted text
            if (anchorNode instanceof TextNode) {
              const beforeText = text.substring(0, startIndex);
              const afterText = text.substring(endIndex);

              if (beforeText) {
                anchorNode.setTextContent(beforeText);
                anchorNode.insertAfter(newTextNode);
              } else {
                anchorNode.replace(newTextNode);
              }

              if (afterText) {
                const afterNode = $createTextNode(' ' + afterText);
                newTextNode.insertAfter(afterNode);
                afterNode.select();
              } else {
                const spaceNode = $createTextNode(' ');
                newTextNode.insertAfter(spaceNode);
                spaceNode.select();
              }
            }

            return true;
          }
        }

        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    return removeListener;
  }, [editor]);

  return null;
}