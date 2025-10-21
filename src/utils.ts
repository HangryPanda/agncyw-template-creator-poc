/**
 * Utils index file - exports commonly used utilities
 */

// Re-export all utils functions
export * from './utils/url';
export * from './utils/getDOMRangeRect';
export * from './utils/getSelectedNode';
export * from './utils/setFloatingElemPosition';
export * from './utils/setFloatingElemPositionForLinkEditor';
export * from './utils/joinClasses';

// Export a copyToClipboard utility (needed by CopyButton)
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

// Add any other common utilities here
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// React hook for debouncing
import { useCallback, useRef } from 'react';

export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    }) as T,
    [fn, delay]
  );
}