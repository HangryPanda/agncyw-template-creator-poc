import { Template, Migration, MigrationResult } from '../types';
import { CURRENT_SCHEMA_VERSION, SYSTEM_TEMPLATES } from '../../../TemplateEditor/data/defaultTemplates';

const MIGRATION_FLAG_KEY = 'template_migrations_applied';
const LEGACY_TEMPLATES_KEY = 'insurance_templates';

// IDs of system templates that should not be migrated to user templates
const SYSTEM_TEMPLATE_IDS = new Set(SYSTEM_TEMPLATES.map(t => t.id));

/**
 * Migration definitions
 * Each migration has a version number and up/down functions
 */
const migrations: Migration[] = [
  // Migration 1: Move existing templates from old key to new multi-key structure
  {
    version: 1,
    name: 'InitialMultiKeyMigration',
    up: (templates: Template[]): Template[] => {
      // Filter out system templates - they should not be migrated to user templates
      // System templates will be added automatically by the registry
      const userOnlyTemplates = templates.filter(template => {
        const isSystemTemplate = SYSTEM_TEMPLATE_IDS.has(template.id);
        if (isSystemTemplate) {
          console.log(`Skipping system template "${template.id}" during migration`);
        }
        return !isSystemTemplate;
      });

      // Add new fields to existing user templates
      return userOnlyTemplates.map(template => ({
        ...template,
        templateType: 'user' as const,
        version: template.version || 1,
        schemaVersion: CURRENT_SCHEMA_VERSION,
      }));
    },
    down: (templates: Template[]): Template[] => {
      // Remove new fields (for rollback, if needed)
      const { templateType, version, schemaVersion, ...rest } = templates[0] || {};
      return templates.map(({ templateType, version, schemaVersion, ...template }) => template as Template);
    },
  },
];

/**
 * Migration Engine
 * Handles running migrations and tracking which have been applied
 */
export class MigrationEngine {
  /**
   * Get the list of applied migrations from localStorage
   */
  private getAppliedMigrations(): number[] {
    const data = localStorage.getItem(MIGRATION_FLAG_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Mark a migration as applied
   */
  private markMigrationApplied(version: number): void {
    const applied = this.getAppliedMigrations();
    if (!applied.includes(version)) {
      applied.push(version);
      localStorage.setItem(MIGRATION_FLAG_KEY, JSON.stringify(applied));
    }
  }

  /**
   * Check if the legacy data migration is needed
   */
  needsLegacyMigration(): boolean {
    const hasLegacyData = localStorage.getItem(LEGACY_TEMPLATES_KEY) !== null;
    const appliedMigrations = this.getAppliedMigrations();
    const migration1Applied = appliedMigrations.includes(1);

    return hasLegacyData && !migration1Applied;
  }

  /**
   * Run the legacy data migration
   * Moves templates from 'insurance_templates' to 'templates_user'
   */
  runLegacyMigration(): MigrationResult {
    console.log('Running legacy data migration...');

    try {
      // Read legacy data
      const legacyData = localStorage.getItem(LEGACY_TEMPLATES_KEY);
      if (!legacyData) {
        return {
          success: true,
          fromVersion: 0,
          toVersion: 1,
          errors: ['No legacy data found'],
        };
      }

      const legacyTemplates: Template[] = JSON.parse(legacyData);

      // Find migration 1
      const migration = migrations.find(m => m.version === 1);
      if (!migration) {
        return {
          success: false,
          fromVersion: 0,
          toVersion: 1,
          errors: ['Migration 1 not found'],
        };
      }

      // Run migration
      const migratedTemplates = migration.up(legacyTemplates);

      // Save to new user templates key
      localStorage.setItem('templates_user', JSON.stringify(migratedTemplates));

      // Mark migration as applied
      this.markMigrationApplied(1);

      // Remove legacy key
      localStorage.removeItem(LEGACY_TEMPLATES_KEY);

      console.log(`Successfully migrated ${migratedTemplates.length} templates from legacy storage`);

      return {
        success: true,
        fromVersion: 0,
        toVersion: 1,
        errors: [],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Legacy migration failed:', errorMessage);

      return {
        success: false,
        fromVersion: 0,
        toVersion: 1,
        errors: [errorMessage],
      };
    }
  }

  /**
   * Run all pending migrations
   * Returns an array of migration results
   */
  runPendingMigrations(): MigrationResult[] {
    const results: MigrationResult[] = [];
    const appliedMigrations = this.getAppliedMigrations();

    // Check for legacy migration first
    if (this.needsLegacyMigration()) {
      const result = this.runLegacyMigration();
      results.push(result);

      if (!result.success) {
        console.error('Legacy migration failed, stopping further migrations');
        return results;
      }
    }

    // Run any other pending migrations (for future use)
    const pendingMigrations = migrations.filter(
      m => m.version > 1 && !appliedMigrations.includes(m.version)
    );

    for (const migration of pendingMigrations) {
      console.log(`Running migration ${migration.version}: ${migration.name}`);
      // Future migrations would be implemented here
      this.markMigrationApplied(migration.version);
    }

    return results;
  }

  /**
   * Get the current migration version
   */
  getCurrentVersion(): number {
    const applied = this.getAppliedMigrations();
    return applied.length > 0 ? Math.max(...applied) : 0;
  }

  /**
   * Reset all migrations (use with caution!)
   */
  reset(): void {
    localStorage.removeItem(MIGRATION_FLAG_KEY);
    console.log('Migration history reset');
  }
}

// Singleton instance
export const migrationEngine = new MigrationEngine();
