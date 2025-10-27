/**
 * Color Utilities for SaaS Component Library
 *
 * Provides type-safe access to the 6 brand colors across all 14 themes:
 * - brand-blue: Primary actions, links, focus states
 * - brand-purple: Secondary actions, highlights
 * - brand-green: Success, positive feedback
 * - brand-pink: Accents, special highlights
 * - brand-orange: Warnings, alerts
 * - brand-red: Errors, destructive actions
 */

export type BrandColor = 'blue' | 'purple' | 'green' | 'pink' | 'orange' | 'red'

export type Status =
  | 'complete'
  | 'active'
  | 'pending'
  | 'blocked'
  | 'draft'
  | 'archived'

export type Priority =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'none'

export type ActivityType =
  | 'create'
  | 'update'
  | 'delete'
  | 'comment'
  | 'share'
  | 'status_change'

/**
 * Map status to brand colors
 */
export const statusColors: Record<Status, BrandColor> = {
  complete: 'green',
  active: 'blue',
  pending: 'orange',
  blocked: 'red',
  draft: 'purple',
  archived: 'purple',
}

/**
 * Map priority levels to brand colors
 */
export const priorityColors: Record<Priority, BrandColor> = {
  critical: 'red',
  high: 'orange',
  medium: 'blue',
  low: 'purple',
  none: 'purple',
}

/**
 * Map activity types to brand colors
 */
export const activityColors: Record<ActivityType, BrandColor> = {
  create: 'green',
  update: 'blue',
  delete: 'red',
  comment: 'purple',
  share: 'blue',
  status_change: 'orange',
}

/**
 * Get CSS variable for brand color
 * @example getColorVar('blue') => 'var(--brand-blue)'
 */
export function getColorVar(color: BrandColor): string {
  return `var(--brand-${color})`
}

/**
 * Get color-mix expression for brand color with opacity
 * @example getColorMix('blue', 10) => 'color-mix(in oklch, var(--brand-blue) 10%, transparent)'
 */
export function getColorMix(color: BrandColor, opacity: number): string {
  return `color-mix(in oklch, var(--brand-${color}) ${opacity}%, transparent)`
}

/**
 * Get brand color for a status
 */
export function getStatusColor(status: Status): string {
  return getColorVar(statusColors[status])
}

/**
 * Get brand color for a priority
 */
export function getPriorityColor(priority: Priority): string {
  return getColorVar(priorityColors[priority])
}

/**
 * Get brand color for an activity type
 */
export function getActivityColor(activity: ActivityType): string {
  return getColorVar(activityColors[activity])
}

/**
 * Get chart color by index (cycles through brand colors)
 * @example getChartColor(0) => 'blue'
 */
export function getChartColor(index: number): BrandColor {
  const colors: BrandColor[] = ['blue', 'purple', 'green', 'pink', 'orange', 'red']
  return colors[index % colors.length]
}

/**
 * Get tag color by index (cycles through 5 brand colors, excluding red)
 * @example getTagColor(0) => 'blue'
 */
export function getTagColor(index: number): BrandColor {
  const colors: BrandColor[] = ['blue', 'purple', 'green', 'pink', 'orange']
  return colors[index % colors.length]
}

/**
 * Get Tailwind class name for brand color background
 * Note: This requires the color to be defined in Tailwind config
 */
export function getBrandColorClass(color: BrandColor, type: 'bg' | 'text' | 'border' = 'bg'): string {
  return `${type}-brand-${color}`
}

/**
 * Check if a color is considered "positive" for a given context
 */
export function isPositiveColor(color: BrandColor): boolean {
  return color === 'green' || color === 'blue'
}

/**
 * Check if a color is considered "negative" for a given context
 */
export function isNegativeColor(color: BrandColor): boolean {
  return color === 'red' || color === 'orange'
}

/**
 * Get appropriate text color (light or dark) for accessibility on brand color background
 * All brand colors should use white text for sufficient contrast
 */
export function getContrastTextColor(_color: BrandColor): string {
  return 'var(--primary-foreground)' // Always white for brand colors
}
