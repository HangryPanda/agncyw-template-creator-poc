import React from 'react';
import { TemplateVariable } from '@/types';
import { Hash } from 'lucide-react';

interface VariableListProps {
  variables: TemplateVariable[];
  onInsertVariable: (variableName: string) => void;
}

const GROUP_LABELS: Record<string, string> = {
  customer: 'Customer Info',
  message: 'Message Details',
  agent: 'Agent Team Member',
  agency: 'Agency Details',
  custom: 'Custom Variables',
};

export function VariableList({ variables, onInsertVariable }: VariableListProps): JSX.Element {
  // Group variables
  const groupedVariables = React.useMemo(() => {
    const groups: Record<string, TemplateVariable[]> = {
      customer: [],
      message: [],
      agent: [],
      agency: [],
      custom: [],
    };

    variables.forEach(variable => {
      const group = variable.group || 'custom';
      if (groups[group]) {
        groups[group].push(variable);
      } else {
        groups.custom.push(variable);
      }
    });

    return Object.entries(groups).filter(([_, vars]) => vars.length > 0);
  }, [variables]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {groupedVariables.map(([groupKey, groupVars]) => (
          <div key={groupKey}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {GROUP_LABELS[groupKey] || groupKey}
            </h3>
            <div className="space-y-1">
              {groupVars.map(variable => (
                <button
                  key={variable.name}
                  onClick={() => onInsertVariable(variable.name)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors group"
                  title={variable.description}
                >
                  <div className="flex items-start gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground/60 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {variable.label}
                      </div>
                      {variable.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {variable.description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
