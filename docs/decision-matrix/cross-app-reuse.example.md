# ───────────────────────────────────────────────────────────────────────────────
# File: core/styles/tokens/core.tokens.json
# Purpose: Primitive tokens (authoritative values; not used directly in UI)
# ───────────────────────────────────────────────────────────────────────────────
{
  "color": {
    "brand": { "primary": "#D32F2F" },
    "neutral": { "0": "#FFFFFF", "50": "#FAFAFA", "800": "#1F2937", "900": "#0B0B0B" }
  },
  "space": { "1": "0.25rem", "2": "0.5rem", "3": "0.75rem", "4": "1rem", "5": "1.25rem" },
  "radius": { "sm": "0.375rem", "md": "0.75rem", "lg": "1rem" },
  "shadow": { "md": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }
}

# ───────────────────────────────────────────────────────────────────────────────
# File: core/styles/themes/light.css
# Purpose: Map tokens → CSS variables (semantic, overridable)
# Attach to a container via data-theme="light"
# ───────────────────────────────────────────────────────────────────────────────
:root[data-theme="light"]{
  --color-surface: #FFFFFF;                 /* from tokens.color.neutral.0 */
  --color-surface-muted: #FAFAFA;          /* neutral.50 */
  --color-text: #0B0B0B;                   /* neutral.900 */
  --color-muted-foreground: #6B7280;       /* gray-500 approx */
  --color-border: #E5E7EB;                 /* gray-200 approx */
  --color-ring: #2563EB;                   /* blue-600 approx */
  --color-primary: #D32F2F;                /* brand.primary */
  --shadow-md: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

  --radius-md: 0.75rem;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --z-modal: 9999;
  --z-backdrop: 9998;
}

# ───────────────────────────────────────────────────────────────────────────────
# File: core/types/tag.ts
# Purpose: Minimal Tag type used by the Construct
# ───────────────────────────────────────────────────────────────────────────────
export interface Tag {
  id: string
  name: string
  color: string
}

# ───────────────────────────────────────────────────────────────────────────────
# File: core/utils/colorSystem.ts
# Purpose: Preset colors + simple distinct-color helper
# ───────────────────────────────────────────────────────────────────────────────
export const PRESET_COLORS = [
  "#2563EB","#10B981","#F59E0B","#EF4444","#8B5CF6",
  "#14B8A6","#84CC16","#EC4899","#F97316","#06B6D4"
]

export function getNextDistinctColor(current?: string) {
  if (!current) return PRESET_COLORS[0]
  const i = PRESET_COLORS.indexOf(current)
  return PRESET_COLORS[(i + 1) % PRESET_COLORS.length]
}

# ───────────────────────────────────────────────────────────────────────────────
# File: core/ui/constructs/InlineTagEditorConstruct/InlineTagEditorConstruct.vars.css
# Purpose: Construct-scoped variables (theme-facing “knobs” the layout can override)
# Why separate? This file is the *contract* between design (themes/layouts) and the construct’s visuals.
# ───────────────────────────────────────────────────────────────────────────────
/* Namespace the construct so overrides are safe & targeted */
[data-construct="InlineTagEditor"]{
  /* Surface & text */
  --ite-bg: var(--color-surface);
  --ite-fg: var(--color-text);
  --ite-muted-bg: color-mix(in oklab, var(--color-surface), black 5%);
  --ite-muted-fg: var(--color-muted-foreground);
  --ite-border: var(--color-border);

  /* Accents */
  --ite-ring: var(--color-ring);
  --ite-primary: var(--color-primary);

  /* Sizing & shape */
  --ite-radius: var(--radius-md);
  --ite-gap: var(--space-3);
  --ite-pad: var(--space-3);

  /* Effects & layers */
  --ite-shadow: var(--shadow-md);
  --ite-z-modal: var(--z-modal);
  --ite-z-backdrop: var(--z-backdrop);

  /* Motion */
  --ite-scale-in: 0.98; /* start scale for enter animation */
}

