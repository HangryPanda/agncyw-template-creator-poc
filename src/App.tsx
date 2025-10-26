import { useState, useEffect, useCallback } from 'react';
import TemplateEditor from './apps/TemplateEditor/features/editor/components/TemplateEditor.view';
import ModernTemplateSidebar from './apps/TemplateEditor/features/sidebar/components/ModernTemplateSidebar.view';
import TemplateMetadataEditor from './apps/TemplateEditor/features/metadata/components/TemplateMetadataEditor.view';
import { CharacterCounter } from '@/components/indicators';
import GlobalSearch from './apps/TemplateEditor/features/sidebar/components/GlobalSearch.view';
import InlineTagEditor from './apps/TemplateEditor/features/metadata/components/InlineTagEditor.view';
import InlineVariableEditor from './apps/TemplateEditor/features/metadata/components/InlineVariableEditor.view';
import { FormWrapper, ResponsiveDrawer } from '@/components/forms';
import { TemplateEditorTabs, useTemplateEditorTabs } from '@/lib/tabs/integrations/lexical';
import { useTemplateValues } from '@/hooks/templateValues';
import { useTemplateRegistry } from '@/hooks/templateRegistry';
import { Toaster } from './components/ui/sonner';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/ui/resizable';
import { TemplateVariable, EditorState, Template, Tag } from '@/apps/_shared/template/types';
import GitHubEditorPage from './pages/GitHubEditorPage';
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

// Import EMPTY_TEMPLATE from new location
import { EMPTY_TEMPLATE } from './apps/TemplateEditor/data/defaultTemplates';

