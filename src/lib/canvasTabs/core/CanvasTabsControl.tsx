/**
 * Generic TabBar Component
 *
 * Reusable VS Code-style tab bar UI that works with any data type.
 * Supports drag-and-drop reordering, modified indicators, context menus,
 * and keyboard navigation.
 */

import { useState, useRef, useCallback, useEffect, MouseEvent, DragEvent } from 'react';
import { X } from 'lucide-react';

export interface CanvasTabsControlProps<T = string, Item = unknown> {
  /**
   * Array of tab IDs in order
   */
  tabs: T[];

  /**
   * Currently active tab ID
   */
  activeTabId: T | null;

  /**
   * Map of tab ID to full item data
   */
  items: Map<T, Item>;

  /**
   * Callback when tab is clicked
   */
  onTabClick: (tabId: T) => void;

  /**
   * Callback when tab close button is clicked
   */
  onTabClose: (tabId: T) => void;

  /**
   * Optional callback for tab reordering
   */
  onTabReorder?: (fromIndex: number, toIndex: number) => void;

  /**
   * Render function for tab content
   */
  renderTabContent: (item: Item, isActive: boolean) => React.ReactNode;

  /**
   * Optional function to get tab key (defaults to using tab ID)
   */
  getTabKey?: (item: Item) => string;

  /**
   * Set of tab IDs that have unsaved changes
   */
  modifiedTabs?: Set<T>;

  /**
   * Show close buttons on tabs
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Enable drag-and-drop reordering
   * @default true
   */
  enableDragReorder?: boolean;

  /**
   * Enable right-click context menu
   * @default true
   */
  enableContextMenu?: boolean;

  /**
   * Optional callbacks for context menu actions
   */
  onCloseOtherTabs?: (tabId: T) => void;
  onCloseTabsToRight?: (tabId: T) => void;
  onCloseAllTabs?: () => void;

  /**
   * Custom class name for the tab bar container
   */
  className?: string;

  /**
   * Variant style
   * @default 'default'
   */
  variant?: 'default' | 'minimal' | 'compact';
}

interface ContextMenuState {
  show: boolean;
  x: number;
  y: number;
  tabId: string | null;
}

