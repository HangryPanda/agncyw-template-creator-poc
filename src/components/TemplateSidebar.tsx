import { useState } from 'react';
import { Template, Tag } from '@/types';
import React from 'react';

interface TemplateSidebarProps {
  templates: Template[];
  tags: Tag[];
  selectedTemplateId: string | null;
  onSelectTemplate: (templateId: string) => void;
  onNewTemplate: () => void;
  onDeleteTemplate: (templateId: string) => void;
  onManageTags: () => void;
}

export default function TemplateSidebar({
  templates,
  tags,
  selectedTemplateId,
  onSelectTemplate,
  onNewTemplate,
  onDeleteTemplate,
  onManageTags,
}: TemplateSidebarProps): JSX.Element {
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set(['untagged']));
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleTag = (tagId: string): void => {
    const newExpanded = new Set(expandedTags);
    if (newExpanded.has(tagId)) {
      newExpanded.delete(tagId);
    } else {
      newExpanded.add(tagId);
    }
    setExpandedTags(newExpanded);
  };

  // Filter templates by search query
  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group templates by tags
  const templatesByTag = new Map<string, Template[]>();

  // Initialize with untagged group
  templatesByTag.set('untagged', []);

  // Initialize all tag groups
  tags.forEach((tag) => {
    templatesByTag.set(tag.id, []);
  });

  // Categorize templates
  filteredTemplates.forEach((template) => {
    if (template.tags.length === 0) {
      templatesByTag.get('untagged')?.push(template);
    } else {
      template.tags.forEach((tagId) => {
        const tagTemplates = templatesByTag.get(tagId);
        if (tagTemplates) {
          tagTemplates.push(template);
        }
      });
    }
  });

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
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      <div style={actionsStyle}>
        <button onClick={onManageTags} style={manageTagsButtonStyle}>
          Manage Tags
        </button>
      </div>

      <div style={treeContainerStyle}>
        {/* Untagged templates */}
        {(templatesByTag.get('untagged')?.length ?? 0) > 0 && (
          <div style={tagGroupStyle}>
            <button
              onClick={() => toggleTag('untagged')}
              style={tagHeaderStyle}
            >
              <span style={expandIconStyle}>
                {expandedTags.has('untagged') ? '▼' : '▶'}
              </span>
              <span style={tagNameStyle}>Untagged</span>
              <span style={countBadgeStyle}>
                {templatesByTag.get('untagged')?.length ?? 0}
              </span>
            </button>
            {expandedTags.has('untagged') && (
              <div style={templatesListStyle}>
                {templatesByTag.get('untagged')?.map((template) => (
                  <div
                    key={template.id}
                    style={{
                      ...templateItemStyle,
                      ...(selectedTemplateId === template.id
                        ? selectedTemplateStyle
                        : {}),
                    }}
                  >
                    <div
                      onClick={() => onSelectTemplate(template.id)}
                      style={templateContentStyle}
                    >
                      <div style={templateNameStyle}>
                        <span style={typeIconStyle}>
                          {template.type === 'email' ? '📧' : '💬'}
                        </span>
                        {template.name}
                      </div>
                      <div style={templateMetaStyle}>
                        {formatDate(template.updatedAt)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete template "${template.name}"?`)) {
                          onDeleteTemplate(template.id);
                        }
                      }}
                      style={deleteIconStyle}
                      title="Delete template"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tagged templates */}
        {tags.map((tag) => {
          const tagTemplates = templatesByTag.get(tag.id) ?? [];
          if (tagTemplates.length === 0) return null;

          return (
            <div key={tag.id} style={tagGroupStyle}>
              <button
                onClick={() => toggleTag(tag.id)}
                style={tagHeaderStyle}
              >
                <span style={expandIconStyle}>
                  {expandedTags.has(tag.id) ? '▼' : '▶'}
                </span>
                <span
                  style={{
                    ...tagColorDotStyle,
                    backgroundColor: tag.color,
                  }}
                />
                <span style={tagNameStyle}>{tag.name}</span>
                <span style={countBadgeStyle}>{tagTemplates.length}</span>
              </button>
              {expandedTags.has(tag.id) && (
                <div style={templatesListStyle}>
                  {tagTemplates.map((template) => (
                    <div
                      key={template.id}
                      style={{
                        ...templateItemStyle,
                        ...(selectedTemplateId === template.id
                          ? selectedTemplateStyle
                          : {}),
                      }}
                    >
                      <div
                        onClick={() => onSelectTemplate(template.id)}
                        style={templateContentStyle}
                      >
                        <div style={templateNameStyle}>
                          <span style={typeIconStyle}>
                            {template.type === 'email' ? '📧' : '💬'}
                          </span>
                          {template.name}
                        </div>
                        <div style={templateMetaStyle}>
                          {formatDate(template.updatedAt)}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete template "${template.name}"?`)) {
                            onDeleteTemplate(template.id);
                          }
                        }}
                        style={deleteIconStyle}
                        title="Delete template"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div style={emptyStateStyle}>
          <p>
            {searchQuery
              ? 'No templates found'
              : 'No templates yet. Click "+ New" to create your first template!'}
          </p>
        </div>
      )}
    </div>
  );
}

