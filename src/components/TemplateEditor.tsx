import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { TemplateVariableNode } from '../nodes/TemplateVariableNode';
import ToolbarPlugin from '../plugins/ToolbarPlugin';
import { TemplateVariable, EditorState } from '../types';
import { EditorState as LexicalEditorState } from 'lexical';
import React from 'react';

interface TemplateEditorProps {
  onChange?: (editorState: EditorState) => void;
  initialState?: string;
  availableVariables: TemplateVariable[];
}

export default function TemplateEditor({ 
  onChange, 
  initialState, 
  availableVariables 
}: TemplateEditorProps): JSX.Element {
  const initialConfig = {
    namespace: 'TemplateEditor',
    theme: {
      paragraph: 'editor-paragraph',
    },
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [TemplateVariableNode],
    editorState: initialState,
  };

  const handleChange = (editorState: LexicalEditorState): void => {
    editorState.read(() => {
      const json = editorState.toJSON() as EditorState;
      onChange?.(json);
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div style={editorContainerStyle}>
        <ToolbarPlugin availableVariables={availableVariables} />
        <div style={editorInnerStyle}>
          <RichTextPlugin
            contentEditable={<ContentEditable style={contentEditableStyle} />}
            placeholder={<div style={placeholderStyle}>Start typing your template...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <OnChangePlugin onChange={handleChange} />
        </div>
      </div>
    </LexicalComposer>
  );
}

const editorContainerStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const editorInnerStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: '200px',
};

const contentEditableStyle: React.CSSProperties = {
  minHeight: '200px',
  padding: '16px',
  outline: 'none',
  fontSize: '14px',
  lineHeight: '1.6',
};

const placeholderStyle: React.CSSProperties = {
  position: 'absolute',
  top: '16px',
  left: '16px',
  color: '#999',
  pointerEvents: 'none',
  fontSize: '14px',
};
