import { useState, useMemo } from 'react';
import { Template, Tag } from '@/types';

interface ModernTemplateSidebarProps {
  templates: Template[];
  tags: Tag[];
  selectedTemplateId: string | null;
  onSelectTemplate: (templateId: string) => void;
  onNewTemplate: () => void;
  onDeleteTemplate: (templateId: string) => void;
  onToggleStar: (templateId: string) => void;
  onManageTags: () => void;
  openTabIds?: string[];
}

export default function ModernTemplateSidebar({
  templates,
  tags,
  selectedTemplateId,
  onSelectTemplate,
  onNewTemplate,
  onDeleteTemplate,
  onToggleStar,
  onManageTags,
  openTabIds = [],
}: ModernTemplateSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['starred', 'recent', 'untagged'])
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Filter templates by search query
  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get starred templates
  const starredTemplates = useMemo(
    () => filteredTemplates.filter((t) => t.isStarred).sort((a, b) => b.updatedAt - a.updatedAt),
    [filteredTemplates]
  );

  // Get recently used templates
  const recentTemplates = useMemo(
    () =>
      filteredTemplates
        .filter((t) => t.lastUsedAt && !t.isStarred)
        .sort((a, b) => (b.lastUsedAt || 0) - (a.lastUsedAt || 0))
        .slice(0, 5),
    [filteredTemplates]
  );

  // Group remaining templates by tags
  const templatesByTag = useMemo(() => {
    const map = new Map<string, Template[]>();
    map.set('untagged', []);
    tags.forEach((tag) => map.set(tag.id, []));

    filteredTemplates
      .filter((t) => !t.isStarred && (!t.lastUsedAt || !recentTemplates.includes(t)))
      .forEach((template) => {
        if (template.tags.length === 0) {
          map.get('untagged')?.push(template);
        } else {
          template.tags.forEach((tagId) => {
            map.get(tagId)?.push(template);
          });
        }
      });

    return map;
  }, [filteredTemplates, tags, recentTemplates]);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderTemplate = (template: Template, showStar: boolean = true) => {
    const isOpen = openTabIds.includes(template.id);
    const isSelected = selectedTemplateId === template.id;

    return (
      <div
        key={template.id}
        onClick={() => onSelectTemplate(template.id)}
        className={`
          group relative cursor-pointer transition-colors duration-150
          ${isSelected
            ? 'bg-muted/40'
            : 'hover:bg-muted/20'
          }
        `}
        style={{
          borderLeft: isSelected ? '2px solid hsl(var(--primary))' : '2px solid transparent',
        }}
      >
        <div className="px-2 py-1 flex items-center gap-1.5 min-h-[26px]">
          {/* Open tab indicator - ultra minimal */}
          {isOpen && (
            <div
              className="w-1 h-1 rounded-full bg-primary flex-shrink-0"
              title="Open in tab"
            />
          )}

          {/* Template type icon - smaller */}
          <span className="text-[11px] leading-none flex-shrink-0 opacity-60">
            {template.type === 'email' ? '✉' : '💬'}
          </span>

          {/* Template name - primary content */}
          <span
            className={`
              text-xs leading-tight truncate flex-1 min-w-0
              ${isSelected ? 'font-medium text-foreground' : 'text-foreground/80'}
            `}
          >
            {template.name}
          </span>

          {/* Metadata and actions - single line, compact */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Use count badge - only show if > 0 */}
            {template.useCount && template.useCount > 0 && (
              <span className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-[10px] leading-none font-medium">
                {template.useCount}x
              </span>
            )}

            {/* Updated time - ultra compact */}
            <span className="text-[10px] text-muted-foreground/60 leading-none whitespace-nowrap">
              {formatDate(template.updatedAt)}
            </span>

            {/* Star button - show on hover or if starred */}
            {showStar && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar(template.id);
                }}
                className={`
                  text-xs leading-none p-0.5 rounded transition-all duration-150
                  ${template.isStarred
                    ? 'opacity-100 hover:bg-brand-orange/20'
                    : 'opacity-0 group-hover:opacity-60 hover:opacity-100 hover:bg-muted'
                  }
                `}
                title={template.isStarred ? 'Remove from favorites' : 'Add to favorites'}
              >
                {template.isStarred ? '★' : '☆'}
              </button>
            )}

            {/* Delete button - only show on hover */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete "${template.name}"?`)) {
                  onDeleteTemplate(template.id);
                }
              }}
              className="
                opacity-0 group-hover:opacity-60 hover:opacity-100
                transition-all duration-150 text-[11px] leading-none p-0.5 rounded
                hover:bg-destructive/20 hover:text-destructive
              "
              title="Delete template"
            >
              🗑
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (
    id: string,
    title: string,
    templates: Template[],
    icon: string,
    showStar: boolean = true
  ) => {
    if (templates.length === 0 && searchQuery === '') return null;

    const isExpanded = expandedSections.has(id);

    return (
      <div key={id} className="mb-1">
        {/* Divider above section header */}
        <div className="border-t border-border/50 my-1" />

        <div
          onClick={() => toggleSection(id)}
          className="
            flex items-center justify-between px-2 py-1
            hover:bg-muted/30 cursor-pointer transition-colors duration-150
            select-none group/section
          "
        >
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
            <span
              className="text-[9px] transition-transform duration-150 leading-none"
              style={{
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
              }}
            >
              ▶
            </span>
            <span className="text-[10px] leading-none">{icon}</span>
            <span className="leading-none">{title}</span>
            <span className="px-1 py-0.5 bg-muted/50 text-muted-foreground rounded text-[9px] leading-none font-medium">
              {templates.length}
            </span>
          </div>
        </div>

        {isExpanded && (
          <div className="animate-slide-in">
            {templates.length === 0 ? (
              <div className="px-2 py-2 text-[11px] text-muted-foreground/50 italic text-center">
                No templates found
              </div>
            ) : (
              templates.map((template) => renderTemplate(template, showStar))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-background flex flex-col">
      {/* Header - Ultra compact */}
      <div className="px-3 py-2 bg-background border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-foreground">Templates</h2>
          <button
            onClick={onNewTemplate}
            className="
              px-2 py-1 bg-primary text-primary-foreground rounded
              text-[11px] font-medium hover:bg-primary/90
              transition-all duration-150 hover:shadow-sm active:scale-95
            "
            title="Create new template"
          >
            + New
          </button>
        </div>

        {/* Search - compact */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full px-2 py-1 text-xs border border-border rounded
              bg-background placeholder:text-muted-foreground/50
              focus:outline-none focus:ring-1 focus:ring-ring
              transition-all duration-150
            "
          />
        </div>
      </div>

      {/* Scrollable Content - Dense list */}
      <div className="flex-1 overflow-y-auto py-1">
        {/* Starred Section */}
        {renderSection('starred', 'Favorites', starredTemplates, '⭐', true)}

        {/* Recently Used Section */}
        {renderSection('recent', 'Recent', recentTemplates, '🕐', true)}

        {/* Tags Sections */}
        {tags.map((tag) => {
          const tagTemplates = templatesByTag.get(tag.id) || [];
          return renderSection(tag.id, tag.name, tagTemplates, '🏷', true);
        })}

        {/* Untagged Section */}
        {renderSection(
          'untagged',
          'Untagged',
          templatesByTag.get('untagged') || [],
          '📄',
          true
        )}
      </div>

      {/* Footer - compact */}
      <div className="px-3 py-2 border-t border-border bg-background">
        <button
          onClick={onManageTags}
          className="
            w-full px-2 py-1.5 bg-background hover:bg-muted
            border border-border rounded text-[11px] font-medium
            text-foreground/70 transition-all duration-150
            hover:text-foreground
          "
        >
          ⚙ Manage Tags
        </button>
      </div>
    </div>
  );
}
