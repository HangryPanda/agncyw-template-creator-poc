import { useState, useMemo } from 'react';
import { Template, Tag } from '@/types';
import React from 'react';

interface EnhancedTemplateSidebarProps {
  templates: Template[];
  tags: Tag[];
  selectedTemplateId: string | null;
  onSelectTemplate: (templateId: string) => void;
  onNewTemplate: () => void;
  onDeleteTemplate: (templateId: string) => void;
  onToggleStar: (templateId: string) => void;
  onManageTags: () => void;
}

export default function EnhancedTemplateSidebar({
  templates,
  tags,
  selectedTemplateId,
  onSelectTemplate,
  onNewTemplate,
  onDeleteTemplate,
  onToggleStar,
  onManageTags,
}: EnhancedTemplateSidebarProps): JSX.Element {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['starred', 'recent', 'untagged'])
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleSection = (sectionId: string): void => {
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

  // Get recently used templates (last 5 used templates)
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

  const renderTemplate = (template: Template, showStar: boolean = true): JSX.Element => (
    <div
      key={template.id}
      style={{
        ...templateItemStyle,
        ...(selectedTemplateId === template.id ? templateItemSelectedStyle : {}),
      }}
      onClick={() => onSelectTemplate(template.id)}
    >
      <div style={templateHeaderStyle}>
        <div style={templateNameStyle}>
          <span style={templateTypeIconStyle}>{template.type === 'email' ? '✉️' : '💬'}</span>
          <span>{template.name}</span>
        </div>
        {showStar && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(template.id);
            }}
            style={starButtonStyle}
            title={template.isStarred ? 'Remove from favorites' : 'Add to favorites'}
          >
            {template.isStarred ? '⭐' : '☆'}
          </button>
        )}
      </div>
      <div style={templateMetaStyle}>
        <span>{formatDate(template.updatedAt)}</span>
        {template.useCount && template.useCount > 0 && (
          <span style={useCountStyle}>Used {template.useCount}x</span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Delete "${template.name}"?`)) {
              onDeleteTemplate(template.id);
            }
          }}
          style={deleteButtonStyle}
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
  ): JSX.Element | null => {
    if (templates.length === 0 && searchQuery === '') return null;

    return (
      <div key={id} style={sectionStyle}>
        <div
          style={sectionHeaderStyle}
          onClick={() => toggleSection(id)}
        >
          <span style={sectionTitleStyle}>
            <span style={sectionIconStyle}>{icon}</span>
            {title}
            <span style={countBadgeStyle}>{templates.length}</span>
          </span>
          <span style={chevronStyle}>
            {expandedSections.has(id) ? '▼' : '▶'}
          </span>
        </div>
        {expandedSections.has(id) && (
          <div style={sectionContentStyle}>
            {templates.length === 0 ? (
              <div style={emptyStateStyle}>No templates found</div>
            ) : (
              templates.map((template) => renderTemplate(template, showStar))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={sidebarStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Templates</h2>
        <button onClick={onNewTemplate} style={newButtonStyle} title="Create new template">
          + New
        </button>
      </div>

      <div style={searchContainerStyle}>
        <input
          type="text"
          placeholder="🔍 Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      <div style={scrollContainerStyle}>
        {/* Starred/Favorites Section */}
        {renderSection('starred', 'Favorites', starredTemplates, '⭐', false)}

        {/* Recently Used Section */}
        {renderSection('recent', 'Recently Used', recentTemplates, '🕐', true)}

        {/* Tags Sections */}
        {tags.map((tag) => {
          const tagTemplates = templatesByTag.get(tag.id) || [];
          return renderSection(
            tag.id,
            tag.name,
            tagTemplates,
            '🏷️',
            true
          );
        })}

        {/* Untagged Section */}
        {renderSection(
          'untagged',
          'Untagged',
          templatesByTag.get('untagged') || [],
          '📄',
          true
        )}

        <div style={footerStyle}>
          <button onClick={onManageTags} style={manageTagsButtonStyle}>
            Manage Tags
          </button>
        </div>
      </div>
    </div>
  );
}

// Enhanced Styles with Design System
const sidebarStyle: React.CSSProperties = {
  width: '320px',
  height: '100vh',
  backgroundColor: 'var(--color-white)',
  borderRight: '1px solid var(--color-border)',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: 'var(--shadow-sm)',
};

const headerStyle: React.CSSProperties = {
  padding: 'var(--spacing-4)',
  borderBottom: '1px solid var(--color-border)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'var(--color-surface)',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'var(--text-xl)',
  fontWeight: 'var(--font-bold)',
  color: 'var(--color-text-primary)',
  margin: 0,
};

const newButtonStyle: React.CSSProperties = {
  padding: 'var(--spacing-2) var(--spacing-3)',
  backgroundColor: 'var(--color-primary)',
  color: 'white',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-semibold)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
};

const searchContainerStyle: React.CSSProperties = {
  padding: 'var(--spacing-3)',
  borderBottom: '1px solid var(--color-border)',
};

const searchInputStyle: React.CSSProperties = {
  width: '100%',
  padding: 'var(--spacing-2) var(--spacing-3)',
  fontSize: 'var(--text-sm)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--color-surface)',
  transition: 'all var(--transition-fast)',
};

const scrollContainerStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: 'var(--spacing-2)',
};

const sectionStyle: React.CSSProperties = {
  marginBottom: 'var(--spacing-2)',
};

const sectionHeaderStyle: React.CSSProperties = {
  padding: 'var(--spacing-2) var(--spacing-3)',
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  transition: 'all var(--transition-fast)',
  userSelect: 'none',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-semibold)',
  color: 'var(--color-text-secondary)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-2)',
};

const sectionIconStyle: React.CSSProperties = {
  fontSize: 'var(--text-base)',
};

const countBadgeStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-gray-200)',
  color: 'var(--color-text-secondary)',
  padding: '2px 6px',
  borderRadius: 'var(--radius-full)',
  fontSize: 'var(--text-xs)',
  fontWeight: 'var(--font-medium)',
};

const chevronStyle: React.CSSProperties = {
  fontSize: 'var(--text-xs)',
  color: 'var(--color-text-muted)',
  transition: 'transform var(--transition-fast)',
};

const sectionContentStyle: React.CSSProperties = {
  marginTop: 'var(--spacing-1)',
  paddingLeft: 'var(--spacing-2)',
};

const templateItemStyle: React.CSSProperties = {
  padding: 'var(--spacing-2) var(--spacing-3)',
  marginBottom: 'var(--spacing-1)',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
  border: '1px solid transparent',
};

const templateItemSelectedStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-primary-light)',
  borderColor: 'var(--color-primary)',
};

const templateHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 'var(--spacing-1)',
};

const templateNameStyle: React.CSSProperties = {
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-medium)',
  color: 'var(--color-text-primary)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-1)',
};

const templateTypeIconStyle: React.CSSProperties = {
  fontSize: 'var(--text-xs)',
};

const starButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: 'var(--text-base)',
  cursor: 'pointer',
  padding: 0,
  color: 'var(--color-warning)',
  transition: 'transform var(--transition-fast)',
};

const templateMetaStyle: React.CSSProperties = {
  fontSize: 'var(--text-xs)',
  color: 'var(--color-text-muted)',
  display: 'flex',
  gap: 'var(--spacing-2)',
  alignItems: 'center',
};

const useCountStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-success)',
  color: 'white',
  padding: '1px 6px',
  borderRadius: 'var(--radius-full)',
  fontSize: '10px',
  fontWeight: 'var(--font-medium)',
};

const deleteButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: 'var(--text-xs)',
  cursor: 'pointer',
  padding: 0,
  opacity: 0.5,
  transition: 'opacity var(--transition-fast)',
};

const emptyStateStyle: React.CSSProperties = {
  padding: 'var(--spacing-3)',
  fontSize: 'var(--text-xs)',
  color: 'var(--color-text-muted)',
  fontStyle: 'italic',
  textAlign: 'center',
};

const footerStyle: React.CSSProperties = {
  padding: 'var(--spacing-3)',
  borderTop: '1px solid var(--color-border)',
  marginTop: 'auto',
};

const manageTagsButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: 'var(--spacing-2)',
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text-secondary)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
};