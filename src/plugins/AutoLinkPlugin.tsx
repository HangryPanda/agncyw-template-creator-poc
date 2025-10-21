import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isAutoLinkNode, $createAutoLinkNode, AutoLinkNode } from '@lexical/link';
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  TextNode,
} from 'lexical';
import { useEffect } from 'react';
import { mergeRegister } from '@lexical/utils';

const URL_REGEX = /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const EMAIL_REGEX = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;

export default function AutoLinkPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerNodeTransform(TextNode, (textNode: TextNode) => {
        const text = textNode.getTextContent();
        const parent = textNode.getParent();

        // Don't process if already inside a link
        if ($isAutoLinkNode(parent)) {
          return;
        }

        // Check for URLs
        const urlMatch = URL_REGEX.exec(text);
        if (urlMatch !== null) {
          const [fullMatch] = urlMatch;
          const startIndex = urlMatch.index;
          const endIndex = startIndex + fullMatch.length;

          // Split the text node
          const beforeText = text.slice(0, startIndex);
          const afterText = text.slice(endIndex);

          let url = fullMatch;
          // Add protocol if missing
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
          }

          const linkNode = $createAutoLinkNode(url);
          const linkTextNode = $createTextNode(fullMatch);
          linkNode.append(linkTextNode);

          if (beforeText) {
            textNode.setTextContent(beforeText);
            textNode.insertAfter(linkNode);
          } else {
            textNode.replace(linkNode);
          }

          if (afterText) {
            const afterNode = $createTextNode(afterText);
            linkNode.insertAfter(afterNode);
          }
          return;
        }

        // Check for emails
        const emailMatch = EMAIL_REGEX.exec(text);
        if (emailMatch !== null) {
          const [fullMatch] = emailMatch;
          const startIndex = emailMatch.index;
          const endIndex = startIndex + fullMatch.length;

          const beforeText = text.slice(0, startIndex);
          const afterText = text.slice(endIndex);

          const linkNode = $createAutoLinkNode('mailto:' + fullMatch);
          const linkTextNode = $createTextNode(fullMatch);
          linkNode.append(linkTextNode);

          if (beforeText) {
            textNode.setTextContent(beforeText);
            textNode.insertAfter(linkNode);
          } else {
            textNode.replace(linkNode);
          }

          if (afterText) {
            const afterNode = $createTextNode(afterText);
            linkNode.insertAfter(afterNode);
          }
        }
      }),
    );
  }, [editor]);

  return null;
}