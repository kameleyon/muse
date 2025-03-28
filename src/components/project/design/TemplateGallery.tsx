import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input'; // For search/filter
import { Button } from '@/components/ui/Button'; // For filter toggles
import { Filter, LayoutGrid, List, CheckCircle } from 'lucide-react'; // Icons

// Placeholder data for templates
const placeholderTemplates = [
  { id: 't1', name: 'Minimalist Pro', category: 'Minimalist/Professional', preview: '/path/to/thumb1.jpg' },
  { id: 't2', name: 'Corporate Blue', category: 'Corporate/Enterprise', preview: '/path/to/thumb2.jpg' },
  { id: 't3', name: 'Creative Splash', category: 'Creative/Modern', preview: '/path/to/thumb3.jpg' },
  { id: 't4', name: 'Data Focus', category: 'Data-focused/Analytical', preview: '/path/to/thumb4.jpg' },
  { id: 't5', name: 'Narrative Arc', category: 'Storytelling/Narrative', preview: '/path/to/thumb5.jpg' },
  { id: 't6', name: 'Tech Startup', category: 'Industry-Specific', preview: '/path/to/thumb6.jpg' },
];

// Define Props
interface TemplateGalleryProps {
  selectedTemplateId: string | null;
  onSelectTemplate: (id: string | null) => void; // Allow deselecting? Or just selecting? Let's allow selecting only for now.
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ selectedTemplateId, onSelectTemplate }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); 

  // Handle template selection - toggle might be complex, let's just select
  const handleSelect = (id: string) => {
     onSelectTemplate(id);
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm">
      <div className="flex justify-between items-center mb-4 border-b border-neutral-light/40 pb-2">
        <h4 className="font-semibold text-neutral-dark text-lg">Select a Template</h4>
        <div className="flex items-center gap-2">
           {/* View Mode Toggle */}
           <Button variant="ghost" size="sm" onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'text-primary' : 'text-neutral-medium'}>
             <LayoutGrid size={16} />
           </Button>
           <Button variant="ghost" size="sm" onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'text-primary' : 'text-neutral-medium'}>
             <List size={16} />
           </Button>
           {/* Filter Toggle */}
           <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
             <Filter size={14} className="mr-1" /> Filters {showFilters ? '(Hide)' : '(Show)'}
           </Button>
        </div>
      </div>

      {/* Filters Section (Collapsible) */}
      {showFilters && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-neutral-light/20 rounded-md border border-neutral-light/50">
          {/* Placeholder Filters */}
          <div>
            <label className="text-xs font-medium text-neutral-medium block mb-1">Industry</label>
            <select className="settings-input text-sm p-1 w-full"><option>All</option><option>Tech</option><option>Finance</option></select>
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-medium block mb-1">Purpose</label>
            <select className="settings-input text-sm p-1 w-full"><option>All</option><option>Investment</option><option>Sales</option></select>
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-medium block mb-1">Style</label>
            <select className="settings-input text-sm p-1 w-full"><option>All</option><option>Minimalist</option><option>Creative</option></select>
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-medium block mb-1">Color</label>
            <Input type="color" className="settings-input p-0 h-8 w-full" defaultValue="#ae5630" />
          </div>
           {/* Add more filters like toggles later */}
        </div>
      )}

      {/* Template Grid/List */}
      <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' : 'grid-cols-1'}`}>
        {placeholderTemplates.map(template => {
          const isSelected = selectedTemplateId === template.id;
          return (
            <Card 
              key={template.id} 
              onClick={() => handleSelect(template.id)} // Use handler
              className={`template-card relative border hover:shadow-md cursor-pointer transition-shadow overflow-hidden ${
                 isSelected ? 'border-primary ring-2 ring-primary/50' : 'border-neutral-light' // Highlight selected
              }`}
            >
              {/* Selected Checkmark */}
              {isSelected && (
                 <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5 z-10">
                   <CheckCircle size={12} />
                 </div>
               )}
              <div className="aspect-[4/3] bg-neutral-light flex items-center justify-center text-neutral-medium text-xs p-1 text-center">
                Thumbnail for {template.name}
              </div>
              <div className="p-2 space-y-0.5">
                <p className="text-sm font-medium truncate leading-tight">{template.name}</p>
                <p className="text-xs text-neutral-medium truncate leading-tight">{template.category}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
};

export default TemplateGallery;