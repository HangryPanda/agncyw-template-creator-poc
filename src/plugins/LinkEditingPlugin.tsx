import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  COMMAND_PRIORITY_LOW,
  KEY_MODIFIER_COMMAND,
} from 'lexical';
import { $isLinkNode, $createLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/overlays/shadcn/Dialog';
import { Button } from '@/components/ui/primitives/shadcn/Button';
import { Input } from '@/components/ui/primitives/shadcn/Input';
import { Label } from '@/components/ui/primitives/shadcn/Label';

export default function LinkEditingPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [isLinkEditOpen, setIsLinkEditOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  const openLinkEditor = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const selectedText = selection.getTextContent();
      const anchorNode = selection.anchor.getNode();

      // Check if we're inside a link
      const linkNode = $findMatchingParent(anchorNode, $isLinkNode);

      if (linkNode) {
        setLinkUrl(linkNode.getURL());
        setLinkText(linkNode.getTextContent());
        setIsEditingExisting(true);
      } else {
        setLinkText(selectedText || '');
        setLinkUrl('');
        setIsEditingExisting(false);
      }

      setIsLinkEditOpen(true);
    });
  }, [editor]);

  const handleSaveLink = useCallback(() => {
    if (!linkUrl) {
      setIsLinkEditOpen(false);
      return;
    }

    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      if (isEditingExisting) {
        // Update existing link
        const anchorNode = selection.anchor.getNode();
        const linkNode = $findMatchingParent(anchorNode, $isLinkNode);
        if (linkNode) {
          linkNode.setURL(linkUrl);
        }
      } else {
        // Create new link
        const linkNode = $createLinkNode(linkUrl);
        if (linkText && linkText !== selection.getTextContent()) {
          // If the link text is different from selected text, replace it
          selection.insertText(linkText);
        }
        selection.insertNodes([linkNode]);
      }
    });

    setIsLinkEditOpen(false);
    setLinkUrl('');
    setLinkText('');
  }, [editor, linkUrl, linkText, isEditingExisting]);

  const handleRemoveLink = useCallback(() => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    setIsLinkEditOpen(false);
    setLinkUrl('');
    setLinkText('');
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      // Cmd/Ctrl+K to open link editor
      editor.registerCommand(
        KEY_MODIFIER_COMMAND,
        (event: KeyboardEvent) => {
          if (event.key === 'k' || event.key === 'K') {
            event.preventDefault();
            openLinkEditor();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, openLinkEditor]);

  // Add floating link button when text is selected
  const [showLinkButton, setShowLinkButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || selection.isCollapsed()) {
          setShowLinkButton(false);
          return;
        }

        const nativeSelection = window.getSelection();
        if (nativeSelection && nativeSelection.rangeCount > 0) {
          const range = nativeSelection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          // Check if we're already in a link
          const anchorNode = selection.anchor.getNode();
          const isInLink = !!$findMatchingParent(anchorNode, $isLinkNode);

          if (!isInLink && selection.getTextContent().trim()) {
            setButtonPosition({
              x: rect.left + rect.width / 2 - 20,
              y: rect.top - 45
            });
            setShowLinkButton(true);
          } else {
            setShowLinkButton(false);
          }
        }
      });
    });
  }, [editor]);

  return (
    <>
      {/* Floating Link Button */}
      {showLinkButton && (
        <button
          className="fixed z-50 p-2 bg-popover border rounded-md shadow-md hover:bg-accent transition-colors"
          style={{
            left: buttonPosition.x,
            top: buttonPosition.y,
          }}
          onClick={openLinkEditor}
          title="Add link (Cmd/Ctrl+K)"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
      )}

      {/* Link Edit Dialog */}
      <Dialog open={isLinkEditOpen} onOpenChange={setIsLinkEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditingExisting ? 'Edit Link' : 'Add Link'}</DialogTitle>
            <DialogDescription>
              Enter the URL for your link. Press Cmd/Ctrl+K to open this dialog.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="link-text">Link Text</Label>
              <Input
                id="link-text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Enter link text"
                disabled={isEditingExisting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            {isEditingExisting && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleRemoveLink}
              >
                Remove Link
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLinkEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveLink}>
                {isEditingExisting ? 'Update' : 'Add'} Link
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}