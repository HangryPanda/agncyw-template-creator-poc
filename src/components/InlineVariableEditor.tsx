import { useState, useRef, useEffect } from 'react';
import { TemplateVariable } from '@/types';
import React from 'react';

interface InlineVariableEditorProps {
  isOpen: boolean;
  onClose: () => void;
  customVariables: TemplateVariable[];
  onAddVariable: (variable: TemplateVariable) => void;
  onEditVariable: (index: number, variable: TemplateVariable) => void;
  onDeleteVariable: (index: number) => void;
  onInsertVariable?: (variable: TemplateVariable) => void;
  position?: { top: number; left: number };
}

// Default system variables that are always available
const SYSTEM_VARIABLES: TemplateVariable[] = [
  { name: 'customer_name', label: 'Customer Name', description: 'Full name of the customer', example: 'John Doe' },
  { name: 'policy_number', label: 'Policy Number', description: 'Insurance policy number', example: 'POL-123456' },
  { name: 'expiry_date', label: 'Expiry Date', description: 'Policy expiration date', example: '12/31/2025' },
  { name: 'premium_amount', label: 'Premium Amount', description: 'Monthly premium', example: '$150.00' },
  { name: 'agent_name', label: 'Agent Name', description: 'Your name as the agent', example: 'Jane Smith' },
];

export default function InlineVariableEditor({
  isOpen,
  onClose,
  customVariables,
  onAddVariable,
  onEditVariable,
  onDeleteVariable,
  onInsertVariable,
  position,
}: InlineVariableEditorProps): JSX.Element | null {
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<TemplateVariable>({
    name: '',
    label: '',
    description: '',
    example: '',
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isCreating || editingIndex !== null) {
          setIsCreating(false);
          setEditingIndex(null);
          resetForm();
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, isCreating, editingIndex]);

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({
      name: '',
      label: '',
      description: '',
      example: '',
    });
  };

  const handleSubmit = () => {
    const validName = /^[a-z][a-z0-9_]*$/.test(formData.name);
    if (!validName) {
      alert('Variable name must start with a lowercase letter and contain only lowercase letters, numbers, and underscores.');
      return;
    }

    if (editingIndex !== null) {
      onEditVariable(editingIndex, formData);
    } else {
      onAddVariable(formData);
      if (onInsertVariable) {
        onInsertVariable(formData);
      }
    }

    setIsCreating(false);
    setEditingIndex(null);
    resetForm();
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(customVariables[index]);
    setIsCreating(true);
  };

  const allVariables = [...SYSTEM_VARIABLES, ...customVariables];
  const filteredVariables = allVariables.filter(variable =>
    variable.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    variable.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const modalStyle: React.CSSProperties = position
    ? {
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
      }
    : {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
      };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]" />

      {/* Modal */}
      <div ref={modalRef} style={modalStyle}>
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-[380px] max-h-[520px] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search or create variable..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-sm outline-none placeholder-gray-400"
              />
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[400px]">
            {isCreating ? (
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="space-y-3">
                  {/* Variable Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Variable Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="customer_id"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      pattern="^[a-z][a-z0-9_]*$"
                      disabled={editingIndex !== null}
                    />
                    <p className="text-xs text-gray-500 mt-1">Use lowercase letters, numbers, and underscores</p>
                  </div>

                  {/* Display Label */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Display Label <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      placeholder="Customer ID"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Unique customer identifier"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Example */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Example Value
                    </label>
                    <input
                      type="text"
                      value={formData.example}
                      onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                      placeholder="CUST-12345"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSubmit}
                      disabled={!formData.name || !formData.label}
                      className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300"
                    >
                      {editingIndex !== null ? 'Update' : 'Create'}
                    </button>
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setEditingIndex(null);
                        resetForm();
                      }}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Variables List */}
                {filteredVariables.length > 0 ? (
                  <div className="py-1">
                    {/* System Variables */}
                    {filteredVariables.filter(v => SYSTEM_VARIABLES.includes(v)).length > 0 && (
                      <>
                        <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                          System Variables
                        </div>
                        {filteredVariables.filter(v => SYSTEM_VARIABLES.some(sv => sv.name === v.name)).map((variable) => (
                          <VariableItem
                            key={variable.name}
                            variable={variable}
                            isSystem={true}
                            onInsert={onInsertVariable}
                            onEdit={() => {}}
                            onDelete={() => {}}
                            onClose={onClose}
                          />
                        ))}
                      </>
                    )}

                    {/* Custom Variables */}
                    {customVariables.filter(v => filteredVariables.includes(v)).length > 0 && (
                      <>
                        <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 mt-2">
                          Custom Variables
                        </div>
                        {customVariables.filter(v => filteredVariables.includes(v)).map((variable, index) => (
                          <VariableItem
                            key={variable.name}
                            variable={variable}
                            isSystem={false}
                            onInsert={onInsertVariable}
                            onEdit={() => handleStartEdit(index)}
                            onDelete={() => {
                              if (window.confirm(`Delete variable "${variable.label}"?`)) {
                                onDeleteVariable(index);
                              }
                            }}
                            onClose={onClose}
                          />
                        ))}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-sm text-gray-500">
                    {searchQuery ? 'No variables found' : 'No variables yet'}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!isCreating && (
            <div className="p-2 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setIsCreating(true)}
                className="w-full px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors text-left"
              >
                + New custom variable
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Variable Item Component
function VariableItem({
  variable,
  isSystem,
  onInsert,
  onEdit,
  onDelete,
  onClose,
}: {
  variable: TemplateVariable;
  isSystem: boolean;
  onInsert?: (variable: TemplateVariable) => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  return (
    <div className="group flex items-start justify-between px-3 py-2 hover:bg-gray-50 transition-colors">
      <button
        onClick={() => {
          if (onInsert) {
            onInsert(variable);
            onClose();
          }
        }}
        className="flex-1 text-left"
      >
        <div className="flex items-center gap-2 mb-1">
          <code className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
            {`{{${variable.name}}}`}
          </code>
          <span className="text-sm font-medium text-gray-900">{variable.label}</span>
        </div>
        {variable.description && (
          <p className="text-xs text-gray-500 mt-1">{variable.description}</p>
        )}
        {variable.example && (
          <p className="text-xs text-gray-400 mt-0.5">Example: {variable.example}</p>
        )}
      </button>

      {!isSystem && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Edit variable"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-gray-400 hover:text-red-600"
            title="Delete variable"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}