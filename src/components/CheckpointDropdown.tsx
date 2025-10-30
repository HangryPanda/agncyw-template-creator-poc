import React, { useState, useRef, useEffect } from 'react';
import { TemplateCheckpoint } from '@/types';
import { formatCheckpointTime, getCheckpointDisplayLabel } from '@/utils/checkpointUtils';

interface CheckpointDropdownProps {
  /** Array of checkpoints (newest first) */
  checkpoints: TemplateCheckpoint[];

  /** Callback when user creates manual checkpoint */
  onCreateCheckpoint: (label?: string) => void;

  /** Callback when user restores a checkpoint */
  onRestoreCheckpoint: (checkpointId: string) => void;

  /** Callback when user deletes a checkpoint */
  onDeleteCheckpoint: (checkpointId: string) => void;

  /** Whether dropdown is disabled */
  disabled?: boolean;
}

export function CheckpointDropdown({
  checkpoints,
  onCreateCheckpoint,
  onRestoreCheckpoint,
  onDeleteCheckpoint,
  disabled = false,
}: CheckpointDropdownProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [labelInput, setLabelInput] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left?: number; right?: number }>({ top: 0, right: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Calculate optimal dropdown position when opened
  useEffect(() => {
    if (!isOpen || !dropdownRef.current || !buttonRef.current) return;

    const button = buttonRef.current.getBoundingClientRect();
    const dropdown = dropdownRef.current.getBoundingClientRect();
    const viewport = { width: window.innerWidth, height: window.innerHeight };

    // Calculate optimal position - align to LEFT edge of button by default
    const spaceBelow = viewport.height - button.bottom;
    const spaceAbove = button.top;
    const spaceRight = viewport.width - button.left; // Space to right of button's left edge

    let top = button.bottom + 4; // Default: 4px below button
    let left = button.left; // Align to left edge of button
    let right: number | undefined;

    // If not enough space below, position above
    if (spaceBelow < 400 && spaceAbove > spaceBelow) {
      top = button.top - dropdown.height - 4;
    }

    // If not enough space to the right, adjust position
    if (spaceRight < 320) {
      // Try aligning to right edge of button instead
      const spaceFromRight = viewport.width - button.right;
      if (spaceFromRight >= 320) {
        left = button.right - 320;
      } else {
        // Center if neither side has space
        left = Math.max(8, (viewport.width - 320) / 2);
      }
    }

    setDropdownPosition({ top, left, right });
  }, [isOpen]);

  const handleCreateCheckpoint = () => {
    const label = labelInput.trim() || undefined;
    onCreateCheckpoint(label);
    setLabelInput('');
    setShowLabelInput(false);
    setIsOpen(false);
  };

  const handleRestore = (checkpointId: string) => {
    if (window.confirm('Restore this checkpoint? Current unsaved changes will be lost.')) {
      onRestoreCheckpoint(checkpointId);
      setIsOpen(false);
    }
  };

  const handleDelete = (checkpointId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this checkpoint? This cannot be undone.')) {
      onDeleteCheckpoint(checkpointId);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Dropdown Toggle Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={`Checkpoints${checkpoints.length > 0 ? ` (${checkpoints.length})` : ''}`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.492 2.492 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25zM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM3.5 3.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0z"></path>
        </svg>
        <span>Checkpoints</span>
        {checkpoints.length > 0 && (
          <span className="text-xs opacity-70">({checkpoints.length})</span>
        )}
        <svg
          className="w-3 h-3 transition-transform"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 12 12"
        >
          <path d="M3 5L6 8L9 5" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          id="checkpoint-dropdown"
          className="checkpoint-dropdown"
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            minWidth: '320px',
            maxWidth: 'min(400px, calc(100vw - 16px))',
            maxHeight: '400px',
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            className="checkpoint-dropdown-header"
            style={{
              padding: 'var(--spacing-md) var(--spacing-lg)',
              borderBottom: '1px solid var(--border)',
              fontWeight: 'var(--fontWeight-semibold)',
              fontSize: 'var(--fontSize-md)',
              color: 'var(--foreground)',
              backgroundColor: 'var(--card)',
              lineHeight: 'var(--lineHeight-tight)',
            }}
          >
            Version History
          </div>

          {/* Create Checkpoint Section */}
          <div
            className="checkpoint-dropdown-create"
            style={{
              padding: 'var(--spacing-md)',
              borderBottom: '1px solid var(--border)',
              backgroundColor: 'var(--background)',
            }}
          >
            {!showLabelInput ? (
              <button
                onClick={() => setShowLabelInput(true)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  fontSize: 'var(--fontSize-base)',
                  fontWeight: 'var(--fontWeight-medium)',
                  backgroundColor: 'var(--brand-blue)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-xs)',
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 1v10M1 6h10" strokeLinecap="round" />
                </svg>
                <span>Create Checkpoint</span>
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                <input
                  type="text"
                  placeholder="Checkpoint name (optional)"
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateCheckpoint();
                    if (e.key === 'Escape') {
                      setShowLabelInput(false);
                      setLabelInput('');
                    }
                  }}
                  autoFocus
                  style={{
                    padding: 'var(--spacing-md)',
                    fontSize: 'var(--fontSize-sm)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--card)',
                    color: 'var(--foreground)',
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--brand-blue)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                />
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <button
                    onClick={handleCreateCheckpoint}
                    style={{
                      flex: 1,
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      fontSize: 'var(--fontSize-sm)',
                      fontWeight: 'var(--fontWeight-medium)',
                      backgroundColor: 'var(--brand-blue)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'opacity 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowLabelInput(false);
                      setLabelInput('');
                    }}
                    style={{
                      flex: 1,
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      fontSize: 'var(--fontSize-sm)',
                      fontWeight: 'var(--fontWeight-medium)',
                      backgroundColor: 'var(--card)',
                      color: 'var(--muted-foreground)',
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--muted)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--card)';
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Checkpoint List */}
          <div
            className="checkpoint-dropdown-list"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 'var(--spacing-sm)',
              backgroundColor: 'var(--background)',
            }}
          >
            {checkpoints.length === 0 ? (
              <div
                className="checkpoint-empty-state"
                style={{
                  padding: 'var(--spacing-2xl) var(--spacing-lg)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                }}
              >
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.3">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" />
                  <path d="M24 12v12l8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <div>
                  <div
                    style={{
                      fontSize: 'var(--fontSize-sm)',
                      fontWeight: 'var(--fontWeight-medium)',
                      color: 'var(--muted-foreground)',
                      marginBottom: 'var(--spacing-2xs)',
                    }}
                  >
                    No checkpoints yet
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--fontSize-xs)',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    Create your first checkpoint to track changes
                  </div>
                </div>
              </div>
            ) : (
              checkpoints.map((checkpoint) => (
                <div
                  key={checkpoint.id}
                  className="checkpoint-item"
                  data-checkpoint-id={checkpoint.id}
                  style={{
                    padding: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-sm)',
                    backgroundColor: 'var(--card)',
                    border: '1px solid transparent',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--muted)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--card)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                  onClick={() => handleRestore(checkpoint.id)}
                >
                  {/* Title and Delete Button Row */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 'var(--spacing-xs)',
                      gap: 'var(--spacing-sm)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'var(--fontSize-base)',
                        fontWeight: 'var(--fontWeight-medium)',
                        color: 'var(--foreground)',
                        lineHeight: 'var(--lineHeight-tight)',
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {getCheckpointDisplayLabel(checkpoint)}
                    </span>
                    <button
                      onClick={(e) => handleDelete(checkpoint.id, e)}
                      style={{
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        fontSize: 'var(--fontSize-xs)',
                        color: 'var(--text-tertiary)',
                        backgroundColor: 'transparent',
                        border: '1px solid transparent',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--destructive)';
                        e.currentTarget.style.backgroundColor = 'var(--error-bg)';
                        e.currentTarget.style.borderColor = 'var(--destructive)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-tertiary)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  {/* Consolidated Metadata Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)',
                      fontSize: 'var(--fontSize-xs)',
                      color: 'var(--text-tertiary)',
                      lineHeight: 'var(--lineHeight-tight)',
                    }}
                  >
                    <span>{formatCheckpointTime(checkpoint.timestamp)}</span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-2xs)',
                      }}
                    >
                      {checkpoint.checkpointType === 'auto' ? '⚡ Auto-save' : '📌 Manual'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Click-outside handler */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
}
