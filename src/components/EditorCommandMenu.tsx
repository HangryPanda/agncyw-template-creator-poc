import { useEffect, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/overlays/shadcn/Command';
import { Popover, PopoverContent } from '@/components/ui/overlays/shadcn/Popover';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, INSERT_CHECK_LIST_COMMAND } from '@lexical/list';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { $createImageNode } from '@/nodes/ImageNode';
import { $createStickyNode } from '@/nodes/StickyNode';
import { $createPollNode } from '@/nodes/PollNode';
import { $createEquationNode } from '@/nodes/EquationNode';
import { $createCodeNode } from '@lexical/code';
import { INSERT_COLLAPSIBLE_COMMAND } from '@/plugins/CollapsiblePlugin';
import { INSERT_EXCALIDRAW_COMMAND } from '@/plugins/ExcalidrawPlugin';
import { $createTweetNode } from '@/nodes/TweetNode';
import { $createYouTubeNode } from '@/nodes/YouTubeNode';
import { $createFigmaNode } from '@/nodes/FigmaNode';
import { INSERT_PAGE_BREAK } from '@/plugins/PageBreakPlugin';

interface EditorCommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: { x: number; y: number };
}

export function EditorCommandMenu({ open, onOpenChange, position }: EditorCommandMenuProps) {
  const [editor] = useLexicalComposerContext();

  const insertNode = (type: string) => {
    // First, remove the slash from the text
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const anchorNode = selection.anchor.getNode();
      const text = anchorNode.getTextContent();
      const slashIndex = text.lastIndexOf('/');
      if (slashIndex !== -1 && anchorNode.getType() === 'text') {
        (anchorNode as any).spliceText(slashIndex, text.length - slashIndex, '');
      }
    });

    // Then insert the appropriate node/block
    switch (type) {
      case 'heading1':
      case 'heading2':
      case 'heading3':
      case 'quote':
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          switch (type) {
            case 'heading1':
              $setBlocksType(selection, () => $createHeadingNode('h1'));
              break;
            case 'heading2':
              $setBlocksType(selection, () => $createHeadingNode('h2'));
              break;
            case 'heading3':
              $setBlocksType(selection, () => $createHeadingNode('h3'));
              break;
            case 'quote':
              $setBlocksType(selection, () => $createQuoteNode());
              break;
          }
        });
        break;
      case 'bullet':
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        break;
      case 'number':
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        break;
      case 'checklist':
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
        break;
      case 'divider':
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
        break;
      case 'table':
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
          rows: '3',
          columns: '3',
          includeHeaders: true
        });
        break;
      case 'image':
        const url = prompt('Enter image URL:');
        if (url) {
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            const imageNode = $createImageNode({
              src: url,
              altText: 'Image',
              width: 500
            });
            selection.insertNodes([imageNode]);
          });
        }
        break;
      case 'sticky':
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;
          const stickyNode = $createStickyNode(0, 0);
          selection.insertNodes([stickyNode]);
        });
        break;
      case 'poll':
        const question = prompt('Enter poll question:');
        if (question) {
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            const pollNode = $createPollNode(question, [
              { text: 'Option 1', uid: '1', votes: [] },
              { text: 'Option 2', uid: '2', votes: [] },
            ]);
            selection.insertNodes([pollNode]);
          });
        }
        break;
      case 'equation':
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;
          const equationNode = $createEquationNode('', true);
          selection.insertNodes([equationNode]);
        });
        break;
      case 'code':
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;
          $setBlocksType(selection, () => $createCodeNode());
        });
        break;
      case 'collapsible':
        editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined);
        break;
      case 'excalidraw':
        editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined);
        break;
      case 'tweet':
        const tweetId = prompt('Enter tweet ID or URL:');
        if (tweetId) {
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            const tweetNode = $createTweetNode(tweetId);
            selection.insertNodes([tweetNode]);
          });
        }
        break;
      case 'youtube':
        const videoId = prompt('Enter YouTube video ID or URL:');
        if (videoId) {
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            const youtubeNode = $createYouTubeNode(videoId);
            selection.insertNodes([youtubeNode]);
          });
        }
        break;
      case 'figma':
        const figmaUrl = prompt('Enter Figma embed URL:');
        if (figmaUrl) {
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            const figmaNode = $createFigmaNode(figmaUrl);
            selection.insertNodes([figmaNode]);
          });
        }
        break;
      case 'pagebreak':
        editor.dispatchCommand(INSERT_PAGE_BREAK, undefined);
        break;
      case 'variable':
        // Insert {{ which will trigger the VariablePopover automatically
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;
          selection.insertText('{{');
        });
        break;
    }

    onOpenChange(false);
  };

  const formatText = (format: string) => {
    // First remove the slash
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const anchorNode = selection.anchor.getNode();
      const text = anchorNode.getTextContent();
      const slashIndex = text.lastIndexOf('/');
      if (slashIndex !== -1 && anchorNode.getType() === 'text') {
        (anchorNode as any).spliceText(slashIndex, text.length - slashIndex, '');
      }
    });

    // Then apply the format
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format as any);
    onOpenChange(false);
  };

  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverContent
        className="w-80 p-0"
        align="start"
        side="bottom"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
        }}
      >
        <Command>
          <CommandInput
            placeholder="Search for blocks and formatting..."
            value={search}
            onValueChange={setSearch}
            className="h-9"
          />
          <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Template">
            <CommandItem onSelect={() => insertNode('variable')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted bg-brand-purple/10 border-brand-purple/30">
                  <span className="text-sm font-mono text-brand-purple">{'{{}}'}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Variable</p>
                  <p className="text-xs text-muted-foreground">Insert a template variable</p>
                </div>
              </div>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Basic blocks">
            <CommandItem onSelect={() => insertNode('heading1')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="text-lg font-bold">H1</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Heading 1</p>
                  <p className="text-xs text-muted-foreground">Big section heading</p>
                </div>
              </div>
            </CommandItem>

            <CommandItem onSelect={() => insertNode('heading2')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="text-base font-bold">H2</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Heading 2</p>
                  <p className="text-xs text-muted-foreground">Medium section heading</p>
                </div>
              </div>
            </CommandItem>

            <CommandItem onSelect={() => insertNode('heading3')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="text-sm font-bold">H3</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Heading 3</p>
                  <p className="text-xs text-muted-foreground">Small section heading</p>
                </div>
              </div>
            </CommandItem>

            <CommandItem onSelect={() => insertNode('quote')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="text-lg">"</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Quote</p>
                  <p className="text-xs text-muted-foreground">Capture a quote</p>
                </div>
              </div>
            </CommandItem>

            <CommandItem onSelect={() => insertNode('bullet')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="text-lg">•</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Bulleted list</p>
                  <p className="text-xs text-muted-foreground">Create a simple list</p>
                </div>
              </div>
            </CommandItem>

            <CommandItem onSelect={() => insertNode('number')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="text-sm">1.</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Numbered list</p>
                  <p className="text-xs text-muted-foreground">Create a numbered list</p>
                </div>
              </div>
            </CommandItem>

            <CommandItem onSelect={() => insertNode('checklist')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Checklist</p>
                  <p className="text-xs text-muted-foreground">Track tasks with checkboxes</p>
                </div>
              </div>
            </CommandItem>

            <CommandItem onSelect={() => insertNode('divider')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="text-lg">—</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Divider</p>
                  <p className="text-xs text-muted-foreground">Visually divide blocks</p>
                </div>
              </div>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Advanced blocks">
            <CommandItem onSelect={() => insertNode('table')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Table</p>
                  <p className="text-xs text-muted-foreground">Insert a table</p>
                </div>
              </div>
            </CommandItem>

            <CommandItem onSelect={() => insertNode('image')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Image</p>
                  <p className="text-xs text-muted-foreground">Add an image from URL</p>
                </div>
              </div>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Embeds & Media">
            <CommandItem onSelect={() => insertNode('tweet')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="text-lg">𝕏</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Tweet</p>
                  <p className="text-xs text-muted-foreground">Embed a tweet</p>
                </div>
              </div>
            </CommandItem>

            <CommandItem onSelect={() => insertNode('youtube')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="text-lg">▶</span>
                </div>
                <div>
                  <p className="text-sm font-medium">YouTube</p>
                  <p className="text-xs text-muted-foreground">Embed a YouTube video</p>
                </div>
              </div>
            </CommandItem>

            <CommandItem onSelect={() => insertNode('figma')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="text-sm font-bold">F</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Figma</p>
                  <p className="text-xs text-muted-foreground">Embed a Figma design</p>
                </div>
              </div>
            </CommandItem>

            <CommandItem onSelect={() => insertNode('excalidraw')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="text-lg">✏️</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Excalidraw</p>
                  <p className="text-xs text-muted-foreground">Create a diagram</p>
                </div>
              </div>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Interactive Elements">
            <CommandItem onSelect={() => insertNode('poll')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="text-lg">📊</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Poll</p>
                  <p className="text-xs text-muted-foreground">Create a poll</p>
                </div>
              </div>
            </CommandItem>

            <CommandItem onSelect={() => insertNode('sticky')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="text-lg">📌</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Sticky Note</p>
                  <p className="text-xs text-muted-foreground">Add a sticky note</p>
                </div>
              </div>
            </CommandItem>

            <CommandItem onSelect={() => insertNode('collapsible')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="text-lg">⊟</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Collapsible</p>
                  <p className="text-xs text-muted-foreground">Expandable content section</p>
                </div>
              </div>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Code & Math">
            <CommandItem onSelect={() => insertNode('code')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="text-xs font-mono">{`{}`}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Code Block</p>
                  <p className="text-xs text-muted-foreground">Add a code block with syntax highlighting</p>
                </div>
              </div>
            </CommandItem>

            <CommandItem onSelect={() => insertNode('equation')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="text-lg">∑</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Equation</p>
                  <p className="text-xs text-muted-foreground">Add a LaTeX equation</p>
                </div>
              </div>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Layout">
            <CommandItem onSelect={() => insertNode('pagebreak')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="text-xs">---</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Page Break</p>
                  <p className="text-xs text-muted-foreground">Insert a page break for printing</p>
                </div>
              </div>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Text formatting">
            <CommandItem onSelect={() => formatText('bold')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="font-bold">B</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Bold</p>
                  <p className="text-xs text-muted-foreground">Make text bold</p>
                </div>
              </div>
            </CommandItem>

            <CommandItem onSelect={() => formatText('italic')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="italic">I</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Italic</p>
                  <p className="text-xs text-muted-foreground">Make text italic</p>
                </div>
              </div>
            </CommandItem>

            <CommandItem onSelect={() => formatText('underline')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="underline">U</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Underline</p>
                  <p className="text-xs text-muted-foreground">Underline text</p>
                </div>
              </div>
            </CommandItem>

            <CommandItem onSelect={() => formatText('strikethrough')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="line-through">S</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Strikethrough</p>
                  <p className="text-xs text-muted-foreground">Cross out text</p>
                </div>
              </div>
            </CommandItem>

            <CommandItem onSelect={() => formatText('code')}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                  <span className="text-xs font-mono">&lt;/&gt;</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Code</p>
                  <p className="text-xs text-muted-foreground">Inline code style</p>
                </div>
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      </PopoverContent>
    </Popover>
  );
}