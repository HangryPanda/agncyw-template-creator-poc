/**
 * Canvas Tabs System Types
 *
 * Type definitions for canvas tab navigation that manages workspaces
 * (templates, documents, designs, etc.) - distinct from generic UI tabs.
 */

/**
 * Represents a single canvas tab in the tab bar
 * @template T - The type of the canvas tab identifier (usually string)
 */
export interface CanvasTabItem<T = string> {
  id: T;
  openedAt: number;
  metadata?: Record<string, unknown>;
}

/**
 * Complete state of the canvas tabs system
 * @template T - The type of the canvas tab identifier (usually string)
 */
export interface CanvasTabsState<T = string> {
  tabs: CanvasTabItem<T>[];
  activeTabId: T | null;
  tabOrder: T[];
}

/**
 * Configuration options for useCanvasTabsManager hook
 * @template T - The type of the canvas tab identifier (usually string)
 */
export interface UseCanvasTabsManagerOptions<T = string> {
  /**
   * Key for localStorage persistence
   * @example 'myapp_canvas_tabs'
   */
  storageKey: string;

  /**
   * Enable localStorage persistence
   * @default true
   */
  persist?: boolean;

  /**
   * Maximum number of canvas tabs allowed
   * @default undefined (no limit)
   */
  maxTabs?: number;

  /**
   * Callback when active canvas tab changes
   */
  onTabChange?: (tabId: T | null) => void;

  /**
   * Callback when canvas tab is closing
   * Return false to prevent close
   */
  onTabClose?: (tabId: T) => boolean | void;

  /**
   * Initial canvas tabs to open on mount
   */
  initialTabs?: T[];
}

/**
 * Return value of useCanvasTabsManager hook
 * @template T - The type of the canvas tab identifier (usually string)
 */
export interface CanvasTabsManagerReturn<T = string> {
  /**
   * Array of canvas tab IDs in order
   */
  tabs: T[];

  /**
   * Currently active canvas tab ID
   */
  activeTabId: T | null;

  /**
   * Open a canvas tab or switch to it if already open
   */
  openTab: (tabId: T) => void;

  /**
   * Close a canvas tab
   */
  closeTab: (tabId: T) => void;

  /**
   * Switch to a different canvas tab
   */
  setActiveTab: (tabId: T) => void;

  /**
   * Reorder canvas tabs by dragging
   */
  reorderTabs: (fromIndex: number, toIndex: number) => void;

  /**
   * Close all canvas tabs except the specified one
   */
  closeOtherTabs: (tabId: T) => void;

  /**
   * Close all canvas tabs to the right of the specified tab
   */
  closeTabsToRight: (tabId: T) => void;

  /**
   * Close all canvas tabs
   */
  closeAllTabs: () => void;

  /**
   * Check if a canvas tab is currently open
   */
  isTabOpen: (tabId: T) => boolean;
}
