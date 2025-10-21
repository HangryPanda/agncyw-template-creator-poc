import { useState } from 'react';
import { TemplateVariable } from '@/types';
import React from 'react';

interface VariableManagerProps {
  customVariables: TemplateVariable[];
  onAdd: (variable: TemplateVariable) => void;
  onEdit: (index: number, variable: TemplateVariable) => void;
  onDelete: (index: number) => void;
}

export default function VariableManager({
  customVariables,
  onAdd,
  onEdit,
  onDelete,
}: VariableManagerProps): JSX.Element {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<TemplateVariable>({
    name: '',
    label: '',
    description: '',
    example: '',
  });

  const resetForm = (): void => {
    setFormData({
      name: '',
      label: '',
      description: '',
      example: '',
    });
    setIsAdding(false);
    setEditingIndex(null);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    // Validate that name doesn't have spaces and is lowercase with underscores
    const validName = /^[a-z][a-z0-9_]*$/.test(formData.name);
    if (!validName) {
      alert('Variable name must start with a lowercase letter and contain only lowercase letters, numbers, and underscores.');
      return;
    }

    if (editingIndex !== null) {
      onEdit(editingIndex, formData);
    } else {
      onAdd(formData);
    }
    resetForm();
  };

  const handleEdit = (index: number): void => {
    setFormData(customVariables[index]);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleCancel = (): void => {
    resetForm();
  };

  return (
    <div className="p-10">
      {/* Premium Header */}
      <div className="relative bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 px-10 py-8 -mx-10 -mt-10 mb-10 border-b border-blue-700">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Custom Variables</h3>
            <p className="text-blue-100 text-base">Create reusable placeholders for your templates</p>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="group relative inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 transition-all duration-300 hover:scale-105 active:scale-95 shadow-soft"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Variable
            </button>
          )}
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-medium animate-slide-up">
          <div className="mb-8 pb-6 border-b border-blue-200">
            <h4 className="text-2xl font-bold text-blue-900 tracking-tight">
              {editingIndex !== null ? 'Edit Variable' : 'New Variable'}
            </h4>
          </div>

          {/* Variable Name Input */}
          <div className="mb-8">
            <label className="block mb-3 text-base font-semibold text-blue-900">
              Variable Name <span className="text-indigo-600">*</span>
              <span className="ml-2 text-sm font-normal text-blue-600">(e.g., customer_id, policy_number)</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-4 text-base border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-soft font-mono"
              placeholder="customer_id"
              required
              pattern="^[a-z][a-z0-9_]*$"
              title="Must start with lowercase letter, use only lowercase letters, numbers, and underscores"
            />
          </div>

          {/* Display Label Input */}
          <div className="mb-8">
            <label className="block mb-3 text-base font-semibold text-blue-900">
              Display Label <span className="text-indigo-600">*</span>
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full px-5 py-4 text-base border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-soft"
              placeholder="Customer ID"
              required
            />
          </div>

          {/* Description Input */}
          <div className="mb-8">
            <label className="block mb-3 text-base font-semibold text-blue-900">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-5 py-4 text-base border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-soft"
              placeholder="Unique customer identifier"
            />
          </div>

          {/* Example Value Input */}
          <div className="mb-8">
            <label className="block mb-3 text-base font-semibold text-blue-900">
              Example Value
            </label>
            <input
              type="text"
              value={formData.example}
              onChange={(e) => setFormData({ ...formData, example: e.target.value })}
              className="w-full px-5 py-4 text-base border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-soft"
              placeholder="CUST-12345"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-strong hover:shadow-intense"
            >
              {editingIndex !== null ? 'Update' : 'Add'} Variable
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-4 bg-gray-200 text-gray-700 text-base font-semibold rounded-xl hover:bg-gray-300 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Variables List */}
      {customVariables.length > 0 && (
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-4">
            Your Custom Variables ({customVariables.length})
          </h4>
          <div className="space-y-4">
            {customVariables.map((variable, index) => (
              <div
                key={index}
                className="group flex items-start justify-between gap-6 p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-medium transition-all duration-300 animate-scale-in"
              >
                <div className="flex-1 space-y-3">
                  {/* Variable Name and Label */}
                  <div className="flex items-center gap-3">
                    <code className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-mono border border-blue-200 shadow-soft">
                      {`{{${variable.name}}}`}
                    </code>
                    <span className="text-base font-semibold text-gray-900">
                      {variable.label}
                    </span>
                  </div>

                  {/* Description */}
                  {variable.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {variable.description}
                    </p>
                  )}

                  {/* Example */}
                  {variable.example && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-medium">Example:</span>
                      <em className="text-gray-700">{variable.example}</em>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleEdit(index)}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Edit variable"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete variable "${variable.label}"?`)) {
                        onDelete(index);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Delete variable"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {customVariables.length === 0 && !isAdding && (
        <div className="text-center py-16 px-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-200 animate-fade-in">
          <div className="mb-6">
            <svg className="w-24 h-24 mx-auto text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-blue-900 mb-3">No custom variables yet</h3>
          <p className="text-blue-600 text-base mb-8">Create your first variable to use as a placeholder in your templates</p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-strong"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Variable
          </button>
        </div>
      )}
    </div>
  );
}
