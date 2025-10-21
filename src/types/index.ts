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

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  content: EditorState;
  tags: string[]; // Array of tag IDs
  createdAt: number;
  updatedAt: number;
  isStarred?: boolean;
  lastUsedAt?: number;
  useCount?: number;
}