# ───────────────────────────────────────────────────────────────────────────────
# File: core/ui/constructs/InlineTagEditorConstruct/InlineTagEditorConstruct.tailwind.css
# Purpose: Structural composition & states using Tailwind @layer + the variables above.
# Why separate? This file uses utilities & classnames; it *consumes* variables but doesn’t declare design tokens.
# ───────────────────────────────────────────────────────────────────────────────
@layer components {
  /* Backdrop */
  .ite-backdrop {
    @apply fixed inset-0 backdrop-blur-sm;
    background: rgb(0 0 0 / 0.20);
    z-index: var(--ite-z-backdrop);
  }

  /* Modal container (position computed inline via style prop; visual style here) */
  .ite-modal {
    @apply rounded-lg border w-[320px] max-h-[480px] overflow-hidden shadow-2xl;
    background: var(--ite-bg);
    color: var(--ite-fg);
    border-color: var(--ite-border);
    box-shadow: var(--ite-shadow);
    z-index: var(--ite-z-modal);
    transform-origin: top left;
    transform: scale(var(--ite-scale-in));
    animation: ite-scale-in 120ms ease-out forwards;
  }

  /* Sections */
  .ite-header { @apply p-3 border-b; border-color: var(--ite-border); }
  .ite-content { @apply max-h-[360px] overflow-y-auto; }
  .ite-footer { @apply p-2 border-t; border-color: var(--ite-border); background: color-mix(in oklab, var(--ite-bg), black 3%); }

  /* Inputs */
  .ite-input {
    @apply w-full text-sm outline-none placeholder-gray-400;
    background: transparent;
  }

  .ite-field {
    @apply w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:border-transparent;
    border-color: var(--ite-border);
    --tw-ring-color: var(--ite-ring);
  }

  /* Color swatches */
  .ite-swatch {
    @apply w-full h-7 rounded-md transition-transform;
  }
  .ite-swatch--active {
    @apply ring-2 ring-offset-1 scale-110;
    --tw-ring-color: var(--ite-ring);
  }
  .ite-swatch--hover { @apply hover:scale-105; }

  /* Buttons */
  .ite-btn {
    @apply px-3 py-1.5 text-xs font-medium rounded-md transition-colors;
  }
  .ite-btn--primary {
    @apply text-white;
    background: var(--ite-primary);
  }
  .ite-btn--muted {
    @apply text-foreground/80;
    background: color-mix(in oklab, var(--ite-bg), black 6%);
  }

  /* List rows */
  .ite-row { @apply flex items-center justify-between px-3 py-2 transition-colors; }
  .ite-row--hover { @apply hover:bg-muted/30; }

  .ite-chip {
    @apply px-2 py-0.5 rounded text-xs font-medium text-white;
  }

  .ite-iconbtn {
    @apply p-1 transition-opacity;
  }
  .ite-iconbtn-wrap { @apply flex items-center gap-1 opacity-0 group-hover:opacity-100; }

  /* Keyframes */
  @keyframes ite-scale-in {
    to { transform: scale(1); }
  }
}

# ───────────────────────────────────────────────────────────────────────────────
# File: core/ui/constructs/InlineTagEditorConstruct/InlineTagEditorConstruct.tsx
# Purpose: Your component adapted as a Construct:
#   - Adds data-construct for scoping
#   - Replaces long Tailwind class chains with short, variable-driven classes
#   - Leaves *positioning* inline (JS-calculated), keeps *visuals* in CSS
# ───────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from 'react'
import type { Tag } from '@core/types/tag'
import { PRESET_COLORS, getNextDistinctColor } from '@core/utils/colorSystem'

interface InlineTagEditorProps {
  isOpen: boolean
  onClose: () => void
  tags: Tag[]
  selectedTags: string[]
  onTagsChange: (tagIds: string[]) => void
  onAddTag: (tag: Tag) => void
  onEditTag: (tagId: string, tag: Tag) => void
  onDeleteTag: (tagId: string) => void
  position?: { top: number; left: number }
}

