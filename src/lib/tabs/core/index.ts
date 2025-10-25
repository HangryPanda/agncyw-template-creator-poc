/**
 * Generic Tab System
 *
 * Modular tab management system that can be used in any React application.
 * Provides both state management (hooks) and UI (components).
 *
 * @example
 * ```typescript
 * import { useTabManager, TabBar } from '@/lib/tabs';
 *
 * function MyApp() {
 *   const tabManager = useTabManager({
 *     storageKey: 'my_app_tabs',
 *     persist: true,
 *   });
 *
 *   return (
 *     <TabBar
 *       {...tabManager}
 *       items={myItemsMap}
 *       renderTabContent={(item) => <div>{item.name}</div>}
 *     />
 *   );
 * }
 * ```
 */

export { useTabManager } from './useTabManager';
export { TabBar } from './TabBar';
export type {
  TabItem,
  TabsState,
  UseTabManagerOptions,
  TabManagerReturn,
} from './types';
export type { TabBarProps } from './TabBar';
