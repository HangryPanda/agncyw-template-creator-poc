import { useState, useRef, useEffect } from 'react';

interface InlineTitleEditorProps {
  value: string;
  onChange: (value: string) => void;
  onEnterPress?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
}

export default function InlineTitleEditor({
  value,
  onChange,
  onEnterPress,
  autoFocus = false,
  placeholder = 'Untitled Template',
  className = ''
}: InlineTitleEditorProps): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when autoFocus prop is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setIsEditing(true);
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [autoFocus]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (!isEditing) {
      setEditValue(value);
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed) {
      onChange(trimmed);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
      // Call onEnterPress after a short delay to allow the save to complete
      setTimeout(() => {
        onEnterPress?.();
      }, 50);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`text-sm font-semibold text-foreground bg-background border border-primary rounded px-2 py-0.5 outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
        placeholder={placeholder}
      />
    );
  }

  return (
    <h1
      onClick={handleClick}
      className={`text-sm font-semibold text-foreground cursor-text hover:text-primary transition-colors ${className}`}
      title="Click to edit"
    >
      {value || placeholder}
    </h1>
  );
}
