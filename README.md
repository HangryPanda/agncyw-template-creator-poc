# Insurance Template Creator - POC (TypeScript)

A proof of concept for creating and using email and SMS templates with fill-in-the-blank fields for insurance Quote Not Written campaigns. Built with React, TypeScript, Vite, and Lexical.

## Features

- **Template Editor**: Create templates with dynamic fill-in-the-blank fields using Lexical editor
- **Template Variables**: Insert customer data fields like name, quote amount, policy type, etc.
- **Dual Templates**: Separate templates for email and SMS outreach
- **Template Usage**: Fill in customer details and copy completed templates to clipboard
- **Insurance-Specific**: Pre-built for Quote Not Written requote permission campaigns
- **Fully Typed**: Complete TypeScript implementation with proper types

## How to Run in CodeSandbox

### Option 1: Direct Upload
1. Go to https://codesandbox.io/
2. Click "Create Sandbox" → "Import from GitHub" or drag and drop
3. Upload this entire zip file
4. CodeSandbox will automatically detect it's a Vite + React + TypeScript project
5. Dependencies will install automatically and the dev server will start

### Option 2: Manual Import
1. Extract this zip file
2. Go to https://codesandbox.io/
3. Drag the extracted folder into CodeSandbox
4. Wait for dependencies to install
5. The preview will load automatically

## How to Run Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## How to Use

### Create Mode
1. Switch between "Email Template" and "SMS Template" tabs
2. Click variable buttons (First Name, Quote Amount, etc.) to insert fill-in-the-blank fields
3. Type your message around the variables
4. Variables appear as blue pills like {{first_name}}

### Use Mode
1. Switch to "Use Template" mode
2. Fill in the customer details in the form
3. See the completed template in the preview
4. Click "Copy to Clipboard" to copy the final text
5. Paste into your email client or SMS tool

## Use Case: Quote Not Written Campaign

This POC is designed for insurance sales professionals running "Quote Not Written" campaigns. The goal is to:

1. Re-engage prospects who received quotes but didn't purchase
2. Ask permission to requote them with updated rates
3. Personalize outreach at scale using templates
4. Maintain consistent messaging across the team

## Technical Stack

- **Vite** - Build tool and dev server
- **React 18** - UI framework  
- **TypeScript** - Type safety and better DX
- **Lexical** - Rich text editor from Meta (MIT licensed)
- **Custom Nodes** - TemplateVariableNode for fill-in-the-blank fields

## Project Structure

```
src/
├── components/
│   ├── TemplateEditor.tsx    # Main editor component
│   └── TemplatePreview.tsx   # Preview and usage component
├── nodes/
│   └── TemplateVariableNode.tsx  # Custom Lexical node
├── plugins/
│   └── ToolbarPlugin.tsx     # Variable insertion toolbar
├── types/
│   └── index.ts              # TypeScript interfaces
├── App.tsx                   # Main application
├── App.css                   # Global styles
└── main.tsx                  # Entry point
```

## Key Components

- **TemplateVariableNode.tsx** - Custom Lexical DecoratorNode for template variables with full TypeScript typing
- **ToolbarPlugin.tsx** - Toolbar with buttons to insert variables
- **TemplateEditor.tsx** - Main editor component with Lexical composer
- **TemplatePreview.tsx** - Preview and usage component with form inputs
- **App.tsx** - Main application with pre-built insurance templates and state management

## Pre-built Templates

### Email Template
Professional email asking for permission to requote with personalized details.

### SMS Template  
Concise text message for mobile outreach with key details.

## TypeScript Benefits

- Full type safety across components
- Better IDE autocomplete and IntelliSense
- Compile-time error catching
- Self-documenting code with interfaces
- Easier refactoring and maintenance

## License

MIT - Free for commercial use (Lexical is also MIT licensed)

## Notes for Production

If building this for production, consider:
- Saving templates to a database (with proper typing for API calls)
- User authentication and template sharing
- Template versioning and history
- Analytics on template usage and effectiveness
- Integration with CRM systems (typed API clients)
- Multi-language support
- A/B testing capabilities
- Server-side validation of template structure
- Rate limiting for copy operations
- Template library/marketplace

## Troubleshooting

### CodeSandbox Issues
- If dependencies don't install, try refreshing the page
- Make sure you're using a React TypeScript template in CodeSandbox
- Check the console for any TypeScript errors

### Type Errors
- All components are properly typed
- EditorState interface matches Lexical's structure
- Custom node types extend Lexical's base types correctly

## Why Lexical?

- **MIT Licensed** - Completely free for commercial use
- **Extensible** - Easy to create custom nodes like our TemplateVariableNode
- **Modern** - Built by Meta with React best practices
- **Performant** - Handles large documents efficiently
- **TypeScript-first** - Excellent TypeScript support out of the box
