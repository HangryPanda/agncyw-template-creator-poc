import { useState } from 'react';
import { TemplateVariable, EditorState } from '../types';
import React from 'react';

interface TemplatePreviewProps {
  templateState: EditorState | null;
  availableVariables: TemplateVariable[];
}

interface VariableValues {
  [key: string]: string;
}

export default function TemplatePreview({ 
  templateState, 
  availableVariables 
}: TemplatePreviewProps): JSX.Element {
  const [values, setValues] = useState<VariableValues>(() => {
    const initial: VariableValues = {};
    availableVariables.forEach(v => {
      initial[v.name] = v.example || '';
    });
    return initial;
  });

  const renderTemplate = (): string => {
    if (!templateState) return '';
    
    let output = '';
    
    const processNode = (node: any): string => {
      if (node.type === 'template-variable') {
        return values[node.variableName] || `{{${node.variableName}}}`;
      } else if (node.type === 'text') {
        return node.text;
      } else if (node.children) {
        return node.children.map(processNode).join('');
      } else if (node.type === 'paragraph') {
        return (node.children?.map(processNode).join('') || '') + '\n';
      }
      return '';
    };

    if (templateState.root?.children) {
      output = templateState.root.children.map(processNode).join('');
    }

    return output;
  };

  const handleCopy = (): void => {
    const text = renderTemplate();
    navigator.clipboard.writeText(text);
    alert('Template copied to clipboard!');
  };

  const handleInputChange = (variableName: string, value: string): void => {
    setValues({ ...values, [variableName]: value });
  };

  return (
    <div style={containerStyle}>
      <h3 style={headingStyle}>Fill in Values</h3>
      <div style={fieldsContainerStyle}>
        {availableVariables.map((variable) => (
          <div key={variable.name} style={fieldStyle}>
            <label style={labelStyle}>
              {variable.label}
              {variable.description && (
                <span style={descriptionStyle}> - {variable.description}</span>
              )}
            </label>
            <input
              type="text"
              value={values[variable.name]}
              onChange={(e) => handleInputChange(variable.name, e.target.value)}
              style={inputStyle}
              placeholder={variable.example}
            />
          </div>
        ))}
      </div>
      
      <h3 style={headingStyle}>Preview</h3>
      <div style={previewStyle}>
        {renderTemplate()}
      </div>
      
      <button onClick={handleCopy} style={copyButtonStyle}>
        Copy to Clipboard
      </button>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
};

const headingStyle: React.CSSProperties = {
  marginTop: '0',
  marginBottom: '16px',
  fontSize: '18px',
  color: '#333',
};

const fieldsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '24px',
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#333',
};

const descriptionStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 'normal',
  color: '#666',
};

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
};

const previewStyle: React.CSSProperties = {
  padding: '16px',
  backgroundColor: 'white',
  border: '1px solid #ddd',
  borderRadius: '4px',
  minHeight: '100px',
  whiteSpace: 'pre-wrap',
  fontSize: '14px',
  lineHeight: '1.6',
  marginBottom: '16px',
};

const copyButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#2e7d32',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
};
