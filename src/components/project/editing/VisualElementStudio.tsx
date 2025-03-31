import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BarChart3, Table, Image as ImageIcon, Share2, Database, Palette, XCircle, Plus, Clock, TrendingUp } from 'lucide-react';
import TimelineDiagram from './visualizations/TimelineDiagram';
import StackedAreaChart from './visualizations/StackedAreaChart';

interface ChartData {
  type: string;
  title: string;
  data: string[];
  elements: string[];
  layout: string;
  colorUsage: { primary: string; secondary: string; accent: string };
}

const VisualElementStudio: React.FC<{
  brandColors?: { primary: string; secondary: string; accent: string }
}> = ({
  brandColors = { primary: '#ae5630', secondary: '#232321', accent: '#9d4e2c' }
}) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [chartPreview, setChartPreview] = useState<ChartData | null>(null);
  const [showTimeline, setShowTimeline] = useState<boolean>(false);
  const [showMarketGrowth, setShowMarketGrowth] = useState<boolean>(false);
  
  const handleAddElement = (type: string) => {
    setSelectedTool(type);
    setChartPreview(null);
    setShowTimeline(false);
    setShowMarketGrowth(false);
    
    if (type === 'timeline') {
      setShowTimeline(true);
    }
    else if (type === 'marketgrowth') {
      setShowMarketGrowth(true);
    }
    else if (type === 'chart') {
      // Create a sample chart preview for AI in Education Market Growth
      setChartPreview({
        type: 'chart',
        title: 'AI in Education Market Growth Trajectory (2024-2033)',
        data: [
          'Year,Market Size',
          '2024,12.0',
          '2025,17.3',
          '2026,24.3',
          '2027,31.4',
          '2028,40.4',
          '2029,51.7',
          '2030,61.8',
          '2031,67.1',
          '2032,70.2',
          '2033,73.3'
        ],
        elements: [
          'Stacked area chart showing growth of overall market and personalized learning segment',
          'Y-axis showing market size in billions of dollars',
          'X-axis showing years (2024-2033)',
          'Clear annotation of the 35.18% CAGR',
          'Highlight of the $73.3B projection for 2033'
        ],
        layout: 'Clean, professional design with minimal grid lines',
        colorUsage: brandColors
      });
    } else {
      setChartPreview(null);
    }
  };
  
  const closePreview = () => {
    setSelectedTool(null);
    setChartPreview(null);
  };
  
  // Render chart preview or tool buttons based on state
  return (
    <Card className="p-3 border border-neutral-light bg-white/30 shadow-sm">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Visual Element Studio</h4>
      
      {!selectedTool ? (
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
            >
              <TrendingUp size={14} className="mr-1.5"/> Market Growth
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start p-1.5 hover:bg-neutral-light/20"
              onClick={() => handleAddElement('chart')}
            >
              <BarChart3 size={14} className="mr-1.5"/> Chart Wizard
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start p-1.5 hover:bg-neutral-light/20"
              onClick={() => handleAddElement('table')}
            >
              <Table size={14} className="mr-1.5"/> Table Generator
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start p-1.5 hover:bg-neutral-light/20"
              onClick={() => handleAddElement('timeline')}
            >
              <Clock size={14} className="mr-1.5"/> Timeline Diagram
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start p-1.5 hover:bg-neutral-light/20"
              onClick={() => handleAddElement('diagram')}
            >
              <Share2 size={14} className="mr-1.5"/> Diagram Builder
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start p-1.5 hover:bg-neutral-light/20"
              onClick={() => handleAddElement('image')}
            >
              <ImageIcon size={14} className="mr-1.5"/> Image Handling
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start p-1.5 hover:bg-neutral-light/20"
              onClick={() => handleAddElement('data')}
            >
              <Database size={14} className="mr-1.5"/> Data Integration
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start p-1.5 hover:bg-neutral-light/20"
              onClick={() => handleAddElement('consistency')}
            >
              <Palette size={14} className="mr-1.5"/> Consistency
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Chart Preview */}
          {chartPreview && (
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-sm">{chartPreview.title}</h5>
                <Button variant="ghost" size="sm" onClick={closePreview} className="h-6 w-6 p-0">
                  <XCircle size={16} />
                </Button>
              </div>
              
              <div className="chart-preview border border-neutral-light rounded-md p-3 mb-3 bg-white">
                <div className="w-full h-40 bg-gray-50 flex items-center justify-center border border-dashed border-gray-300 rounded"
                    style={{ borderColor: `${brandColors.primary}40` }}>
                  <div className="text-center p-4">
                    <BarChart3
                      className="mx-auto mb-2"
                      size={32}
                      style={{ color: brandColors.primary }}
                    />
                    <p className="text-xs font-medium" style={{ color: brandColors.secondary }}>
                      AI in Education Market Growth Trajectory
                    </p>
                    <p className="text-xs text-gray-500 mt-1">2024-2033</p>
                    <p className="text-xs font-medium mt-2" style={{ color: brandColors.primary }}>
                      $73.3B by 2033 (35.18% CAGR)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="specs text-xs mt-4">
                <div className="mb-2">
                  <p className="font-medium text-gray-700">Data Points:</p>
                  <div className="bg-gray-50 p-2 rounded max-h-20 overflow-y-auto">
                    <code className="text-xs whitespace-pre-wrap">
                      {chartPreview.data.slice(0, 3).join('\n')}
                      {chartPreview.data.length > 3 && '...'}
                    </code>
                  </div>
                </div>
                
                <div className="mt-2">
                  <p className="font-medium text-gray-700">Elements:</p>
                  <ul className="list-disc list-inside text-gray-600 text-xs ml-1">
                    {chartPreview.elements.slice(0, 2).map((element, i) => (
                      <li key={i} className="truncate">{element}</li>
                    ))}
                    {chartPreview.elements.length > 2 && <li className="text-gray-500">...and more</li>}
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" size="sm" onClick={closePreview} className="text-xs">Cancel</Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs text-white"
                  style={{ backgroundColor: brandColors.primary }}
                >
                  <Plus size={14} className="mr-1" /> Insert Chart
                </Button>
              </div>
            </div>
          )}
          
          {/* Timeline Diagram */}
          {showTimeline && (
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-sm">InstaSmart Strategic Evolution Roadmap</h5>
                <Button variant="ghost" size="sm" onClick={closePreview} className="h-6 w-6 p-0">
                  <XCircle size={16} />
                </Button>
              </div>
              
              {/* Actual Timeline Diagram */}
              <TimelineDiagram
                title="InstaSmart Strategic Evolution Roadmap"
                startYear="2022"
                endYear="2026"
                brandColors={brandColors}
                events={[
                  { year: "2022", quarter: "1", title: "Initial R&D phase completed", isCurrentPhase: false },
                  { year: "2022", quarter: "3", title: "Secured $3.2M funding", isCurrentPhase: false },
                  { year: "2023", quarter: "1", title: "Beta platform launch", isCurrentPhase: false },
                  { year: "2023", quarter: "3", title: "Analytics dashboard release", isCurrentPhase: false },
                  { year: "2024", quarter: "1", title: "Commercial launch", isCurrentPhase: true },
                  { year: "2024", quarter: "3", title: "Implementation of NLP capabilities", isCurrentPhase: false },
                  { year: "2025", quarter: "1", title: "Enterprise solution launch", isCurrentPhase: false },
                  { year: "2025", quarter: "3", title: "International expansion", isCurrentPhase: false },
                  { year: "2026", quarter: "1", title: "Integration of generative AI/LLM technologies", isCurrentPhase: false }
                ]}
              />
              
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" size="sm" onClick={closePreview} className="text-xs">Cancel</Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs text-white"
                  style={{ backgroundColor: brandColors.primary }}
                >
                  <Plus size={14} className="mr-1" /> Insert Timeline
                </Button>
              </div>
            </div>
          )}
          
          {/* Market Growth Chart */}
          {showMarketGrowth && (
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-sm">AI in Education Market Growth Trajectory (2024-2033)</h5>
                <Button variant="ghost" size="sm" onClick={closePreview} className="h-6 w-6 p-0">
                  <XCircle size={16} />
                </Button>
              </div>
              
              {/* Actual Market Growth Chart */}
              <StackedAreaChart
                title="AI in Education Market Growth"
                xAxisLabel="Year"
                yAxisLabel="Market Size ($ Billions)"
                cagr="35.18%"
                brandColors={brandColors}
                data={[
                  { year: "2024", total: 12.0, segment1: 5.4 },
                  { year: "2025", total: 17.3, segment1: 7.7 },
                  { year: "2026", total: 24.3, segment1: 12.1 },
                  { year: "2027", total: 31.4, segment1: 15.5 },
                  { year: "2028", total: 40.4, segment1: 21.2 },
                  { year: "2029", total: 51.7, segment1: 28.0 },
                  { year: "2030", total: 61.8, segment1: 34.9 },
                  { year: "2031", total: 67.1, segment1: 41.0 },
                  { year: "2032", total: 70.2, segment1: 45.6 },
                  { year: "2033", total: 73.3, segment1: 47.8 }
                ]}
              />
              
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" size="sm" onClick={closePreview} className="text-xs">Cancel</Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs text-white"
                  style={{ backgroundColor: brandColors.primary }}
                >
                  <Plus size={14} className="mr-1" /> Insert Market Chart
                </Button>
              </div>
            </div>
          )}
          
          {/* Other tool interfaces */}
          {selectedTool && !chartPreview && !showTimeline && !showMarketGrowth && (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">This feature is not implemented in the current version.</p>
              <Button variant="outline" size="sm" onClick={closePreview}>Back to Tools</Button>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default VisualElementStudio;