const CUSTOM_VARIABLES_KEY = 'insurance_template_custom_variables';
const TAGS_KEY = 'insurance_template_tags';

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

  // Use the Template Registry hook instead of direct localStorage
  const {
    templates,
    isInitialized,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  } = useTemplateRegistry();

  // Use tab manager for multi-tab editing
  const {
    tabs: openTabs,
    activeTabId,
    openTab,
    closeTab,
    setActiveTab,
    reorderTabs,
    closeOtherTabs,
    closeTabsToRight,
    closeAllTabs,
    isTabOpen,
    dirtyTabs,
    markTabDirty,
  } = useTemplateEditorTabs();

  // View state: 'overview' or 'github-editor'
  const [currentView, setCurrentView] = useState<'overview' | 'github-editor'>('overview');

  // Open first template once templates are loaded (if no tabs are open)
  useEffect(() => {
    if (isInitialized && templates.length > 0 && openTabs.length === 0) {
      openTab(templates[0].id);
    }
  }, [isInitialized, templates, openTabs.length, openTab]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(CUSTOM_VARIABLES_KEY, JSON.stringify(customVariables));
  }, [customVariables]);

  useEffect(() => {
    localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  }, [tags]);

  // Get active template (from active tab)
  const selectedTemplate = templates.find((t) => t.id === activeTabId) ?? null;

  // Combine built-in and custom variables
  const allVariables = [...INSURANCE_VARIABLES, ...customVariables];

  // Template values hook for Compose mode
  const templateValues = useTemplateValues(
    activeTabId || 'default',
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
    templates.forEach((template) => {
      const updatedTags = template.tags.filter((id) => id !== tagId);
      if (updatedTags.length !== template.tags.length) {
        updateTemplate({
          ...template,
          tags: updatedTags,
        });
      }
    });
  };

  // Template handlers
  const handleNewTemplate = (): void => {
    const now = Date.now();
    const newTemplate: Template = {
      id: `template_${now}_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Untitled Template',
      type: 'email',
      content: EMPTY_TEMPLATE,
      tags: [],
      createdAt: now,
      updatedAt: now,
      templateType: 'user',
      version: 1,
      schemaVersion: 1,
    };
    createTemplate(newTemplate);
    openTab(newTemplate.id); // Open in new tab
    setMode('create');
    setView('editor');
  };

  const handleDeleteTemplate = (templateId: string): void => {
    deleteTemplate(templateId);
    closeTab(templateId); // Close the tab if it's open
  };

  const handleSelectTemplate = (templateId: string): void => {
    openTab(templateId); // Open or switch to tab
    setMode('create');
    setView('editor');
  };

  const handleUpdateTemplateName = (name: string): void => {
    if (!selectedTemplate) return;
    updateTemplate({
      ...selectedTemplate,
      name,
    });
  };

  const handleUpdateTemplateType = (type: 'email' | 'sms'): void => {
    if (!selectedTemplate) return;
    updateTemplate({
      ...selectedTemplate,
      type,
    });
  };

  const handleUpdateTemplateTags = (tagIds: string[]): void => {
    if (!selectedTemplate) return;
    updateTemplate({
      ...selectedTemplate,
      tags: tagIds,
    });
  };

  const handleUpdateTemplateContent = (content: EditorState): void => {
    if (!selectedTemplate) return;
    updateTemplate({
      ...selectedTemplate,
      content,
    });
  };

  const handleToggleStar = (templateId: string): void => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      updateTemplate({
        ...template,
        isStarred: !template.isStarred,
      });
    }
  };

  const handleTemplateChange = (updatedTemplate: Template): void => {
    updateTemplate(updatedTemplate);
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
      const isMod = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl + K for search
      if (isMod && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      // Cmd/Ctrl + N for new template
      if (isMod && e.key === 'n') {
        e.preventDefault();
        handleNewTemplate();
      }
      // Cmd/Ctrl + B for toggle sidebar
      if (isMod && e.key === 'b') {
        e.preventDefault();
        if (windowWidth >= 768) {
          setIsSidebarCollapsed(!isSidebarCollapsed);
        }
      }

      // Tab navigation shortcuts
      // Cmd/Ctrl + W to close active tab
      if (isMod && e.key === 'w') {
        e.preventDefault();
        if (activeTabId) {
          closeTab(activeTabId);
        }
      }

      // Cmd/Ctrl + Tab to switch to next tab
      if (isMod && e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        if (openTabs.length > 0 && activeTabId) {
          const currentIndex = openTabs.indexOf(activeTabId);
          const nextIndex = (currentIndex + 1) % openTabs.length;
          setActiveTab(openTabs[nextIndex]);
        }
      }

      // Cmd/Ctrl + Shift + Tab to switch to previous tab
      if (isMod && e.shiftKey && e.key === 'Tab') {
        e.preventDefault();
        if (openTabs.length > 0 && activeTabId) {
          const currentIndex = openTabs.indexOf(activeTabId);
          const prevIndex = (currentIndex - 1 + openTabs.length) % openTabs.length;
          setActiveTab(openTabs[prevIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarCollapsed, windowWidth, openTabs, activeTabId, closeTab, setActiveTab]);

  // If GitHub editor view is active, render that page
  if (currentView === 'github-editor') {
    return (
      <>
        <GitHubEditorPage
          templates={templates}
          tags={tags}
          selectedTemplateId={activeTabId}
          onSelectTemplate={handleSelectTemplate}
          onNewTemplate={handleNewTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          onToggleStar={handleToggleStar}
          onManageTags={() => setShowTagEditor(true)}
          allVariables={allVariables}
          onTemplateChange={handleTemplateChange}
          onBackToOverview={() => setCurrentView('overview')}
        />

        {/* Modals (shared between views) */}
        {showTagEditor && (
          <InlineTagEditor
            isOpen={showTagEditor}
            tags={tags}
            selectedTags={selectedTemplate?.tags || []}
            onTagsChange={handleUpdateTemplateTags}
            onClose={() => setShowTagEditor(false)}
            onAddTag={handleAddTag}
            onEditTag={handleEditTag}
            onDeleteTag={handleDeleteTag}
          />
        )}
        {showVariableEditor && (
          <InlineVariableEditor
            isOpen={showVariableEditor}
            customVariables={customVariables}
            onClose={() => setShowVariableEditor(false)}
            onAddVariable={handleAddVariable}
            onEditVariable={handleEditVariable}
            onDeleteVariable={handleDeleteVariable}
          />
        )}
        <Toaster />
      </>
    );
  }

  // Default: Overview page (current page)
  return (
    <>
      <div className="h-screen bg-background font-sans flex flex-col">
        {/* Header - Full viewport width, not constrained */}
        <header className="bg-muted/30 border-b border-border px-6 py-3 flex-shrink-0">
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
                className="p-2 hover:bg-muted rounded-md transition-colors"
                title={windowWidth < 768 ? 'Open templates' : (isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar')}
              >
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-foreground">Messages</h1>
              <span className="hidden sm:inline text-sm text-muted-foreground">Quote Not Written Campaign</span>
            </div>

            <div className="flex items-center gap-2">
              {/* GitHub Editor Button */}
              <button
                onClick={() => setCurrentView('github-editor')}
                className="px-3 py-1.5 text-sm font-medium text-brand-blue bg-brand-blue/10 border border-brand-blue/30 rounded-md hover:bg-brand-blue/20 transition-all"
                title="Open GitHub-style editor"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z" />
                  </svg>
                  Editor View
                </span>
              </button>

              {/* Global Search */}
              <GlobalSearch
                templates={templates}
                onSelectTemplate={(id) => {
                  openTab(id);
                  setIsSearchOpen(false);
                }}
                onClose={() => setIsSearchOpen(false)}
                onOpen={() => setIsSearchOpen(true)}
                isOpen={isSearchOpen}
              />

              {/* Mode Toggle */}
              <div className="flex bg-muted rounded-md p-0.5">
                <button
                  onClick={() => setMode('create')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
                    mode === 'create'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Editor
                </button>
                <button
                  onClick={() => setMode('use')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
                    mode === 'use'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Compose
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area - Three Column Layout - Centered with max-width */}
        <div className="flex-1 overflow-hidden flex justify-center bg-background">
          <div className="w-full max-w-[2400px]">
            <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Sidebar - Hidden on mobile (< 768px), resizable on desktop */}
            {windowWidth >= 768 && (
              <>
                <ResizablePanel
                  defaultSize={25}
                  minSize={20}
                  maxSize={35}
                  collapsible={true}
                  collapsedSize={0}
                  onCollapse={() => setIsSidebarCollapsed(true)}
                  onExpand={() => setIsSidebarCollapsed(false)}
                  className={isSidebarCollapsed ? 'min-w-0' : 'min-w-[296px]'}
                >
                  <ModernTemplateSidebar
                    templates={templates}
                    tags={tags}
                    selectedTemplateId={activeTabId}
                    onSelectTemplate={handleSelectTemplate}
                    onNewTemplate={handleNewTemplate}
                    onDeleteTemplate={handleDeleteTemplate}
                    onToggleStar={handleToggleStar}
                    onManageTags={() => setShowTagEditor(true)}
                    openTabIds={openTabs}
                  />
                </ResizablePanel>
                <ResizableHandle className="w-px bg-border hover:bg-primary/30 transition-colors" />
              </>
            )}

            {/* Main Content */}
            <ResizablePanel defaultSize={windowWidth >= 768 ? 55 : 100} minSize={45}>
              <div className="h-full flex flex-col overflow-hidden">
                {/* Content Area */}
                {selectedTemplate ? (
                  <>
                    {/* Editor Header */}
                    <div className="bg-background border-b border-border px-6 py-3 flex-shrink-0">
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
                          className="flex md:hidden items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                          {mode === 'create' ? 'Variables' : 'Fill Details'}
                        </button>
                      </div>
                    </div>

                    {/* Tab Bar */}
                    {openTabs.length > 0 && (
                      <TemplateEditorTabs
                        tabs={openTabs}
                        activeTabId={activeTabId}
                        templates={templates}
                        modifiedTabs={dirtyTabs}
                        onTabClick={setActiveTab}
                        onTabClose={closeTab}
                        onTabReorder={reorderTabs}
                        onCloseOtherTabs={closeOtherTabs}
                        onCloseTabsToRight={closeTabsToRight}
                        onCloseAllTabs={closeAllTabs}
                      />
                    )}

                    {/* Unified Split-Column Layout */}
                    <div className="flex-1 flex overflow-hidden">
                      {/* Left + Center Panels Wrapper */}
                      <div className="flex-1 flex flex-col overflow-hidden">
                        {/* GitHub-style Toolbar */}
                        <div className="border-b border-border bg-background px-4 py-2 flex-shrink-0">
                          <div className="flex items-center gap-2">
                            {/* Branch/Version Selector */}
                            <button
                              onClick={() => {
                                // TODO: Open version selector dropdown
                                console.log('Open version selector');
                              }}
                              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground bg-muted/50 border border-border rounded-md hover:bg-muted hover:border-muted-foreground transition-colors"
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
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary hover:underline transition-colors"
                              title="View all versions"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.492 2.492 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25zM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM3.5 3.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0z"></path>
                              </svg>
                              <span>Versions</span>
                            </button>

                            {/* Mode Toggle (Editor/Compose) - like "Go to file" */}
                            <div className="flex items-center gap-1 px-1 py-1 bg-muted/50 border border-border rounded-md">
                              <button
                                onClick={() => setMode('create')}
                                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                                  mode === 'create'
                                    ? 'bg-[#1f6feb] text-white'
                                    : 'text-muted-foreground hover:bg-muted/80'
                                }`}
                              >
                                Editor
                              </button>
                              <button
                                onClick={() => setMode('use')}
                                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                                  mode === 'use'
                                    ? 'bg-[#1f6feb] text-white'
                                    : 'text-muted-foreground hover:bg-muted/80'
                                }`}
                              >
                                Compose
                              </button>
                            </div>

                            <div className="flex-1"></div>

                            {/* Add Placeholder Button (like + button) */}
                            <button
                              onClick={() => setShowVariableEditor(true)}
                              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground bg-muted/50 border border-border rounded-md hover:bg-muted hover:border-muted-foreground transition-colors"
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
                          {/* Desktop: Left Panel - FormWrapper - DARKEST background */}
                          <div className="hidden md:block w-[320px] overflow-hidden bg-background">
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

                          {/* Center Panel - Editor - LIGHTER to be focal point */}
                          <div className="flex-1 overflow-y-auto p-6 bg-muted/50">
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
                                setValue={templateValues.updateValue}
                                variableToInsert={variableToInsert}
                                onVariableInserted={handleVariableInserted}
                                onDirtyChange={(isDirty) => {
                                  if (activeTabId) {
                                    markTabDirty(activeTabId, isDirty);
                                  }
                                }}
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

                      {/* Right Panel - Template Details - DARKEST background */}
                      <div className="hidden lg:block w-[356px] bg-background overflow-y-auto">
                        <div className="p-4 space-y-4">
                          {/* About Section */}
                          <div>
                            <h3 className="text-sm font-semibold text-foreground mb-3">About</h3>
                            <div className="space-y-2">
                              {/* Type Badge */}
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  selectedTemplate.type === 'email'
                                    ? 'bg-primary/20 text-primary'
                                    : 'bg-accent/30 text-accent-foreground'
                                }`}>
                                  {selectedTemplate.type === 'email' ? '✉️ Email' : '💬 SMS'}
                                </span>
                              </div>

                              {/* Stats */}
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-foreground/80">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  <span className="font-medium">{selectedTemplate.isStarred ? 'Favorited' : 'Not favorited'}</span>
                                </div>

                                {selectedTemplate.useCount !== undefined && selectedTemplate.useCount > 0 && (
                                  <div className="flex items-center gap-2 text-foreground/80">
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
                              <h3 className="text-sm font-semibold text-foreground">Tags</h3>
                              <button
                                onClick={() => setShowTagEditor(true)}
                                className="p-1 text-muted-foreground hover:text-foreground/80 hover:bg-muted rounded transition-colors"
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
                              <p className="text-xs text-muted-foreground italic">No tags assigned</p>
                            )}
                          </div>

                          {/* Metadata Section */}
                          <div className="pt-3 border-t border-border">
                            <h3 className="text-sm font-semibold text-foreground mb-3">Details</h3>
                            <div className="space-y-2 text-xs text-muted-foreground">
                              <div className="flex justify-between">
                                <span>Created</span>
                                <span className="text-foreground font-medium">
                                  {new Date(selectedTemplate.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Updated</span>
                                <span className="text-foreground font-medium">
                                  {new Date(selectedTemplate.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                              {selectedTemplate.lastUsedAt && (
                                <div className="flex justify-between">
                                  <span>Last used</span>
                                  <span className="text-foreground font-medium">
                                    {new Date(selectedTemplate.lastUsedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Variable Count */}
                          <div className="pt-3 border-t border-border">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-foreground/80">Variables</span>
                              <span className="font-semibold text-foreground">
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
                        selectedTemplateId={activeTabId}
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
                        openTabIds={openTabs}
                      />
                    </ResponsiveDrawer>
                  </>
                ) : (
                  /* Empty State */
                  <div className="flex-1 flex items-center justify-center bg-muted/30">
                    <div className="text-center max-w-md">
                      <svg className="w-16 h-16 mx-auto text-muted-foreground/60 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h2 className="text-xl font-semibold text-foreground mb-2">No template selected</h2>
                      <p className="text-muted-foreground mb-6">
                        Create a new template or select one from the sidebar to get started
                      </p>
                      <button
                        onClick={handleNewTemplate}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
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
          </div>
        </div>
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
    </>
  );
}

export default App;
