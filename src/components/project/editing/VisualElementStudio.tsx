import React, { useState, useRef } from 'react'; // Import useRef
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import html2canvas from 'html2canvas'; // Import html2canvas
import { BarChart3, Table, Image as ImageIcon, Share2, Database, Palette, XCircle, Plus, Clock, TrendingUp, Loader } from 'lucide-react';
import TimelineDiagram from './visualizations/TimelineDiagram';
import StackedAreaChart from './visualizations/StackedAreaChart';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';

// Interfaces remain for potential future use with real data
interface ChartData {
  type: string;
  title: string;
  data: string[];
  elements: string[];
  layout: string;
  colorUsage: { primary: string; secondary: string; accent: string };
}

interface TableData {
  type: string;
  title: string;
  headers: string[];
  rows: string[][];
  notes?: string;
}

interface DiagramData {
  type: string;
  title: string;
  elements: string[];
  connections: { from: string; to: string; label?: string }[];
  style: string;
}

const VisualElementStudio: React.FC<{
  brandColors?: { primary: string; secondary: string; accent: string }
}> = ({
  brandColors = { primary: '#ae5630', secondary: '#232321', accent: '#9d4e2c' }
}) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  // Remove state for mock previews
  // const [chartPreview, setChartPreview] = useState<ChartData | null>(null);
  // const [tablePreview, setTablePreview] = useState<TableData | null>(null);
  // const [diagramPreview, setDiagramPreview] = useState<DiagramData | null>(null);
  const [showTimeline, setShowTimeline] = useState<boolean>(false); // Keep for showing component structure
  const [showMarketGrowth, setShowMarketGrowth] = useState<boolean>(false); // Keep for showing component structure
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Refs might be used later for capturing dynamically generated previews
  const timelineRef = useRef<HTMLDivElement>(null);
  const marketGrowthRef = useRef<HTMLDivElement>(null);
  const diagramPreviewRef = useRef<HTMLDivElement>(null);
  const chartPreviewRef = useRef<HTMLDivElement>(null);

  // Get project ID and editor content from store at component level
  const { projectId, editorContent, setEditorContent } = useProjectWorkflowStore();
  const dispatch = useDispatch();

  const handleAddElement = async (type: string) => {
    if (!projectId) {
      dispatch(addToast({
        type: 'error',
        message: "Cannot create visual elements without a valid project ID."
      }));
      return;
    }

    setIsLoading(true);
    setSelectedTool(type);
    // Clear any previous component structure visibility states
    setShowTimeline(false);
    setShowMarketGrowth(false);

    try {
      // Simulate API call delay or initial setup time
      await new Promise(resolve => setTimeout(resolve, 100));

      // Simply set the selected tool type. Do not generate mock preview data here.
      // The UI will show the appropriate interface based on the selectedTool state.
      // Specific components like TimelineDiagram or StackedAreaChart might still render
      // if their corresponding state (e.g., showTimeline) is set, but without mock data injection here.

      // Example: If specific components need to be shown immediately upon tool selection
      if (type === 'timeline') {
         setShowTimeline(true); // Show the timeline component structure
      } else if (type === 'marketgrowth') {
         setShowMarketGrowth(true); // Show the market growth component structure
      }
      // No explicit setting of chartPreview, tablePreview, or diagramPreview with mock data.

    } catch (error) {
      console.error(`Error selecting tool ${type}:`, error);
      dispatch(addToast({
        type: 'error',
        message: `Failed to load tool for ${type}.`
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertElement = async (type: string) => {
    let visualElementHtml = ''; // Use HTML for insertion
    setIsLoading(true); // Show loading indicator

    try {
      // Generate generic placeholder HTML based on type
      if (type === 'Market Chart') {
        visualElementHtml = `<p style="text-align: center; border: 1px dashed #ccc; padding: 1rem; margin: 1rem 0;">[Placeholder: Market Growth Chart]</p>`;
      } else if (type === 'Chart') {
        visualElementHtml = `<p style="text-align: center; border: 1px dashed #ccc; padding: 1rem; margin: 1rem 0;">[Placeholder: Chart]</p>`;
      } else if (type === 'Timeline') {
        visualElementHtml = `<p style="text-align: center; border: 1px dashed #ccc; padding: 1rem; margin: 1rem 0;">[Placeholder: Timeline Diagram]</p>`;
      } else if (type === 'Table') {
        // Generate generic HTML table structure
        visualElementHtml = `
          <h3 style="text-align: center; margin-bottom: 0.5rem;">[Placeholder Table Title]</h3>
          <table border="1" style="border-collapse: collapse; width: 90%; margin: 1rem auto; font-size: 0.9em;">
            <thead style="background-color: #eee;">
              <tr>
                <th style="border: 1px solid #ccc; padding: 6px 10px; text-align: left;">Header 1</th>
                <th style="border: 1px solid #ccc; padding: 6px 10px; text-align: left;">Header 2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #ccc; padding: 6px 10px;">Row 1, Cell 1</td>
                <td style="border: 1px solid #ccc; padding: 6px 10px;">Row 1, Cell 2</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ccc; padding: 6px 10px;">Row 2, Cell 1</td>
                <td style="border: 1px solid #ccc; padding: 6px 10px;">Row 2, Cell 2</td>
              </tr>
            </tbody>
          </table>
          <p style="text-align: center; font-size: 0.8em; margin-top: 0.5rem;"><em>[Placeholder Table Note]</em></p>
        `;
      } else if (type === 'Diagram') {
          visualElementHtml = `<p style="text-align: center; border: 1px dashed #ccc; padding: 1rem; margin: 1rem 0;">[Placeholder: Diagram]</p>`;
      } else {
        // Handle unimplemented or error cases
        visualElementHtml = `<p style="text-align: center; color: #888; margin: 1rem 0;">[Visual Element: ${type} - Not implemented]</p>`;
        console.warn(`Insertion for type "${type}" is not implemented.`);
      }

      // Append the visual element HTML to the existing content
      if (visualElementHtml && setEditorContent) {
        // Append with a newline for separation
        setEditorContent(editorContent + '\n' + visualElementHtml);

        dispatch(addToast({
          type: 'success',
          message: `${type} placeholder inserted successfully.`
        }));
      } else {
        throw new Error(`Failed to generate placeholder HTML for ${type}`);
      }
    } catch (error) {
        console.error(`Error inserting ${type}:`, error);
        dispatch(addToast({
          type: 'error',
          message: `Failed to insert ${type} element. Please try again.`
        }));
    } finally {
        setIsLoading(false);
        closePreview(); // Close the preview/tool selection pane
    }
  };


  const closePreview = () => {
    setSelectedTool(null);
    // No preview states to clear anymore
    setShowTimeline(false);
    setShowMarketGrowth(false);
  };

  // Render chart preview or tool buttons based on state
  return (
    <Card className="p-3 border border-neutral-light bg-white/30 shadow-sm relative">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Visual Element Studio</h4>

      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-neutral-dark">Processing...</p> {/* Generic loading */}
          </div>
        </div>
      )}

      {!selectedTool ? (
        // Tool Selection View
        <>
          <p className="text-xs text-neutral-medium mb-3">
            Create charts, tables, diagrams, or manage images.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start p-1.5 hover:bg-neutral-light/20"
              onClick={() => handleAddElement('marketgrowth')}
              disabled={isLoading}
            >
              <TrendingUp size={14} className="mr-1.5"/> Market Growth
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start p-1.5 hover:bg-neutral-light/20"
              onClick={() => handleAddElement('chart')}
              disabled={isLoading}
            >
              <BarChart3 size={14} className="mr-1.5"/> Chart Wizard
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start p-1.5 hover:bg-neutral-light/20"
              onClick={() => handleAddElement('table')}
              disabled={isLoading}
            >
              <Table size={14} className="mr-1.5"/> Table Generator
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start p-1.5 hover:bg-neutral-light/20"
              onClick={() => handleAddElement('timeline')}
              disabled={isLoading}
            >
              <Clock size={14} className="mr-1.5"/> Timeline Diagram
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start p-1.5 hover:bg-neutral-light/20"
              onClick={() => handleAddElement('diagram')}
              disabled={isLoading}
            >
              <Share2 size={14} className="mr-1.5"/> Diagram Builder
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start p-1.5 hover:bg-neutral-light/20"
              onClick={() => handleAddElement('image')}
              disabled={isLoading}
            >
              <ImageIcon size={14} className="mr-1.5"/> Image Handling
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start p-1.5 hover:bg-neutral-light/20"
              onClick={() => handleAddElement('data')}
              disabled={isLoading}
            >
              <Database size={14} className="mr-1.5"/> Data Integration
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start p-1.5 hover:bg-neutral-light/20"
              onClick={() => handleAddElement('consistency')}
              disabled={isLoading}
            >
              <Palette size={14} className="mr-1.5"/> Consistency
            </Button>
          </div>
        </>
      ) : (
        // Tool Interface/Preview View (Now without mock data)
        <>
          {/* Timeline Diagram Structure */}
          {showTimeline && (
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-sm">Timeline Diagram</h5>
                <Button variant="ghost" size="sm" onClick={closePreview} className="h-6 w-6 p-0">
                  <XCircle size={16} />
                </Button>
              </div>
              {/* Render the component structure, but it won't have data unless passed */}
              <div ref={timelineRef}>
                <TimelineDiagram
                  title="[Timeline Title]"
                  startYear="YYYY"
                  endYear="YYYY"
                  brandColors={brandColors}
                  events={[]} // Pass empty array or fetch real data
                />
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" size="sm" onClick={closePreview} className="text-xs">Cancel</Button>
                <Button
                  variant="primary" size="sm" className="text-xs text-white"
                  style={{ backgroundColor: brandColors.primary }}
                  onClick={() => handleInsertElement('Timeline')}
                >
                  <Plus size={14} className="mr-1" /> Insert Timeline Placeholder
                </Button>
              </div>
            </div>
          )}

          {/* Market Growth Chart Structure */}
          {showMarketGrowth && (
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-sm">Market Growth Chart</h5>
                 <Button variant="ghost" size="sm" onClick={closePreview} className="h-6 w-6 p-0">
                  <XCircle size={16} />
                </Button>
              </div>
               {/* Render the component structure, but it won't have data unless passed */}
              <div ref={marketGrowthRef}>
                <StackedAreaChart
                  title="[Chart Title]"
                  xAxisLabel="X-Axis"
                  yAxisLabel="Y-Axis"
                  cagr="N/A"
                  brandColors={brandColors}
                  data={[]} // Pass empty array or fetch real data
                />
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" size="sm" onClick={closePreview} className="text-xs">Cancel</Button>
                <Button
                  variant="primary" size="sm" className="text-xs text-white"
                  style={{ backgroundColor: brandColors.primary }}
                  onClick={() => handleInsertElement('Market Chart')}
                >
                  <Plus size={14} className="mr-1" /> Insert Market Chart Placeholder
                </Button>
              </div>
            </div>
          )}

          {/* Generic Chart Wizard Interface (Example) */}
          {selectedTool === 'chart' && !showMarketGrowth && ( // Ensure it doesn't overlap
             <div className="mb-2">
               <div className="flex justify-between items-center mb-2">
                 <h5 className="font-medium text-sm">Chart Wizard</h5>
                 <Button variant="ghost" size="sm" onClick={closePreview} className="h-6 w-6 p-0">
                   <XCircle size={16} />
                 </Button>
               </div>
               {/* Placeholder for Chart Wizard UI elements */}
               <div ref={chartPreviewRef} className="chart-preview border border-neutral-light rounded-md p-3 mb-3 bg-white min-h-[150px] flex items-center justify-center text-neutral-medium italic">
                 Chart configuration options would go here...
               </div>
               <div className="flex justify-end mt-4 gap-2">
                 <Button variant="outline" size="sm" onClick={closePreview} className="text-xs">Cancel</Button>
                 <Button
                   variant="primary" size="sm" className="text-xs text-white"
                   style={{ backgroundColor: brandColors.primary }}
                   onClick={() => handleInsertElement('Chart')}
                 >
                   <Plus size={14} className="mr-1" /> Insert Chart Placeholder
                 </Button>
               </div>
             </div>
           )}

          {/* Table Generator Interface (Example) */}
          {selectedTool === 'table' && (
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-sm">Table Generator</h5>
                <Button variant="ghost" size="sm" onClick={closePreview} className="h-6 w-6 p-0">
                  <XCircle size={16} />
                </Button>
              </div>
              {/* Placeholder for Table Generator UI elements */}
              <div className="table-preview border border-neutral-light rounded-md p-3 mb-3 bg-white min-h-[150px] flex items-center justify-center text-neutral-medium italic">
                Table configuration options would go here...
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" size="sm" onClick={closePreview} className="text-xs">Cancel</Button>
                <Button
                  variant="primary" size="sm" className="text-xs text-white"
                  style={{ backgroundColor: brandColors.primary }}
                  onClick={() => handleInsertElement('Table')}
                >
                  <Plus size={14} className="mr-1" /> Insert Table Placeholder
                </Button>
              </div>
            </div>
          )}

          {/* Diagram Builder Interface (Example) */}
          {selectedTool === 'diagram' && (
             <div className="mb-2">
               <div className="flex justify-between items-center mb-2">
                 <h5 className="font-medium text-sm">Diagram Builder</h5>
                 <Button variant="ghost" size="sm" onClick={closePreview} className="h-6 w-6 p-0">
                   <XCircle size={16} />
                 </Button>
               </div>
               {/* Placeholder for Diagram Builder UI elements */}
               <div ref={diagramPreviewRef} className="diagram-preview border border-neutral-light rounded-md p-3 mb-3 bg-white min-h-[150px] flex items-center justify-center text-neutral-medium italic">
                 Diagram configuration options would go here...
               </div>
               <div className="flex justify-end mt-4 gap-2">
                 <Button variant="outline" size="sm" onClick={closePreview} className="text-xs">Cancel</Button>
                 <Button
                   variant="primary" size="sm" className="text-xs text-white"
                   style={{ backgroundColor: brandColors.primary }}
                   onClick={() => handleInsertElement('Diagram')}
                 >
                   <Plus size={14} className="mr-1" /> Insert Diagram Placeholder
                 </Button>
               </div>
             </div>
           )}

          {/* Other tool interfaces (Unimplemented) */}
          {selectedTool && !['chart', 'table', 'diagram', 'timeline', 'marketgrowth'].includes(selectedTool) && (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">This feature ({selectedTool}) is not implemented in the current version.</p>
              <Button variant="outline" size="sm" onClick={closePreview}>Back to Tools</Button>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default VisualElementStudio;