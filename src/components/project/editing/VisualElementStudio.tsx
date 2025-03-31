import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BarChart3, Table, Image as ImageIcon, Share2, Database, Palette, XCircle, Plus, Clock, TrendingUp, Loader } from 'lucide-react';
import TimelineDiagram from './visualizations/TimelineDiagram';
import StackedAreaChart from './visualizations/StackedAreaChart';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';

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
  const [chartPreview, setChartPreview] = useState<ChartData | null>(null);
  const [tablePreview, setTablePreview] = useState<TableData | null>(null);
  const [diagramPreview, setDiagramPreview] = useState<DiagramData | null>(null);
  const [showTimeline, setShowTimeline] = useState<boolean>(false);
  const [showMarketGrowth, setShowMarketGrowth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
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
    setChartPreview(null);
    setTablePreview(null);
    setDiagramPreview(null);
    setShowTimeline(false);
    setShowMarketGrowth(false);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
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
      }
      else if (type === 'table') {
        setTablePreview({
          type: 'table',
          title: 'Competitive Analysis Matrix',
          headers: ['Feature', 'Our Solution', 'Competitor A', 'Competitor B', 'Competitor C'],
          rows: [
            ['AI Integration', 'Advanced', 'Basic', 'Intermediate', 'None'],
            ['User Experience', 'Excellent', 'Good', 'Fair', 'Good'],
            ['Pricing', '$49/mo', '$79/mo', '$39/mo', '$99/mo'],
            ['Market Share', '15%', '35%', '10%', '25%'],
            ['Customer Support', '24/7', 'Business hours', 'Email only', '24/7']
          ],
          notes: 'Based on market research conducted in Q1 2025'
        });
      }
      else if (type === 'diagram') {
        setDiagramPreview({
          type: 'diagram',
          title: 'System Architecture',
          elements: [
            'User Interface',
            'API Gateway',
            'Authentication Service',
            'Core Processing Engine',
            'Database',
            'Analytics Engine'
          ],
          connections: [
            { from: 'User Interface', to: 'API Gateway' },
            { from: 'API Gateway', to: 'Authentication Service' },
            { from: 'API Gateway', to: 'Core Processing Engine' },
            { from: 'Core Processing Engine', to: 'Database' },
            { from: 'Core Processing Engine', to: 'Analytics Engine' }
          ],
          style: 'Modern, clean with directional arrows'
        });
      }
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      dispatch(addToast({
        type: 'error',
        message: `Failed to generate ${type} visualization.`
      }));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInsertElement = (type: string) => {
    // Generate chart/visual element HTML or markdown
    let visualElementCode = '';
    
    if (type === 'Market Chart') {
      // Generate markdown for the market growth chart instead of HTML
      visualElementCode = `
### AI in Education Market Growth Trajectory (2024-2033)

![Market Growth Chart](chart-placeholder.png)

**CAGR: 35.18% through 2033**

*Total Market | AI-Powered Learning Solutions*
`;
    } else if (type === 'Timeline') {
      // Generate timeline in markdown format
      visualElementCode = `
### Project Timeline

- **2022 Q1**: Initial R&D phase completed
- **2022 Q3**: Secured $3.2M funding
- **2023 Q1**: Beta platform launch
- **2023 Q3**: Analytics dashboard release
- **2024 Q1**: Commercial launch (Current Phase)
- **2024 Q3**: Implementation of NLP capabilities
- **2025 Q1**: Enterprise solution launch
- **2025 Q3**: International expansion
- **2026 Q1**: Integration of generative AI/LLM technologies
`;
    } else if (type === 'Table') {
      // Generate table in markdown format
      if (tablePreview) {
        visualElementCode = `
### ${tablePreview.title}

| ${tablePreview.headers.join(' | ')} |
| ${tablePreview.headers.map(() => '---').join(' | ')} |
${tablePreview.rows.map(row => `| ${row.join(' | ')} |`).join('\n')}

${tablePreview.notes ? `*Note: ${tablePreview.notes}*` : ''}
`;
      } else {
        visualElementCode = `
### Competitive Analysis Matrix

| Feature | Our Solution | Competitor A | Competitor B | Competitor C |
| --- | --- | --- | --- | --- |
| AI Integration | Advanced | Basic | Intermediate | None |
| User Experience | Excellent | Good | Fair | Good |
| Pricing | $49/mo | $79/mo | $39/mo | $99/mo |
| Market Share | 15% | 35% | 10% | 25% |
| Customer Support | 24/7 | Business hours | Email only | 24/7 |

*Based on market research conducted in Q1 2025*
`;
      }
    } else if (type === 'Diagram') {
      // Generate diagram in markdown format
      visualElementCode = `
### ${diagramPreview?.title || 'System Architecture'}

*Diagram showing the following components:*
${diagramPreview?.elements.map(element => `- ${element}`).join('\n') || `
- User Interface
- API Gateway
- Authentication Service
- Core Processing Engine
- Database
- Analytics Engine`}

*With connections between components*
`;
    }
    
    // Insert the visual element code into the editor content
    if (visualElementCode && setEditorContent) {
      // Insert at cursor position or append to the end
      // Append the visual element to the existing content
      setEditorContent(editorContent + visualElementCode);
      
      dispatch(addToast({
        type: 'success',
        message: `${type} element inserted successfully.`
      }));
    } else {
      dispatch(addToast({
        type: 'error',
        message: `Failed to insert ${type} element. Please try again.`
      }));
    }
    
    closePreview();
  };
  
  const closePreview = () => {
    setSelectedTool(null);
    setChartPreview(null);
    setTablePreview(null);
    setDiagramPreview(null);
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
            <p className="text-sm text-neutral-dark">Generating {selectedTool}...</p>
          </div>
        </div>
      )}
      
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
                  onClick={() => handleInsertElement('Chart')}
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
                  onClick={() => handleInsertElement('Timeline')}
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
                  onClick={() => handleInsertElement('Market Chart')}
                >
                  <Plus size={14} className="mr-1" /> Insert Market Chart
                </Button>
              </div>
            </div>
          )}
          
          {/* Table Preview */}
          {tablePreview && (
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-sm">{tablePreview.title}</h5>
                <Button variant="ghost" size="sm" onClick={closePreview} className="h-6 w-6 p-0">
                  <XCircle size={16} />
                </Button>
              </div>
              
              <div className="table-preview border border-neutral-light rounded-md p-3 mb-3 bg-white overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: `${brandColors.primary}15` }}>
                      {tablePreview.headers.map((header, i) => (
                        <th
                          key={i}
                          className="border border-neutral-light p-2 font-medium text-left"
                          style={{ color: brandColors.secondary }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tablePreview.rows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : `bg-neutral-light/10`}>
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className="border border-neutral-light p-2"
                            style={{
                              fontWeight: j === 0 ? 500 : 400,
                              color: j === 0 ? brandColors.primary : 'inherit'
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {tablePreview.notes && (
                  <div className="text-xs text-neutral-medium mt-2 italic">
                    Note: {tablePreview.notes}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" size="sm" onClick={closePreview} className="text-xs">Cancel</Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs text-white"
                  style={{ backgroundColor: brandColors.primary }}
                  onClick={() => handleInsertElement('Table')}
                >
                  <Plus size={14} className="mr-1" /> Insert Table
                </Button>
              </div>
            </div>
          )}
          
          {/* Diagram Preview */}
          {diagramPreview && (
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-sm">{diagramPreview.title}</h5>
                <Button variant="ghost" size="sm" onClick={closePreview} className="h-6 w-6 p-0">
                  <XCircle size={16} />
                </Button>
              </div>
              
              <div className="diagram-preview border border-neutral-light rounded-md p-3 mb-3 bg-white">
                <div className="w-full h-60 bg-gray-50 flex items-center justify-center border border-dashed border-gray-300 rounded p-4"
                    style={{ borderColor: `${brandColors.primary}40` }}>
                  <div className="w-full h-full relative">
                    {/* Simple diagram visualization */}
                    {diagramPreview.elements.map((element, i) => {
                      const x = 50 + (i % 3) * 120;
                      const y = 30 + Math.floor(i / 3) * 80;
                      return (
                        <div
                          key={i}
                          className="absolute px-3 py-2 rounded-md text-xs font-medium text-center"
                          style={{
                            left: `${x}px`,
                            top: `${y}px`,
                            backgroundColor: `${brandColors.primary}20`,
                            borderColor: brandColors.primary,
                            color: brandColors.secondary,
                            border: `1px solid ${brandColors.primary}40`,
                            minWidth: '100px',
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          {element}
                        </div>
                      );
                    })}
                    {/* Simple connection lines */}
                    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                      {diagramPreview.connections.map((conn, i) => {
                        const fromIndex = diagramPreview.elements.indexOf(conn.from);
                        const toIndex = diagramPreview.elements.indexOf(conn.to);
                        if (fromIndex === -1 || toIndex === -1) return null;
                        
                        const fromX = 50 + (fromIndex % 3) * 120;
                        const fromY = 30 + Math.floor(fromIndex / 3) * 80;
                        const toX = 50 + (toIndex % 3) * 120;
                        const toY = 30 + Math.floor(toIndex / 3) * 80;
                        
                        return (
                          <g key={i}>
                            <line
                              x1={fromX}
                              y1={fromY}
                              x2={toX}
                              y2={toY}
                              stroke={brandColors.secondary}
                              strokeWidth="1"
                              strokeDasharray="4,2"
                            />
                            {/* Arrow head */}
                            <circle cx={toX} cy={toY} r="3" fill={brandColors.secondary} />
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="specs text-xs mt-4">
                <div className="mt-2">
                  <p className="font-medium text-gray-700">Elements:</p>
                  <ul className="list-disc list-inside text-gray-600 text-xs ml-1">
                    {diagramPreview.elements.slice(0, 3).map((element, i) => (
                      <li key={i} className="truncate">{element}</li>
                    ))}
                    {diagramPreview.elements.length > 3 && <li className="text-gray-500">...and more</li>}
                  </ul>
                </div>
                <div className="mt-2">
                  <p className="font-medium text-gray-700">Style:</p>
                  <p className="text-gray-600 text-xs ml-1">{diagramPreview.style}</p>
                </div>
              </div>
              
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" size="sm" onClick={closePreview} className="text-xs">Cancel</Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs text-white"
                  style={{ backgroundColor: brandColors.primary }}
                  onClick={() => handleInsertElement('Diagram')}
                >
                  <Plus size={14} className="mr-1" /> Insert Diagram
                </Button>
              </div>
            </div>
          )}
          
          {/* Other tool interfaces */}
          {selectedTool && !chartPreview && !tablePreview && !diagramPreview && !showTimeline && !showMarketGrowth && (
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