import { Template, EditorState } from '@/types';

// Schema version for migrations
export const CURRENT_SCHEMA_VERSION = 1;

// Empty template
export const EMPTY_TEMPLATE: EditorState = {
  root: {
    children: [
      {
        children: [{ text: '', type: 'text' }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
};

// Pre-built Email Template
const EMAIL_TEMPLATE: EditorState = {
  root: {
    children: [
      {
        children: [
          { text: 'Hi ', type: 'text' },
          { type: 'template-variable', variableName: 'first_name', version: 1 },
          { text: ',', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [{ text: '', type: 'text' }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { text: "I hope this email finds you well! I'm reaching out because I noticed we provided you with a ", type: 'text' },
          { type: 'template-variable', variableName: 'policy_type', version: 1 },
          { text: ' quote for ', type: 'text' },
          { type: 'template-variable', variableName: 'quote_amount', version: 1 },
          { text: ' back on ', type: 'text' },
          { type: 'template-variable', variableName: 'quote_date', version: 1 },
          { text: '.', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [{ text: '', type: 'text' }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { text: "Insurance rates and coverage options change frequently, and I'd love the opportunity to review your needs again. We may be able to find you even better coverage or savings than before.", type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [{ text: '', type: 'text' }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { text: 'Would you have 10 minutes this week to discuss your current insurance needs? ', type: 'text' },
          { text: "I'm available at your convenience.", format: 'bold', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [{ text: '', type: 'text' }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [{ text: 'Best regards,', type: 'text' }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [{ type: 'template-variable', variableName: 'agent_name', version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [{ type: 'template-variable', variableName: 'agency_name', version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [{ type: 'template-variable', variableName: 'phone_number', version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
};

// Pre-built SMS Template
const SMS_TEMPLATE: EditorState = {
  root: {
    children: [
      {
        children: [
          { text: 'Hi ', type: 'text' },
          { type: 'template-variable', variableName: 'first_name', version: 1 },
          { text: ', this is ', type: 'text' },
          { type: 'template-variable', variableName: 'agent_name', version: 1 },
          { text: ' from ', type: 'text' },
          { type: 'template-variable', variableName: 'agency_name', version: 1 },
          { text: '. Your ', type: 'text' },
          { type: 'template-variable', variableName: 'policy_type', version: 1 },
          { text: ' quote from ', type: 'text' },
          { type: 'template-variable', variableName: 'quote_date', version: 1 },
          { text: ' may have expired. Would you like me to run new numbers for you? Reply YES for a quick review.', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
};

// Intro/Getting Started Template
const INTRO_TEMPLATE: EditorState = {
  root: {
    children: [
      {
        children: [
          { text: 'Welcome to the Template Creator! 👋', format: 'bold', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'heading',
        tag: 'h2',
        version: 1,
      },
      {
        children: [{ text: '', type: 'text' }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { text: "This tool helps you create reusable message templates for insurance outreach. Think of it as building a fill-in-the-blank letter that you can use over and over with different customers.", type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [{ text: '', type: 'text' }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { text: '📝 Edit Mode (What You\'re Using Now)', format: 'bold', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { text: 'Right now, you\'re in ', type: 'text' },
          { text: 'Edit mode', format: 'bold', type: 'text' },
          { text: ' - perfect for building and modifying templates. Here\'s how to add variables (those fill-in-the-blank fields):', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [{ text: '', type: 'text' }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          {
            children: [
              { text: 'Type ', type: 'text' },
              { text: '{{', type: 'text', format: 'code' },
              { text: ' and pick from the list', type: 'text' },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'listitem',
            value: 1,
            version: 1,
          },
          {
            children: [
              { text: 'Type ', type: 'text' },
              { text: '/', type: 'text', format: 'code' },
              { text: ' and select "Variable"', type: 'text' },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'listitem',
            value: 2,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        listType: 'bullet',
        start: 1,
        tag: 'ul',
        type: 'list',
        version: 1,
      },
      {
        children: [{ text: '', type: 'text' }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { text: 'Try it right here! Type ', type: 'text' },
          { text: '{{', type: 'text', format: 'code' },
          { text: ' on the line below and add your ', type: 'text' },
          { type: 'template-variable', variableName: 'customer_name', version: 1 },
          { text: ':', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [{ text: '', type: 'text' }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [{ text: '', type: 'text' }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { text: '✨ Compose Mode (Try It Next!)', format: 'bold', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { text: 'Once your template is ready, click the ', type: 'text' },
          { text: '📝 Compose', format: 'bold', type: 'text' },
          { text: ' button in the toolbar above. This switches you to ', type: 'text' },
          { text: 'Compose mode', format: 'bold', type: 'text' },
          { text: ' where you can fill in all your variables with real customer information.', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [{ text: '', type: 'text' }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { text: 'In Compose mode, the variables turn green and become clickable. Fill them in, and your personalized message is ready to copy!', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [{ text: '', type: 'text' }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { text: '🚀 Ready to Go!', format: 'bold', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { text: 'Go ahead - click ', type: 'text' },
          { text: 'Compose', format: 'bold', type: 'text' },
          { text: ' now and see how the ', type: 'text' },
          { type: 'template-variable', variableName: 'customer_name', version: 1 },
          { text: ' variable becomes editable. You can always switch back to Edit mode to make changes. Happy templating!', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
};

/**
 * System Templates - Provided by the app, can be deleted but restored from "server"
 * These templates will automatically be restored if missing
 */
export const SYSTEM_TEMPLATES: Omit<Template, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'intro_template',
    name: 'Getting Started Guide',
    type: 'email',
    content: INTRO_TEMPLATE,
    tags: [],
    isStarred: true,
    templateType: 'system',
    version: 1,
    schemaVersion: CURRENT_SCHEMA_VERSION,
  },
  {
    id: 'email_template_1',
    name: 'Follow-up Email',
    type: 'email',
    content: EMAIL_TEMPLATE,
    tags: [],
    isStarred: true,
    templateType: 'system',
    version: 1,
    schemaVersion: CURRENT_SCHEMA_VERSION,
  },
  {
    id: 'sms_template_1',
    name: 'Quick SMS Check-in',
    type: 'sms',
    content: SMS_TEMPLATE,
    tags: [],
    templateType: 'system',
    version: 1,
    schemaVersion: CURRENT_SCHEMA_VERSION,
  },
];

/**
 * Agency Templates - Defined by agency owners/managers (future implementation)
 * These will sync from agency settings when backend is implemented
 */
export const AGENCY_TEMPLATES: Omit<Template, 'createdAt' | 'updatedAt'>[] = [
  // Will be populated from agency settings in the future
];
