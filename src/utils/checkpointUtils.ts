import { EditorState } from 'lexical';
import { Template, TemplateCheckpoint, TemplateWithHistory } from '@/types';

/**
 * Generates a GitHub-style checkpoint ID
 * Format: abc123d-2025-10-28-14-30
 */
export function generateCheckpointId(): string {
  // Generate random 7-character alphanumeric token
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 7; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // Get current timestamp in YYYY-MM-DD-HH-mm format
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${token}-${year}-${month}-${day}-${hours}-${minutes}`;
}

/**
 * Creates a new checkpoint from current template state
 */
export function createCheckpoint(
  template: Template,
  checkpointType: 'auto' | 'manual',
  label?: string
): TemplateCheckpoint {
  return {
    id: generateCheckpointId(),
    content: template.content,
    timestamp: new Date().toISOString(),
    label,
    checkpointType,
    metadata: {
      name: template.name,
      type: template.type,
      tags: [...template.tags],
    },
  };
}

/**
 * Adds a checkpoint to template history, enforcing max limit
 */
export function addCheckpointToHistory(
  template: Template | TemplateWithHistory,
  checkpoint: TemplateCheckpoint,
  maxCheckpoints: number = 50
): TemplateWithHistory {
  const existingCheckpoints = 'checkpoints' in template ? template.checkpoints : [];

  // Add new checkpoint at beginning (newest first)
  const updatedCheckpoints = [checkpoint, ...existingCheckpoints];

  // Trim to max limit
  const trimmedCheckpoints = updatedCheckpoints.slice(0, maxCheckpoints);

  return {
    ...template,
    checkpoints: trimmedCheckpoints,
    maxCheckpoints,
  };
}

/**
 * Restores template to a specific checkpoint
 */
export function restoreFromCheckpoint(
  template: TemplateWithHistory,
  checkpointId: string
): Template {
  const checkpoint = template.checkpoints.find(cp => cp.id === checkpointId);

  if (!checkpoint) {
    throw new Error(`Checkpoint ${checkpointId} not found`);
  }

  return {
    ...template,
    content: checkpoint.content,
    name: checkpoint.metadata.name,
    type: checkpoint.metadata.type,
    tags: [...checkpoint.metadata.tags],
    updatedAt: Date.now(),
  };
}

/**
 * Formats checkpoint timestamp for display
 * Example: "Oct 28, 2025 at 2:30 PM"
 */
export function formatCheckpointTime(timestamp: string): string {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  return date.toLocaleDateString('en-US', options).replace(',', ' at');
}

/**
 * Gets display label for checkpoint (user label or auto-generated)
 */
export function getCheckpointDisplayLabel(checkpoint: TemplateCheckpoint): string {
  if (checkpoint.label) {
    return checkpoint.label;
  }

  // Auto-generate label from ID and type
  const typeLabel = checkpoint.checkpointType === 'auto' ? 'Auto-save' : 'Checkpoint';
  return `${typeLabel} ${checkpoint.id.substring(0, 7)}`;
}

/**
 * Deletes a specific checkpoint from history
 */
export function deleteCheckpoint(
  template: TemplateWithHistory,
  checkpointId: string
): TemplateWithHistory {
  return {
    ...template,
    checkpoints: template.checkpoints.filter(cp => cp.id !== checkpointId),
  };
}

/**
 * Checks if template has any checkpoints
 */
export function hasCheckpoints(template: Template | TemplateWithHistory | undefined): template is TemplateWithHistory {
  return template != null && 'checkpoints' in template && template.checkpoints.length > 0;
}
