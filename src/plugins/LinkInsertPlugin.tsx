import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $createLinkNode, $isLinkNode } from '@lexical/link';
import React from 'react';

export function useLinkInsert(): {
  insertLink: (url: string, text?: string) => void;
  isLink: boolean;
} {
  const [editor] = useLexicalComposerContext();
  const [isLink, setIsLink] = React.useState(false);

  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode();
          const parent = node.getParent();
          setIsLink($isLinkNode(parent) || $isLinkNode(node));
        }
      });
    });
  }, [editor]);

  const insertLink = React.useCallback(
    (url: string, text?: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const linkNode = $createLinkNode(url);

          if (text) {
            selection.insertText(text);
          }

          if (selection.isCollapsed()) {
            // If no text is selected, insert the URL as text
            selection.insertNodes([linkNode]);
            linkNode.select();
          } else {
            // Wrap selected text in link
            selection.insertNodes([linkNode]);
          }
        }
      });
    },
    [editor]
  );

  return { insertLink, isLink };
}

export default function LinkInsertPlugin(): null {
  // This is a hook-only plugin, no UI
  return null;
}
