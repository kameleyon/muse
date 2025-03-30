import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Filter, CheckCircle, Sparkles, LayoutGrid, List } from 'lucide-react';

// Template interface
interface Template {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  isPremium?: boolean;
}

// Define Props
interface TemplateGalleryProps {
  selectedTemplateId: string | null;
  onSelectTemplate: (id: string) => void;
  primaryColor: string;
}

// Template data matching the provided design
const templates: Template[] = [
  {
    id: 'minimalist-pro',
    name: 'Minimalist Pro',
    subtitle: 'Minimal • Professional',
    description: 'Clean, minimal design focusing on content with elegant typography and ample whitespace.'
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    subtitle: 'Corporate • Business',
    description: 'Professional template with corporate styling, perfect for enterprise presentations.'
  },
  {
    id: 'creative-splash',
    name: 'Creative Splash',
    subtitle: 'Creative • Modern',
    description: 'Vibrant, colorful template with creative layouts for standout presentations.'
  },
  {
    id: 'data-focus',
    name: 'Data Focus',
    subtitle: 'Analytical • Technical',
    description: 'Optimized for data presentation with built-in chart layouts and visualization spaces.'
  },
  {
    id: 'narrative-arc',
    name: 'Narrative Arc',
    subtitle: 'Storytelling • Journey',
    description: 'Structured to tell a cohesive story with flowing transitions between slides.'
  },
  {
    id: 'tech-startup',
    name: 'Tech Startup',
    subtitle: 'Industry-Specific • Tech',
    description: 'Designed specifically for tech startups with focus on innovation and growth metrics.'
  },
  {
    id: 'elegant-gradient',
    name: 'Elegant Gradient',
    subtitle: 'Professional • Modern',
    description: 'Modern template with subtle gradient backgrounds and elegant typography.',
    isPremium: true
  },
  {
    id: 'bold-contrast',
    name: 'Bold Contrast',
    subtitle: 'Impact • Bold',
    description: 'High-contrast design for maximum impact and memorability.'
  },
];

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  primaryColor,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter templates based on search
  const filteredTemplates = templates.filter(template =>
    searchQuery === '' ||
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected template
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm">
      {/* Header with title - now at the top as requested */}
      <h4 className="font-semibold text-neutral-dark text-lg mb-4">Select a Template</h4>
      
      {/* Controls row with search, view toggle and filters */}
      <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
        <Input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow max-w-64 h-8 text-sm"
        />
        
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex border rounded overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`p-1 h-7 ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-neutral-medium'}`}
            >
              <LayoutGrid size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={`p-1 h-7 ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-neutral-medium'}`}
            >
              <List size={14} />
            </Button>
          </div>
          
          {/* Filter Button - more compact as requested */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="h-7 px-2 flex items-center gap-1 whitespace-nowrap"
          >
            <span className="text-xs">Show Filters</span>
            <Filter size={12} />
          </Button>
        </div>
      </div>

      {/* Simple template count */}
      <div className="text-xs text-neutral-medium mb-3">
        Showing {filteredTemplates.length} of {templates.length} templates
      </div>

      {/* Template Grid or List view based on viewMode */}
      <div className={viewMode === 'grid'
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4"
        : "flex flex-col space-y-2 mb-4"
      }>
        {filteredTemplates.map(template => {
          const isSelected = selectedTemplateId === template.id;
          
          return (
            <div
              key={template.id}
              onClick={() => {
                // Set the template ID and force the update to happen
                onSelectTemplate(template.id);
              }}
              className={`${viewMode === 'list' ? 'flex flex-row items-center p-2' : ''}
                border rounded-md cursor-pointer relative overflow-hidden
                ${isSelected ? `border-primary ring-1 ring-primary` : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-1 right-1 bg-primary rounded-full p-1 text-white">
                  <CheckCircle size={12} />
                </div>
              )}
              
              {/* Premium badge */}
              {template.isPremium && (
                <div className="absolute top-0 left-0 bg-amber-500 text-white text-xs py-0.5 px-2 rounded-br-md">
                  <div className="flex items-center">
                    <Sparkles size={10} className="mr-1" />
                    PREMIUM
                  </div>
                </div>
              )}
              
              {/* Template preview with visual designs */}
              <div className="aspect-square flex items-center justify-center p-2 border-b">
                {template.id === 'minimalist-pro' && (
                  <div className="w-full h-full bg-gray-50 flex flex-col p-3">
                    <div className="h-4 w-1/2 bg-gray-200 mb-2"></div>
                    <div className="flex-1 flex flex-col justify-center items-center">
                      <div className="h-1 w-2/3 bg-gray-300 mb-1"></div>
                      <div className="h-1 w-1/2 bg-gray-300 mb-1"></div>
                      <div className="h-1 w-3/5 bg-gray-300"></div>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-gray-400 self-end mt-2"></div>
                  </div>
                )}
                
                {template.id === 'corporate-blue' && (
                  <div className="w-full h-full flex flex-col">
                    <div className="h-5 bg-blue-700 mb-2"></div>
                    <div className="flex-1 grid grid-cols-2 gap-1 p-1">
                      <div className="bg-blue-100 rounded"></div>
                      <div className="bg-blue-200 rounded"></div>
                      <div className="bg-blue-300 rounded"></div>
                      <div className="bg-blue-400 rounded"></div>
                    </div>
                  </div>
                )}
                
                {template.id === 'creative-splash' && (
                  <div className="w-full h-full bg-yellow-50 relative">
                    <div className="absolute top-0 left-0 w-12 h-12 bg-amber-300 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 bg-purple-300 rounded-full translate-x-1/3 translate-y-1/3 opacity-60"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <div className="text-[10px] font-bold">Creative</div>
                    </div>
                  </div>
                )}
                
                {template.id === 'data-focus' && (
                  <div className="w-full h-full flex flex-col p-2 bg-teal-50">
                    <div className="text-[8px] font-bold mb-1 text-teal-600">DATA ANALYSIS</div>
                    <div className="flex-1 flex flex-col justify-around">
                      <div className="h-2 w-full bg-teal-100 mb-1 relative">
                        <div className="absolute top-0 left-0 h-full w-3/4 bg-teal-500"></div>
                      </div>
                      <div className="h-2 w-full bg-teal-100 mb-1 relative">
                        <div className="absolute top-0 left-0 h-full w-1/2 bg-teal-500"></div>
                      </div>
                      <div className="h-2 w-full bg-teal-100 relative">
                        <div className="absolute top-0 left-0 h-full w-1/4 bg-teal-500"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {template.id === 'narrative-arc' && (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                    <div className="w-3/4 h-3/4 relative">
                      <div className="absolute h-1/2 border-l-2 border-t-2 border-indigo-400 w-1/2 left-0 top-0"></div>
                      <div className="absolute h-1/2 border-r-2 border-b-2 border-indigo-400 w-1/2 right-0 bottom-0"></div>
                      <div className="absolute h-1 w-1 rounded-full bg-indigo-600 -left-0.5 -top-0.5"></div>
                      <div className="absolute h-1 w-1 rounded-full bg-indigo-600 -right-0.5 -bottom-0.5"></div>
                      <div className="absolute text-[8px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-700 font-medium">
                        STORY
                      </div>
                    </div>
                  </div>
                )}
                
                {template.id === 'tech-startup' && (
                  <div className="w-full h-full flex flex-col p-2 bg-cyan-50">
                    <div className="text-[10px] font-bold text-cyan-700 mb-1">&lt;/&gt;</div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="space-y-1 w-full">
                        <div className="h-1 bg-cyan-200 w-4/5"></div>
                        <div className="h-1 bg-cyan-400 w-3/5"></div>
                        <div className="h-1 bg-cyan-600 w-2/5"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {template.id === 'elegant-gradient' && (
                  <div
                    className="w-full h-full flex flex-col p-2"
                    style={{ background: 'linear-gradient(135deg, #f8f9fa, #dee2e6)' }}
                  >
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                         style={{ background: 'linear-gradient(45deg, #868e96, #adb5bd)' }}>
                        <div className="w-6 h-6 rounded-full bg-white"></div>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="h-0.5 w-full bg-gray-300"></div>
                      <div className="h-0.5 w-3/4 mx-auto bg-gray-400"></div>
                    </div>
                  </div>
                )}
                
                {template.id === 'bold-contrast' && (
                  <div className="w-full h-full bg-gray-900 p-2 text-white">
                    <div className="h-full flex flex-col justify-between">
                      <div className="text-[10px] font-bold">BOLD</div>
                      <div className="w-full h-px bg-white"></div>
                      <div className="text-right text-[10px] font-bold">IMPACT</div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Template info */}
              <div className="p-2">
                <h5 className="font-medium text-sm">{template.name}</h5>
                <p className="text-xs text-gray-500">{template.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Selected Template Info - matching design */}
      {selectedTemplate && (
        <div className="mt-2">
          <div className="flex items-center text-sm font-medium mb-1">
            <CheckCircle size={14} className="mr-1.5 text-primary" />
            Selected Template: {selectedTemplate.name}
          </div>
          
          <p className="text-xs text-gray-600 mb-1">
            {selectedTemplate.description}
          </p>
          
          <p className="text-xs text-gray-500">
            This template will be applied to your pitch deck structure with your brand colors and styling preferences.
          </p>
        </div>
      )}
    </Card>
  );
};

export default TemplateGallery;

/*
Note: This simpler implementation matches the design in the screenshot.
The commented version below has more advanced features we can implement in the future:

- Advanced filtering by category, style, etc.
- Grid/List view toggling
- More detailed template information
- Better visual previews with brand color application
- Tag filtering

These features can be uncommented and implemented later as the product evolves.
*/