/**
 * Tab Management System
 *
 * A modular, reusable VS Code-style tab navigation system for React applications.
 *
 * ## Core System
 * Generic tab state management with persistence, drag-and-drop, and keyboard shortcuts.
 * Import from `@/lib/tabs/core` for framework-agnostic usage.
 *
 * ## Integrations
 * Editor-specific integrations (e.g., Lexical) that add dirty state tracking and
 * custom tab behaviors. Import from `@/lib/tabs/integrations/[integration-name]`.
 *
 * @see {@link file://./CLAUDE.md} for complete documentation
 */

// Export core tab system
export * from './core';

// Export integrations
export * from './integrations';
