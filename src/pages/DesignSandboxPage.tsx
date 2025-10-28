import { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/constructs/shadcn/Resizable';
import ThemeToggle from '@/core/ui/primitives/ThemeToggle';
import ModernTemplateSidebar from '@/apps/TemplateEditor/features/sidebar/components/ModernTemplateSidebar';
import { Template, Tag } from '@/types';

// Mock data for component previews
const MOCK_TEMPLATES: Template[] = [
  {
    id: 'template-1',
    name: 'Welcome Email',
    type: 'email',
    content: { root: { children: [], direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } },
    tags: ['tag-1'],
    isStarred: true,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000,
    templateType: 'user',
    version: 1,
    schemaVersion: 1,
  },
  {
    id: 'template-2',
    name: 'Follow-up SMS',
    type: 'sms',
    content: { root: { children: [], direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } },
    tags: ['tag-2'],
    isStarred: false,
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 7200000,
    templateType: 'user',
    version: 1,
    schemaVersion: 1,
  },
  {
    id: 'template-3',
    name: 'Quote Reminder',
    type: 'email',
    content: { root: { children: [], direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } },
    tags: ['tag-1', 'tag-2'],
    isStarred: true,
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 10800000,
    templateType: 'system',
    version: 1,
    schemaVersion: 1,
  },
];

const MOCK_TAGS: Tag[] = [
  { id: 'tag-1', name: 'Sales', color: '#3b82f6' },
  { id: 'tag-2', name: 'Follow-up', color: '#10b981' },
];

type ComponentKey = 'ModernTemplateSidebar';

interface ComponentInfo {
  key: ComponentKey;
  name: string;
  location: string;
  description: string;
  status: 'active' | 'experimental' | 'deprecated';
}

const COMPONENTS: ComponentInfo[] = [
  {
    key: 'ModernTemplateSidebar',
    name: 'ModernTemplateSidebar',
    location: '/src/apps/TemplateEditor/features/sidebar/components/ModernTemplateSidebar.tsx',
    description: 'Primary sidebar component - 331 lines, actively maintained',
    status: 'active',
  },
];

export default function DesignSandboxPage() {
  const [selectedComponent, setSelectedComponent] = useState<ComponentKey>('ModernTemplateSidebar');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>('template-1');

  const renderComponent = (key: ComponentKey) => {
    const commonProps = {
      templates: MOCK_TEMPLATES,
      tags: MOCK_TAGS,
      selectedTemplateId,
      onSelectTemplate: setSelectedTemplateId,
      onNewTemplate: () => console.log('New template'),
      onDeleteTemplate: (id: string) => console.log('Delete:', id),
      onToggleStar: (id: string) => console.log('Toggle star:', id),
      onManageTags: () => console.log('Manage tags'),
      openTabIds: ['template-1'],
    };

    switch (key) {
      case 'ModernTemplateSidebar':
        return <ModernTemplateSidebar {...commonProps} onClose={() => console.log('Close sidebar')} />;
      default:
        return <div className="p-4 text-muted-foreground">Component not found</div>;
    }
  };

  const selectedInfo = COMPONENTS.find((c) => c.key === selectedComponent);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-background">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold text-foreground">Design Sandbox</h1>
          <span className="text-xs text-muted-foreground">Component Viewer & Comparison Tool</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Sidebar - Component List */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full flex flex-col bg-muted/30 border-r border-border">
            <div className="px-4 py-3 border-b border-border bg-background">
              <h2 className="text-sm font-semibold text-foreground">Components</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Select to preview</p>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {COMPONENTS.map((component) => (
                <button
                  key={component.key}
                  onClick={() => setSelectedComponent(component.key)}
                  className={`w-full text-left px-3 py-2 rounded-md mb-1 transition-colors ${
                    selectedComponent === component.key
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <div className="text-sm font-medium">{component.name}</div>
                  <div className="text-xs opacity-80 mt-0.5 flex items-center gap-2">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        component.status === 'active'
                          ? 'bg-green-500'
                          : component.status === 'experimental'
                          ? 'bg-yellow-500'
                          : 'bg-gray-500'
                      }`}
                    />
                    {component.status}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Center Canvas - Component Preview */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col bg-background">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <h2 className="text-sm font-semibold text-foreground">Preview</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{selectedInfo?.name}</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Component Preview Container */}
              <div className="h-full">
                {renderComponent(selectedComponent)}
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Right Sidebar - Component Details */}
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
          <div className="h-full flex flex-col bg-muted/30 border-l border-border">
            <div className="px-4 py-3 border-b border-border bg-background">
              <h2 className="text-sm font-semibold text-foreground">Details</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Component information</p>
            </div>

            {selectedInfo && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Status Badge */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium ${
                        selectedInfo.status === 'active'
                          ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                          : selectedInfo.status === 'experimental'
                          ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                          : 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          selectedInfo.status === 'active'
                            ? 'bg-green-500'
                            : selectedInfo.status === 'experimental'
                            ? 'bg-yellow-500'
                            : 'bg-gray-500'
                        }`}
                      />
                      {selectedInfo.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</label>
                  <div className="mt-1 text-xs font-mono bg-muted p-2 rounded-md text-foreground break-all">
                    {selectedInfo.location}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Description
                  </label>
                  <div className="mt-1 text-sm text-foreground">{selectedInfo.description}</div>
                </div>

                {/* Props Info */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Props (Mock Data)
                  </label>
                  <div className="mt-1 text-xs font-mono bg-muted p-2 rounded-md text-foreground space-y-1">
                    <div>• templates: {MOCK_TEMPLATES.length} items</div>
                    <div>• tags: {MOCK_TAGS.length} items</div>
                    <div>• selectedTemplateId: "{selectedTemplateId}"</div>
                    <div>• openTabIds: ["template-1"]</div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Actions</label>
                  <div className="mt-1 space-y-2">
                    <button className="w-full text-xs px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                      View Source Code
                    </button>
                    <button className="w-full text-xs px-3 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors">
                      Compare Versions
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
