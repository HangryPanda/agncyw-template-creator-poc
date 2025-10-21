import { useState, useEffect } from 'react';
import TemplateEditor from './components/TemplateEditor';
import TemplatePreview from './components/TemplatePreview';
import ModernTemplateSidebar from './components/ModernTemplateSidebar';
import TemplateMetadataEditor from './components/TemplateMetadataEditor';
import CharacterCounter from './components/CharacterCounter';
import GlobalSearch from './components/GlobalSearch';
import InlineTagEditor from './components/InlineTagEditor';
import InlineVariableEditor from './components/InlineVariableEditor';
import { Toaster } from './components/ui/sonner';
import { TemplateVariable, EditorState, Template, Tag } from './types';
// Removed App.css - using Tailwind and shadcn styles instead

// Insurance-specific variables for Quote Not Written campaign
const INSURANCE_VARIABLES: TemplateVariable[] = [
  // Customer Info
  { name: 'first_name', label: 'First Name', description: 'Customer first name', example: 'John', group: 'customer' },
  { name: 'last_name', label: 'Last Name', description: 'Customer last name', example: 'Smith', group: 'customer' },

  // Message Details
  { name: 'quote_amount', label: 'Quote Amount', description: 'Original quote amount', example: '$247/mo', group: 'message' },
  { name: 'policy_type', label: 'Policy Type', description: 'Type of insurance', example: 'Auto Insurance', group: 'message' },
  { name: 'quote_date', label: 'Quote Date', description: 'When quote was provided', example: 'September 15th', group: 'message' },
  { name: 'vehicle_info', label: 'Vehicle Info', description: 'Vehicle details', example: '2019 Honda Accord', group: 'message' },

  // Agent Team Member
  { name: 'agent_name', label: 'Agent Name', description: 'Your name', example: 'Sarah Johnson', group: 'agent' },
  { name: 'agent_email', label: 'Agent Email', description: 'Your email address', example: 'sarah.johnson@insurance.com', group: 'agent' },
  { name: 'agent_phone', label: 'Agent Phone', description: 'Your phone number', example: '(555) 987-6543', group: 'agent' },

  // Agency Details
  { name: 'agency_name', label: 'Agency Name', description: 'Your agency', example: 'Premier Insurance Group', group: 'agency' },
  { name: 'phone_number', label: 'Agency Phone', description: 'Agency contact number', example: '(555) 123-4567', group: 'agency' },
];

