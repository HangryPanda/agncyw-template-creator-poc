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

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderTemplate = (template: Template, showStar: boolean = true) => (
    <div
      key={template.id}
      onClick={() => onSelectTemplate(template.id)}
      className={`group p-3 mb-1.5 rounded-lg cursor-pointer transition-all duration-200 border ${
        selectedTemplateId === template.id
          ? 'bg-primary/10 border-primary shadow-sm'
          : 'bg-background border-border hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm flex-shrink-0">
            {template.type === 'email' ? '✉️' : '💬'}
          </span>
          <span className="font-medium text-sm text-foreground/90 truncate">
            {template.name}
          </span>
        </div>
        {showStar && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(template.id);
            }}
            className="text-base hover:scale-110 transition-all duration-150 flex-shrink-0 p-1 rounded hover:bg-brand-orange/20"
            title={template.isStarred ? 'Remove from favorites' : 'Add to favorites'}
          >
            {template.isStarred ? '★' : '☆'}
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{formatDate(template.updatedAt)}</span>
        {template.useCount && template.useCount > 0 && (
          <span className="px-2 py-0.5 bg-accent/30 text-accent-foreground rounded-full font-medium">
            {template.useCount}x
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Delete "${template.name}"?`)) {
              onDeleteTemplate(template.id);
            }
          }}
          className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-150 text-base p-1 rounded hover:bg-destructive/20"
          title="Delete template"
        >
          🗑️
        </button>
      </div>
    </div>
  );

  const renderSection = (
    id: string,
    title: string,
    templates: Template[],
    icon: string,
    showStar: boolean = true
  ) => {
    if (templates.length === 0 && searchQuery === '') return null;

    return (
      <div key={id} className="mb-2">
        <div
          onClick={() => toggleSection(id)}
          className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors duration-150 select-none"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
            <span>{icon}</span>
            {title}
            <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs font-medium">
              {templates.length}
            </span>
          </span>
          <span className="text-xs text-muted-foreground transition-transform duration-150" style={{
            transform: expandedSections.has(id) ? 'rotate(90deg)' : 'rotate(0deg)'
          }}>
            ▶
          </span>
        </div>
        {expandedSections.has(id) && (
          <div className="mt-1.5 pl-2 animate-slide-in">
            {templates.length === 0 ? (
              <div className="p-3 text-xs text-muted-foreground/60 italic text-center">
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
      {/* Header - Darkest background */}
      <div className="p-4 bg-background border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">Templates</h2>
          <button
            onClick={onNewTemplate}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow active:scale-95"
            title="Create new template"
          >
            + New
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {/* Starred Section */}
        {renderSection('starred', 'Favorites', starredTemplates, '⭐', true)}

        {/* Recently Used Section */}
        {renderSection('recent', 'Recently Used', recentTemplates, '🕐', true)}

        {/* Tags Sections */}
        {tags.map((tag) => {
          const tagTemplates = templatesByTag.get(tag.id) || [];
          return renderSection(tag.id, tag.name, tagTemplates, '🏷️', true);
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

      {/* Footer */}
      <div className="p-3 border-t border-border bg-background">
        <button
          onClick={onManageTags}
          className="w-full px-4 py-2.5 bg-background hover:bg-muted border border-border rounded-lg text-sm font-medium text-foreground/80 transition-all duration-150 hover:shadow-sm"
        >
          ⚙️ Manage Tags
        </button>
      </div>
    </div>
  );
}
