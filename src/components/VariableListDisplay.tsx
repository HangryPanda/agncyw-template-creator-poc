import React from 'react';
import { TemplateVariable } from '@/types';
import { Hash } from 'lucide-react';

interface VariableListDisplayProps {
  variables: TemplateVariable[];
  mode: 'create' | 'use';
  values?: Record<string, string>;
}

const GROUP_LABELS: Record<string, string> = {
  customer: 'Customer Info',
  message: 'Message Details',
  agent: 'Agent Team Member',
  agency: 'Agency Details',
  custom: 'Custom Variables',
};

export function VariableListDisplay({ variables, mode, values = {} }: VariableListDisplayProps): JSX.Element {
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
    <div className="space-y-4">
      {groupedVariables.map(([groupKey, groupVars]) => (
        <div key={groupKey}>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            {GROUP_LABELS[groupKey] || groupKey}
          </h4>
          <div className="space-y-1.5">
            {groupVars.map(variable => (
              <div
                key={variable.name}
                className="px-2.5 py-2 rounded-md bg-muted/50 border border-border/50"
              >
                <div className="flex items-start gap-2">
                  <Hash className="w-3.5 h-3.5 text-muted-foreground/60 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground">
                      {variable.label}
                    </div>
                    {mode === 'use' && values[variable.name] && (
                      <div className="text-xs text-primary mt-1 truncate">
                        {values[variable.name]}
                      </div>
                    )}
                    {mode === 'create' && (
                      <div className="text-xs text-muted-foreground mt-0.5 font-mono">
                        {`{{${variable.name}}}`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
