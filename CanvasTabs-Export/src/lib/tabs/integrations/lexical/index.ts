/**
 * Lexical Editor Integration for Tab Management System
 *
 * This module provides Lexical-specific tab management utilities including:
 * - Dirty state tracking using Lexical History Plugin
 * - Template editor tabs with confirmation dialogs
 * - Headless plugin for reporting dirty state changes
 */

export { useLexicalDirtyState } from './useLexicalDirtyState';
export type { UseLexicalDirtyStateReturn } from './useLexicalDirtyState';

export { DirtyStatePlugin } from './DirtyStatePlugin';
export type { DirtyStatePluginProps } from './DirtyStatePlugin';

export { useTemplateEditorTabs } from './useTemplateEditorTabs';
export type { UseTemplateEditorTabsReturn } from './useTemplateEditorTabs';

export { TemplateEditorTabs } from './TemplateEditorTabs';
export type { TemplateEditorTabsProps } from './TemplateEditorTabs';
