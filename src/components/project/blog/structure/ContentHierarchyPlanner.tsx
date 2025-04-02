import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

interface Heading {
  id: string;
  level: number;
  title: string;
  parentId: string | null;
}

interface ContentHierarchyPlannerProps {
  headingStructure: Heading[] | null;
  onHeadingStructureChange: (headings: Heading[]) => void;
}

const ContentHierarchyPlanner: React.FC<ContentHierarchyPlannerProps> = ({
  headingStructure,
  onHeadingStructureChange
}) => {
  const [newHeadingTitle, setNewHeadingTitle] = useState('');
  const [newHeadingLevel, setNewHeadingLevel] = useState('2');
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  
  // Initialize headings
  const headings = headingStructure || [
    { id: 'h-1', level: 1, title: 'Introduction', parentId: null },
    { id: 'h-2', level: 2, title: 'Main Section 1', parentId: null },
    { id: 'h-3', level: 2, title: 'Main Section 2', parentId: null },
    { id: 'h-4', level: 2, title: 'Main Section 3', parentId: null },
    { id: 'h-5', level: 1, title: 'Conclusion', parentId: null }
  ];
  
  const handleAddHeading = () => {
    if (!newHeadingTitle.trim()) return;
    
    const newHeading: Heading = {
      id: `h-${Date.now()}`,
      level: parseInt(newHeadingLevel),
      title: newHeadingTitle,
      parentId: null
    };
    
    onHeadingStructureChange([...headings, newHeading]);
    setNewHeadingTitle('');
  };
  
  const handleRemoveHeading = (id: string) => {
    onHeadingStructureChange(headings.filter(h => h.id !== id));
  };
  
  const handleMoveHeading = (id: string, direction: 'up' | 'down') => {
    const index = headings.findIndex(h => h.id === id);
    if (index < 0) return;
    
    if (direction === 'up' && index > 0) {
      const newHeadings = [...headings];
      [newHeadings[index - 1], newHeadings[index]] = [newHeadings[index], newHeadings[index - 1]];
      onHeadingStructureChange(newHeadings);
    } else if (direction === 'down' && index < headings.length - 1) {
      const newHeadings = [...headings];
      [newHeadings[index], newHeadings[index + 1]] = [newHeadings[index + 1], newHeadings[index]];
      onHeadingStructureChange(newHeadings);
    }
  };
  
  const handleEditHeading = (id: string) => {
    const heading = headings.find(h => h.id === id);
    if (!heading) return;
    
    setEditMode(id);
    setEditTitle(heading.title);
  };
  
  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    
    const newHeadings = headings.map(h => 
      h.id === id ? { ...h, title: editTitle } : h
    );
    
    onHeadingStructureChange(newHeadings);
    setEditMode(null);
    setEditTitle('');
  };
  
  const handleChangeLevel = (id: string, newLevel: string) => {
    const level = parseInt(newLevel);
    
    const newHeadings = headings.map(h => 
      h.id === id ? { ...h, level } : h
    );
    
    onHeadingStructureChange(newHeadings);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold font-heading text-secondary mb-4">Content Hierarchy Planning</h3>
      <p className="text-sm text-neutral-muted mb-6">
        Plan your blog post structure by organizing headings and subheadings.
      </p>
      
      <div className="space-y-6">
        <div className="space-y-1">
          <Label className="text-sm font-medium text-neutral-dark">Heading Structure</Label>
          <p className="text-xs text-neutral-muted mb-3">
            Drag and drop to reorder. Use H1 for main title, H2 for sections, H3 for subsections.
          </p>
          
          <div className="space-y-2 mb-6">
            {headings.map((heading, index) => (
              <div 
                key={heading.id}
                className="flex items-center gap-2 p-3 bg-neutral-light/10 rounded-md border border-neutral-light"
              >
                <div 
                  className="w-8 flex-shrink-0"
                  style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                >
                  <span className="inline-block p-1 rounded bg-primary/20 text-primary text-xs font-mono">
                    H{heading.level}
                  </span>
                </div>
                
                {editMode === heading.id ? (
                  <div className="flex-grow flex gap-2">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-grow"
                    />
                    <Button size="sm" onClick={() => handleSaveEdit(heading.id)}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditMode(null)}>Cancel</Button>
                  </div>
                ) : (
                  <>
                    <span className="flex-grow">{heading.title}</span>
                    
                    <Select
                      value={heading.level.toString()}
                      onValueChange={(value) => handleChangeLevel(heading.id, value)}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">H1</SelectItem>
                        <SelectItem value="2">H2</SelectItem>
                        <SelectItem value="3">H3</SelectItem>
                        <SelectItem value="4">H4</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleEditHeading(heading.id)}
                      className="p-1 h-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleRemoveHeading(heading.id)}
                      className="p-1 h-auto text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                    
                    <div className="flex flex-col">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleMoveHeading(heading.id, 'up')}
                        disabled={index === 0}
                        className="p-0.5 h-4 text-neutral-dark"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleMoveHeading(heading.id, 'down')}
                        disabled={index === headings.length - 1}
                        className="p-0.5 h-4 text-neutral-dark"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t border-neutral-light">
          <h4 className="text-sm font-medium text-neutral-dark mb-2">Add New Heading</h4>
          <div className="flex gap-2">
            <Select
              value={newHeadingLevel}
              onValueChange={setNewHeadingLevel}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">H1</SelectItem>
                <SelectItem value="2">H2</SelectItem>
                <SelectItem value="3">H3</SelectItem>
                <SelectItem value="4">H4</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              value={newHeadingTitle}
              onChange={(e) => setNewHeadingTitle(e.target.value)}
              placeholder="Enter heading title"
              className="flex-grow"
            />
            
            <Button 
              onClick={handleAddHeading}
              disabled={!newHeadingTitle.trim()}
            >
              Add
            </Button>
          </div>
        </div>
        
        <div className="pt-4 border-t border-neutral-light">
          <h4 className="text-sm font-medium text-neutral-dark mb-2">Preview</h4>
          <div className="p-4 bg-white rounded-md border border-neutral-light">
            {headings.map((heading) => (
              <div 
                key={heading.id}
                className="mb-2"
                style={{
                  marginLeft: `${(heading.level - 1) * 20}px`,
                  fontSize: `${1.4 - (heading.level - 1) * 0.1}rem`,
                  fontWeight: 600 - (heading.level - 1) * 100,
                }}
              >
                {heading.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContentHierarchyPlanner;
