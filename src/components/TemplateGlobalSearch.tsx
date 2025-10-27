import { useState, useMemo, useCallback } from 'react';
import { Template, EditorState } from '@/types';
import React from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/overlays/shadcn/Command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/overlays/shadcn/Popover';
import { FileText, Mail, MessageSquare, Search } from 'lucide-react';

interface GlobalSearchProps {
  templates: Template[];
  onSelectTemplate: (templateId: string) => void;
  onClose: () => void;
  onOpen: () => void;
  isOpen: boolean;
  trigger?: React.ReactNode;
}

interface SearchResult {
  template: Template;
  matchType: 'name' | 'content' | 'variable';
  matchContext?: string;
  relevanceScore: number;
}

export default function TemplateGlobalSearch({ templates, onSelectTemplate, onClose, onOpen, isOpen, trigger }: GlobalSearchProps): JSX.Element {
  const [query, setQuery] = useState<string>('');

  // Extract text content from editor state
  const getTextFromEditorState = useCallback((state: EditorState): string => {
    let text = '';
    const processNode = (node: any): void => {
      if (node.type === 'text') {
        text += node.text || '';
      } else if (node.type === 'template-variable') {
        text += `{{${node.variableName}}}`;
      } else if (node.children && Array.isArray(node.children)) {
        node.children.forEach(processNode);
      }
    };

    if (state.root && state.root.children) {
      state.root.children.forEach(processNode);
    }
    return text.toLowerCase();
  }, []);

  // Get variables used in a template
  const getVariablesFromTemplate = useCallback((state: EditorState): string[] => {
    const variables: string[] = [];
    const processNode = (node: any): void => {
      if (node.type === 'template-variable') {
        variables.push(node.variableName);
      } else if (node.children && Array.isArray(node.children)) {
        node.children.forEach(processNode);
      }
    };

    if (state.root && state.root.children) {
      state.root.children.forEach(processNode);
    }
    return [...new Set(variables)]; // Remove duplicates
  }, []);

  // Search through templates
  const searchResults = useMemo((): SearchResult[] => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    templates.forEach((template) => {
      let relevanceScore = 0;
      let matchType: 'name' | 'content' | 'variable' | null = null;
      let matchContext: string | undefined;

      // Check name match (highest priority)
      if (template.name.toLowerCase().includes(lowerQuery)) {
        relevanceScore = 100;
        matchType = 'name';

        // Exact match gets bonus
        if (template.name.toLowerCase() === lowerQuery) {
          relevanceScore = 150;
        }
      }

      // Check content match
      const content = getTextFromEditorState(template.content);
      const contentIndex = content.indexOf(lowerQuery);
      if (contentIndex !== -1) {
        const contextStart = Math.max(0, contentIndex - 30);
        const contextEnd = Math.min(content.length, contentIndex + lowerQuery.length + 30);
        matchContext = '...' + content.slice(contextStart, contextEnd) + '...';

        if (!matchType || relevanceScore < 50) {
          relevanceScore = 50;
          matchType = 'content';
        }
      }

      // Check variable match
      const variables = getVariablesFromTemplate(template.content);
      const matchingVariable = variables.find(v =>
        v.toLowerCase().includes(lowerQuery) ||
        lowerQuery.includes(v.toLowerCase())
      );

      if (matchingVariable) {
        if (!matchType || relevanceScore < 75) {
          relevanceScore = 75;
          matchType = 'variable';
          matchContext = `Uses variable: {{${matchingVariable}}}`;
        }
      }

      // Add to results if matched
      if (matchType) {
        results.push({
          template,
          matchType,
          matchContext,
          relevanceScore,
        });
      }
    });

    // Sort by relevance score and then by last updated
    return results.sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      return b.template.updatedAt - a.template.updatedAt;
    });
  }, [query, templates, getTextFromEditorState, getVariablesFromTemplate]);

  const handleSelectResult = (templateId: string): void => {
    onSelectTemplate(templateId);
    setQuery('');
    onClose();
  };

  const getMatchIcon = (type: 'name' | 'content' | 'variable'): JSX.Element => {
    switch (type) {
      case 'name': return <FileText className="h-4 w-4" />;
      case 'content': return <FileText className="h-4 w-4" />;
      case 'variable': return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={(open) => open ? onOpen() : onClose()}>
      <PopoverTrigger asChild>
        {trigger || (
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
            <Search className="w-4 h-4" />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border border-border">⌘K</kbd>
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[600px]" align="start">
        <Command>
          <CommandInput
            placeholder="Search templates, content, or variables..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No templates found matching "{query}"</CommandEmpty>
            {searchResults.length > 0 && (
              <CommandGroup heading="Templates">
                {searchResults.slice(0, 10).map((result) => (
                  <CommandItem
                    key={result.template.id}
                    value={result.template.id}
                    onSelect={() => handleSelectResult(result.template.id)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      {getMatchIcon(result.matchType)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{result.template.name}</span>
                          {result.template.type === 'email' ? (
                            <Mail className="h-3 w-3 text-muted-foreground" />
                          ) : (
                            <MessageSquare className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        {result.matchContext && (
                          <div className="text-xs text-muted-foreground truncate">
                            {result.matchContext}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Match in {result.matchType} • Score: {result.relevanceScore}
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
                {searchResults.length > 10 && (
                  <div className="px-2 py-1.5 text-xs text-center text-muted-foreground">
                    +{searchResults.length - 10} more results
                  </div>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}