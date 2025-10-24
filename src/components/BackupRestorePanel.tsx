import { useState, useRef } from 'react';
import { useTemplateRegistry } from '@/hooks/useTemplateRegistry';
import { ImportStrategy, TemplateBackup } from '@/types';
import { toast } from 'sonner';

export default function BackupRestorePanel() {
  const {
    downloadBackup,
    importBackup,
    parseBackupFile,
    restoreSystemDefaults,
    templates,
  } = useTemplateRegistry();

  const [isImporting, setIsImporting] = useState(false);
  const [showStrategyDialog, setShowStrategyDialog] = useState(false);
  const [pendingBackup, setPendingBackup] = useState<TemplateBackup | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportClick = () => {
    try {
      downloadBackup();
      toast.success('Templates exported successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed';
      toast.error(`Export failed: ${message}`);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const backup = parseBackupFile(content);

      if (!backup) {
        toast.error('Invalid backup file format');
        return;
      }

      // Show strategy dialog
      setPendingBackup(backup);
      setShowStrategyDialog(true);
    };

    reader.onerror = () => {
      toast.error('Failed to read backup file');
    };

    reader.readAsText(file);

    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImport = (strategy: ImportStrategy, preserveUserTemplates?: boolean) => {
    if (!pendingBackup) return;

    setIsImporting(true);
    setShowStrategyDialog(false);

    try {
      const result = importBackup(pendingBackup, {
        strategy,
        preserveUserTemplates,
      });

      if (result.success) {
        toast.success(
          `Successfully imported ${result.imported.total} templates` +
          (result.conflicts > 0 ? ` (resolved ${result.conflicts} conflicts)` : '')
        );
      } else {
        toast.error(`Import failed: ${result.message}`, {
          description: result.errors.join(', '),
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Import failed';
      toast.error(`Import failed: ${message}`);
    } finally {
      setIsImporting(false);
      setPendingBackup(null);
    }
  };

  const handleRestoreSystemDefaults = () => {
    try {
      const count = restoreSystemDefaults();
      if (count > 0) {
        toast.success(`Restored ${count} system templates`);
      } else {
        toast.info('All system templates are already present');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Restore failed';
      toast.error(`Restore failed: ${message}`);
    }
  };

  const systemCount = templates.filter(t => t.templateType === 'system').length;
  const agencyCount = templates.filter(t => t.templateType === 'agency').length;
  const userCount = templates.filter(t => t.templateType === 'user').length;

  return (
    <div className="p-6 bg-background rounded-lg border border-border space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-2">Backup & Restore</h2>
        <p className="text-sm text-muted-foreground">
          Export your templates to a JSON file or import templates from a previous backup.
        </p>
      </div>

      {/* Template Counts */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground">{systemCount}</div>
          <div className="text-xs text-muted-foreground">System Templates</div>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground">{agencyCount}</div>
          <div className="text-xs text-muted-foreground">Agency Templates</div>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground">{userCount}</div>
          <div className="text-xs text-muted-foreground">User Templates</div>
        </div>
      </div>

      {/* Export */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Export Templates</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Download all your templates (system, agency, and user) as a JSON backup file.
        </p>
        <button
          onClick={handleExportClick}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          📥 Download Backup
        </button>
      </div>

      {/* Import */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Import Templates</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Upload a backup file to restore templates. You can choose to merge or replace existing templates.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isImporting}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📤 Upload Backup
        </button>
      </div>

      {/* Restore System Defaults */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Restore System Templates</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Restore any missing system templates (like "Getting Started Guide") without affecting your custom templates.
        </p>
        <button
          onClick={handleRestoreSystemDefaults}
          className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          🔄 Restore System Defaults
        </button>
      </div>

      {/* Strategy Dialog */}
      {showStrategyDialog && pendingBackup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
            <h3 className="text-lg font-bold text-foreground">Import Strategy</h3>
            <p className="text-sm text-muted-foreground">
              Choose how to handle the imported templates:
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleImport('merge')}
                className="w-full p-4 text-left bg-muted hover:bg-muted/70 rounded-lg transition-colors"
              >
                <div className="font-semibold text-foreground mb-1">🔀 Merge</div>
                <div className="text-xs text-muted-foreground">
                  Add imported templates to existing ones. Conflicts resolved by version number (newer wins).
                </div>
              </button>

              <button
                onClick={() => handleImport('replace', false)}
                className="w-full p-4 text-left bg-muted hover:bg-muted/70 rounded-lg transition-colors"
              >
                <div className="font-semibold text-foreground mb-1">🔄 Replace All</div>
                <div className="text-xs text-muted-foreground">
                  Delete all existing templates and import the backup. <strong>Warning:</strong> This will erase all your templates!
                </div>
              </button>

              <button
                onClick={() => handleImport('replace', true)}
                className="w-full p-4 text-left bg-muted hover:bg-muted/70 rounded-lg transition-colors"
              >
                <div className="font-semibold text-foreground mb-1">🔄 Replace System & Agency Only</div>
                <div className="text-xs text-muted-foreground">
                  Replace system and agency templates but preserve your custom user templates.
                </div>
              </button>
            </div>

            <button
              onClick={() => {
                setShowStrategyDialog(false);
                setPendingBackup(null);
              }}
              className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
