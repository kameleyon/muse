import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Folder, Tag, PlusCircle } from 'lucide-react';

// Reusable component for category row
const CategoryRow: React.FC<{ icon: React.ElementType; name: string; onRemove: () => void }> = ({ icon: Icon, name, onRemove }) => (
  <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
    <div className="flex items-center">
      <Icon size={16} className="mr-2 text-[#3d3d3a]" />
      <span className="text-sm">{name}</span>
    </div>
    <Button variant="ghost" size="sm" className="h-6 px-2" onClick={onRemove}>✕</Button>
  </div>
);

// Reusable component for tag display
const TagDisplay: React.FC<{ name: string }> = ({ name }) => (
  <div className="inline-flex items-center bg-[#f9f7f1] px-2 py-1 rounded-md">
    <Tag size={14} className="mr-1 text-[#3d3d3a]" />
    <span className="text-xs">{name}</span>
  </div>
);

// Define types for clarity
type TemplateSortOrder = 'alpha' | 'recent' | 'frequent' | 'created' | 'custom';

const TemplateOrganizationSettings: React.FC = () => {
  // Local state for this section
  const [categories, setCategories] = useState([
    { id: 'biz', name: 'Business', icon: Folder },
    { id: 'creative', name: 'Creative Writing', icon: Folder },
    { id: 'academic', name: 'Academic', icon: Folder },
  ]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [sortOrder, setSortOrder] = useState<TemplateSortOrder>('alpha');
  const [enableTagging, setEnableTagging] = useState(true);
  const [commonTags, setCommonTags] = useState(['Draft', 'Final', 'Approved', 'Important']);

  const handleRemoveCategory = (idToRemove: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== idToRemove));
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newId = newCategoryName.trim().toLowerCase().replace(/\s+/g, '_');
      setCategories(prev => [...prev, { id: newId, name: newCategoryName.trim(), icon: Folder }]);
      setNewCategoryName('');
    }
  };

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Template Organization</h3>
      <p className="settings-form-description">Configure how templates are categorized and displayed</p>

      <div className="space-y-4 mt-4">
        {/* Categories */}
        <div>
          <label className="settings-label">Template Categories</label>
          <div className="space-y-2 mb-4">
            {categories.map(cat => (
              <CategoryRow key={cat.id} icon={cat.icon} name={cat.name} onRemove={() => handleRemoveCategory(cat.id)} />
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              className="settings-input"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button variant="outline" size="sm" onClick={handleAddCategory}>
              <PlusCircle size={16} className="mr-1" /> Add
            </Button>
          </div>
        </div>

        {/* Sorting */}
        <div>
          <label className="settings-label">Template Sorting</label>
          <select
            className="settings-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as TemplateSortOrder)}
          >
            <option value="alpha">Alphabetical</option>
            <option value="recent">Most Recently Used</option>
            <option value="frequent">Most Frequently Used</option>
            <option value="created">Date Created</option>
            <option value="custom">Custom Order</option>
          </select>
        </div>

        {/* Tagging */}
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input type="checkbox" checked={enableTagging} onChange={() => setEnableTagging(!enableTagging)} />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Allow tagging templates</span>
        </div>

        {enableTagging && (
          <div className="space-y-2 mt-2">
            <label className="settings-label">Common Tags</label>
            <div className="flex flex-wrap gap-2">
              {commonTags.map(tag => <TagDisplay key={tag} name={tag} />)}
              {/* TODO: Add input/button to add new common tags */}
              <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                <PlusCircle size={12} className="mr-1" /> Add Tag
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateOrganizationSettings;