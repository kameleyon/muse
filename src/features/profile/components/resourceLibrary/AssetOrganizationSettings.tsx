import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input'; // Assuming Input is needed
import { Image, FileText, File, Tag, PlusCircle } from 'lucide-react';

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

const AssetOrganizationSettings: React.FC = () => {
  // Local state for this section
  const [categories, setCategories] = useState([
    { id: 'img', name: 'Images', icon: Image },
    { id: 'doc', name: 'Documents', icon: FileText },
    { id: 'tpl', name: 'Templates', icon: File },
  ]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [enableTagging, setEnableTagging] = useState(true);
  const [commonTags, setCommonTags] = useState(['Logo', 'Brand', 'Template', 'Marketing']);
  const [metadataFields, setMetadataFields] = useState({
    creationDate: true,
    author: true,
    fileInfo: true,
    description: true,
    usageRights: false,
    expirationDate: false,
  });

  const handleRemoveCategory = (idToRemove: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== idToRemove));
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      // Basic ID generation, consider a more robust method
      const newId = newCategoryName.trim().toLowerCase().replace(/\s+/g, '_');
      // Use a default icon or allow selection later
      setCategories(prev => [...prev, { id: newId, name: newCategoryName.trim(), icon: File }]);
      setNewCategoryName(''); // Clear input
    }
  };

  const handleMetadataChange = (field: keyof typeof metadataFields) => {
    setMetadataFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Asset Organization</h3>
      <p className="settings-form-description">Configure how resources are organized in the library</p>

      <div className="space-y-4 mt-4">
        {/* Categories */}
        <div>
          <label className="settings-label">Resource Categories</label>
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

        {/* Tagging */}
        <div>
          <label className="settings-label">Resource Tagging</label>
          <div className="toggle-switch-container mb-2">
            <label className="toggle-switch">
              <input type="checkbox" checked={enableTagging} onChange={() => setEnableTagging(!enableTagging)} />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">Enable resource tagging</span>
          </div>

          {enableTagging && (
            <div className="space-y-2 mt-2">
              <label className="text-sm text-[#3d3d3a]">Common Tags</label>
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

        {/* Metadata Fields */}
        <div>
          <label className="settings-label">Metadata Fields</label>
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={metadataFields.creationDate} onChange={() => handleMetadataChange('creationDate')} />
              <span className="ml-2 text-sm">Creation date</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={metadataFields.author} onChange={() => handleMetadataChange('author')} />
              <span className="ml-2 text-sm">Author/Creator</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={metadataFields.fileInfo} onChange={() => handleMetadataChange('fileInfo')} />
              <span className="ml-2 text-sm">File size and type</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={metadataFields.description} onChange={() => handleMetadataChange('description')} />
              <span className="ml-2 text-sm">Description</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={metadataFields.usageRights} onChange={() => handleMetadataChange('usageRights')} />
              <span className="ml-2 text-sm">Usage rights</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={metadataFields.expirationDate} onChange={() => handleMetadataChange('expirationDate')} />
              <span className="ml-2 text-sm">Expiration date</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetOrganizationSettings;