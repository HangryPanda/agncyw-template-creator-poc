import { useEffect, useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/overlays/shadcn/Command';
import { Popover, PopoverContent } from '@/components/ui/overlays/shadcn/Popover';
import { TemplateVariable } from '@/types';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $createTemplateVariableNode } from '@/nodes/TemplateVariableNode';

interface VariablePopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: { x: number; y: number };
  availableVariables: TemplateVariable[];
  onManageVariables?: () => void;
}

export function VariablePopover({
  open,
  onOpenChange,
  position,
  availableVariables,
  onManageVariables
}: VariablePopoverProps) {
  const [editor] = useLexicalComposerContext();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  const insertVariable = (variable: TemplateVariable) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Remove the {{ trigger
        const anchorNode = selection.anchor.getNode();
        const text = anchorNode.getTextContent();
        const triggerIndex = text.lastIndexOf('{{');
        if (triggerIndex !== -1 && anchorNode.getType() === 'text') {
          (anchorNode as any).spliceText(triggerIndex, text.length - triggerIndex, '');
        }

        // Insert the variable node
        const variableNode = $createTemplateVariableNode(variable.name);
        selection.insertNodes([variableNode]);
      }
    });
    onOpenChange(false);
  };

  const filteredVariables = availableVariables.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.label.toLowerCase().includes(search.toLowerCase()) ||
    (v.description && v.description.toLowerCase().includes(search.toLowerCase()))
  );

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
            placeholder="Search variables..."
            value={search}
            onValueChange={setSearch}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No variables found.</CommandEmpty>
            <CommandGroup heading="Variables">
              {filteredVariables.map((variable) => (
                <CommandItem
                  key={variable.name}
                  onSelect={() => insertVariable(variable)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start gap-2 w-full">
                    <code className="text-xs font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20 flex-shrink-0">
                      {`{{${variable.name}}}`}
                    </code>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{variable.label}</p>
                      {variable.description && (
                        <p className="text-xs text-muted-foreground truncate">{variable.description}</p>
                      )}
                      {variable.example && (
                        <p className="text-xs text-muted-foreground italic">e.g., {variable.example}</p>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            {onManageVariables && (
              <>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      onManageVariables();
                      onOpenChange(false);
                    }}
                    className="cursor-pointer"
                  >
                    <span className="text-muted-foreground mr-2">+</span>
                    Manage Variables
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}