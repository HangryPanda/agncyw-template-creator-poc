/**
 * Variable Model
 *
 * Types for template variables and their serialization
 */

export interface TemplateVariable {
  name: string;
  label: string;
  description: string;
  example: string;
  group?: 'customer' | 'message' | 'agent' | 'agency' | 'custom';
}

export interface SerializedTemplateVariableNode {
  variableName: string;
  type: 'template-variable';
  version: number;
}
