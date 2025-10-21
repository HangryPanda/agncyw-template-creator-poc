import { useState } from 'react';
import { Template, Tag } from '@/types';

interface TemplateMetadataEditorProps {
  template: Template;
  tags: Tag[];
  onUpdateName: (name: string) => void;
  onUpdateType: (type: 'email' | 'sms') => void;
  onUpdateTags: (tagIds: string[]) => void;
  onManageTags: () => void;
}

export default function TemplateMetadataEditor({
  template,
  tags,
  onUpdateName,
  onUpdateType,
  onUpdateTags: _onUpdateTags, // Reserved for future tag selection features
  onManageTags,
}: TemplateMetadataEditorProps): JSX.Element {
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(template.name);

  const handleNameSave = (): void => {
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
      setIsEditingName(false);
    }
  };

  const handleNameCancel = (): void => {
    setNameInput(template.name);
    setIsEditingName(false);
  };

  const selectedTagObjs = tags.filter(tag => template.tags.includes(tag.id));

  return (
    <div className="flex items-center gap-4">
      {/* Template Name */}
      <div className="flex-1 flex items-center gap-2">
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameSave();
                if (e.key === 'Escape') handleNameCancel();
              }}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Template name"
              autoFocus
            />
            <button
              onClick={handleNameSave}
              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={handleNameCancel}
              className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900">{template.name}</h2>
            <button
              onClick={() => setIsEditingName(true)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Edit name"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Template Type */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-md p-0.5">
        <button
          onClick={() => onUpdateType('email')}
          className={`px-2 py-1 text-xs font-medium rounded transition-all ${
            template.type === 'email'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Email
        </button>
        <button
          onClick={() => onUpdateType('sms')}
          className={`px-2 py-1 text-xs font-medium rounded transition-all ${
            template.type === 'sms'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          SMS
        </button>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2">
        {selectedTagObjs.length > 0 ? (
          selectedTagObjs.map(tag => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white cursor-pointer hover:opacity-80 transition-opacity"
              style={{ backgroundColor: tag.color }}
              onClick={onManageTags}
            >
              {tag.name}
            </span>
          ))
        ) : (
          <button
            onClick={onManageTags}
            className="flex items-center gap-1 px-2 py-0.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Tag
          </button>
        )}
      </div>
    </div>
  );
}