import { DecoratorNode, LexicalNode, NodeKey } from 'lexical';
import { SerializedTemplateVariableNode } from '@/types';
import { useVariableValues } from '@/context/VariableValuesContext';
import { useState, useRef, useEffect } from 'react';

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

interface TemplateVariableComponentProps {
  variableName: string;
}

function TemplateVariableComponent({ variableName }: TemplateVariableComponentProps): JSX.Element {
  const { values, mode, setValue, isVariableFilled, getFirstUnfilledVariable } = useVariableValues();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [inputWidth, setInputWidth] = useState<number | undefined>(undefined);
  const [minWidth, setMinWidth] = useState<number | undefined>(undefined);
  const editableRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  // Determine if this is the first unfilled variable
  const firstUnfilled = getFirstUnfilledVariable();
  const isFirstUnfilled = mode === 'use' && !isVariableFilled(variableName) && firstUnfilled === variableName;

  // In Compose mode, show the filled value if it exists
  const displayValue = mode === 'use' && values[variableName]
    ? values[variableName]
    : variableName;

  // Measure text width for smooth transitions
  useEffect(() => {
    if (measureRef.current) {
      const width = measureRef.current.offsetWidth;
      setInputWidth(width || undefined);
    }
  }, [editValue, displayValue]);

  // Auto-focus when editing starts
  useEffect(() => {
    if (isEditing && editableRef.current) {
      editableRef.current.focus();
      // Select all text in contenteditable
      const range = document.createRange();
      range.selectNodeContents(editableRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  // Handle click to start editing (only in Compose mode)
  const handleClick = () => {
    if (mode === 'use' && !isEditing) {
      // Measure the full display width WITH brackets before entering edit mode
      if (wrapperRef.current) {
        const fullWidth = wrapperRef.current.offsetWidth;
        setMinWidth(fullWidth);
      }
      setEditValue(values[variableName] || '');
      setIsEditing(true);
    }
  };

  // Save value and exit editing
  const handleSave = () => {
    // Get text content from contenteditable
    const value = editableRef.current?.textContent || '';
    setValue(variableName, value);
    setIsEditing(false);
    setMinWidth(undefined); // Clear minimum width
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setEditValue('');
    setMinWidth(undefined); // Clear minimum width
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
      // Focus will be handled by tab navigation in TemplateEditor
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  // Handle input changes for contenteditable
  const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
    const value = e.currentTarget.textContent || '';
    setEditValue(value);
  };

  // Determine CSS classes based on state
  const getWrapperClassName = () => {
    const classes = ['template-variable-wrapper'];

    if (isEditing) {
      classes.push('editing');
    }

    if (mode === 'use') {
      classes.push('template-variable-editable');

      if (isVariableFilled(variableName)) {
        classes.push('template-variable-filled');
      } else if (isFirstUnfilled) {
        classes.push('template-variable-unfilled-first');
      } else {
        classes.push('template-variable-unfilled');
      }
    }

    return classes.join(' ');
  };

  // Stable wrapper with smooth transitions - wrapper NEVER changes, only content inside
  return (
    <span
      ref={wrapperRef}
      contentEditable={false}
      onClick={handleClick}
      className={getWrapperClassName()}
      data-variable-name={variableName}
      data-mode={mode}
      tabIndex={mode === 'use' && !isEditing ? 0 : -1}
    >
      {!isEditing && (
        <>
          <span className="template-variable-bracket">{'{'}</span>
          <span className="template-variable-bracket">{'{'}</span>
        </>
      )}
      <span
        className="template-variable-content"
        style={{
          width: inputWidth ? `${inputWidth}px` : undefined,
          minWidth: isEditing && minWidth ? `${minWidth}px` : undefined
        }}
      >
        {isEditing ? (
          /*
           * IMPORTANT: We use contentEditable span instead of <input> or <textarea>
           *
           * Why? Password managers (LastPass, 1Password, Bitwarden, etc.) aggressively
           * inject icons and functionality into ALL <input> and <textarea> elements,
           * even when using data-lpignore, autocomplete="off", and readonly tricks.
           *
           * Password managers ONLY target input/textarea elements and completely ignore
           * contentEditable elements since they're not traditional form fields.
           *
           * This provides identical single-line text editing functionality without
           * any password manager interference.
           */
          <span
            ref={editableRef}
            contentEditable={true}
            onInput={handleInput}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="template-variable-input"
            data-variable-name={variableName}
            suppressContentEditableWarning={true}
          >
            {editValue}
          </span>
        ) : (
          <span className="template-variable-display">{displayValue}</span>
        )}
      </span>
      {!isEditing && (
        <>
          <span className="template-variable-bracket">{'}'}</span>
          <span className="template-variable-bracket">{'}'}</span>
        </>
      )}

      {/* Hidden measurement element */}
      <span
        ref={measureRef}
        className="template-variable-measure"
        aria-hidden="true"
      >
        {isEditing ? editValue || '\u00A0' : displayValue}
      </span>
    </span>
  );
}

export function $createTemplateVariableNode(variableName: string): TemplateVariableNode {
  return new TemplateVariableNode(variableName);
}

export function $isTemplateVariableNode(node: LexicalNode | null | undefined): node is TemplateVariableNode {
  return node instanceof TemplateVariableNode;
}
