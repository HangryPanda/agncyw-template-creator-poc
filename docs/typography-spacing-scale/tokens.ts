/**
 * Design Tokens for Agency Workspace
 * Side Panel-First SaaS Design System
 * 
 * Base: 13px typography, 4px spacing unit
 * Optimized for: 360px - 800px panel widths
 */

export const tokens = {
  spacing: {
    '2xs': '2px',
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '48px',
  },
  fontSize: {
    '2xs': '10px',
    xs: '11px',
    sm: '12px',
    base: '13px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '30px',
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontFamily: {
    base: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', monospace",
  },
  breakpoints: {
    'panel-xs': '360px',
    'panel-sm': '420px',
    'panel-md': '480px',
    'panel-lg': '600px',
    'panel-xl': '720px',
    'panel-full': '1024px',
  },
} as const;

// Type exports for type-safe usage
export type Spacing = keyof typeof tokens.spacing;
export type FontSize = keyof typeof tokens.fontSize;
export type LineHeight = keyof typeof tokens.lineHeight;
export type FontWeight = keyof typeof tokens.fontWeight;
export type FontFamily = keyof typeof tokens.fontFamily;
export type Breakpoint = keyof typeof tokens.breakpoints;

// Numeric value helpers (strips 'px' suffix)
export const spacingValues = Object.entries(tokens.spacing).reduce((acc, [key, value]) => {
  acc[key as Spacing] = parseInt(value);
  return acc;
}, {} as Record<Spacing, number>);

export const fontSizeValues = Object.entries(tokens.fontSize).reduce((acc, [key, value]) => {
  acc[key as FontSize] = parseInt(value);
  return acc;
}, {} as Record<FontSize, number>);

export const breakpointValues = Object.entries(tokens.breakpoints).reduce((acc, [key, value]) => {
  acc[key as Breakpoint] = parseInt(value);
  return acc;
}, {} as Record<Breakpoint, number>);

// Usage example:
// import { tokens, spacingValues } from './tokens';
// const padding = tokens.spacing.md; // '8px'
// const paddingNum = spacingValues.md; // 8