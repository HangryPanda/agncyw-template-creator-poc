import { useState, useEffect } from 'react';
import { Layers, X } from 'lucide-react';

interface PageSwitcherProps {
  currentPage: 'app' | 'design-sandbox' | 'select-field-demo';
  onPageChange: (page: 'app' | 'design-sandbox' | 'select-field-demo') => void;
}

export default function PageSwitcher({ currentPage, onPageChange }: PageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Keyboard shortcut: Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const pages = [
    {
      id: 'app' as const,
      name: 'Template Editor',
      description: 'Main application - template creation and management',
      status: 'primary',
    },
    {
      id: 'design-sandbox' as const,
      name: 'Design Sandbox',
      description: 'Component viewer and comparison tool',
      status: 'dev-tool',
    },
    {
      id: 'select-field-demo' as const,
      name: 'Select Field Demo',
      description: 'Select field configuration preview',
      status: 'demo',
    },
  ];

  const handlePageChange = (pageId: 'app' | 'design-sandbox' | 'select-field-demo') => {
    onPageChange(pageId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
        title="Switch Pages"
      >
        <Layers className="w-5 h-5" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-background border border-border rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <div>
                <h2 className="text-base font-semibold text-foreground">Page Switcher</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Navigate between pages</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-muted rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Page List */}
            <div className="p-4 space-y-2">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handlePageChange(page.id)}
                  disabled={currentPage === page.id}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    currentPage === page.id
                      ? 'bg-primary/10 border-primary text-primary cursor-default'
                      : 'bg-background border-border hover:bg-muted hover:border-muted-foreground/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{page.name}</span>
                        {currentPage === page.id && (
                          <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{page.description}</p>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-xs px-2 py-1 rounded-md font-medium ${
                        page.status === 'primary'
                          ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400'
                          : page.status === 'dev-tool'
                          ? 'bg-purple-500/20 text-purple-700 dark:text-purple-400'
                          : 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {page.status === 'primary'
                        ? 'Main'
                        : page.status === 'dev-tool'
                        ? 'Dev Tool'
                        : 'Demo'}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-border bg-muted/20">
              <p className="text-xs text-muted-foreground text-center">
                Press <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs font-mono">Esc</kbd> to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
