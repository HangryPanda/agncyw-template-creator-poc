import { useCallback } from 'react';
import { Template, TemplateWithHistory, TemplateCheckpoint } from '@/types';
import {
  createCheckpoint,
  addCheckpointToHistory,
  restoreFromCheckpoint,
  deleteCheckpoint,
  hasCheckpoints,
} from '@/utils/checkpointUtils';

interface UseCheckpointManagerProps {
  /** Current template being edited */
  template: Template | TemplateWithHistory | undefined;

  /** Callback when template should be updated (e.g., save to registry) */
  onTemplateUpdate: (template: Template | TemplateWithHistory) => void;

  /** Callback when checkpoint is restored (to refresh editor state) */
  onRestore?: (restoredTemplate: Template) => void;

  /** Maximum checkpoints to retain (default: 50) */
  maxCheckpoints?: number;
}

interface UseCheckpointManagerReturn {
  /** All checkpoints for current template */
  checkpoints: TemplateCheckpoint[];

  /** Creates a new checkpoint (auto or manual) */
  createNewCheckpoint: (type: 'auto' | 'manual', label?: string) => void;

  /** Restores template to a specific checkpoint */
  restoreCheckpoint: (checkpointId: string) => void;

  /** Deletes a specific checkpoint */
  removeCheckpoint: (checkpointId: string) => void;

  /** Whether template has any checkpoints */
  hasAnyCheckpoints: boolean;
}

export function useCheckpointManager({
  template,
  onTemplateUpdate,
  onRestore,
  maxCheckpoints = 50,
}: UseCheckpointManagerProps): UseCheckpointManagerReturn {
  const checkpoints = hasCheckpoints(template) ? template.checkpoints : [];
  const hasAnyCheckpoints = checkpoints.length > 0;

  /**
   * Creates a new checkpoint and updates template
   */
  const createNewCheckpoint = useCallback(
    (type: 'auto' | 'manual', label?: string) => {
      if (!template) return;
      const checkpoint = createCheckpoint(template, type, label);
      const updatedTemplate = addCheckpointToHistory(template, checkpoint, maxCheckpoints);
      onTemplateUpdate(updatedTemplate);
    },
    [template, maxCheckpoints, onTemplateUpdate]
  );

  /**
   * Restores template to a specific checkpoint
   */
  const restoreCheckpoint = useCallback(
    (checkpointId: string) => {
      if (!template || !hasCheckpoints(template)) {
        console.error('No checkpoints available to restore');
        return;
      }

      try {
        const restoredTemplate = restoreFromCheckpoint(template, checkpointId);
        onTemplateUpdate(restoredTemplate);

        // Notify parent component to refresh editor state
        if (onRestore) {
          onRestore(restoredTemplate);
        }
      } catch (error) {
        console.error('Failed to restore checkpoint:', error);
      }
    },
    [template, onTemplateUpdate, onRestore]
  );

  /**
   * Removes a specific checkpoint from history
   */
  const removeCheckpoint = useCallback(
    (checkpointId: string) => {
      if (!template || !hasCheckpoints(template)) {
        return;
      }

      const updatedTemplate = deleteCheckpoint(template, checkpointId);
      onTemplateUpdate(updatedTemplate);
    },
    [template, onTemplateUpdate]
  );

  return {
    checkpoints,
    createNewCheckpoint,
    restoreCheckpoint,
    removeCheckpoint,
    hasAnyCheckpoints,
  };
}
