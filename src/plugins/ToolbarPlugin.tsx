import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $createTemplateVariableNode } from '../nodes/TemplateVariableNode';
import { TemplateVariable } from '../types';
import React from 'react';

interface ToolbarPluginProps {
  availableVariables: TemplateVariable[];
}

export default function ToolbarPlugin({ availableVariables }: ToolbarPluginProps): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const insertVariable = (variableName: string): void => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const variableNode = $createTemplateVariableNode(variableName);
        selection.insertNodes([variableNode]);
      }
    });
  };

  return (
    <div style={toolbarStyle}>
      <div style={{ marginBottom: '8px', fontWeight: '600', color: '#333' }}>
        Insert Variable:
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {availableVariables.map((variable) => (
          <button
            key={variable.name}
            onClick={() => insertVariable(variable.name)}
            style={buttonStyle}
            title={variable.description}
          >
            {variable.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const toolbarStyle: React.CSSProperties = {
  padding: '12px',
  borderBottom: '1px solid #ddd',
  backgroundColor: '#f9f9f9',
};

const buttonStyle: React.CSSProperties = {
  padding: '6px 12px',
  backgroundColor: '#1976d2',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '500',
  transition: 'background-color 0.2s',
};
