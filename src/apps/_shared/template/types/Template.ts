/**
 * Template Model
 *
 * Core template types and definitions
 */

import { EditorState } from './EditorState';

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
