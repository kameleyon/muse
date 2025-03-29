import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BarChart3, Table, Image as ImageIcon, Share2, Database, Palette } from 'lucide-react'; // Icons

const VisualElementStudio: React.FC = () => {
   // Placeholder handlers
  const handleAddElement = (type: string) => console.log(`Add Element: ${type}`);

  return (
    <Card className="p-2 border border-neutral-light bg-white/30 shadow-sm">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Visual Element Studio</h4>
      <p className="text-xs text-neutral-medium mb-3">
        Create charts, tables, diagrams, or manage images.
      </p>
      <div className="grid grid-cols-2 gap-1">
         <Button variant="outline" size="sm" className="text-xs justify-start border-0 p-0" onClick={() => handleAddElement('chart')}>
            <BarChart3 size={14} className="mr-1"/> Chart Wizard
         </Button>
         <Button variant="outline" size="sm" className="text-xs justify-start border-0 p-0" onClick={() => handleAddElement('table')}>
            <Table size={14} className="mr-1"/> Table Generator
         </Button>
         <Button variant="outline" size="sm" className="text-xs justify-start border-0 p-0" onClick={() => handleAddElement('diagram')}>
            <Share2 size={14} className="mr-1"/> Diagram Builder
         </Button>
         <Button variant="outline" size="sm" className="text-xs justify-start border-0 p-0" onClick={() => handleAddElement('image')}>
            <ImageIcon size={14} className="mr-1"/> Image Handling
         </Button>
          <Button variant="outline" size="sm" className="text-xs justify-start border-0 p-0" onClick={() => handleAddElement('data')}>
            <Database size={14} className="mr-1"/> Data Integration
         </Button>
          <Button variant="outline" size="sm" className="text-xs justify-start border-0 p-0" onClick={() => handleAddElement('consistency')}>
            <Palette size={14} className="mr-1"/> Consistency
         </Button>
      </div>
    </Card>
  );
};

export default VisualElementStudio;