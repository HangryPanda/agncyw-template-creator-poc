import { useState, useRef, useEffect } from 'react';
import { useVariableValues } from '@/context/VariableValuesContext';
import styles from './TemplateVariable.module.css';

interface TemplateVariableComponentProps {
  variableName: string;
}

export function TemplateVariableComponent({ variableName }: TemplateVariableComponentProps): JSX.Element {
  const { values, mode, setValue, isVariableFilled, getFirstUnfilledVariable } = useVariableValues();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [inputWidth, setInputWidth] = useState<number | undefined>(undefined);
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
      // Use requestAnimationFrame to ensure measurement happens in sync with DOM paint
      requestAnimationFrame(() => {
        if (measureRef.current) {
          const width = measureRef.current.offsetWidth;
          setInputWidth(width || undefined);
        }
      });
    }
  }, [editValue, displayValue]);

  // Auto-focus when editing starts and set initial value
  useEffect(() => {
    if (isEditing && editableRef.current) {
      // Set the text content directly (not via React)
      editableRef.current.textContent = editValue;
      editableRef.current.focus();
      // Move cursor to end of text
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editableRef.current);
      range.collapse(false); // Collapse to end
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing, editValue]);

  // Handle click to start editing (only in Compose mode)
  const handleClick = () => {
    if (mode === 'use' && !isEditing) {
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
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setEditValue('');
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
    const classes = [styles.wrapper];

    if (isEditing) {
      classes.push(styles.editing);
      if (mode === 'use') {
        classes.push(styles.useModeEditing);
      }
    }

    if (mode === 'use') {
      classes.push(styles.useMode);
      classes.push(styles.editable);

      if (isVariableFilled(variableName)) {
        classes.push(styles.filled);
      } else if (isFirstUnfilled) {
        classes.push(styles.unfilledFirst);
        classes.push(styles.unfilledFirstUseMode);
      } else {
        classes.push(styles.unfilled);
        classes.push(styles.unfilledUseMode);
      }

      // Add hover state for use mode
      classes.push(styles.editableUseMode);
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
          <span className={styles.bracket}>{'{'}</span>
          <span className={styles.bracket}>{'{'}</span>
        </>
      )}
      <span
        className={styles.content}
        style={{
          width: inputWidth ? `${inputWidth}px` : undefined,
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
            className={styles.input}
            data-variable-name={variableName}
            suppressContentEditableWarning={true}
            style={{ direction: 'ltr', unicodeBidi: 'normal' }}
          >
            {editValue}
          </span>
        ) : (
          <span className={styles.display}>{displayValue}</span>
        )}
      </span>
      {!isEditing && (
        <>
          <span className={styles.bracket}>{'}'}</span>
          <span className={styles.bracket}>{'}'}</span>
        </>
      )}

      {/* Hidden measurement element */}
      <span
        ref={measureRef}
        className={styles.measure}
        aria-hidden="true"
      >
        {isEditing ? editValue || '\u00A0' : displayValue}
      </span>
    </span>
  );
}
