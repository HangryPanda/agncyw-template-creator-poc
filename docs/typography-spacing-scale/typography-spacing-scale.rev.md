Revised Spacing Scale (for 13px base typography)
Base Scale (4px unit) - More Compact:

2xs: 2px - hairline spacing, ultra-tight table cells
xs: 4px - tight spacing for compact data, badges, inline elements
sm: 6px - compact button padding, tight form elements
md: 8px - default spacing between related elements
lg: 12px - comfortable spacing, form field gaps
xl: 16px - card padding, section spacing
2xl: 24px - major section breaks
3xl: 32px - page-level spacing
4xl: 48px - marketing sections (rarely used in app)

Why the Changes?
Added 2xs (2px):

Table cell padding in dense data grids
Spacing between icon and text in compact buttons
Tag/badge internal padding

Changed sm (8px → 6px):

Better proportion for 13px text in buttons
Tighter form controls match VSCode/Linear feel

Changed md (12px → 8px):

More appropriate default for 13px typography
Matches spacing between form labels and inputs

Kept the ratio tighter overall:

With smaller text, you need less breathing room
Maintains information density without feeling cramped

Comparison with Industry Standards:
VSCode:

Uses 2px, 4px, 8px heavily for UI chrome
12px-16px for panel padding
Very tight by default

Linear:

4px, 8px, 12px for most UI
16px for cards
Compact but not cramped

Figma:

4px, 8px, 12px in panels
16px for major sections
Dense information architecture

Updated Tokens:
json{
  "spacing": {
    "2xs": {
      "$type": "dimension",
      "$value": "2px"
    },
    "xs": {
      "$type": "dimension",
      "$value": "4px"
    },
    "sm": {
      "$type": "dimension",
      "$value": "6px"
    },
    "md": {
      "$type": "dimension",
      "$value": "8px"
    },
    "lg": {
      "$type": "dimension",
      "$value": "12px"
    },
    "xl": {
      "$type": "dimension",
      "$value": "16px"
    },
    "2xl": {
      "$type": "dimension",
      "$value": "24px"
    },
    "3xl": {
      "$type": "dimension",
      "$value": "32px"
    },
    "4xl": {
      "$type": "dimension",
      "$value": "48px"
    }
  }
}



NOT READY FOR IMPLEMENTATION: 
Automation with Style Dictionary
For a completely automated pipeline, use Style Dictionary:
javascript// build-tokens.js
const StyleDictionary = require('style-dictionary');

StyleDictionary.extend({
  source: ['tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables'
      }]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'src/',
      files: [{
        destination: 'tokens.js',
        format: 'javascript/es6'
      }]
    }
  }
}).buildAllPlatforms();
Run with: node build-tokens.js
Workflow
Design → Code Pipeline:

Design in Figma using variables
Export variables using Tokens Studio plugin → tokens.json
Run Style Dictionary → generates CSS, JS, and Tailwind configs
Commit generated files to your repo
Use in code with identical naming

Example Usage:
jsx// React component using Tailwind
<div className="p-lg text-base font-medium">
  Card content
</div>

// Or with CSS custom properties
<div style={{ 
  padding: 'var(--spacing-lg)',
  fontSize: 'var(--fontSize-base)',
  fontWeight: 'var(--fontWeight-medium)'
}}>
  Card content
</div>

// Or with JS tokens
import { tokens } from './tokens';

const styles = {
  padding: tokens.spacing.lg,
  fontSize: tokens.fontSize.base,
  fontWeight: tokens.fontWeight.medium,
};
This system ensures your designers and developers are always speaking the same language. When a spacing value changes in Figma, you re-export and rebuild - the change propagates everywhere automatically.