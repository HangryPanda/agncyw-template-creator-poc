import { useEffect, useMemo } from 'react';
import { TemplateVariable, EditorState, Template } from '@/types';
import React from 'react';
import { useTemplateValues } from '@/hooks/use-template-values';
import { ComposePreview } from './ComposePreview';
import { AccordionItem } from '@/components/ui/primitives/shadcn/Accordion';

interface TemplatePreviewProps {
  template: Template;
  availableVariables: TemplateVariable[];
}

const GROUP_LABELS: Record<string, string> = {
  customer: 'Customer Info',
  message: 'Message Details',
  agent: 'Agent Team Member',
  agency: 'Agency Details',
  custom: 'Custom Variables',
};

export default function TemplatePreview({
  template,
  availableVariables,
}: TemplatePreviewProps): JSX.Element {
  const {
    values,
    updateValue,
    clearValues,
    getGroupFillCount,
  } = useTemplateValues(template.id, availableVariables);

  // Render template with current values
  const renderedText = useMemo((): string => {
    if (!template.content) return '';

    const processNode = (node: any): string => {
      if (node.type === 'template-variable') {
        return values[node.variableName] || `{{${node.variableName}}}`;
      } else if (node.type === 'text') {
        return node.text;
      } else if (node.type === 'heading') {
        const content = node.children?.map(processNode).join('') || '';
        return content + '\n\n';
      } else if (node.type === 'paragraph') {
        const content = node.children?.map(processNode).join('') || '';
        return content + '\n';
      } else if (node.children) {
        return node.children.map(processNode).join('');
      }
      return '';
    };

    if (template.content.root?.children) {
      const output = template.content.root.children.map(processNode).join('');
      return output.trimEnd();
    }

    return '';
  }, [template.content, values]);

  // Copy to clipboard
  const handleCopy = (): void => {
    navigator.clipboard.writeText(renderedText);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Enter to copy
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleCopy();
      }
      // Cmd+K to clear
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        clearValues();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [renderedText, clearValues]);

  // Group variables by their group property
  const groupedVariables = useMemo(() => {
    const groups: Record<string, TemplateVariable[]> = {
      customer: [],
      message: [],
      agent: [],
      agency: [],
      custom: [],
    };

    availableVariables.forEach(variable => {
      const group = variable.group || 'custom';
      if (groups[group]) {
        groups[group].push(variable);
      } else {
        groups.custom.push(variable);
      }
    });

    // Filter out empty groups
    return Object.entries(groups).filter(([_, vars]) => vars.length > 0);
  }, [availableVariables]);

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Preview */}
      <ComposePreview
        renderedText={renderedText}
        templateType={template.type}
        onCopy={handleCopy}
        onClear={clearValues}
      />

      {/* Form Fields with Accordions */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-3">
          {groupedVariables.map(([groupKey, variables]) => {
            const { filled, total } = getGroupFillCount(groupKey);
            const allFilled = filled === total && total > 0;

            return (
              <AccordionItem
                key={groupKey}
                title={
                  <div className="flex items-center justify-between w-full">
                    <span>{GROUP_LABELS[groupKey] || groupKey}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      allFilled
                        ? 'bg-accent/30 text-accent-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {filled}/{total}
                    </span>
                  </div>
                }
                defaultOpen={!allFilled}
              >
                <div className="space-y-4 pt-1">
                  {variables.map((variable) => (
                    <div key={variable.name} className="flex flex-col gap-1">
                      <label
                        htmlFor={variable.name}
                        className="text-xs font-medium text-foreground/80"
                      >
                        {variable.label}
                        {variable.description && (
                          <span className="text-muted-foreground font-normal ml-1">
                            · {variable.description}
                          </span>
                        )}
                      </label>
                      <input
                        id={variable.name}
                        type="text"
                        value={values[variable.name] || ''}
                        onChange={(e) => updateValue(variable.name, e.target.value)}
                        placeholder={variable.example}
                        className="px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </AccordionItem>
            );
          })}
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="mt-8 max-w-3xl mx-auto">
          <div className="text-xs text-muted-foreground/60 text-center space-x-4">
            <span><kbd className="px-1.5 py-0.5 bg-muted rounded border border-border">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border">Enter</kbd> to copy</span>
            <span>·</span>
            <span><kbd className="px-1.5 py-0.5 bg-muted rounded border border-border">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border">K</kbd> to clear</span>
          </div>
        </div>
      </div>
    </div>
  );
}
