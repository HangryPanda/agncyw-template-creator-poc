export interface TemplateVariable {
  name: string;
  label: string;
  description: string;
  example: string;
  group?: 'customer' | 'message' | 'agent' | 'agency' | 'custom';
}

export interface SerializedTemplateVariableNode {
  variableName: string;
  type: 'template-variable';
  version: number;
}

export interface EditorState {
  root: {
    children: any[];
    direction: string;
    format: string;
    indent: number;
    type: string;
    version: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export type TemplateType = 'system' | 'agency' | 'user';

export interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  content: EditorState;
  tags: string[]; // Array of tag IDs
  createdAt: number;
  updatedAt: number;
  isStarred?: boolean;
  lastUsedAt?: number;
  useCount?: number;
  // Template Registry fields
  templateType: TemplateType; // Distinguishes system/agency/user templates
  version: number; // For version-based conflict resolution
  schemaVersion: number; // For migration tracking
}

/**
 * Represents a single checkpoint in template version history
 */
export interface TemplateCheckpoint {
  /** Unique checkpoint identifier (format: abc123d-2025-10-28-14-30) */
  id: string;

  /** Full template state at this checkpoint */
  content: EditorState;

  /** ISO timestamp when checkpoint was created */
  timestamp: string;

  /** Optional user-provided label (defaults to auto-generated name) */
  label?: string;

  /** Type of checkpoint creation */
  checkpointType: 'auto' | 'manual';

  /** Template metadata at checkpoint time */
  metadata: {
    name: string;
    type: 'email' | 'sms';
    tags: string[];
  };
}

/**
 * Extended Template interface with version history
 */
export interface TemplateWithHistory extends Template {
  /** Array of historical checkpoints (newest first) */
  checkpoints: TemplateCheckpoint[];

  /** Maximum number of checkpoints to retain (default: 50) */
  maxCheckpoints?: number;
}

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
