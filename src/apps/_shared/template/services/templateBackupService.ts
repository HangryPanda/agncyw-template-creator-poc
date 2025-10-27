import { Template, TemplateBackup, ImportOptions, ImportResult, TemplateType } from '../types';
import { templateRegistry } from './templateRegistryService';
import { CURRENT_SCHEMA_VERSION } from '../../../TemplateEditor/data/defaultTemplates';

/**
 * Template Backup and Restore Service
 * Handles exporting templates to JSON and importing them back
 */
export class TemplateBackupService {
  /**
   * Export all templates to a JSON backup file
   * Returns the backup object (caller handles download)
   */
  exportTemplates(): TemplateBackup {
    const systemTemplates = templateRegistry.getByType('system');
    const agencyTemplates = templateRegistry.getByType('agency');
    const userTemplates = templateRegistry.getByType('user');

    const backup: TemplateBackup = {
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0', // Could be imported from package.json
      schemaVersion: CURRENT_SCHEMA_VERSION,
      templates: {
        system: systemTemplates,
        agency: agencyTemplates,
        user: userTemplates,
      },
      counts: {
        system: systemTemplates.length,
        agency: agencyTemplates.length,
        user: userTemplates.length,
        total: systemTemplates.length + agencyTemplates.length + userTemplates.length,
      },
    };

    console.log(`Exported ${backup.counts.total} templates`);
    return backup;
  }

  /**
   * Download templates as a JSON file
   */
  downloadBackup(): void {
    const backup = this.exportTemplates();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const filename = `templates_backup_${date}.json`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);

    console.log(`Downloaded backup: ${filename}`);
  }

  /**
   * Validate a backup file structure
   */
  private validateBackup(data: unknown): data is TemplateBackup {
    if (typeof data !== 'object' || data === null) {
      return false;
    }

    const backup = data as Partial<TemplateBackup>;

    // Check required fields
    if (!backup.exportDate || !backup.schemaVersion || !backup.templates || !backup.counts) {
      return false;
    }

    // Check template structure
    if (!backup.templates.system || !backup.templates.agency || !backup.templates.user) {
      return false;
    }

    return true;
  }

  /**
   * Merge templates using version-based conflict resolution
   * Newer version wins. If versions are equal, imported template wins.
   */
  private mergeTemplates(
    existing: Template[],
    imported: Template[],
    templateType: TemplateType
  ): { templates: Template[]; conflicts: number } {
    let conflicts = 0;
    const mergedMap = new Map<string, Template>();

    // Add existing templates to map
    existing.forEach(template => {
      mergedMap.set(template.id, template);
    });

    // Process imported templates
    imported.forEach(importedTemplate => {
      const existingTemplate = mergedMap.get(importedTemplate.id);

      if (!existingTemplate) {
        // New template - just add it
        mergedMap.set(importedTemplate.id, {
          ...importedTemplate,
          templateType,
        });
      } else {
        // Conflict - resolve by version
        conflicts++;

        if (importedTemplate.version > existingTemplate.version) {
          // Imported template is newer
          mergedMap.set(importedTemplate.id, {
            ...importedTemplate,
            templateType,
          });
          console.log(
            `Conflict resolved: Using imported template "${importedTemplate.name}" (v${importedTemplate.version} > v${existingTemplate.version})`
          );
        } else if (importedTemplate.version === existingTemplate.version) {
          // Same version - imported wins (user chose to import)
          mergedMap.set(importedTemplate.id, {
            ...importedTemplate,
            templateType,
            updatedAt: Date.now(), // Update timestamp
          });
          console.log(
            `Conflict resolved: Using imported template "${importedTemplate.name}" (same version, import preference)`
          );
        } else {
          // Existing template is newer - keep it
          console.log(
            `Conflict resolved: Keeping existing template "${existingTemplate.name}" (v${existingTemplate.version} > v${importedTemplate.version})`
          );
        }
      }
    });

    return {
      templates: Array.from(mergedMap.values()),
      conflicts,
    };
  }

  /**
   * Import templates from a backup file
   */
  importTemplates(backup: TemplateBackup, options: ImportOptions): ImportResult {
    console.log(`Importing templates with strategy: ${options.strategy}`);

    // Validate backup
    if (!this.validateBackup(backup)) {
      return {
        success: false,
        message: 'Invalid backup file format',
        imported: { system: 0, agency: 0, user: 0, total: 0 },
        conflicts: 0,
        errors: ['Invalid backup file structure'],
      };
    }

    const errors: string[] = [];
    const imported = { system: 0, agency: 0, user: 0, total: 0 };
    let totalConflicts = 0;

    try {
      if (options.strategy === 'replace') {
        // Replace strategy - clear existing and import new
        // Optionally preserve user templates
        if (options.preserveUserTemplates) {
          // Clear only system and agency
          const userTemplates = templateRegistry.getByType('user');
          templateRegistry.clearAll();

          // Restore user templates
          userTemplates.forEach(template => templateRegistry.create(template));

          // Import system and agency
          backup.templates.system.forEach(template => {
            templateRegistry.create({ ...template, templateType: 'system' });
            imported.system++;
          });

          backup.templates.agency.forEach(template => {
            templateRegistry.create({ ...template, templateType: 'agency' });
            imported.agency++;
          });

          imported.user = userTemplates.length;
        } else {
          // Clear everything and import all
          templateRegistry.clearAll();

          backup.templates.system.forEach(template => {
            templateRegistry.create({ ...template, templateType: 'system' });
            imported.system++;
          });

          backup.templates.agency.forEach(template => {
            templateRegistry.create({ ...template, templateType: 'agency' });
            imported.agency++;
          });

          backup.templates.user.forEach(template => {
            templateRegistry.create({ ...template, templateType: 'user' });
            imported.user++;
          });
        }
      } else {
        // Merge strategy - use version-based conflict resolution
        const types: TemplateType[] = ['system', 'agency', 'user'];

        for (const type of types) {
          const existing = templateRegistry.getByType(type);
          const importedTemplates = backup.templates[type];

          const { templates: merged, conflicts } = this.mergeTemplates(
            existing,
            importedTemplates,
            type
          );

          totalConflicts += conflicts;

          // Write merged templates back
          // Clear the type first, then add all merged
          const allTemplates = templateRegistry.getAll();
          const otherTypes = allTemplates.filter(t => t.templateType !== type);

          templateRegistry.clearAll();

          // Restore other types
          otherTypes.forEach(template => templateRegistry.create(template));

          // Add merged templates
          merged.forEach(template => templateRegistry.create(template));

          imported[type] = importedTemplates.length;
        }
      }

      imported.total = imported.system + imported.agency + imported.user;

      // Restore default system templates if missing
      templateRegistry.restoreSystemDefaults();

      return {
        success: true,
        message: `Successfully imported ${imported.total} templates`,
        imported,
        conflicts: totalConflicts,
        errors,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Import failed:', errorMessage);

      return {
        success: false,
        message: 'Import failed',
        imported,
        conflicts: totalConflicts,
        errors: [errorMessage],
      };
    }
  }

  /**
   * Parse a backup file from uploaded JSON
   */
  parseBackupFile(fileContent: string): TemplateBackup | null {
    try {
      const data = JSON.parse(fileContent);

      if (!this.validateBackup(data)) {
        console.error('Invalid backup file format');
        return null;
      }

      return data as TemplateBackup;
    } catch (error) {
      console.error('Error parsing backup file:', error);
      return null;
    }
  }
}

// Singleton instance
export const templateBackupService = new TemplateBackupService();
