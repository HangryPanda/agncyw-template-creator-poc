import { DecoratorNode, LexicalNode, NodeKey } from 'lexical';
import { SerializedTemplateVariableNode } from '@/types';
import { TemplateVariableComponent } from './TemplateVariableComponent';

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
    // Minimal wrapper - all styling handled by the React component
    span.className = 'inline';
    span.setAttribute('data-variable-name', this.__variableName);
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

  canBeEmpty(): false {
    return false;
  }

  isIsolated(): false {
    return false;
  }
}

export function $createTemplateVariableNode(variableName: string): TemplateVariableNode {
  return new TemplateVariableNode(variableName);
}

export function $isTemplateVariableNode(node: LexicalNode | null | undefined): node is TemplateVariableNode {
  return node instanceof TemplateVariableNode;
}
