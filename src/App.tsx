import { useState } from 'react';
import TemplateEditor from './components/TemplateEditor';
import TemplatePreview from './components/TemplatePreview';
import { TemplateVariable, EditorState } from './types';
import './App.css';
import React from 'react';

// Insurance-specific variables for Quote Not Written campaign
const INSURANCE_VARIABLES: TemplateVariable[] = [
  { name: 'first_name', label: 'First Name', description: 'Customer first name', example: 'John' },
  { name: 'last_name', label: 'Last Name', description: 'Customer last name', example: 'Smith' },
  { name: 'quote_amount', label: 'Quote Amount', description: 'Original quote amount', example: '$247/mo' },
  { name: 'quote_date', label: 'Quote Date', description: 'When quote was provided', example: 'September 15th' },
  { name: 'policy_type', label: 'Policy Type', description: 'Type of insurance', example: 'Auto Insurance' },
  { name: 'agent_name', label: 'Agent Name', description: 'Your name', example: 'Sarah Johnson' },
  { name: 'agency_name', label: 'Agency Name', description: 'Your agency', example: 'Premier Insurance Group' },
  { name: 'phone_number', label: 'Phone Number', description: 'Your contact number', example: '(555) 123-4567' },
];

// Pre-built templates
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
        children: [
          { text: '', type: 'text' },
        ],
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
        children: [
          { text: '', type: 'text' },
        ],
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
        children: [
          { text: '', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { text: 'Would you be open to a quick 10-minute conversation to see if we can requote you with our latest options? I promise to respect your time and provide genuine value.', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { text: '', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { text: 'Just reply to this email or give me a call at ', type: 'text' },
          { type: 'template-variable', variableName: 'phone_number', version: 1 },
          { text: '.', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { text: '', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { text: 'Best regards,', type: 'text' },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { type: 'template-variable', variableName: 'agent_name', version: 1 },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          { type: 'template-variable', variableName: 'agency_name', version: 1 },
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

const SMS_TEMPLATE: EditorState = {
  root: {
    children: [
      {
        children: [
          { text: 'Hi ', type: 'text' },
          { type: 'template-variable', variableName: 'first_name', version: 1 },
          { text: '! This is ', type: 'text' },
          { type: 'template-variable', variableName: 'agent_name', version: 1 },
          { text: ' from ', type: 'text' },
          { type: 'template-variable', variableName: 'agency_name', version: 1 },
          { text: '. I provided you a ', type: 'text' },
          { type: 'template-variable', variableName: 'policy_type', version: 1 },
          { text: ' quote for ', type: 'text' },
          { type: 'template-variable', variableName: 'quote_amount', version: 1 },
          { text: '. Rates have changed - can I requote you? May save you money! Reply YES if interested. Thanks!', type: 'text' },
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

type TabType = 'email' | 'sms';
type ModeType = 'create' | 'use';

function App(): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabType>('email');
  const [emailTemplate, setEmailTemplate] = useState<EditorState>(EMAIL_TEMPLATE);
  const [smsTemplate, setSmsTemplate] = useState<EditorState>(SMS_TEMPLATE);
  const [mode, setMode] = useState<ModeType>('create');

  const currentTemplate = activeTab === 'email' ? emailTemplate : smsTemplate;
  const setCurrentTemplate = activeTab === 'email' ? setEmailTemplate : setSmsTemplate;

  return (
    <div style={appStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>🛡️ Insurance Template Creator</h1>
        <p style={subtitleStyle}>Quote Not Written Campaign - Requote Permission Templates</p>
      </header>

      <div style={modeToggleStyle}>
        <button
          onClick={() => setMode('create')}
          style={{
            ...modeButtonStyle,
            ...(mode === 'create' ? modeButtonActiveStyle : {}),
          }}
        >
          Create Template
        </button>
        <button
          onClick={() => setMode('use')}
          style={{
            ...modeButtonStyle,
            ...(mode === 'use' ? modeButtonActiveStyle : {}),
          }}
        >
          Use Template
        </button>
      </div>

      <div style={tabsStyle}>
        <button
          onClick={() => setActiveTab('email')}
          style={{
            ...tabButtonStyle,
            ...(activeTab === 'email' ? activeTabStyle : {}),
          }}
        >
          📧 Email Template
        </button>
        <button
          onClick={() => setActiveTab('sms')}
          style={{
            ...tabButtonStyle,
            ...(activeTab === 'sms' ? activeTabStyle : {}),
          }}
        >
          💬 SMS Template
        </button>
      </div>

      <div style={contentStyle}>
        {mode === 'create' ? (
          <div>
            <h2 style={sectionTitleStyle}>
              {activeTab === 'email' ? 'Email' : 'SMS'} Template Editor
            </h2>
            <p style={instructionStyle}>
              Click the variable buttons below to insert fill-in-the-blank fields into your template.
            </p>
            <TemplateEditor
              key={activeTab}
              onChange={setCurrentTemplate}
              initialState={JSON.stringify(currentTemplate)}
              availableVariables={INSURANCE_VARIABLES}
            />
          </div>
        ) : (
          <div>
            <h2 style={sectionTitleStyle}>Use Your Template</h2>
            <p style={instructionStyle}>
              Fill in the customer details below and copy the completed template to your clipboard.
            </p>
            <TemplatePreview
              templateState={currentTemplate}
              availableVariables={INSURANCE_VARIABLES}
            />
          </div>
        )}
      </div>

      <footer style={footerStyle}>
        <p>
          💡 <strong>Pro Tip:</strong> Save time by creating templates once, then quickly fill in
          customer details for each outreach. This ensures consistent messaging while
          personalizing each interaction.
        </p>
      </footer>
    </div>
  );
}

const appStyle: React.CSSProperties = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: '20px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '32px',
  paddingBottom: '16px',
  borderBottom: '2px solid #1976d2',
};

const titleStyle: React.CSSProperties = {
  margin: '0 0 8px 0',
  fontSize: '32px',
  color: '#1976d2',
};

const subtitleStyle: React.CSSProperties = {
  margin: '0',
  fontSize: '16px',
  color: '#666',
};

const modeToggleStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  marginBottom: '24px',
  justifyContent: 'center',
};

const modeButtonStyle: React.CSSProperties = {
  padding: '12px 24px',
  fontSize: '16px',
  fontWeight: '500',
  border: '2px solid #1976d2',
  backgroundColor: 'white',
  color: '#1976d2',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const modeButtonActiveStyle: React.CSSProperties = {
  backgroundColor: '#1976d2',
  color: 'white',
};

const tabsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  marginBottom: '24px',
};

const tabButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px',
  fontSize: '16px',
  fontWeight: '500',
  border: '1px solid #ddd',
  backgroundColor: '#f5f5f5',
  cursor: 'pointer',
  borderRadius: '8px 8px 0 0',
  transition: 'all 0.2s',
};

const activeTabStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderBottom: '2px solid white',
  fontWeight: '600',
  color: '#1976d2',
};

const contentStyle: React.CSSProperties = {
  marginBottom: '24px',
};

const sectionTitleStyle: React.CSSProperties = {
  marginTop: '0',
  marginBottom: '8px',
  fontSize: '20px',
  color: '#333',
};

const instructionStyle: React.CSSProperties = {
  marginTop: '0',
  marginBottom: '16px',
  fontSize: '14px',
  color: '#666',
};

const footerStyle: React.CSSProperties = {
  marginTop: '32px',
  padding: '16px',
  backgroundColor: '#fff3cd',
  border: '1px solid #ffc107',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#856404',
};

export default App;
