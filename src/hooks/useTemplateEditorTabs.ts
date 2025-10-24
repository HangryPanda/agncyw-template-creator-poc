/**
 * Template Editor Tabs Hook
 *
 * Template-specific wrapper around the generic useTabManager hook.
 * Adds dirty state tracking and confirmation dialogs for closing modified tabs.
 *
 * @example
 * ```typescript
 * function App() {
 *   const {
 *     tabs,
 *     activeTabId,
 *     openTab,
 *     closeTab,
 *     dirtyTabs,
 *     markTabDirty,
 *   } = useTemplateEditorTabs();
 *
 *   return (
 *     <TemplateEditor
 *       onDirtyChange={(isDirty) => markTabDirty(activeTabId, isDirty)}
 *     />
 *   );
 * }
 * ```
 */

import { useState, useCallback } from 'react';
import { useTabManager } from '@/lib/tabs';

export interface UseTemplateEditorTabsReturn {
  /**
   * Array of open tab IDs
   */
  tabs: string[];

  /**
   * Currently active tab ID
   */
  activeTabId: string | null;

  /**
   * Open a tab or switch to it if already open
   */
  openTab: (tabId: string) => void;

  /**
   * Close a tab
   */
  closeTab: (tabId: string) => void;

  /**
   * Switch to a different tab
   */
  setActiveTab: (tabId: string) => void;

  /**
   * Reorder tabs by dragging
   */
  reorderTabs: (fromIndex: number, toIndex: number) => void;

  /**
   * Close all tabs except the specified one
   */
  closeOtherTabs: (tabId: string) => void;

  /**
   * Close all tabs to the right of the specified tab
   */
  closeTabsToRight: (tabId: string) => void;

  /**
   * Close all tabs
   */
  closeAllTabs: () => void;

  /**
   * Check if a tab is currently open
   */
  isTabOpen: (tabId: string) => boolean;

  /**
   * Set of tab IDs that have unsaved changes
   */
  dirtyTabs: Set<string>;

  /**
   * Mark a tab as dirty or clean
   */
  markTabDirty: (tabId: string, isDirty: boolean) => void;
}

/**
 * Hook for managing template editor tabs with dirty state tracking
 */
export function useTemplateEditorTabs(): UseTemplateEditorTabsReturn {
  const [dirtyTabs, setDirtyTabs] = useState<Set<string>>(new Set());

  const tabManager = useTabManager<string>({
    storageKey: 'insurance_template_editor_tabs',
    persist: true,
    maxTabs: 15,

    onTabClose: (tabId) => {
      // Confirm close if tab has unsaved changes
      if (dirtyTabs.has(tabId)) {
        const confirmed = window.confirm(
          'This template has unsaved changes. Close anyway?'
        );
        if (!confirmed) {
          return false; // Cancel close
        }
      }

      // Clean up dirty state
      setDirtyTabs((prev) => {
        const next = new Set(prev);
        next.delete(tabId);
        return next;
      });

      return true;
    },
  });

  // Track dirty state for a specific tab
  const markTabDirty = useCallback((tabId: string, isDirty: boolean) => {
    setDirtyTabs((prev) => {
      const next = new Set(prev);
      if (isDirty) {
        next.add(tabId);
      } else {
        next.delete(tabId);
      }
      return next;
    });
  }, []);

  return {
    ...tabManager,
    dirtyTabs,
    markTabDirty,
  };
}
