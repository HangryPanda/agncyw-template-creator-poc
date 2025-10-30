/**
 * Canvas Tabs Manager Hook
 *
 * Reusable state management for canvas tab navigation systems.
 * Works with any data type via TypeScript generics.
 * No UI dependencies - pure state management.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { CanvasTabItem, CanvasTabsState, UseCanvasTabsManagerOptions, CanvasTabsManagerReturn } from './types';

/**
 * Custom hook for managing canvas tab state
 *
 * @template T - The type of canvas tab identifiers (usually string)
 * @param options - Configuration options
 * @returns Canvas tab management functions and state
 *
 * @example
 * ```typescript
 * const canvasTabs = useCanvasTabsManager<string>({
 *   storageKey: 'my_app_canvas_tabs',
 *   persist: true,
 *   maxTabs: 10,
 *   onTabClose: (tabId) => {
 *     if (hasUnsavedChanges(tabId)) {
 *       return !confirm('Unsaved changes. Close anyway?');
 *     }
 *   }
 * });
 * ```
 */
export function useCanvasTabsManager<T = string>(
  options: UseCanvasTabsManagerOptions<T>
): CanvasTabsManagerReturn<T> {
  const {
    storageKey,
    persist = true,
    maxTabs,
    onTabChange,
    onTabClose,
    initialTabs = [],
  } = options;

  // Initialize state from localStorage or defaults
  const [state, setState] = useState<CanvasTabsState<T>>(() => {
    if (persist) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as CanvasTabsState<T>;
          return parsed;
        } catch (error) {
          console.error(`Failed to parse tab state from ${storageKey}:`, error);
        }
      }
    }

    // Default state
    return {
      tabs: initialTabs.map((id, index) => ({
        id,
        openedAt: Date.now() - (initialTabs.length - index), // Preserve order
      })),
      activeTabId: initialTabs[0] ?? null,
      tabOrder: initialTabs,
    };
  });

  // Persist state to localStorage
  useEffect(() => {
    if (persist) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (error) {
        console.error(`Failed to save tab state to ${storageKey}:`, error);
      }
    }
  }, [state, storageKey, persist]);

  // Memoized tab IDs in order
  const tabs = useMemo(() => state.tabOrder, [state.tabOrder]);

  // Open a tab or switch to it if already open
  const openTab = useCallback((tabId: T) => {
    setState((prev) => {
      // If tab is already open, just switch to it
      const existingIndex = prev.tabOrder.indexOf(tabId);
      if (existingIndex !== -1) {
        if (prev.activeTabId !== tabId) {
          onTabChange?.(tabId);
        }
        return {
          ...prev,
          activeTabId: tabId,
        };
      }

      // Check max tabs limit
      let newTabs = [...prev.tabs];
      let newTabOrder = [...prev.tabOrder];

      if (maxTabs !== undefined && newTabs.length >= maxTabs) {
        // Remove the least recently used tab (oldest openedAt that isn't active)
        const lruTab = newTabs
          .filter((t) => t.id !== prev.activeTabId)
          .sort((a, b) => a.openedAt - b.openedAt)[0];

        if (lruTab) {
          // Check if we can close the LRU tab
          const canClose = onTabClose?.(lruTab.id);
          if (canClose === false) {
            // Can't close, so can't open new tab
            return prev;
          }

          newTabs = newTabs.filter((t) => t.id !== lruTab.id);
          newTabOrder = newTabOrder.filter((id) => id !== lruTab.id);
        }
      }

      // Add new tab
      const newTab: CanvasTabItem<T> = {
        id: tabId,
        openedAt: Date.now(),
      };

      newTabs.push(newTab);
      newTabOrder.push(tabId);

      onTabChange?.(tabId);

      return {
        tabs: newTabs,
        activeTabId: tabId,
        tabOrder: newTabOrder,
      };
    });
  }, [maxTabs, onTabChange, onTabClose]);

  // Close a tab
  const closeTab = useCallback((tabId: T) => {
    setState((prev) => {
      // Check if tab exists
      if (!prev.tabOrder.includes(tabId)) {
        return prev;
      }

      // Check if we can close this tab
      const canClose = onTabClose?.(tabId);
      if (canClose === false) {
        return prev;
      }

      const tabIndex = prev.tabOrder.indexOf(tabId);
      const newTabs = prev.tabs.filter((t) => t.id !== tabId);
      const newTabOrder = prev.tabOrder.filter((id) => id !== tabId);

      // Determine next active tab
      let newActiveTabId = prev.activeTabId;

      if (prev.activeTabId === tabId) {
        if (newTabOrder.length === 0) {
          newActiveTabId = null;
        } else if (tabIndex < newTabOrder.length) {
          // Select tab to the right
          newActiveTabId = newTabOrder[tabIndex];
        } else {
          // Select tab to the left (last tab)
          newActiveTabId = newTabOrder[newTabOrder.length - 1];
        }

        if (newActiveTabId !== prev.activeTabId) {
          onTabChange?.(newActiveTabId);
        }
      }

      return {
        tabs: newTabs,
        activeTabId: newActiveTabId,
        tabOrder: newTabOrder,
      };
    });
  }, [onTabClose, onTabChange]);

  // Set active tab
  const setActiveTab = useCallback((tabId: T) => {
    setState((prev) => {
      if (!prev.tabOrder.includes(tabId)) {
        console.warn(`Tab ${tabId} is not open`);
        return prev;
      }

      if (prev.activeTabId !== tabId) {
        onTabChange?.(tabId);
      }

      return {
        ...prev,
        activeTabId: tabId,
      };
    });
  }, [onTabChange]);

  // Reorder tabs
  const reorderTabs = useCallback((fromIndex: number, toIndex: number) => {
    setState((prev) => {
      if (
        fromIndex < 0 ||
        fromIndex >= prev.tabOrder.length ||
        toIndex < 0 ||
        toIndex >= prev.tabOrder.length
      ) {
        return prev;
      }

      const newTabOrder = [...prev.tabOrder];
      const [removed] = newTabOrder.splice(fromIndex, 1);
      newTabOrder.splice(toIndex, 0, removed);

      return {
        ...prev,
        tabOrder: newTabOrder,
      };
    });
  }, []);

  // Close other tabs
  const closeOtherTabs = useCallback((tabId: T) => {
    setState((prev) => {
      const tabsToClose = prev.tabOrder.filter((id) => id !== tabId);

      // Check if we can close all other tabs
      for (const id of tabsToClose) {
        const canClose = onTabClose?.(id);
        if (canClose === false) {
          // If any tab can't be closed, don't close any
          return prev;
        }
      }

      const newTabs = prev.tabs.filter((t) => t.id === tabId);
      const newTabOrder = [tabId];

      if (prev.activeTabId !== tabId) {
        onTabChange?.(tabId);
      }

      return {
        tabs: newTabs,
        activeTabId: tabId,
        tabOrder: newTabOrder,
      };
    });
  }, [onTabClose, onTabChange]);

  // Close tabs to the right
  const closeTabsToRight = useCallback((tabId: T) => {
    setState((prev) => {
      const tabIndex = prev.tabOrder.indexOf(tabId);
      if (tabIndex === -1 || tabIndex === prev.tabOrder.length - 1) {
        return prev;
      }

      const tabsToClose = prev.tabOrder.slice(tabIndex + 1);

      // Check if we can close all tabs to the right
      for (const id of tabsToClose) {
        const canClose = onTabClose?.(id);
        if (canClose === false) {
          return prev;
        }
      }

      const newTabOrder = prev.tabOrder.slice(0, tabIndex + 1);
      const newTabs = prev.tabs.filter((t) => newTabOrder.includes(t.id));

      let newActiveTabId = prev.activeTabId;
      if (prev.activeTabId && !newTabOrder.includes(prev.activeTabId)) {
        newActiveTabId = tabId;
        onTabChange?.(tabId);
      }

      return {
        tabs: newTabs,
        activeTabId: newActiveTabId,
        tabOrder: newTabOrder,
      };
    });
  }, [onTabClose, onTabChange]);

  // Close all tabs
  const closeAllTabs = useCallback(() => {
    setState((prev) => {
      // Check if we can close all tabs
      for (const tabId of prev.tabOrder) {
        const canClose = onTabClose?.(tabId);
        if (canClose === false) {
          return prev;
        }
      }

      onTabChange?.(null);

      return {
        tabs: [],
        activeTabId: null,
        tabOrder: [],
      };
    });
  }, [onTabClose, onTabChange]);

  // Check if tab is open
  const isTabOpen = useCallback(
    (tabId: T) => {
      return state.tabOrder.includes(tabId);
    },
    [state.tabOrder]
  );

  return {
    tabs,
    activeTabId: state.activeTabId,
    openTab,
    closeTab,
    setActiveTab,
    reorderTabs,
    closeOtherTabs,
    closeTabsToRight,
    closeAllTabs,
    isTabOpen,
  };
}
