export interface TemplateVariable {
  name: string;
  label: string;
  description: string;
  example: string;
}

export interface SerializedTemplateVariableNode {
  variableName: string;
  type: 'template-variable';
  version: number;
}

export interface EditorState {
  root: {
    children: any[];
    direction: string;
    format: string;
    indent: number;
    type: string;
    version: number;
  };
}
