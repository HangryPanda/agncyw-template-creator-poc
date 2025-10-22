import { useState, useEffect, useCallback } from 'react';
import TemplateEditor from './components/TemplateEditor';
import ModernTemplateSidebar from './components/ModernTemplateSidebar';
import TemplateMetadataEditor from './components/TemplateMetadataEditor';
import CharacterCounter from './components/CharacterCounter';
import GlobalSearch from './components/GlobalSearch';
import InlineTagEditor from './components/InlineTagEditor';
import InlineVariableEditor from './components/InlineVariableEditor';
import { FormWrapper } from './components/FormWrapper';
import { ResponsiveDrawer } from './components/ResponsiveDrawer';
import { useTemplateValues } from './hooks/use-template-values';
import { Toaster } from './components/ui/sonner';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/ui/resizable';
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);
  const [variableToInsert, setVariableToInsert] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

  // Template values hook for Compose mode
  const templateValues = useTemplateValues(
    selectedTemplateId || 'default',
    allVariables
  );

  // Handle variable insertion from FormWrapper
  const handleInsertVariable = useCallback((variableName: string): void => {
    setVariableToInsert(variableName);
  }, []);

  const handleVariableInserted = useCallback((): void => {
    setVariableToInsert(null);
  }, []);

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

  // Window resize handler for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive sidebar collapse logic
  useEffect(() => {
    // Breakpoints:
    // < 768px: Mobile - sidebar hidden via CSS (existing drawer pattern)
    // 768px - 1024px: Tablet - can be collapsed or expanded
    // >= 1024px: Desktop - expanded by default

    if (windowWidth < 768) {
      // Mobile: sidebar handled by drawer, keep collapsed state
      setIsSidebarCollapsed(true);
    } else if (windowWidth >= 768 && windowWidth < 1024) {
      // Tablet: allow user control, but start collapsed for narrow viewports
      // User can expand manually via toggle
    } else {
      // Desktop: expanded by default
      setIsSidebarCollapsed(false);
    }
  }, [windowWidth]);

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
      // Cmd/Ctrl + B for toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        if (windowWidth >= 768) {
          setIsSidebarCollapsed(!isSidebarCollapsed);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarCollapsed, windowWidth]);

  return (
    <div className="h-screen bg-white font-sans">
      <ResizablePanelGroup direction="horizontal" className="h-screen">
        {/* Sidebar - Hidden on mobile (< 768px), resizable on desktop */}
        {windowWidth >= 768 && (
          <>
            <ResizablePanel
              defaultSize={25}
              minSize={15}
              maxSize={40}
              collapsible={true}
              collapsedSize={0}
              onCollapse={() => setIsSidebarCollapsed(true)}
              onExpand={() => setIsSidebarCollapsed(false)}
              className={isSidebarCollapsed ? 'min-w-0' : 'min-w-[240px]'}
            >
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
            </ResizablePanel>
            <ResizableHandle withHandle className="w-1 bg-gray-200 hover:bg-blue-400 transition-colors" />
          </>
        )}

        {/* Main Content */}
        <ResizablePanel defaultSize={75} minSize={50}>
          <div className="h-full flex flex-col overflow-hidden">
        {/* Compact Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Sidebar Toggle Button */}
              <button
                onClick={() => {
                  if (windowWidth < 768) {
                    // Mobile: Open drawer with sidebar
                    setIsSidebarDrawerOpen(true);
                  } else {
                    // Desktop: Toggle sidebar collapse
                    setIsSidebarCollapsed(!isSidebarCollapsed);
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title={windowWidth < 768 ? 'Open templates' : (isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar')}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
              <span className="hidden sm:inline text-sm text-gray-500">Quote Not Written Campaign</span>
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

                {/* Mobile Placeholders Button */}
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="flex md:hidden items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  {mode === 'create' ? 'Variables' : 'Fill Details'}
                </button>
              </div>
            </div>

            {/* Unified Split-Column Layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left + Center Panels Wrapper */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* GitHub-style Toolbar */}
                <div className="border-b border-gray-200 bg-[#0d1117] px-4 py-2">
                  <div className="flex items-center gap-2">
                    {/* Branch/Version Selector */}
                    <button
                      onClick={() => {
                        // TODO: Open version selector dropdown
                        console.log('Open version selector');
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-300 bg-[#21262d] border border-[#30363d] rounded-md hover:bg-[#30363d] hover:border-[#8b949e] transition-colors"
                      title="Switch version"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.492 2.492 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25zM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM3.5 3.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0z"></path>
                      </svg>
                      <span>main</span>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"></path>
                      </svg>
                    </button>

                    {/* Versions Badge Button (like "6 Branches") */}
                    <button
                      onClick={() => {
                        // TODO: Navigate to versions page
                        console.log('Navigate to versions page');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-[#58a6ff] hover:underline transition-colors"
                      title="View all versions"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.492 2.492 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25zM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM3.5 3.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0z"></path>
                      </svg>
                      <span>Versions</span>
                    </button>

                    {/* Mode Toggle (Editor/Compose) - like "Go to file" */}
                    <div className="flex items-center gap-1 px-1 py-1 bg-[#21262d] border border-[#30363d] rounded-md">
                      <button
                        onClick={() => setMode('create')}
                        className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                          mode === 'create'
                            ? 'bg-[#1f6feb] text-white'
                            : 'text-gray-300 hover:bg-[#30363d]'
                        }`}
                      >
                        Editor
                      </button>
                      <button
                        onClick={() => setMode('use')}
                        className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                          mode === 'use'
                            ? 'bg-[#1f6feb] text-white'
                            : 'text-gray-300 hover:bg-[#30363d]'
                        }`}
                      >
                        Compose
                      </button>
                    </div>

                    <div className="flex-1"></div>

                    {/* Add Placeholder Button (like + button) */}
                    <button
                      onClick={() => setShowVariableEditor(true)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-300 bg-[#21262d] border border-[#30363d] rounded-md hover:bg-[#30363d] hover:border-[#8b949e] transition-colors"
                      title="Add variable"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"></path>
                      </svg>
                    </button>

                    {/* Copy to Clipboard Button (like Code button) */}
                    <button
                      onClick={() => {
                        // TODO: Implement copy functionality
                        console.log('Copy template');
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-[#238636] border border-[#2ea043] rounded-md hover:bg-[#2ea043] transition-colors"
                      title="Copy to clipboard"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
                        <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
                      </svg>
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                {/* Left + Center Content Row */}
                <div className="flex-1 flex overflow-hidden">
                  {/* Desktop: Left Panel - FormWrapper */}
                  <div className="hidden md:block w-[300px] overflow-hidden border-r border-gray-200">
                    <FormWrapper
                      mode={mode}
                      template={selectedTemplate}
                      availableVariables={allVariables}
                      onInsertVariable={handleInsertVariable}
                      onCopyMessage={() => {
                        // TODO: Implement copy message functionality
                      }}
                    />
                  </div>

                  {/* Center Panel - Editor */}
                  <div className="flex-1 overflow-y-auto p-6 bg-white">
                    <div className="max-w-4xl mx-auto">
                      <TemplateEditor
                        key={selectedTemplate.id}
                        templateId={selectedTemplate.id}
                        initialState={selectedTemplate.content}
                        availableVariables={allVariables}
                        onStateChange={handleUpdateTemplateContent}
                        onManageVariables={() => setShowVariableEditor(true)}
                        mode={mode}
                        values={templateValues.values}
                        variableToInsert={variableToInsert}
                        onVariableInserted={handleVariableInserted}
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
                </div>
              </div>

              {/* Right Panel - Template Details (15%) */}
              <div className="hidden lg:block w-[280px] border-l border-gray-200 bg-gray-50 overflow-y-auto">
                <div className="p-4 space-y-4">
                  {/* About Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">About</h3>
                    <div className="space-y-2">
                      {/* Type Badge */}
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedTemplate.type === 'email'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {selectedTemplate.type === 'email' ? '✉️ Email' : '💬 SMS'}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-medium">{selectedTemplate.isStarred ? 'Favorited' : 'Not favorited'}</span>
                        </div>

                        {selectedTemplate.useCount !== undefined && selectedTemplate.useCount > 0 && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Used {selectedTemplate.useCount} {selectedTemplate.useCount === 1 ? 'time' : 'times'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">Tags</h3>
                      <button
                        onClick={() => setShowTagEditor(true)}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                        title="Manage tags"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    {selectedTemplate.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedTemplate.tags.map((tagId) => {
                          const tag = tags.find((t) => t.id === tagId);
                          return tag ? (
                            <span
                              key={tag.id}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                              style={{
                                backgroundColor: `${tag.color}20`,
                                color: tag.color,
                              }}
                            >
                              {tag.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">No tags assigned</p>
                    )}
                  </div>

                  {/* Metadata Section */}
                  <div className="pt-3 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Details</h3>
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Created</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(selectedTemplate.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Updated</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(selectedTemplate.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {selectedTemplate.lastUsedAt && (
                        <div className="flex justify-between">
                          <span>Last used</span>
                          <span className="text-gray-900 font-medium">
                            {new Date(selectedTemplate.lastUsedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Variable Count */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Variables</span>
                      <span className="font-semibold text-gray-900">
                        {(() => {
                          const countVariables = (node: unknown): number => {
                            if (!node || typeof node !== 'object') return 0;
                            const obj = node as Record<string, unknown>;

                            let count = 0;
                            if (obj.type === 'template-variable') count = 1;

                            if (Array.isArray(obj.children)) {
                              count += obj.children.reduce((sum, child) => sum + countVariables(child), 0);
                            }

                            return count;
                          };

                          return countVariables(selectedTemplate.content.root);
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile: Bottom Drawer for FormWrapper */}
            <ResponsiveDrawer
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
            >
              <FormWrapper
                mode={mode}
                template={selectedTemplate}
                availableVariables={allVariables}
                onInsertVariable={handleInsertVariable}
                onCopyMessage={() => {
                  // TODO: Implement copy message functionality
                }}
              />
            </ResponsiveDrawer>

            {/* Mobile: Sidebar Drawer */}
            <ResponsiveDrawer
              isOpen={isSidebarDrawerOpen}
              onClose={() => setIsSidebarDrawerOpen(false)}
            >
              <ModernTemplateSidebar
                templates={templates}
                tags={tags}
                selectedTemplateId={selectedTemplateId}
                onSelectTemplate={(id) => {
                  handleSelectTemplate(id);
                  setIsSidebarDrawerOpen(false);
                }}
                onNewTemplate={() => {
                  handleNewTemplate();
                  setIsSidebarDrawerOpen(false);
                }}
                onDeleteTemplate={handleDeleteTemplate}
                onToggleStar={handleToggleStar}
                onManageTags={() => {
                  setShowTagEditor(true);
                  setIsSidebarDrawerOpen(false);
                }}
              />
            </ResponsiveDrawer>
          </>
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
        </ResizablePanel>
      </ResizablePanelGroup>

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