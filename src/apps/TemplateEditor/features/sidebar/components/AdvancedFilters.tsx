import { useState, useMemo } from 'react';
import { Template, EditorState, TemplateVariable } from '@/types';
import React from 'react';

interface AdvancedFiltersProps {
  templates: Template[];
  availableVariables: TemplateVariable[];
  onFilterChange: (filteredTemplates: Template[]) => void;
}

interface FilterCriteria {
  dateRange: {
    start: string;
    end: string;
    type: 'created' | 'updated' | 'used';
  };
  variables: string[];
  templateType: 'all' | 'email' | 'sms';
  starred: 'all' | 'starred' | 'not-starred';
}

export default function AdvancedFilters({
  templates,
  availableVariables,
  onFilterChange,
}: AdvancedFiltersProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterCriteria>({
    dateRange: {
      start: '',
      end: '',
      type: 'updated',
    },
    variables: [],
    templateType: 'all',
    starred: 'all',
  });

  // Get variables from a template
  const getVariablesFromTemplate = (state: EditorState): string[] => {
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
    return [...new Set(variables)];
  };

  // Apply filters to templates
  const filteredTemplates = useMemo(() => {
    let result = [...templates];

    // Filter by date range
    if (filters.dateRange.start || filters.dateRange.end) {
      const startDate = filters.dateRange.start
        ? new Date(filters.dateRange.start).getTime()
        : 0;
      const endDate = filters.dateRange.end
        ? new Date(filters.dateRange.end).getTime() + 86400000 // Add 1 day to include the end date
        : Date.now();

      result = result.filter((template) => {
        let timestamp: number;
        switch (filters.dateRange.type) {
          case 'created':
            timestamp = template.createdAt;
            break;
          case 'used':
            timestamp = template.lastUsedAt || 0;
            break;
          default:
            timestamp = template.updatedAt;
        }
        return timestamp >= startDate && timestamp <= endDate;
      });
    }

    // Filter by variables
    if (filters.variables.length > 0) {
      result = result.filter((template) => {
        const templateVars = getVariablesFromTemplate(template.content);
        return filters.variables.every((v) => templateVars.includes(v));
      });
    }

    // Filter by template type
    if (filters.templateType !== 'all') {
      result = result.filter((template) => template.type === filters.templateType);
    }

    // Filter by starred status
    if (filters.starred !== 'all') {
      result = result.filter((template) =>
        filters.starred === 'starred' ? template.isStarred : !template.isStarred
      );
    }

    return result;
  }, [templates, filters]);

  // Update parent component when filters change
  useMemo(() => {
    onFilterChange(filteredTemplates);
  }, [filteredTemplates, onFilterChange]);

  const handleVariableToggle = (variable: string): void => {
    setFilters((prev) => ({
      ...prev,
      variables: prev.variables.includes(variable)
        ? prev.variables.filter((v) => v !== variable)
        : [...prev.variables, variable],
    }));
  };

  const clearFilters = (): void => {
    setFilters({
      dateRange: {
        start: '',
        end: '',
        type: 'updated',
      },
      variables: [],
      templateType: 'all',
      starred: 'all',
    });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.variables.length > 0) count++;
    if (filters.templateType !== 'all') count++;
    if (filters.starred !== 'all') count++;
    return count;
  }, [filters]);

  return (
    <div style={containerStyle}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...toggleButtonStyle,
          ...(activeFiltersCount > 0 ? activeToggleButtonStyle : {}),
        }}
      >
        <span>🔧 Advanced Filters</span>
        {activeFiltersCount > 0 && (
          <span style={badgeStyle}>{activeFiltersCount}</span>
        )}
        <span style={chevronStyle}>{isOpen ? '▼' : '▶'}</span>
      </button>

      {isOpen && (
        <div style={panelStyle}>
          {/* Date Range Filter */}
          <div style={filterSectionStyle}>
            <h4 style={filterTitleStyle}>Date Range</h4>
            <div style={dateTypeStyle}>
              <label style={radioLabelStyle}>
                <input
                  type="radio"
                  name="dateType"
                  value="created"
                  checked={filters.dateRange.type === 'created'}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, type: 'created' },
                    }))
                  }
                  style={radioStyle}
                />
                Created
              </label>
              <label style={radioLabelStyle}>
                <input
                  type="radio"
                  name="dateType"
                  value="updated"
                  checked={filters.dateRange.type === 'updated'}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, type: 'updated' },
                    }))
                  }
                  style={radioStyle}
                />
                Updated
              </label>
              <label style={radioLabelStyle}>
                <input
                  type="radio"
                  name="dateType"
                  value="used"
                  checked={filters.dateRange.type === 'used'}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, type: 'used' },
                    }))
                  }
                  style={radioStyle}
                />
                Last Used
              </label>
            </div>
            <div style={dateRangeStyle}>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value },
                  }))
                }
                style={dateInputStyle}
                placeholder="Start date"
              />
              <span style={dateToStyle}>to</span>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value },
                  }))
                }
                style={dateInputStyle}
                placeholder="End date"
              />
            </div>
          </div>

          {/* Variable Filter */}
          <div style={filterSectionStyle}>
            <h4 style={filterTitleStyle}>
              Variables Used ({filters.variables.length} selected)
            </h4>
            <div style={variableGridStyle}>
              {availableVariables.map((variable) => (
                <label
                  key={variable.name}
                  style={{
                    ...variableLabelStyle,
                    ...(filters.variables.includes(variable.name)
                      ? variableLabelActiveStyle
                      : {}),
                  }}
                >
                  <input
                    type="checkbox"
                    checked={filters.variables.includes(variable.name)}
                    onChange={() => handleVariableToggle(variable.name)}
                    style={checkboxStyle}
                  />
                  <span style={variableNameStyle}>{`{{${variable.name}}}`}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Template Type Filter */}
          <div style={filterSectionStyle}>
            <h4 style={filterTitleStyle}>Template Type</h4>
            <div style={buttonGroupStyle}>
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, templateType: 'all' }))
                }
                style={{
                  ...typeButtonStyle,
                  ...(filters.templateType === 'all' ? typeButtonActiveStyle : {}),
                }}
              >
                All
              </button>
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, templateType: 'email' }))
                }
                style={{
                  ...typeButtonStyle,
                  ...(filters.templateType === 'email' ? typeButtonActiveStyle : {}),
                }}
              >
                ✉️ Email
              </button>
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, templateType: 'sms' }))
                }
                style={{
                  ...typeButtonStyle,
                  ...(filters.templateType === 'sms' ? typeButtonActiveStyle : {}),
                }}
              >
                💬 SMS
              </button>
            </div>
          </div>

          {/* Starred Filter */}
          <div style={filterSectionStyle}>
            <h4 style={filterTitleStyle}>Favorites</h4>
            <div style={buttonGroupStyle}>
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, starred: 'all' }))
                }
                style={{
                  ...typeButtonStyle,
                  ...(filters.starred === 'all' ? typeButtonActiveStyle : {}),
                }}
              >
                All
              </button>
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, starred: 'starred' }))
                }
                style={{
                  ...typeButtonStyle,
                  ...(filters.starred === 'starred' ? typeButtonActiveStyle : {}),
                }}
              >
                ⭐ Starred
              </button>
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, starred: 'not-starred' }))
                }
                style={{
                  ...typeButtonStyle,
                  ...(filters.starred === 'not-starred' ? typeButtonActiveStyle : {}),
                }}
              >
                ☆ Not Starred
              </button>
            </div>
          </div>

          {/* Filter Actions */}
          <div style={actionsStyle}>
            <button onClick={clearFilters} style={clearButtonStyle}>
              Clear All Filters
            </button>
            <div style={resultTextStyle}>
              {filteredTemplates.length} of {templates.length} templates
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const containerStyle: React.CSSProperties = {
  marginBottom: 'var(--spacing-4)',
};

const toggleButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-2)',
  padding: 'var(--spacing-2) var(--spacing-4)',
  backgroundColor: 'var(--color-white)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-medium)',
  color: 'var(--color-text-secondary)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
  width: '100%',
};

const activeToggleButtonStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-primary-light)',
  borderColor: 'var(--color-primary)',
  color: 'var(--color-primary)',
};

const badgeStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-primary)',
  color: 'white',
  padding: '2px 6px',
  borderRadius: 'var(--radius-full)',
  fontSize: 'var(--text-xs)',
  fontWeight: 'var(--font-bold)',
  marginLeft: 'auto',
};

const chevronStyle: React.CSSProperties = {
  fontSize: 'var(--text-xs)',
  marginLeft: 'var(--spacing-2)',
};

const panelStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-white)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: 'var(--spacing-4)',
  marginTop: 'var(--spacing-2)',
  boxShadow: 'var(--shadow-sm)',
};

const filterSectionStyle: React.CSSProperties = {
  marginBottom: 'var(--spacing-4)',
};

const filterTitleStyle: React.CSSProperties = {
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-semibold)',
  color: 'var(--color-text-primary)',
  marginBottom: 'var(--spacing-2)',
};

const dateTypeStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-3)',
  marginBottom: 'var(--spacing-2)',
};

const radioLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-1)',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text-secondary)',
  cursor: 'pointer',
};

const radioStyle: React.CSSProperties = {
  cursor: 'pointer',
};

const dateRangeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-2)',
};

const dateInputStyle: React.CSSProperties = {
  padding: 'var(--spacing-2)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text-primary)',
  backgroundColor: 'var(--color-white)',
};

const dateToStyle: React.CSSProperties = {
  color: 'var(--color-text-muted)',
  fontSize: 'var(--text-sm)',
};

const variableGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: 'var(--spacing-2)',
};

const variableLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-1)',
  padding: 'var(--spacing-2)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-sm)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
};

const variableLabelActiveStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-primary-light)',
  borderColor: 'var(--color-primary)',
};

const checkboxStyle: React.CSSProperties = {
  cursor: 'pointer',
};

const variableNameStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--text-xs)',
  color: 'var(--color-primary)',
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-1)',
};

const typeButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: 'var(--spacing-2)',
  backgroundColor: 'var(--color-white)',
  border: '1px solid var(--color-border)',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text-secondary)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
};

const typeButtonActiveStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-primary)',
  borderColor: 'var(--color-primary)',
  color: 'white',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: 'var(--spacing-3)',
  borderTop: '1px solid var(--color-border)',
};

const clearButtonStyle: React.CSSProperties = {
  padding: 'var(--spacing-2) var(--spacing-3)',
  backgroundColor: 'var(--color-gray-100)',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text-secondary)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
};

const resultTextStyle: React.CSSProperties = {
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text-muted)',
};