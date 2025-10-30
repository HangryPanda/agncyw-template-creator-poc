/**
 * Generic Tab System Types
 *
 * Reusable type definitions for a tab management system that can work
 * with any data type (templates, documents, files, etc.)
 */

/**
 * Represents a single tab in the tab bar
 * @template T - The type of the tab identifier (usually string)
 */
export interface TabItem<T = string> {
  id: T;
  openedAt: number;
  metadata?: Record<string, unknown>;
}

/**
 * Complete state of the tab system
 * @template T - The type of the tab identifier (usually string)
 */
export interface TabsState<T = string> {
  tabs: TabItem<T>[];
  activeTabId: T | null;
  tabOrder: T[];
}

/**
 * Configuration options for useTabManager hook
 * @template T - The type of the tab identifier (usually string)
 */
export interface UseTabManagerOptions<T = string> {
  /**
   * Key for localStorage persistence
   * @example 'myapp_editor_tabs'
   */
  storageKey: string;

  /**
   * Enable localStorage persistence
   * @default true
   */
  persist?: boolean;

  /**
   * Maximum number of tabs allowed
   * @default undefined (no limit)
   */
  maxTabs?: number;

  /**
   * Callback when active tab changes
   */
  onTabChange?: (tabId: T | null) => void;

  /**
   * Callback when tab is closing
   * Return false to prevent close
   */
  onTabClose?: (tabId: T) => boolean | void;

  /**
   * Initial tabs to open on mount
   */
  initialTabs?: T[];
}

/**
 * Return value of useTabManager hook
 * @template T - The type of the tab identifier (usually string)
 */
export interface TabManagerReturn<T = string> {
  /**
   * Array of tab IDs in order
   */
  tabs: T[];

  /**
   * Currently active tab ID
   */
  activeTabId: T | null;

  /**
   * Open a tab or switch to it if already open
   */
  openTab: (tabId: T) => void;

  /**
   * Close a tab
   */
  closeTab: (tabId: T) => void;

  /**
   * Switch to a different tab
   */
  setActiveTab: (tabId: T) => void;

  /**
   * Reorder tabs by dragging
   */
  reorderTabs: (fromIndex: number, toIndex: number) => void;

  /**
   * Close all tabs except the specified one
   */
  closeOtherTabs: (tabId: T) => void;

  /**
   * Close all tabs to the right of the specified tab
   */
  closeTabsToRight: (tabId: T) => void;

  /**
   * Close all tabs
   */
  closeAllTabs: () => void;

  /**
   * Check if a tab is currently open
   */
  isTabOpen: (tabId: T) => boolean;
}
