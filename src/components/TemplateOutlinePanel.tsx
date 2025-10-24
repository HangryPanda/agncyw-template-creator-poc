import { Template, TemplateVariable } from '@/types';
import { useMemo } from 'react';

interface TemplateOutlinePanelProps {
  template: Template;
  allVariables: TemplateVariable[];
}

export default function TemplateOutlinePanel({
  template,
  allVariables,
}: TemplateOutlinePanelProps) {
  // Extract variables used in this template
  const usedVariables = useMemo(() => {
    const variableNames = new Set<string>();

    // Parse template content to find variables
    const parseNode = (node: any) => {
      if (!node) return;

      if (node.type === 'template-variable') {
        variableNames.add(node.variableName);
      }

      if (node.children) {
        node.children.forEach(parseNode);
      }
    };

    if (template.content?.root?.children) {
      template.content.root.children.forEach(parseNode);
    }

    // Map to full variable objects
    return Array.from(variableNames)
      .map((name) => allVariables.find((v) => v.name === name))
      .filter((v): v is TemplateVariable => v !== undefined);
  }, [template, allVariables]);

  const scrollToVariable = (variableName: string) => {
    // Find the first occurrence of the variable in the editor
    const elements = document.querySelectorAll(`[data-lexical-decorator="true"]`);
    for (const el of Array.from(elements)) {
      if (el.textContent?.includes(`{{${variableName}}}`)) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Briefly highlight the element
        el.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
        }, 2000);
        break;
      }
    }
  };

  return (
    <div className="h-full bg-background border-l border-border flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Outline</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Template Info */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Template Info
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium text-foreground">
                {template.type === 'email' ? 'Email' : 'SMS'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Variables:</span>
              <span className="font-medium text-foreground">{usedVariables.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Updated:</span>
              <span className="font-medium text-foreground text-xs">
                {new Date(template.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Variables Section */}
        {usedVariables.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Variables ({usedVariables.length})
            </h3>
            <div className="space-y-1">
              {usedVariables.map((variable) => (
                <button
                  key={variable.name}
                  onClick={() => scrollToVariable(variable.name)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-primary text-xs font-mono mt-0.5 group-hover:text-brand-purple transition-colors">
                      {'{{}}'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {variable.label}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {variable.name}
                      </div>
                      {variable.description && (
                        <div className="text-xs text-muted-foreground/70 mt-1">
                          {variable.description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {usedVariables.length === 0 && (
          <div className="text-center py-8">
            <div className="text-muted-foreground/50 text-sm">
              <div className="mb-2">📋</div>
              <div>No variables in this template</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Quick Actions
          </h3>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-accent/50 transition-colors text-sm text-foreground">
              <div className="flex items-center gap-2">
                <span>📋</span>
                <span>Copy Template</span>
              </div>
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-accent/50 transition-colors text-sm text-foreground">
              <div className="flex items-center gap-2">
                <span>📥</span>
                <span>Export</span>
              </div>
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-accent/50 transition-colors text-sm text-foreground">
              <div className="flex items-center gap-2">
                <span>🔗</span>
                <span>Share</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