export function CanvasTabsControl<T = string, Item = unknown>({
  tabs,
  activeTabId,
  items,
  onTabClick,
  onTabClose,
  onTabReorder,
  renderTabContent,
  getTabKey,
  modifiedTabs,
  showCloseButton = true,
  enableDragReorder = true,
  enableContextMenu = true,
  onCloseOtherTabs,
  onCloseTabsToRight,
  onCloseAllTabs,
  className = '',
  variant = 'default',
}: CanvasTabsControlProps<T, Item>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    show: false,
    x: 0,
    y: 0,
    tabId: null,
  });

  const tabBarRef = useRef<HTMLDivElement>(null);

  // Handle drag start
  const handleDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>, index: number) => {
      if (!enableDragReorder) return;

      setDraggedIndex(index);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index.toString());

      // Create drag image
      const target = e.currentTarget;
      const clone = target.cloneNode(true) as HTMLElement;
      clone.style.opacity = '0.5';
      clone.style.position = 'absolute';
      clone.style.top = '-9999px';
      document.body.appendChild(clone);
      e.dataTransfer.setDragImage(clone, 0, 0);
      setTimeout(() => document.body.removeChild(clone), 0);
    },
    [enableDragReorder]
  );

  // Handle drag over
  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>, index: number) => {
      if (!enableDragReorder || draggedIndex === null) return;

      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      if (index !== draggedIndex) {
        setDragOverIndex(index);
      }
    },
    [enableDragReorder, draggedIndex]
  );

  // Handle drop
  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>, toIndex: number) => {
      e.preventDefault();

      if (draggedIndex !== null && draggedIndex !== toIndex && onTabReorder) {
        onTabReorder(draggedIndex, toIndex);
      }

      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [draggedIndex, onTabReorder]
  );

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  // Handle context menu
  const handleContextMenu = useCallback(
    (e: MouseEvent<HTMLDivElement>, tabId: T) => {
      if (!enableContextMenu) return;

      e.preventDefault();
      setContextMenu({
        show: true,
        x: e.clientX,
        y: e.clientY,
        tabId: tabId as string,
      });
    },
    [enableContextMenu]
  );

  // Close context menu
  const closeContextMenu = useCallback(() => {
    setContextMenu({ show: false, x: 0, y: 0, tabId: null });
  }, []);

  // Handle context menu actions
  const handleContextMenuAction = useCallback(
    (action: 'close' | 'closeOthers' | 'closeRight' | 'closeAll') => {
      const tabId = contextMenu.tabId as T;

      switch (action) {
        case 'close':
          onTabClose(tabId);
          break;
        case 'closeOthers':
          onCloseOtherTabs?.(tabId);
          break;
        case 'closeRight':
          onCloseTabsToRight?.(tabId);
          break;
        case 'closeAll':
          onCloseAllTabs?.();
          break;
      }

      closeContextMenu();
    },
    [
      contextMenu.tabId,
      onTabClose,
      onCloseOtherTabs,
      onCloseTabsToRight,
      onCloseAllTabs,
      closeContextMenu,
    ]
  );

  // Close context menu on outside click
  useEffect(() => {
    if (contextMenu.show) {
      const handleClick = () => closeContextMenu();
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenu.show, closeContextMenu]);

  // Render empty state
  if (tabs.length === 0) {
    return null;
  }

  const baseClasses = 'flex items-center bg-background border-b border-border overflow-x-auto overflow-y-hidden scrollbar-thin';
  const variantClasses = {
    default: 'h-10',
    minimal: 'h-8',
    compact: 'h-9',
  };

  return (
    <>
      <div
        ref={tabBarRef}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        role="tablist"
      >
        {tabs.map((tabId, index) => {
          const item = items.get(tabId);
          if (!item) return null;

          const isActive = tabId === activeTabId;
          const isModified = modifiedTabs?.has(tabId) ?? false;
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;
          const key = getTabKey ? getTabKey(item) : String(tabId);

          return (
            <div
              key={key}
              role="tab"
              aria-selected={isActive}
              draggable={enableDragReorder}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              onContextMenu={(e) => handleContextMenu(e, tabId)}
              onClick={() => onTabClick(tabId)}
              className={`
                group relative flex items-center gap-2 px-3 py-2 border-r border-border
                cursor-pointer select-none transition-colors min-w-0 max-w-[200px]
                ${isActive
                  ? 'bg-muted/50 border-t-2 border-t-primary -mt-[2px] pt-[6px]'
                  : 'bg-transparent hover:bg-muted/30 border-t-2 border-t-transparent'
                }
                ${isDragging ? 'opacity-40' : 'opacity-100'}
                ${isDragOver ? 'bg-primary/10' : ''}
              `}
            >
              {/* Modified indicator */}
              {isModified && (
                <div
                  className="w-2 h-2 rounded-full bg-primary flex-shrink-0"
                  title="Unsaved changes"
                />
              )}

              {/* Tab content */}
              <div className="flex-1 min-w-0">
                {renderTabContent(item, isActive)}
              </div>

              {/* Close button */}
              {showCloseButton && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tabId);
                  }}
                  className="flex-shrink-0 p-0.5 rounded hover:bg-muted-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Close tab"
                  aria-label="Close tab"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Context Menu */}
      {contextMenu.show && (
        <div
          className="fixed bg-popover border border-border rounded-md shadow-lg py-1 z-50 min-w-[180px]"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleContextMenuAction('close')}
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted transition-colors"
          >
            Close
          </button>

          {onCloseOtherTabs && (
            <button
              onClick={() => handleContextMenuAction('closeOthers')}
              className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted transition-colors"
            >
              Close Others
            </button>
          )}

          {onCloseTabsToRight && (
            <button
              onClick={() => handleContextMenuAction('closeRight')}
              className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted transition-colors"
            >
              Close Tabs to the Right
            </button>
          )}

          {onCloseAllTabs && (
            <>
              <div className="border-t border-border my-1" />
              <button
                onClick={() => handleContextMenuAction('closeAll')}
                className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted transition-colors text-destructive"
              >
                Close All Tabs
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
