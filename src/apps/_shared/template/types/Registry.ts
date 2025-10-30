/**
 * Registry Model
 *
 * Types for template registry, backup, restore, and migration
 */

import { Template } from './Template';

// Template Registry Configuration
export interface RegistryConfig {
  storageKeys: {
    system: string;
    agency: string;
    user: string;
  };
  currentSchemaVersion: number;
}

// Backup/Restore Types
export interface TemplateBackup {
  exportDate: string;
  appVersion: string;
  schemaVersion: number;
  templates: {
    system: Template[];
    agency: Template[];
    user: Template[];
  };
  counts: {
    system: number;
    agency: number;
    user: number;
    total: number;
  };
}

export type ImportStrategy = 'merge' | 'replace';

export interface ImportOptions {
  strategy: ImportStrategy;
  preserveUserTemplates?: boolean; // Only used with 'replace' strategy
}

export interface ImportResult {
  success: boolean;
  message: string;
  imported: {
    system: number;
    agency: number;
    user: number;
    total: number;
  };
  conflicts: number;
  errors: string[];
}

// Migration Types
export interface Migration {
  version: number;
  name: string;
  up: (templates: Template[]) => Template[];
  down?: (templates: Template[]) => Template[];
}

export interface MigrationResult {
  success: boolean;
  fromVersion: number;
  toVersion: number;
  errors: string[];
}
