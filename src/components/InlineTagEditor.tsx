import { useState, useRef, useEffect } from 'react';
import { Tag } from '@/types';
import React from 'react';

interface InlineTagEditorProps {
  isOpen: boolean;
  onClose: () => void;
  tags: Tag[];
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
  onAddTag: (tag: Tag) => void;
  onEditTag: (tagId: string, tag: Tag) => void;
  onDeleteTag: (tagId: string) => void;
  position?: { top: number; left: number };
}

const PRESET_COLORS = [
  { name: 'Blue', light: '#E3F2FD', dark: '#1976D2' },
  { name: 'Green', light: '#E8F5E9', dark: '#388E3C' },
  { name: 'Orange', light: '#FFF3E0', dark: '#F57C00' },
  { name: 'Purple', light: '#F3E5F5', dark: '#7B1FA2' },
  { name: 'Teal', light: '#E0F2F1', dark: '#00796B' },
  { name: 'Red', light: '#FFEBEE', dark: '#C62828' },
  { name: 'Indigo', light: '#E8EAF6', dark: '#303F9F' },
  { name: 'Pink', light: '#FCE4EC', dark: '#AD1457' },
  { name: 'Brown', light: '#EFEBE9', dark: '#5D4037' },
  { name: 'Gray', light: '#FAFAFA', dark: '#616161' },
];

export default function InlineTagEditor({
  isOpen,
  onClose,
  tags,
  selectedTags,
  onTagsChange,
  onAddTag,
  onEditTag,
  onDeleteTag,
  position,
}: InlineTagEditorProps): JSX.Element | null {
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
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
        if (isCreating || editingTag) {
          setIsCreating(false);
          setEditingTag(null);
          setNewTagName('');
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
  }, [isOpen, onClose, isCreating, editingTag]);

  if (!isOpen) return null;

  const handleToggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      const newTag: Tag = {
        id: `tag_${Date.now()}`,
        name: newTagName.trim(),
        color: selectedColor.dark,
      };
      onAddTag(newTag);
      setNewTagName('');
      setIsCreating(false);
      onTagsChange([...selectedTags, newTag.id]);
    }
  };

  const handleUpdateTag = () => {
    if (editingTag && newTagName.trim()) {
      onEditTag(editingTag.id, {
        ...editingTag,
        name: newTagName.trim(),
        color: selectedColor.dark,
      });
      setEditingTag(null);
      setNewTagName('');
    }
  };

  const handleStartEdit = (tag: Tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    const color = PRESET_COLORS.find(c => c.dark === tag.color) || PRESET_COLORS[0];
    setSelectedColor(color);
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-[320px] max-h-[480px] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search or create tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-sm outline-none placeholder-gray-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim() && !filteredTags.length) {
                    setNewTagName(searchQuery.trim());
                    setIsCreating(true);
                    setSearchQuery('');
                  }
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[360px]">
            {isCreating || editingTag ? (
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <div className="mb-3">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Tag name"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        editingTag ? handleUpdateTag() : handleCreateTag();
                      }
                    }}
                  />
                </div>

                {/* Color Picker */}
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-full h-7 rounded-md transition-all ${
                        selectedColor.name === color.name
                          ? 'ring-2 ring-offset-1 ring-gray-400 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.dark }}
                      title={color.name}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={editingTag ? handleUpdateTag : handleCreateTag}
                    className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingTag ? 'Update' : 'Create'}
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingTag(null);
                      setNewTagName('');
                      setSearchQuery('');
                    }}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Create New Tag Option */}
                {searchQuery && !filteredTags.find(t => t.name.toLowerCase() === searchQuery.toLowerCase()) && (
                  <button
                    onClick={() => {
                      setNewTagName(searchQuery);
                      setIsCreating(true);
                      setSearchQuery('');
                    }}
                    className="w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create "<span className="font-medium text-gray-900">{searchQuery}</span>"</span>
                  </button>
                )}

                {/* Existing Tags */}
                {filteredTags.length > 0 ? (
                  <div className="py-1">
                    {filteredTags.map((tag) => (
                      <div
                        key={tag.id}
                        className="group flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <button
                          onClick={() => handleToggleTag(tag.id)}
                          className="flex-1 flex items-center gap-2 text-left"
                        >
                          <div className="flex items-center justify-center w-4 h-4">
                            {selectedTags.includes(tag.id) ? (
                              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <div className="w-3 h-3 border border-gray-300 rounded-sm" />
                            )}
                          </div>
                          <span
                            className="px-2 py-0.5 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.name}
                          </span>
                        </button>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(tag);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Edit tag"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete tag "${tag.name}"?`)) {
                                onDeleteTag(tag.id);
                              }
                            }}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Delete tag"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-sm text-gray-500">
                    {searchQuery ? 'No tags found' : 'No tags yet'}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer with Quick Actions */}
          {!isCreating && !editingTag && tags.length > 0 && (
            <div className="p-2 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setIsCreating(true)}
                className="w-full px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors text-left"
              >
                + New tag
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}