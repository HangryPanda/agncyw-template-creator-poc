import { useState } from 'react';
import { Tag } from '@/types';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

interface TagManagerProps {
  tags: Tag[];
  onAdd: (tag: Tag) => void;
  onEdit: (tagId: string, tag: Tag) => void;
  onDelete: (tagId: string) => void;
}

const PRESET_COLORS = [
  '#1976d2', // Blue
  '#388e3c', // Green
  '#d32f2f', // Red
  '#f57c00', // Orange
  '#7b1fa2', // Purple
  '#0097a7', // Cyan
  '#c2185b', // Pink
  '#5d4037', // Brown
  '#616161', // Gray
];

export default function TagManager({
  tags,
  onAdd,
  onEdit,
  onDelete,
}: TagManagerProps): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ name: string; color: string }>({
    name: '',
    color: PRESET_COLORS[0],
  });
  const [deleteConfirmTag, setDeleteConfirmTag] = useState<Tag | null>(null);

  const resetForm = (): void => {
    setFormData({
      name: '',
      color: PRESET_COLORS[0],
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (editingId !== null) {
      onEdit(editingId, {
        id: editingId,
        name: formData.name,
        color: formData.color,
      });
    } else {
      const newTag: Tag = {
        id: `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name,
        color: formData.color,
      };
      onAdd(newTag);
    }
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (tag: Tag): void => {
    setFormData({ name: tag.name, color: tag.color });
    setEditingId(tag.id);
    setIsDialogOpen(true);
  };

  const handleOpenDialog = (): void => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleDelete = (tag: Tag): void => {
    setDeleteConfirmTag(tag);
  };

  const confirmDelete = (): void => {
    if (deleteConfirmTag) {
      onDelete(deleteConfirmTag.id);
      setDeleteConfirmTag(null);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Manage Tags</CardTitle>
            <CardDescription>Organize your templates with custom tags</CardDescription>
          </div>
          <Button onClick={handleOpenDialog} size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Tag
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        {/* Tags List */}
        {tags.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-4">
              {tags.length} {tags.length === 1 ? 'tag' : 'tags'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tags.map((tag) => (
                <Card key={tag.id} className="group">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Badge
                        className="text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </Badge>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => handleEdit(tag)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                        <Button
                          onClick={() => handleDelete(tag)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:text-destructive"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <svg className="w-12 h-12 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h3 className="text-lg font-semibold mb-1">No tags yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Create your first tag to start organizing</p>
              <Button onClick={handleOpenDialog} size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Tag
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Tag' : 'New Tag'}</DialogTitle>
              <DialogDescription>
                {editingId ? 'Update your tag details' : 'Create a new tag to organize your templates'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tag Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Quote Follow-up, New Customer"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="grid grid-cols-9 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-md cursor-pointer transition-all hover:scale-110 ${
                        formData.color === color
                          ? 'ring-2 ring-primary ring-offset-2'
                          : 'ring-1 ring-border'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? 'Update' : 'Add'} Tag
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmTag} onOpenChange={() => setDeleteConfirmTag(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the tag "{deleteConfirmTag?.name}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteConfirmTag(null)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDelete}>
              Delete Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}