import { useState, useRef, useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import ModernTemplateSidebar from '@/components/ModernTemplateSidebar';
import TemplateEditor from '@/components/TemplateEditor';
import TemplateOutlinePanel from '@/components/TemplateOutlinePanel';
import InlineTitleEditor from '@/components/InlineTitleEditor';
import ThemeToggle from '@/components/ThemeToggle';
import { Template, Tag, TemplateVariable } from '@/types';

interface GitHubEditorPageProps {
  templates: Template[];
  tags: Tag[];
  selectedTemplateId: string | null;
  onSelectTemplate: (templateId: string) => void;
  onNewTemplate: () => void;
  onDeleteTemplate: (templateId: string) => void;
  onToggleStar: (templateId: string) => void;
  onManageTags: () => void;
  allVariables: TemplateVariable[];
  onTemplateChange: (template: Template) => void;
  onBackToOverview?: () => void;
}

export default function GitHubEditorPage({
  templates,
  tags,
  selectedTemplateId,
  onSelectTemplate,
  onNewTemplate,
  onDeleteTemplate,
  onToggleStar,
  onManageTags,
  allVariables,
  onTemplateChange,
  onBackToOverview,
}: GitHubEditorPageProps) {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isOutlineVisible, setIsOutlineVisible] = useState(() => {
    const userPreference = localStorage.getItem('outlineExpanded');
    return userPreference === null ? true : userPreference === 'true';
  });
  const [editorMode, setEditorMode] = useState<'create' | 'use'>('create');
  const [autoFocusTitle, setAutoFocusTitle] = useState(false);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const previousTemplateIdRef = useRef<string | null>(selectedTemplateId);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  const toggleOutlinePanel = () => {
    setIsOutlineVisible((prev) => {
      const newValue = !prev;
      localStorage.setItem('outlineExpanded', String(newValue));
      return newValue;
    });
  };

  const toggleLeftSidebar = () => {
    setIsLeftSidebarCollapsed((prev) => !prev);
  };

  const toggleMode = () => {
    setEditorMode((prev) => (prev === 'create' ? 'use' : 'create'));
  };

  // Detect when a new template is created
  useEffect(() => {
    if (selectedTemplateId && previousTemplateIdRef.current !== selectedTemplateId) {
      const template = templates.find(t => t.id === selectedTemplateId);
      // If the template name is "Untitled Template", it's a new template
      if (template && template.name === 'Untitled Template') {
        setAutoFocusTitle(true);
        // Reset auto-focus after a short delay
        setTimeout(() => setAutoFocusTitle(false), 200);
      }
    }
    previousTemplateIdRef.current = selectedTemplateId;
  }, [selectedTemplateId, templates]);

  const handleTitleChange = (newName: string) => {
    if (selectedTemplate) {
      onTemplateChange({
        ...selectedTemplate,
        name: newName,
        updatedAt: Date.now(),
      });
    }
  };

  const focusEditor = () => {
    // Focus the Lexical editor
    // The editor is inside a contentEditable element with class "ContentEditable__root"
    const editorElement = editorWrapperRef.current?.querySelector('.ContentEditable__root') as HTMLElement;
    if (editorElement) {
      editorElement.focus();
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Toolbar Header */}
      <header className="bg-muted/30 border-b border-border px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle - MOVED TO LEFT */}
            <ThemeToggle />

            {/* Sidebar Toggle */}
            <button
              onClick={toggleLeftSidebar}
              aria-label={isLeftSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!isLeftSidebarCollapsed}
              className="p-2 hover:bg-muted rounded-md transition-colors"
              title="Toggle sidebar (⌘B)"
            >
              <svg
                className="w-4 h-4 text-muted-foreground"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M6.823 7.823a.25.25 0 0 1 0 .354l-2.396 2.396A.25.25 0 0 1 4 10.396V5.604a.25.25 0 0 1 .427-.177Z" />
                <path d="M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0ZM1.5 1.75v12.5c0 .138.112.25.25.25H9.5v-13H1.75a.25.25 0 0 0-.25.25ZM11 14.5h3.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11Z" />
              </svg>
            </button>

            {/* Template Name / Breadcrumb */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Templates</span>
              <span className="text-sm text-muted-foreground">/</span>
              {selectedTemplate && (
                <InlineTitleEditor
                  value={selectedTemplate.name}
                  onChange={handleTitleChange}
                  onEnterPress={focusEditor}
                  autoFocus={autoFocusTitle}
                  placeholder="Untitled Template"
                />
              )}
              {!selectedTemplate && (
                <h1 className="text-sm font-semibold text-foreground">
                  Untitled Template
                </h1>
              )}
            </div>

            {/* Template Type Badge */}
            {selectedTemplate && (
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border ${
                  selectedTemplate.type === 'email'
                    ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/30'
                    : 'bg-brand-purple/10 text-brand-purple border-brand-purple/30'
                }`}
              >
                {selectedTemplate.type === 'email' ? '✉️ Email' : '💬 SMS'}
              </span>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Star Status */}
            {selectedTemplate && selectedTemplate.isStarred && (
              <span className="text-brand-orange text-sm">⭐ Starred</span>
            )}

            {/* Delete Template */}
            {selectedTemplate && (
              <button
                onClick={() => {
                  if (confirm(`Delete "${selectedTemplate.name}"?`)) {
                    onDeleteTemplate(selectedTemplate.id);
                  }
                }}
                className="p-2 rounded-md hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all"
                title="Delete template"
                aria-label="Delete template"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z" />
                </svg>
              </button>
            )}

            {/* Outline Toggle */}
            <button
              onClick={toggleOutlinePanel}
              aria-label="Toggle outline panel"
              aria-expanded={isOutlineVisible}
              className={`p-2 rounded-md transition-all ${
                isOutlineVisible
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted text-muted-foreground'
              }`}
              title="Toggle outline"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M0 2.75A.75.75 0 0 1 .75 2h14.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 2.75Zm3 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Zm0-4a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75Z" />
              </svg>
            </button>

            {/* Back to Overview */}
            <button
              onClick={onBackToOverview}
              className="px-3 py-1.5 text-sm font-medium text-foreground/80 hover:bg-muted rounded-md transition-colors"
            >
              Back to Overview
            </button>
          </div>
        </div>
      </header>

      {/* Three-column layout */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* LEFT: Template List Sidebar */}
          {!isLeftSidebarCollapsed && (
            <>
              <ResizablePanel
                defaultSize={20}
                minSize={15}
                maxSize={35}
                className="min-w-[256px]"
              >
                <ModernTemplateSidebar
                  templates={templates}
                  tags={tags}
                  selectedTemplateId={selectedTemplateId}
                  onSelectTemplate={onSelectTemplate}
                  onNewTemplate={onNewTemplate}
                  onDeleteTemplate={onDeleteTemplate}
                  onToggleStar={onToggleStar}
                  onManageTags={onManageTags}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {/* CENTER: Editor Content */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <div ref={editorWrapperRef} className="h-full bg-muted/50 overflow-auto">
              <div className="max-w-4xl mx-auto p-6">
                {selectedTemplate ? (
                  <TemplateEditor
                    key={selectedTemplate.id}
                    templateId={selectedTemplate.id}
                    initialState={selectedTemplate.content}
                    availableVariables={allVariables}
                    onStateChange={(editorState) => {
                      onTemplateChange({
                        ...selectedTemplate,
                        content: editorState,
                        updatedAt: Date.now(),
                      });
                    }}
                    mode={editorMode}
                    onModeToggle={toggleMode}
                    isOutlineVisible={isOutlineVisible}
                    onToggleOutline={toggleOutlinePanel}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-muted-foreground text-lg mb-4">
                        No template selected
                      </p>
                      <button
                        onClick={onNewTemplate}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Create New Template
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          {/* RIGHT: Outline Panel (collapsible) */}
          {isOutlineVisible && selectedTemplate && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <TemplateOutlinePanel
                  template={selectedTemplate}
                  allVariables={allVariables}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