// Empty template
const EMPTY_TEMPLATE: EditorState = {
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
      {
        children: [
          { type: 'template-variable', variableName: 'phone_number', version: 1 },
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

const CUSTOM_VARIABLES_KEY = 'insurance_template_custom_variables';
const TAGS_KEY = 'insurance_template_tags';
const TEMPLATES_KEY = 'insurance_templates';

function App() {
  const [mode, setMode] = useState<'create' | 'use'>('create');
  const [_view, setView] = useState<'editor'>('editor'); // Reserved for future multi-view functionality
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showTagEditor, setShowTagEditor] = useState(false);
  const [showVariableEditor, setShowVariableEditor] = useState(false);

  // Load saved data
  const [customVariables, setCustomVariables] = useState<TemplateVariable[]>(() => {
    const saved = localStorage.getItem(CUSTOM_VARIABLES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [tags, setTags] = useState<Tag[]>(() => {
    const saved = localStorage.getItem(TAGS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [templates, setTemplates] = useState<Template[]>(() => {
    const saved = localStorage.getItem(TEMPLATES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize with example templates
    const now = Date.now();
    const emailTemplate: Template = {
      id: 'email_template_1',
      name: 'Follow-up Email',
      type: 'email',
      content: EMAIL_TEMPLATE,
      tags: [],
      createdAt: now,
      updatedAt: now,
      isStarred: true,
    };
    const smsTemplate: Template = {
      id: 'sms_template_1',
      name: 'Quick SMS Check-in',
      type: 'sms',
      content: SMS_TEMPLATE,
      tags: [],
      createdAt: now + 1,
      updatedAt: now + 1,
    };
    return [emailTemplate, smsTemplate];
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(() => {
    return templates.length > 0 ? templates[0].id : null;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(CUSTOM_VARIABLES_KEY, JSON.stringify(customVariables));
  }, [customVariables]);

  useEffect(() => {
    localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  }, [templates]);

  // Get selected template
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) ?? null;

  // Combine built-in and custom variables
  const allVariables = [...INSURANCE_VARIABLES, ...customVariables];

  // Variable handlers
  const handleAddVariable = (variable: TemplateVariable): void => {
    setCustomVariables([...customVariables, variable]);
  };

  const handleEditVariable = (index: number, variable: TemplateVariable): void => {
    const updated = [...customVariables];
    updated[index] = variable;
    setCustomVariables(updated);
  };

  const handleDeleteVariable = (index: number): void => {
    const updated = customVariables.filter((_, i) => i !== index);
    setCustomVariables(updated);
  };

  // Tag handlers
  const handleAddTag = (tag: Tag): void => {
    setTags([...tags, tag]);
  };

  const handleEditTag = (tagId: string, updatedTag: Tag): void => {
    setTags(tags.map((tag) => (tag.id === tagId ? updatedTag : tag)));
  };

  const handleDeleteTag = (tagId: string): void => {
    setTags(tags.filter((tag) => tag.id !== tagId));
    // Remove tag from all templates
    setTemplates(
      templates.map((template) => ({
        ...template,
        tags: template.tags.filter((id) => id !== tagId),
      }))
    );
  };

  // Template handlers
  const handleNewTemplate = (): void => {
    const newTemplate: Template = {
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Untitled Template',
      type: 'email',
      content: EMPTY_TEMPLATE,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setTemplates([...templates, newTemplate]);
    setSelectedTemplateId(newTemplate.id);
    setMode('create');
    setView('editor');
  };

  const handleDeleteTemplate = (templateId: string): void => {
    const updated = templates.filter((t) => t.id !== templateId);
    setTemplates(updated);
    // Select another template if we deleted the current one
    if (selectedTemplateId === templateId) {
      setSelectedTemplateId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleSelectTemplate = (templateId: string): void => {
    setSelectedTemplateId(templateId);
    setMode('create');
    setView('editor');
  };

  const handleUpdateTemplateName = (name: string): void => {
    if (!selectedTemplate) return;
    setTemplates(
      templates.map((t) =>
        t.id === selectedTemplate.id ? { ...t, name, updatedAt: Date.now() } : t
      )
    );
  };

  const handleUpdateTemplateType = (type: 'email' | 'sms'): void => {
    if (!selectedTemplate) return;
    setTemplates(
      templates.map((t) =>
        t.id === selectedTemplate.id ? { ...t, type, updatedAt: Date.now() } : t
      )
    );
  };

  const handleUpdateTemplateTags = (tagIds: string[]): void => {
    if (!selectedTemplate) return;
    setTemplates(
      templates.map((t) =>
        t.id === selectedTemplate.id ? { ...t, tags: tagIds, updatedAt: Date.now() } : t
      )
    );
  };

  const handleUpdateTemplateContent = (content: EditorState): void => {
    if (!selectedTemplate) return;
    setTemplates(
      templates.map((t) =>
        t.id === selectedTemplate.id ? { ...t, content, updatedAt: Date.now() } : t
      )
    );
  };

  const handleToggleStar = (templateId: string): void => {
    setTemplates(
      templates.map((t) =>
        t.id === templateId ? { ...t, isStarred: !t.isStarred } : t
      )
    );
  };

  // Reserved for future "Use Template" functionality
  // This will allow users to use a template for sending without editing
  // const handleUseTemplate = (templateId: string): void => {
  //   setTemplates(
  //     templates.map((t) =>
  //       t.id === templateId
  //         ? {
  //             ...t,
  //             lastUsedAt: Date.now(),
  //             useCount: (t.useCount || 0) + 1
  //           }
  //         : t
  //     )
  //   );
  //   setSelectedTemplateId(templateId);
  //   setMode('use');
  //   setView('editor');
  // };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      // Cmd/Ctrl + N for new template
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        handleNewTemplate();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-white font-sans">
      {/* Sidebar */}
      <ModernTemplateSidebar
        templates={templates}
        tags={tags}
        selectedTemplateId={selectedTemplateId}
        onSelectTemplate={handleSelectTemplate}
        onNewTemplate={handleNewTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        onToggleStar={handleToggleStar}
        onManageTags={() => setShowTagEditor(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Compact Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
              <span className="text-sm text-gray-500">Quote Not Written Campaign</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Global Search */}
              <GlobalSearch
                templates={templates}
                onSelectTemplate={(id) => {
                  setSelectedTemplateId(id);
                  setIsSearchOpen(false);
                }}
                onClose={() => setIsSearchOpen(false)}
                onOpen={() => setIsSearchOpen(true)}
                isOpen={isSearchOpen}
              />

              {/* Mode Toggle */}
              <div className="flex bg-gray-100 rounded-md p-0.5">
                <button
                  onClick={() => setMode('create')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
                    mode === 'create'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Editor
                </button>
                <button
                  onClick={() => setMode('use')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
                    mode === 'use'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Compose
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        {selectedTemplate ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Editor/Preview */}
            <div className="flex-1 flex flex-col bg-white">
              {mode === 'create' ? (
                <>
                  {/* Editor Header */}
                  <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                    <div className="flex items-center justify-between">
                      <TemplateMetadataEditor
                        template={selectedTemplate}
                        tags={tags}
                        onUpdateName={handleUpdateTemplateName}
                        onUpdateType={handleUpdateTemplateType}
                        onUpdateTags={handleUpdateTemplateTags}
                        onManageTags={() => setShowTagEditor(true)}
                      />

                      <button
                        onClick={() => setShowVariableEditor(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        Placeholders
                      </button>
                    </div>
                  </div>

                  {/* Editor */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">
                      <TemplateEditor
                        key={selectedTemplate.id}
                        templateId={selectedTemplate.id}
                        initialState={selectedTemplate.content}
                        availableVariables={allVariables}
                        onStateChange={handleUpdateTemplateContent}
                        onManageVariables={() => setShowVariableEditor(true)}
                      />

                      {/* Character Counter for SMS */}
                      {selectedTemplate.type === 'sms' && (
                        <div className="mt-4">
                          <CharacterCounter
                            editorState={selectedTemplate.content}
                            type={selectedTemplate.type}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Compose Mode */}
                  <TemplatePreview
                    template={selectedTemplate}
                    availableVariables={allVariables}
                  />
                </>
              )}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No template selected</h2>
              <p className="text-gray-600 mb-6">
                Create a new template or select one from the sidebar to get started
              </p>
              <button
                onClick={handleNewTemplate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Template
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inline Tag Editor */}
      <InlineTagEditor
        isOpen={showTagEditor}
        onClose={() => setShowTagEditor(false)}
        tags={tags}
        selectedTags={selectedTemplate?.tags || []}
        onTagsChange={handleUpdateTemplateTags}
        onAddTag={handleAddTag}
        onEditTag={handleEditTag}
        onDeleteTag={handleDeleteTag}
      />

      {/* Inline Variable Editor */}
      <InlineVariableEditor
        isOpen={showVariableEditor}
        onClose={() => setShowVariableEditor(false)}
        customVariables={customVariables}
        onAddVariable={handleAddVariable}
        onEditVariable={handleEditVariable}
        onDeleteVariable={handleDeleteVariable}
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

export default App;