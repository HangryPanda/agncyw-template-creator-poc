/**
 * Dirty State Plugin
 *
 * Headless Lexical plugin that tracks dirty state and reports changes to parent component.
 * Uses the useLexicalDirtyState hook to monitor the editor's undo stack.
 *
 * This plugin has no UI - it only manages state and communicates with the parent.
 *
 * @example
 * ```typescript
 * function TemplateEditor({ onDirtyChange }) {
 *   return (
 *     <LexicalComposer>
 *       <RichTextPlugin />
 *       <HistoryPlugin />
 *       <DirtyStatePlugin onDirtyChange={onDirtyChange} />
 *     </LexicalComposer>
 *   );
 * }
 * ```
 */

import { useEffect } from 'react';
import { useLexicalDirtyState } from './useLexicalDirtyState';

export interface DirtyStatePluginProps {
  /**
   * Callback when dirty state changes
   */
  onDirtyChange?: (isDirty: boolean) => void;
}

/**
 * Headless plugin that monitors editor dirty state and reports changes
 */
export function DirtyStatePlugin({ onDirtyChange }: DirtyStatePluginProps): null {
  const { isDirty } = useLexicalDirtyState();

  // Notify parent when dirty state changes
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  return null; // Headless plugin - renders nothing
}
