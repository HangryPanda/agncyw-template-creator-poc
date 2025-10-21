import React, { useState } from 'react';
import { EditorState } from '@/types';
import { Copy, RotateCcw, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ComposePreviewProps {
  renderedText: string;
  templateType: 'email' | 'sms';
  onCopy: () => void;
  onClear: () => void;
}

export function ComposePreview({
  renderedText,
  templateType,
  onCopy,
  onClear,
}: ComposePreviewProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const charCount = renderedText.length;
  const wordCount = renderedText.trim() ? renderedText.trim().split(/\s+/).length : 0;

  // SMS limits
  const SMS_LIMIT_1 = 160;
  let smsCount = 1;
  let colorClass = 'text-green-600';

  if (templateType === 'sms') {
    if (charCount > 306) {
      smsCount = Math.ceil((charCount - 6) / 153);
      colorClass = 'text-red-600';
    } else if (charCount > SMS_LIMIT_1) {
      smsCount = 2;
      colorClass = 'text-orange-600';
    }
  }

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    toast.success('Copied to clipboard!', {
      description: 'Message text has been copied.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-medium text-gray-700">Live Preview</h3>
            {templateType === 'sms' && (
              <div className="flex items-center gap-3 text-xs">
                <span className="text-gray-500">
                  <span className={colorClass}>{charCount}</span> characters
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500">
                  {wordCount} words
                </span>
                {charCount > SMS_LIMIT_1 && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className={colorClass}>
                      {smsCount} SMS {smsCount === 1 ? 'message' : 'messages'}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all active:scale-95"
              title="Clear all fields (Cmd+K)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
              title="Copy to clipboard (Cmd+Enter)"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Message</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 min-h-[120px] max-h-[200px] overflow-y-auto">
          <div className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
            {renderedText || (
              <span className="text-gray-400 italic">
                Fill in the fields below to see your message preview...
              </span>
            )}
          </div>
        </div>

        {/* SMS Warning */}
        {templateType === 'sms' && charCount > SMS_LIMIT_1 && (
          <div className="mt-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-md">
            <p className="text-xs text-orange-800">
              ⚠️ Long messages reduce the impact of text messages. Consider shortening the message or use SF AI to rewrite it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
