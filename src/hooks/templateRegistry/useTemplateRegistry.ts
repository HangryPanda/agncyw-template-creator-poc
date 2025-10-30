import { useState, useEffect, useCallback } from 'react';
import { Template, TemplateType, ImportOptions, ImportResult, TemplateBackup } from '@/types';
import { templateRegistry } from '@/services/TemplateRegistry';
import { migrationEngine } from '@/services/templateMigrations';
import { templateBackupService } from '@/services/templateBackup';

/**
 * React Hook for Template Registry
 * Provides a React-friendly interface to the Template Registry system
 */
export function useTemplateRegistry() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Initialize the registry on mount
   * - Run migrations if needed
   * - Load all templates
   * - Restore missing defaults
   */
  useEffect(() => {
    const initialize = () => {
      console.log('useTemplateRegistry: Initializing...');

      // Run migrations first
      const migrationResults = migrationEngine.runPendingMigrations();

      if (migrationResults.length > 0) {
        console.log('useTemplateRegistry: Migrations completed', migrationResults);
      }

      // Initialize registry and get all templates
      const allTemplates = templateRegistry.initialize();

      setTemplates(allTemplates);
      setIsInitialized(true);

      console.log('useTemplateRegistry: Initialized with', allTemplates.length, 'templates');
    };

    initialize();
  }, []);

  /**
   * Refresh templates from storage
   */
  const refreshTemplates = useCallback(() => {
    const allTemplates = templateRegistry.getAll();
    setTemplates(allTemplates);
  }, []);

  /**
   * Get templates by type
   */
  const getByType = useCallback((templateType: TemplateType): Template[] => {
    return templates.filter(t => t.templateType === templateType);
  }, [templates]);

  /**
   * Get template by ID
   */
  const getById = useCallback((id: string): Template | undefined => {
    return templates.find(t => t.id === id);
  }, [templates]);

  /**
   * Create a new template
   */
  const createTemplate = useCallback((template: Template) => {
    try {
      templateRegistry.create(template);
      refreshTemplates();
      return { success: true, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to create template:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [refreshTemplates]);

  /**
   * Update an existing template
   */
  const updateTemplate = useCallback((template: Template) => {
    try {
      templateRegistry.update(template);
      refreshTemplates();
      return { success: true, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to update template:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [refreshTemplates]);

  /**
   * Delete a template
   */
  const deleteTemplate = useCallback((id: string) => {
    try {
      const success = templateRegistry.delete(id);
      if (success) {
        refreshTemplates();
      }
      return { success, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to delete template:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [refreshTemplates]);

  /**
   * Restore missing system templates
   */
  const restoreSystemDefaults = useCallback(() => {
    const count = templateRegistry.restoreSystemDefaults();
    refreshTemplates();
    return count;
  }, [refreshTemplates]);

  /**
   * Export all templates to JSON backup
   */
  const exportBackup = useCallback((): TemplateBackup => {
    return templateBackupService.exportTemplates();
  }, []);

  /**
   * Download backup as JSON file
   */
  const downloadBackup = useCallback(() => {
    templateBackupService.downloadBackup();
  }, []);

  /**
   * Import templates from backup
   */
  const importBackup = useCallback((backup: TemplateBackup, options: ImportOptions): ImportResult => {
    const result = templateBackupService.importTemplates(backup, options);

    if (result.success) {
      refreshTemplates();
    }

    return result;
  }, [refreshTemplates]);

  /**
   * Parse a backup file from JSON string
   */
  const parseBackupFile = useCallback((fileContent: string): TemplateBackup | null => {
    return templateBackupService.parseBackupFile(fileContent);
  }, []);

  /**
   * Clear all templates (use with caution!)
   */
  const clearAll = useCallback(() => {
    templateRegistry.clearAll();
    refreshTemplates();
  }, [refreshTemplates]);

  return {
    // State
    templates,
    isInitialized,

    // Read operations
    getByType,
    getById,
    refreshTemplates,

    // Write operations
    createTemplate,
    updateTemplate,
    deleteTemplate,

    // Restore operations
    restoreSystemDefaults,

    // Backup/Import operations
    exportBackup,
    downloadBackup,
    importBackup,
    parseBackupFile,

    // Utility
    clearAll,
  };
}