export default function InlineTagEditorConstruct({
  isOpen,
  onClose,
  tags,
  selectedTags,
  onTagsChange,
  onAddTag,
  onEditTag,
  onDeleteTag,
  position
}: InlineTagEditorProps): JSX.Element | null {
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newTagName, setNewTagName] = useState('')
  const [selectedColor, setSelectedColor] = useState<string>(PRESET_COLORS[0])
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus()
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose()
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (isCreating || editingTag) {
        setIsCreating(false); setEditingTag(null); setNewTagName('')
      } else onClose()
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, isCreating, editingTag])

  if (!isOpen) return null

  const handleToggleTag = (tagId: string) => {
    onTagsChange(selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId])
  }

  const handleCreateTag = () => {
    if (!newTagName.trim()) return
    const newTag: Tag = { id: `tag_${Date.now()}`, name: newTagName.trim(), color: selectedColor }
    onAddTag(newTag)
    setNewTagName(''); setIsCreating(false)
    onTagsChange([...selectedTags, newTag.id])
  }

  const handleUpdateTag = () => {
    if (!editingTag || !newTagName.trim()) return
    onEditTag(editingTag.id, { ...editingTag, name: newTagName.trim(), color: selectedColor })
    setEditingTag(null); setNewTagName('')
  }

  const handleStartEdit = (tag: Tag) => {
    setEditingTag(tag); setNewTagName(tag.name)
    setSelectedColor(PRESET_COLORS.find(c => c === tag.color) || PRESET_COLORS[0])
  }

  const filteredTags = tags.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const modalStyle: React.CSSProperties = position
    ? { position: 'fixed', top: `${position.top}px`, left: `${position.left}px`, zIndex: 9999 }
    : { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }

  return (
    <div data-construct="InlineTagEditor">
      {/* Backdrop */}
      <div className="ite-backdrop" />

      {/* Modal */}
      <div ref={modalRef} style={modalStyle} className="ite-modal">
        {/* Header */}
        <div className="ite-header">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[color:var(--ite-muted-fg)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <input
              ref={inputRef}
              className="ite-input"
              type="text"
              placeholder="Search or create tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim() && !filteredTags.length) {
                  setNewTagName(searchQuery.trim()); setIsCreating(true); setSearchQuery('')
                }
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="ite-content">
          {(isCreating || editingTag) ? (
            <div className="p-4 border-b" style={{ borderColor: 'var(--ite-border)', background: 'color-mix(in oklab, var(--ite-bg), black 3%)' }}>
              <div className="mb-3">
                <input
                  className="ite-field"
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Tag name"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') (editingTag ? handleUpdateTag() : handleCreateTag()) }}
                />
              </div>

              {/* Color Picker */}
              <div className="grid grid-cols-5 gap-2 mb-3">
                {PRESET_COLORS.map((color, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`ite-swatch ${selectedColor === color ? 'ite-swatch--active' : 'ite-swatch--hover'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button onClick={editingTag ? handleUpdateTag : handleCreateTag} className="ite-btn ite-btn--primary">
                  {editingTag ? 'Update' : 'Create'}
                </button>
                <button
                  onClick={() => { setIsCreating(false); setEditingTag(null); setNewTagName(''); setSearchQuery('') }}
                  className="ite-btn ite-btn--muted"
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
                  onClick={() => { setNewTagName(searchQuery); setIsCreating(true); setSearchQuery('') }}
                  className="w-full px-3 py-2.5 text-left transition-colors flex items-center gap-2 text-sm hover:bg-[color:var(--ite-muted-bg)]"
                >
                  <svg className="w-4 h-4 text-[color:var(--ite-muted-fg)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create "<span className="font-medium" style={{ color: 'var(--ite-fg)' }}>{searchQuery}</span>"</span>
                </button>
              )}

              {/* Existing Tags */}
              {filteredTags.length > 0 ? (
                <div className="py-1">
                  {filteredTags.map((tag) => (
                    <div key={tag.id} className="group ite-row ite-row--hover">
                      <button onClick={() => handleToggleTag(tag.id)} className="flex-1 flex items-center gap-2 text-left">
                        <div className="flex items-center justify-center w-4 h-4">
                          {selectedTags.includes(tag.id) ? (
                            <svg className="w-4 h-4" style={{ color: 'var(--ite-primary)' }} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <div className="w-3 h-3 rounded-sm" style={{ border: '1px solid var(--ite-border)' }} />
                          )}
                        </div>
                        <span className="ite-chip" style={{ backgroundColor: tag.color }}>{tag.name}</span>
                      </button>

                      <div className="ite-iconbtn-wrap">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleStartEdit(tag) }}
                          className="ite-iconbtn text-[color:var(--ite-muted-fg)] hover:text-[color:var(--ite-fg)]"
                          title="Edit tag"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (window.confirm(`Delete tag "${tag.name}"?`)) onDeleteTag(tag.id)
                          }}
                          className="ite-iconbtn text-[color:var(--ite-muted-fg)] hover:text-red-600"
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
                <div className="p-8 text-center text-sm" style={{ color: 'var(--ite-muted-fg)' }}>
                  {searchQuery ? 'No tags found' : 'No tags yet'}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!isCreating && !editingTag && tags.length > 0 && (
          <div className="ite-footer">
            <button
              onClick={() => setIsCreating(true)}
              className="w-full text-xs text-[color:var(--ite-muted-fg)] hover:text-[color:var(--ite-fg)] hover:bg-[color:var(--ite-muted-bg)] px-3 py-1.5 rounded-md text-left transition-colors"
            >
              + New tag
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

# ───────────────────────────────────────────────────────────────────────────────
# File: apps/crm/ui/layouts/CRMDashboardLayout/CRMDashboardLayout.styles.css
# Purpose: Example of a layout *overriding* the construct variables (no code changes in the Construct)
# ───────────────────────────────────────────────────────────────────────────────
/* Slightly beef up radius & padding for this screen only */
[data-layout="CRMDashboard"] [data-construct="InlineTagEditor"]{
  --ite-radius: 1rem;
  --ite-pad: 1rem;
  --ite-muted-bg: color-mix(in oklab, var(--color-surface), black 8%);
}

# ───────────────────────────────────────────────────────────────────────────────
# File: apps/crm/ui/layouts/CRMDashboardLayout/CRMDashboardLayout.tsx
# Purpose: Layout root that scopes theme & layout, then renders the Construct
# ───────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react'
import InlineTagEditorConstruct from '@core/ui/constructs/InlineTagEditorConstruct/InlineTagEditorConstruct'
import type { Tag } from '@core/types/tag'

export default function CRMDashboardLayout(){
  const [open, setOpen] = useState(true)
  const [tags, setTags] = useState<Tag[]>([
    { id:'1', name:'Urgent', color:'#EF4444' },
    { id:'2', name:'Renewal', color:'#2563EB' },
    { id:'3', name:'VIP', color:'#10B981' }
  ])
  const [selected, setSelected] = useState<string[]>(['2'])

  return (
    <div data-theme="light" data-layout="CRMDashboard" className="min-h-screen p-6">
      <button className="border rounded-md px-3 py-2" onClick={()=>setOpen(true)}>Open Tag Editor</button>
      <InlineTagEditorConstruct
        isOpen={open}
        onClose={()=>setOpen(false)}
        tags={tags}
        selectedTags={selected}
        onTagsChange={setSelected}
        onAddTag={(t)=>setTags(prev=>[...prev, t])}
        onEditTag={(id, t)=>setTags(prev=>prev.map(p=>p.id===id?t:p))}
        onDeleteTag={(id)=>setTags(prev=>prev.filter(p=>p.id!==id))}
        position={{ top: 140, left: 240 }}
      />
    </div>
  )
}