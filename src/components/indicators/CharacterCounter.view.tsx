import React from 'react';
import { EditorState } from '@/types';

interface CharacterCounterProps {
  editorState: EditorState;
  type: 'email' | 'sms';
}

export default function CharacterCounter({ editorState, type }: CharacterCounterProps): JSX.Element | null {
  // Only show counter for SMS templates
  if (type !== 'sms') return null;

  const getTextFromEditorState = (state: EditorState): string => {
    let text = '';

    const processNode = (node: any): void => {
      if (node.type === 'text') {
        text += node.text || '';
      } else if (node.type === 'template-variable') {
        // Exclude placeholder variables from SMS character count
        // Variables will be filled in by user with actual values
      } else if (node.type === 'linebreak') {
        text += '\n';
      } else if (node.children && Array.isArray(node.children)) {
        node.children.forEach(processNode);
      }
    };

    if (state.root && state.root.children) {
      state.root.children.forEach(processNode);
    }

    return text;
  };

  const text = getTextFromEditorState(editorState);
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  // SMS character limits
  const SMS_LIMIT_1 = 160;  // 1 SMS
  const SMS_LIMIT_2 = 306;  // 2 SMS (153 chars each due to concatenation headers)
  const SMS_LIMIT_3 = 459;  // 3 SMS (153 chars each)

  let smsCount = 1;
  let remaining = SMS_LIMIT_1 - charCount;
  let colorClass = 'success';

  if (charCount > SMS_LIMIT_3) {
    smsCount = Math.ceil((charCount - 6) / 153); // Account for headers
    remaining = (smsCount * 153) - charCount;
    colorClass = 'danger';
  } else if (charCount > SMS_LIMIT_2) {
    smsCount = 3;
    remaining = SMS_LIMIT_3 - charCount;
    colorClass = 'warning';
  } else if (charCount > SMS_LIMIT_1) {
    smsCount = 2;
    remaining = SMS_LIMIT_2 - charCount;
    colorClass = 'warning';
  }

  return (
    <div style={containerStyle}>
      <div style={statsContainerStyle}>
        <div style={statItemStyle}>
          <span style={labelStyle}>Characters:</span>
          <span style={{ ...valueStyle, color: getColor(colorClass) }}>
            {charCount}
          </span>
        </div>

        <div style={statItemStyle}>
          <span style={labelStyle}>Words:</span>
          <span style={valueStyle}>{wordCount}</span>
        </div>

        {/* Temporarily hidden - pending platform relevance review
        <div style={statItemStyle}>
          <span style={labelStyle}>SMS Count:</span>
          <span style={{ ...valueStyle, color: getColor(colorClass) }}>
            {smsCount} {smsCount === 1 ? 'message' : 'messages'}
          </span>
        </div>

        {charCount > 0 && (
          <div style={statItemStyle}>
            <span style={labelStyle}>Remaining:</span>
            <span style={{ ...valueStyle, color: getColor(colorClass) }}>
              {remaining > 0 ? remaining : `${Math.abs(remaining)} over`}
            </span>
          </div>
        )}
        */}
      </div>

      {charCount > SMS_LIMIT_1 && (
        <div style={{ ...warningStyle, backgroundColor: getBackgroundColor(colorClass) }}>
          <span style={{ fontSize: 'var(--text-xs)' }}>
            ⚠️ Long messages reduce the impact of text messages. Consider shortening the message or use SF AI to rewrite it.
          </span>
        </div>
      )}

      <div style={progressBarContainerStyle}>
        <div
          style={{
            ...progressBarStyle,
            width: `${Math.min((charCount / SMS_LIMIT_1) * 100, 100)}%`,
            backgroundColor: getColor(colorClass),
          }}
        />
      </div>
    </div>
  );
}

const getColor = (type: string): string => {
  switch(type) {
    case 'success': return 'var(--color-success)';
    case 'warning': return 'var(--color-warning)';
    case 'danger': return 'var(--color-danger)';
    default: return 'var(--color-gray-500)';
  }
};

const getBackgroundColor = (type: string): string => {
  switch(type) {
    case 'warning': return 'rgba(245, 158, 11, 0.1)';
    case 'danger': return 'rgba(239, 68, 68, 0.1)';
    default: return 'transparent';
  }
};

// Styles
const containerStyle: React.CSSProperties = {
  padding: 'var(--spacing-3) var(--spacing-4)',
  backgroundColor: 'var(--color-surface)',
  borderTop: '1px solid var(--color-border)',
  fontSize: 'var(--text-sm)',
};
// SMS Stats Container
const statsContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
  marginBottom: 'var(--spacing-2)',
};
// Single Stat Item
const statItemStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-1)',
  alignItems: 'center',
};
// Stat Label Style
const labelStyle: React.CSSProperties = {
  color: 'var(--color-text-muted)',
  fontSize: '11px',
  fontWeight: 'var(--font-medium)',
};
// Stat Value Style
const valueStyle: React.CSSProperties = {
  color: 'var(--color-text-primary)',
  fontSize: '11px',
  fontWeight: 'var(--font-medium)',
};
// Warning Box Style
const warningStyle: React.CSSProperties = {
  padding: 'var(--spacing-2) var(--spacing-3)',
  borderRadius: 'var(--radius-md)',
  marginTop: 'var(--spacing-2)',
  marginBottom: 'var(--spacing-2)',
};

const progressBarContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '4px',
  backgroundColor: 'var(--color-gray-200)',
  borderRadius: 'var(--radius-full)',
  overflow: 'hidden',
  marginTop: 'var(--spacing-2)',
};

const progressBarStyle: React.CSSProperties = {
  height: '100%',
  transition: 'width var(--transition-base), background-color var(--transition-base)',
  borderRadius: 'var(--radius-full)',
};
