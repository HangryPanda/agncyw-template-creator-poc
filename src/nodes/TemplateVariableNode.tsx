import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from 'lexical';
import { SerializedTemplateVariableNode } from '../types';

export class TemplateVariableNode extends DecoratorNode<JSX.Element> {
  __variableName: string;

  static getType(): string {
    return 'template-variable';
  }

  static clone(node: TemplateVariableNode): TemplateVariableNode {
    return new TemplateVariableNode(node.__variableName, node.__key);
  }

  constructor(variableName: string, key?: NodeKey) {
    super(key);
    this.__variableName = variableName;
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span');
    span.className = 'template-variable';
    span.style.cssText = `
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      display: inline-block;
      margin: 0 2px;
      border: 1px solid #90caf9;
    `;
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return <TemplateVariableComponent variableName={this.__variableName} />;
  }

  getVariableName(): string {
    return this.__variableName;
  }

  exportJSON(): SerializedTemplateVariableNode {
    return {
      variableName: this.__variableName,
      type: 'template-variable',
      version: 1,
    };
  }

  static importJSON(serializedNode: SerializedTemplateVariableNode): TemplateVariableNode {
    return $createTemplateVariableNode(serializedNode.variableName);
  }

  isInline(): true {
    return true;
  }
}

interface TemplateVariableComponentProps {
  variableName: string;
}

function TemplateVariableComponent({ variableName }: TemplateVariableComponentProps): JSX.Element {
  return <span contentEditable={false}>{'{{' + variableName + '}}'}</span>;
}

export function $createTemplateVariableNode(variableName: string): TemplateVariableNode {
  return new TemplateVariableNode(variableName);
}

export function $isTemplateVariableNode(node: LexicalNode | null | undefined): node is TemplateVariableNode {
  return node instanceof TemplateVariableNode;
}
