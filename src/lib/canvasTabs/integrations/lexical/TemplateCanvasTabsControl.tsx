/**
 * Template Editor Tabs Component
 *
 * Template-specific wrapper around the generic CanvasTabsControl component.
 * Displays template type icons and names in a VS Code-style tab bar.
 *
 * @example
 * ```typescript
 * <TemplateCanvasTabsControl
 *   tabs={openTabs}
 *   activeTabId={activeTabId}
 *   templates={templates}
 *   modifiedTabs={dirtyTabs}
 *   onTabClick={setActiveTab}
 *   onTabClose={closeTab}
 *   onTabReorder={reorderTabs}
 * />
 * ```
 */

import { CanvasTabsControl } from '../../core';
import { Template } from '@/types';
import { Mail, MessageSquare } from 'lucide-react';

export interface TemplateCanvasTabsControlProps {
  /**
   * Array of open tab IDs
   */
  tabs: string[];

  /**
   * Currently active tab ID
   */
  activeTabId: string | null;

  /**
   * All available templates
   */
  templates: Template[];

  /**
   * Set of tab IDs with unsaved changes
   */
  modifiedTabs: Set<string>;

  /**
   * Callback when tab is clicked
   */
  onTabClick: (tabId: string) => void;

  /**
   * Callback when tab close button is clicked
   */
  onTabClose: (tabId: string) => void;

  /**
   * Callback for tab reordering
   */
  onTabReorder: (fromIndex: number, toIndex: number) => void;

  /**
   * Optional callbacks for context menu actions
   */
  onCloseOtherTabs?: (tabId: string) => void;
  onCloseTabsToRight?: (tabId: string) => void;
  onCloseAllTabs?: () => void;
}

/**
 * Template-specific tab bar component
 */
export function TemplateCanvasTabsControl({
  tabs,
  activeTabId,
  templates,
  modifiedTabs,
  onTabClick,
  onTabClose,
  onTabReorder,
  onCloseOtherTabs,
  onCloseTabsToRight,
  onCloseAllTabs,
}: TemplateCanvasTabsControlProps) {
  // Create a map of template ID to template for efficient lookup
  const templateMap = new Map(
    templates
      .filter((t) => tabs.includes(t.id))
      .map((t) => [t.id, t])
  );

  return (
    <CanvasTabsControl<string, Template>
      tabs={tabs}
      activeTabId={activeTabId}
      items={templateMap}
      modifiedTabs={modifiedTabs}
      onTabClick={onTabClick}
      onTabClose={onTabClose}
      onTabReorder={onTabReorder}
      onCloseOtherTabs={onCloseOtherTabs}
      onCloseTabsToRight={onCloseTabsToRight}
      onCloseAllTabs={onCloseAllTabs}
      renderTabContent={(template, isActive) => (
        <div className="flex items-center gap-2 min-w-0">
          {/* Template type icon */}
          {template.type === 'email' ? (
            <Mail className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
          ) : (
            <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
          )}

          {/* Template name */}
          <span
            className={`
              truncate text-sm font-medium
              ${isActive ? 'text-foreground' : 'text-muted-foreground'}
            `}
          >
            {template.name}
          </span>
        </div>
      )}
      getTabKey={(template) => template.id}
      enableDragReorder={true}
      enableContextMenu={true}
      showCloseButton={true}
      variant="default"
    />
  );
}
