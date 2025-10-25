/**
 * Lexical Dirty State Hook
 *
 * Uses Lexical's built-in History Plugin to track whether the editor has unsaved changes.
 * This leverages the undo stack - if canUndo is true, the editor has changes since the last save.
 *
 * Benefits:
 * - Accurate dirty tracking (undo to original = not dirty)
 * - No manual change tracking needed
 * - Integrates with existing undo/redo functionality
 *
 * @example
 * ```typescript
 * function MyEditor() {
 *   const { isDirty, markClean } = useLexicalDirtyState();
 *
 *   const handleSave = async () => {
 *     await saveToServer();
 *     markClean(); // Clear history and reset dirty state
 *   };
 *
 *   return (
 *     <button onClick={handleSave} disabled={!isDirty}>
 *       Save {isDirty && '*'}
 *     </button>
 *   );
 * }
 * ```
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  CAN_UNDO_COMMAND,
  CLEAR_HISTORY_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from 'lexical';
import { useEffect, useState, useCallback } from 'react';

export interface UseLexicalDirtyStateReturn {
  /**
   * Whether the editor has unsaved changes
   */
  isDirty: boolean;

  /**
   * Mark the editor as clean (call after save)
   * This clears the history stack and resets the dirty state
   */
  markClean: () => void;
}

/**
 * Hook to track dirty state using Lexical's History Plugin
 *
 * @returns Object with isDirty flag and markClean function
 */
export function useLexicalDirtyState(): UseLexicalDirtyStateReturn {
  const [editor] = useLexicalComposerContext();
  const [isDirty, setIsDirty] = useState(false);

  // Listen to undo stack changes
  // If canUndo is true, the editor has unsaved changes
  useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (canUndo: boolean) => {
        setIsDirty(canUndo);
        return false; // Allow other handlers to process this command
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor]);

  // Mark as clean after save
  const markClean = useCallback(() => {
    // Clear history command resets the undo/redo stack
    editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
    setIsDirty(false);
  }, [editor]);

  return {
    isDirty,
    markClean,
  };
}
