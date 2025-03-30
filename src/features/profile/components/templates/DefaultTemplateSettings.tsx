import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PlusCircle, File } from 'lucide-react';
import FileTemplateIcon from '@/components/icons/FileTemplate'; // Assuming this icon exists

// Define types for clarity
type DefaultTemplateOption = 'blank' | 'basic' | 'business' | 'creative' | 'academic' | 'custom';
type ContentType = 'blog' | 'newsletter' | 'report'; // Example content types

const DefaultTemplateSettings: React.FC = () => {
  // Local state for this section
  const [defaultTemplate, setDefaultTemplate] = useState<DefaultTemplateOption>('blank');
  const [selectedCustomTemplate, setSelectedCustomTemplate] = useState<{ id: string; name: string } | null>(
    { id: 'novel-chap', name: 'Novel Chapter' } // Example initial custom template
  );
  const [contentTypeTemplates, setContentTypeTemplates] = useState<Record<ContentType, string>>({
    blog: 'Blog Template',
    newsletter: 'Newsletter Template',
    report: 'Business Report',
  });

  const handleContentTypeTemplateChange = (contentType: ContentType, templateName: string) => {
    setContentTypeTemplates(prev => ({ ...prev, [contentType]: templateName }));
  };

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Default Templates</h3>
      <p className="settings-form-description">Configure the default templates for new content</p>

      <div className="space-y-4 mt-4">
        {/* Default New Document Template */}
        <div>
          <label className="settings-label">Default New Document Template</label>
          <select
            className="settings-select"
            value={defaultTemplate}
            onChange={(e) => setDefaultTemplate(e.target.value as DefaultTemplateOption)}
          >
            <option value="blank">Blank Document</option>
            <option value="basic">Basic Document</option>
            <option value="business">Business Report</option>
            <option value="creative">Creative Writing</option>
            <option value="academic">Academic Paper</option>
            <option value="custom">Custom Template</option>
          </select>
        </div>

        {/* Custom Template Selection (conditional) */}
        {defaultTemplate === 'custom' && (
          <div>
            <label className="settings-label">Custom Template</label>
            <div className="space-y-2 mt-2">
              {selectedCustomTemplate ? (
                <div className="flex items-center p-2 border border-[#ae5630] rounded-md bg-[#f9f7f1]">
                  <FileTemplateIcon size={16} className="mr-2 text-[#ae5630]" />
                  <span className="text-sm">{selectedCustomTemplate.name}</span>
                  <span className="ml-auto text-xs text-[#3d3d3a]">Personal Template</span> {/* Example source */}
                </div>
              ) : (
                <p className="text-sm text-neutral-medium">No custom template selected.</p>
              )}
              {/* TODO: Implement template selection modal/logic */}
              <Button variant="outline" size="sm">
                Select Different Template
              </Button>
            </div>
          </div>
        )}

        {/* Content Type Specific Templates */}
        <div>
          <label className="settings-label">Content Type Templates</label>
          <div className="space-y-2">
            {/* Example for Blog Post */}
            <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
              <div className="flex items-center">
                <File size={16} className="mr-2 text-[#3d3d3a]" />
                <span className="text-sm">Blog Post</span>
              </div>
              <select
                className="text-xs py-1 px-2 border rounded bg-white"
                value={contentTypeTemplates.blog}
                onChange={(e) => handleContentTypeTemplateChange('blog', e.target.value)}
              >
                <option>Blog Template</option>
                <option>Blank Document</option>
                <option>Custom</option> {/* Add logic for custom selection */}
              </select>
            </div>
            {/* Example for Newsletter */}
            <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
              <div className="flex items-center">
                <File size={16} className="mr-2 text-[#3d3d3a]" />
                <span className="text-sm">Newsletter</span>
              </div>
              <select
                className="text-xs py-1 px-2 border rounded bg-white"
                value={contentTypeTemplates.newsletter}
                onChange={(e) => handleContentTypeTemplateChange('newsletter', e.target.value)}
              >
                <option>Newsletter Template</option>
                <option>Blank Document</option>
                <option>Custom</option>
              </select>
            </div>
             {/* Example for Report */}
             <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
              <div className="flex items-center">
                <File size={16} className="mr-2 text-[#3d3d3a]" />
                <span className="text-sm">Report</span>
              </div>
              <select
                className="text-xs py-1 px-2 border rounded bg-white"
                value={contentTypeTemplates.report}
                onChange={(e) => handleContentTypeTemplateChange('report', e.target.value)}
              >
                <option>Business Report</option>
                <option>Blank Document</option>
                <option>Custom</option>
              </select>
            </div>
          </div>
          {/* TODO: Add functionality to add/manage content types */}
          <Button variant="outline" size="sm" className="mt-2">
            <PlusCircle size={16} className="mr-1" /> Add Content Type
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DefaultTemplateSettings;