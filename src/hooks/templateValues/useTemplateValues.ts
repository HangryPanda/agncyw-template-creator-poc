import { useState, useEffect } from 'react';
import { TemplateVariable } from '@/types';

interface VariableValues {
  [key: string]: string;
}

export function useTemplateValues(
  templateId: string,
  availableVariables: TemplateVariable[]
) {
  // Initialize values from localStorage or examples
  const [values, setValues] = useState<VariableValues>(() => {
    const storageKey = `template_values_${templateId}`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved template values', e);
      }
    }

    // Initialize with example values
    const initial: VariableValues = {};
    availableVariables.forEach(v => {
      initial[v.name] = v.example || '';
    });
    return initial;
  });

  // Save to localStorage whenever values change
  useEffect(() => {
    const storageKey = `template_values_${templateId}`;
    localStorage.setItem(storageKey, JSON.stringify(values));
  }, [values, templateId]);

  // Update a single field value
  const updateValue = (variableName: string, value: string): void => {
    setValues(prev => ({ ...prev, [variableName]: value }));
  };

  // Clear all values back to examples
  const clearValues = (): void => {
    const initial: VariableValues = {};
    availableVariables.forEach(v => {
      initial[v.name] = v.example || '';
    });
    setValues(initial);
  };

  // Check if a specific field is filled (not empty and not just the example)
  const isFieldFilled = (variableName: string): boolean => {
    const value = values[variableName];
    const variable = availableVariables.find(v => v.name === variableName);
    return !!value && value !== variable?.example;
  };

  // Get count of filled fields in a group
  const getGroupFillCount = (groupName: string): { filled: number; total: number } => {
    const groupVars = availableVariables.filter(v => v.group === groupName);
    const filled = groupVars.filter(v => isFieldFilled(v.name)).length;
    return { filled, total: groupVars.length };
  };

  return {
    values,
    updateValue,
    clearValues,
    isFieldFilled,
    getGroupFillCount,
  };
}
