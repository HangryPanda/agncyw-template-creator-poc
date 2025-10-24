import React from 'react';
import { Template, TemplateVariable } from '@/types';
import { VariableList } from './VariableList';
import { AccordionItem } from './ui/accordian';
import { useTemplateValues } from '@/hooks/use-template-values';
import { Save, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface FormWrapperProps {
  mode: 'create' | 'use';
  template: Template;
  availableVariables: TemplateVariable[];
  onInsertVariable: (variableName: string) => void;
  onUpdateTemplate?: (content: string) => void;
  onCopyMessage?: () => void;
  renderedText?: string;
}

const GROUP_LABELS: Record<string, string> = {
  customer: 'Customer Info',
  message: 'Message Details',
  agent: 'Agent Team Member',
  agency: 'Agency Details',
  custom: 'Custom Variables',
};

export function FormWrapper({
  mode,
  template,
  availableVariables,
  onInsertVariable,
  onUpdateTemplate,
  onCopyMessage,
  renderedText = '',
}: FormWrapperProps): JSX.Element {
  const {
    values,
    updateValue,
    getGroupFillCount,
  } = useTemplateValues(template.id, availableVariables);

  // Group variables for Compose mode
  const groupedVariables = React.useMemo(() => {
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

    return Object.entries(groups).filter(([_, vars]) => vars.length > 0);
  }, [availableVariables]);

  const handleCopy = () => {
    if (onCopyMessage) {
      onCopyMessage();
      toast.success('Copied to clipboard!', {
        description: 'Message text has been copied.',
      });
    }
  };

  if (mode === 'create') {
    // Editor mode: Show variable list
    return (
      <div className="w-full h-full flex flex-col bg-muted/30 border-r border-border">
        <div className="px-4 py-3 border-b border-border bg-background">
          <h2 className="text-sm font-semibold text-foreground">Variables</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Click to insert into template</p>
        </div>
        <VariableList
          variables={availableVariables}
          onInsertVariable={onInsertVariable}
        />
      </div>
    );
  }

  // Compose mode: Show form fields
  return (
    <div className="w-full h-full flex flex-col bg-background border-r border-border">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Fill Message Details</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Complete fields to compose message</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
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
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2 bg-background">
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-primary text-white hover:bg-primary/90 rounded-md transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
        >
          <Copy className="w-4 h-4" />
          Copy Message
        </button>
        {onUpdateTemplate && (
          <button
            onClick={() => onUpdateTemplate(renderedText)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-foreground/80 bg-background hover:bg-muted/30 border border-border rounded-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Update Template
          </button>
        )}
      </div>
    </div>
  );
}
