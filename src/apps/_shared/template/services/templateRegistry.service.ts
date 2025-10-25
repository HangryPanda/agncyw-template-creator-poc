import { Template, TemplateType, RegistryConfig } from '../types';
import { SYSTEM_TEMPLATES, AGENCY_TEMPLATES, CURRENT_SCHEMA_VERSION } from '../../../TemplateEditor/data/defaultTemplates';

/**
 * Template Registry Service
 *
 * Abstraction layer for managing templates across multiple localStorage keys.
 * Provides a unified API for CRUD operations on system, agency, and user templates.
 */
export class TemplateRegistry {
  private config: RegistryConfig;

  constructor() {
    this.config = {
      storageKeys: {
        system: 'templates_system',
        agency: 'templates_agency',
        user: 'templates_user',
      },
      currentSchemaVersion: CURRENT_SCHEMA_VERSION,
    };
  }

  /**
   * Get the storage key for a specific template type
   */
  private getStorageKey(templateType: TemplateType): string {
    return this.config.storageKeys[templateType];
  }

  /**
   * Read templates from localStorage by type
   */
  private readFromStorage(templateType: TemplateType): Template[] {
    const key = this.getStorageKey(templateType);
    const data = localStorage.getItem(key);

    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data) as Template[];
    } catch (error) {
      console.error(`Error parsing templates from ${key}:`, error);
      return [];
    }
  }

  /**
   * Write templates to localStorage by type
   */
  private writeToStorage(templateType: TemplateType, templates: Template[]): void {
    const key = this.getStorageKey(templateType);

    try {
      localStorage.setItem(key, JSON.stringify(templates));
    } catch (error) {
      console.error(`Error writing templates to ${key}:`, error);
      throw new Error(`Failed to save ${templateType} templates`);
    }
  }

  /**
   * Get all templates from all storage keys, merged into a single array
   * Deduplicates by ID, prioritizing: system > agency > user
   */
  getAll(): Template[] {
    const systemTemplates = this.readFromStorage('system');
    const agencyTemplates = this.readFromStorage('agency');
    const userTemplates = this.readFromStorage('user');

    // Use Map to deduplicate by ID (first occurrence wins)
    const templateMap = new Map<string, Template>();

    // Add in priority order: system first, then agency, then user
    // This ensures system templates take precedence if there are duplicates
    systemTemplates.forEach(t => templateMap.set(t.id, t));
    agencyTemplates.forEach(t => {
      if (templateMap.has(t.id)) {
        console.warn(`Duplicate template ID "${t.id}" found in agency templates, using system version`);
      } else {
        templateMap.set(t.id, t);
      }
    });
    userTemplates.forEach(t => {
      if (templateMap.has(t.id)) {
        console.warn(`Duplicate template ID "${t.id}" found in user templates, using higher-priority version`);
      } else {
        templateMap.set(t.id, t);
      }
    });

    return Array.from(templateMap.values());
  }

  /**
   * Get templates by type
   */
  getByType(templateType: TemplateType): Template[] {
    return this.readFromStorage(templateType);
  }

  /**
   * Get a single template by ID (searches across all types)
   */
  getById(id: string): Template | undefined {
    const allTemplates = this.getAll();
    return allTemplates.find(t => t.id === id);
  }

  /**
   * Create a new template
   * Automatically routes to the correct storage key based on templateType
   */
  create(template: Template): void {
    const templates = this.readFromStorage(template.templateType);

    // Check for duplicate ID
    if (templates.some(t => t.id === template.id)) {
      throw new Error(`Template with ID "${template.id}" already exists`);
    }

    templates.push(template);
    this.writeToStorage(template.templateType, templates);
  }

  /**
   * Update an existing template
   * Automatically routes to the correct storage key based on templateType
   */
  update(template: Template): void {
    const templates = this.readFromStorage(template.templateType);
    const index = templates.findIndex(t => t.id === template.id);

    if (index === -1) {
      throw new Error(`Template with ID "${template.id}" not found in ${template.templateType} templates`);
    }

    // Increment version on update
    templates[index] = {
      ...template,
      version: template.version + 1,
      updatedAt: Date.now(),
    };

    this.writeToStorage(template.templateType, templates);
  }

  /**
   * Delete a template by ID
   * Searches across all types to find and delete the template
   */
  delete(id: string): boolean {
    const types: TemplateType[] = ['system', 'agency', 'user'];

    for (const type of types) {
      const templates = this.readFromStorage(type);
      const index = templates.findIndex(t => t.id === id);

      if (index !== -1) {
        templates.splice(index, 1);
        this.writeToStorage(type, templates);
        console.log(`Deleted template ${id} from ${type} templates`);
        return true;
      }
    }

    return false;
  }

  /**
   * Restore missing system templates
   * Adds any system templates that don't exist in storage
   */
  restoreSystemDefaults(): number {
    const existingSystemTemplates = this.readFromStorage('system');
    const now = Date.now();

    const missingTemplates = SYSTEM_TEMPLATES.filter(
      defaultTemplate => !existingSystemTemplates.some(t => t.id === defaultTemplate.id)
    ).map((template, index) => ({
      ...template,
      createdAt: now - (SYSTEM_TEMPLATES.length - index),
      updatedAt: now - (SYSTEM_TEMPLATES.length - index),
    }));

    if (missingTemplates.length > 0) {
      const updatedTemplates = [...missingTemplates, ...existingSystemTemplates];
      this.writeToStorage('system', updatedTemplates);
      console.log(`Restored ${missingTemplates.length} missing system templates`);
    }

    return missingTemplates.length;
  }

  /**
   * Restore agency templates (future implementation)
   * Will sync from agency settings when backend is available
   */
  restoreAgencyDefaults(): number {
    const existingAgencyTemplates = this.readFromStorage('agency');
    const now = Date.now();

    const missingTemplates = AGENCY_TEMPLATES.filter(
      defaultTemplate => !existingAgencyTemplates.some(t => t.id === defaultTemplate.id)
    ).map((template, index) => ({
      ...template,
      createdAt: now - (AGENCY_TEMPLATES.length - index),
      updatedAt: now - (AGENCY_TEMPLATES.length - index),
    }));

    if (missingTemplates.length > 0) {
      const updatedTemplates = [...missingTemplates, ...existingAgencyTemplates];
      this.writeToStorage('agency', updatedTemplates);
      console.log(`Restored ${missingTemplates.length} missing agency templates`);
    }

    return missingTemplates.length;
  }

  /**
   * Initialize the registry
   * - Runs migrations if needed
   * - Restores missing system/agency templates
   * - Removes duplicate system templates from user storage
   * - Returns the merged template list
   */
  initialize(): Template[] {
    console.log('Initializing Template Registry...');

    // Remove any duplicate system templates from user storage (cleanup)
    const duplicatesRemoved = this.removeDuplicateSystemTemplates();

    // Restore missing default templates
    const systemRestored = this.restoreSystemDefaults();
    const agencyRestored = this.restoreAgencyDefaults();

    if (systemRestored > 0 || agencyRestored > 0) {
      console.log(`Template Registry: Restored ${systemRestored + agencyRestored} default templates`);
    }

    if (duplicatesRemoved > 0) {
      console.log(`Template Registry: Cleaned up ${duplicatesRemoved} duplicate templates`);
    }

    // Return all templates
    return this.getAll();
  }

  /**
   * Check if the old storage key exists (for migration detection)
   */
  hasLegacyData(): boolean {
    return localStorage.getItem('insurance_templates') !== null;
  }

  /**
   * Get the current schema version
   */
  getSchemaVersion(): number {
    return this.config.currentSchemaVersion;
  }

  /**
   * Clear all template data (use with caution!)
   */
  clearAll(): void {
    localStorage.removeItem(this.config.storageKeys.system);
    localStorage.removeItem(this.config.storageKeys.agency);
    localStorage.removeItem(this.config.storageKeys.user);
    console.log('All template data cleared');
  }

  /**
   * Remove duplicate system templates from user storage
   * This cleans up any system templates that were incorrectly migrated to user templates
   */
  removeDuplicateSystemTemplates(): number {
    const systemTemplates = this.readFromStorage('system');
    const userTemplates = this.readFromStorage('user');

    const systemTemplateIds = new Set(systemTemplates.map(t => t.id));
    const cleanedUserTemplates = userTemplates.filter(t => {
      const isDuplicate = systemTemplateIds.has(t.id);
      if (isDuplicate) {
        console.log(`Removing duplicate system template "${t.id}" from user templates`);
      }
      return !isDuplicate;
    });

    const removedCount = userTemplates.length - cleanedUserTemplates.length;

    if (removedCount > 0) {
      this.writeToStorage('user', cleanedUserTemplates);
      console.log(`Removed ${removedCount} duplicate system templates from user storage`);
    }

    return removedCount;
  }
}

// Singleton instance
export const templateRegistry = new TemplateRegistry();