const sidebarStyle: React.CSSProperties = {
  width: '300px',
  height: '100vh',
  backgroundColor: 'hsl(var(--sidebar))',
  borderRight: '1px solid hsl(var(--sidebar-border))',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const headerStyle: React.CSSProperties = {
  padding: '16px',
  borderBottom: '1px solid hsl(var(--border))',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'hsl(var(--background))',
};

const titleStyle: React.CSSProperties = {
  margin: '0',
  fontSize: '20px',
  fontWeight: '600',
  color: 'hsl(var(--foreground))',
};

const newButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: 'hsl(var(--primary))',
  color: 'hsl(var(--primary-foreground))',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
};

const searchContainerStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid hsl(var(--border))',
  backgroundColor: 'hsl(var(--background))',
};

const searchInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid hsl(var(--border))',
  borderRadius: '4px',
  fontSize: '14px',
  boxSizing: 'border-box',
  backgroundColor: 'hsl(var(--input-bg))',
  color: 'hsl(var(--foreground))',
};

const actionsStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid hsl(var(--border))',
  backgroundColor: 'hsl(var(--background))',
};

const manageTagsButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  backgroundColor: 'hsl(var(--secondary))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '500',
  color: 'hsl(var(--secondary-foreground))',
};

const treeContainerStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '8px 0',
};

const tagGroupStyle: React.CSSProperties = {
  marginBottom: '4px',
};

const tagHeaderStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 16px',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: '500',
  color: 'hsl(var(--foreground))',
  textAlign: 'left',
};

const expandIconStyle: React.CSSProperties = {
  fontSize: '10px',
  color: 'hsl(var(--muted-foreground))',
  width: '12px',
};

const tagColorDotStyle: React.CSSProperties = {
  width: '10px',
  height: '10px',
  borderRadius: '50%',
};

const tagNameStyle: React.CSSProperties = {
  flex: 1,
};

const countBadgeStyle: React.CSSProperties = {
  backgroundColor: 'hsl(var(--muted))',
  color: 'hsl(var(--muted-foreground))',
  padding: '2px 8px',
  borderRadius: '10px',
  fontSize: '11px',
  fontWeight: '600',
};

const templatesListStyle: React.CSSProperties = {
  paddingLeft: '28px',
};

const templateItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px 8px 8px',
  marginBottom: '2px',
  cursor: 'pointer',
  borderRadius: '4px',
  transition: 'background-color 0.15s',
};

const selectedTemplateStyle: React.CSSProperties = {
  backgroundColor: 'hsl(var(--primary) / 0.1)',
  borderLeft: '3px solid hsl(var(--primary))',
};

const templateContentStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const templateNameStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '500',
  color: 'hsl(var(--foreground))',
  marginBottom: '2px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const typeIconStyle: React.CSSProperties = {
  fontSize: '14px',
};

const templateMetaStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'hsl(var(--muted-foreground))',
};

const deleteIconStyle: React.CSSProperties = {
  width: '20px',
  height: '20px',
  border: 'none',
  backgroundColor: 'transparent',
  color: 'hsl(var(--muted-foreground))',
  cursor: 'pointer',
  fontSize: '20px',
  lineHeight: '20px',
  padding: '0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const emptyStateStyle: React.CSSProperties = {
  padding: '24px 16px',
  textAlign: 'center',
  color: 'hsl(var(--muted-foreground))',
  fontSize: '13px',
};
