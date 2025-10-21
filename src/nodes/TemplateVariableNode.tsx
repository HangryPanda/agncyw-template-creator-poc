import { DecoratorNode, LexicalNode, NodeKey } from 'lexical';
import { SerializedTemplateVariableNode } from '@/types';

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
    span.className = 'inline-flex items-center px-2 py-0.5 mx-0.5 text-sm font-medium bg-primary/10 text-primary border border-primary/20 rounded-md cursor-pointer hover:bg-primary/20 transition-colors';
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
