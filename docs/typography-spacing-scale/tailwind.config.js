/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Override default Tailwind spacing to match our design system
    spacing: {
      '2xs': '2px',
      'xs': '4px',
      'sm': '6px',
      'md': '8px',
      'lg': '12px',
      'xl': '16px',
      '2xl': '24px',
      '3xl': '32px',
      '4xl': '48px',
      // Keep numeric scale for edge cases
      '0': '0px',
      '1': '4px',   // Maps to xs
      '2': '8px',   // Maps to md
      '3': '12px',  // Maps to lg
      '4': '16px',  // Maps to xl
      '6': '24px',  // Maps to 2xl
      '8': '32px',  // Maps to 3xl
      '12': '48px', // Maps to 4xl
    },
    
    // Side panel-first breakpoints
    screens: {
      'panel-xs': '360px',
      'panel-sm': '420px',
      'panel-md': '480px',  // Primary design target
      'panel-lg': '600px',
      'panel-xl': '720px',
      'panel-full': '1024px',
    },
    
    extend: {
      // Typography scale optimized for 13px base
      fontSize: {
        '2xs': ['10px', { lineHeight: '1.5' }],
        'xs': ['11px', { lineHeight: '1.5' }],
        'sm': ['12px', { lineHeight: '1.5' }],
        'base': ['13px', { lineHeight: '1.5' }],
        'md': ['14px', { lineHeight: '1.5' }],
        'lg': ['16px', { lineHeight: '1.5' }],
        'xl': ['18px', { lineHeight: '1.5' }],
        '2xl': ['20px', { lineHeight: '1.25' }],
        '3xl': ['24px', { lineHeight: '1.25' }],
        '4xl': ['30px', { lineHeight: '1.25' }],
      },
      
      // Font families
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      
      // Font weights
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      
      // Line heights
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
      },
    },
  },
  plugins: [
    // Container queries plugin for panel-responsive components
    require('@tailwindcss/container-queries'),
  ],
}
