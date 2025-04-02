import React from 'react';
import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  Treemap,
  Sankey,
  Area,
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LabelList
} from 'recharts';

// Define Props interface with enhanced chart types
interface ChartRendererProps {
  data: string | any[]; // Allow string (JSON) or already parsed array
  type?: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'radar' | 'radialBar' | 'composed' | 'treemap' | 'sankey';
  layout?: 'horizontal' | 'vertical';
  stacked?: boolean;
  colors?: { // Make colors prop optional with properties optional if object exists
    primary?: string;
    secondary?: string;
    accent?: string;
    // Add additional color options for richer visualizations
    highlight?: string;
    gradientStart?: string;
    gradientEnd?: string;
    background?: string;
  };
  fonts?: {
    headingFont?: string;
    bodyFont?: string;
  };
  options?: {
    animation?: boolean;
    aspectRatio?: number;
    showValues?: boolean;
    showGrid?: boolean;
    showLegend?: boolean;
    title?: string;
    subTitle?: string;
  };
}

/**
 * Attempts to fix common JSON formatting issues
 */
const repairJson = (jsonString: string): string => {
  return jsonString
    .replace(/'/g, '"') // Replace single quotes with double quotes
    .replace(/(\w+)(?=:)/g, '"$1"') // Add quotes to property names
    .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
    .replace(/\s*\n+\s*/g, ' ') // Normalize whitespace
    .trim();
};

/**
 * Enhanced ChartRenderer component that automatically detects and renders the appropriate
 * chart type based on the data structure with support for advanced visualization options.
 */
export const ChartRenderer: React.FC<ChartRendererProps> = ({ 
  data, 
  type, 
  layout = 'horizontal', 
  stacked = false, 
  colors = {}, 
  fonts = {
    bodyFont: 'inherit',
    headingFont: 'inherit'
  },
  options = {} 
}) => {
  // Set default colors using optional chaining and defaults
  const primaryColor = colors?.primary || '#8884d8';
  const secondaryColor = colors?.secondary || '#82ca9d';
  const accentColor = colors?.accent || '#ffc658';
  const highlightColor = colors?.highlight || '#ff7300';
  
  // Set default options
  const showGrid = options?.showGrid !== undefined ? options.showGrid : true;
  const showLegend = options?.showLegend !== undefined ? options.showLegend : true;
  const showValues = options?.showValues !== undefined ? options.showValues : false;
  const chartHeight = options?.aspectRatio ? 300 * options.aspectRatio : 300;

  try {
    // Parse the data if it's a string (from a code block)
    let chartData;
    if (typeof data === 'string') {
      try {
        // Clean up the string from possible code block formatting
        const cleanData = data.replace(/```chart\s+|```/g, '').trim();
        
        // First attempt - direct parse
        try {
          chartData = JSON.parse(cleanData);
        } catch (initialError) {
          console.log("Initial JSON parse failed, attempting repair...");
          
          // Second attempt - repair and parse
          const repairedJson = repairJson(cleanData);
          try {
            chartData = JSON.parse(repairedJson);
          } catch (repairError) {
            console.log("Repair attempt failed, trying alternative approaches...");
            
            // Third attempt - check for single object that needs array wrapping
            if (repairedJson.trim().startsWith('{')) {
              try {
                // Try wrapping in array brackets
                chartData = JSON.parse(`[${repairedJson}]`);
              } catch (wrapError) {
                // Fourth attempt - try parsing line by line
                if (cleanData.includes('\n')) {
                  const lines = cleanData.split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0);
                  
                  // Try to parse each line as a JSON object and combine
                  try {
                    const parsedLines = lines.map(line => {
                      // Replace single quotes and fix property names
                      const fixedLine = repairJson(line);
                      try {
                        return JSON.parse(fixedLine);
                      } catch (e) {
                        // Just return the line as is if parsing fails
                        return { name: line, value: line.length };
                      }
                    });
                    
                    chartData = parsedLines;
                  } catch (lineError) {
                    throw new Error("Failed to parse data after multiple attempts");
                  }
                } else {
                  throw wrapError;
                }
              }
            } else if (cleanData.includes(',')) {
              // Fifth attempt - try as CSV
              const lines = cleanData.split('\n');
              
              if (lines.length > 0) {
                const headers = lines[0].split(',').map(h => h.trim());
                
                chartData = lines.slice(1).map(line => {
                  const values = line.split(',').map(v => v.trim());
                  const row: Record<string, any> = {};
                  
                  headers.forEach((header, i) => {
                    // Try to convert numeric values
                    const value = values[i];
                    const numValue = parseFloat(value);
                    row[header] = isNaN(numValue) ? value : numValue;
                  });
                  
                  return row;
                });
              } else {
                throw new Error("CSV data has no headers");
              }
            } else {
              throw repairError;
            }
          }
        }
      } catch (error) {
        console.error("All JSON parsing attempts failed:", error);
        
        // Create fallback data as last resort
        chartData = [
          { name: "Parse Error", value: 100 },
          { name: "Example Data", value: 50 }
        ];
      }
    } else {
      chartData = data;
    }
    
    // Validate and fix the data
    if (!Array.isArray(chartData)) {
      // Convert to array if it's a single object
      chartData = [chartData];
    }
    
    if (chartData.length === 0 || !chartData[0]) {
      // Create default data if the array is empty or has invalid entries
      chartData = [
        { name: "No Data", value: 100 },
        { name: "Available", value: 0 }
      ];
    }

    // Ensure first item has valid properties
    if (typeof chartData[0] !== 'object' || chartData[0] === null) {
      // Convert primitive values to objects with name/value properties
      chartData = chartData.map((item, index) => {
        if (typeof item !== 'object' || item === null) {
          return {
            name: `Item ${index + 1}`,
            value: typeof item === 'number' ? item : 1
          };
        }
        return item;
      });
    }

    // Get all data keys except 'name' to determine data series
    const keys = Object.keys(chartData[0]).filter(k => k !== 'name' && k !== 'color');
    
    // If no usable keys, create synthetic ones
    if (keys.length === 0) {
      chartData = [
        { name: "Example", value: 100 },
        { name: "Sample", value: 50 }
      ];
    }
    
    // Re-get keys if we've modified the data
    const dataKeys = Object.keys(chartData[0]).filter(k => k !== 'name' && k !== 'color');
    
    // Auto-detect chart type if not explicitly provided
    let chartType = type || 'line'; // Default to line chart
    
    // Auto chart type detection logic
    if (!type) {
      // Don't use pie chart if there are more than 7 data points
      const tooManyPointsForPie = chartData.length > 7;
      
      // Use pie chart if there's just a 'value' property and not too many data points
      if (dataKeys.length === 1 && dataKeys[0] === 'value' && !tooManyPointsForPie) {
        chartType = 'pie';
      }
      // Use horizontal bar chart for categorical data with many data points
      else if (dataKeys.length === 1 && dataKeys[0] === 'value' && tooManyPointsForPie) {
        chartType = 'bar';
        layout = 'vertical'; // Use horizontal bars for better readability with many categories
      }
      // Use line chart for time series data (if name has date-like format) or multiple data series
      else if (
        (typeof chartData[0].name === 'string' && 
         /^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}|^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)|^\d{4}$/.test(chartData[0].name)) ||
        dataKeys.length > 1
      ) {
        chartType = 'line';
      }
      // Use scatter plot if we have x,y coordinates
      else if (dataKeys.includes('x') && dataKeys.includes('y')) {
        chartType = 'scatter';
      }
      // Use radar chart for comparative data with multiple metrics
      else if (dataKeys.length >= 4 && chartData.length <= 8) {
        chartType = 'radar';
      }
    }
    
    // Create a palette of colors based on the passed in colors
    const colorPalette = [
      primaryColor, 
      secondaryColor, 
      accentColor, 
      highlightColor,
      '#1f77b4', // Additional colors for larger datasets
      '#ff7f0e',
      '#2ca02c',
      '#d62728',
      '#9467bd',
      '#8c564b',
      '#e377c2',
      '#7f7f7f',
      '#bcbd22',
      '#17becf'
    ];
    
    // Dynamic Title Component if needed
    const ChartTitle = options?.title ? (
      <div className="text-center mb-2">
        <div className="font-semibold text-lg">{options.title}</div>
        {options.subTitle && <div className="text-sm text-gray-500">{options.subTitle}</div>}
      </div>
    ) : null;
    
    // Render the appropriate chart based on the type
    let chartComponent = null;
    
    // Set width and height for all charts - reduced to avoid horizontal scrolling
    const chartWidth = 450; // Reduced from 600
    const chartHeight = options?.aspectRatio ? 250 * options.aspectRatio : 250; // Reduced from 300
    
    switch (chartType) {
      case 'bar':
        chartComponent = (
          <>
            {ChartTitle}
            <BarChart 
              width={chartWidth}
              height={chartHeight}
              data={chartData} 
              layout={layout}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              {dataKeys.map((key, i) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  fill={chartData[0]?.colors?.[key] || colorPalette[i % colorPalette.length]} 
                  stackId={stacked ? "stack" : undefined}
                >
                  {showValues && (
                    <LabelList dataKey={key} position="top" fill="#333333" />
                  )}
                </Bar>
              ))}
            </BarChart>
          </>
        );
        break;
        
      case 'line':
        chartComponent = (
          <>
            {ChartTitle}
            <LineChart 
              width={chartWidth}
              height={chartHeight}
              data={chartData} 
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              {dataKeys.map((key, i) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={chartData[0]?.colors?.[key] || colorPalette[i % colorPalette.length]}
                  activeDot={{ r: 6 }}
                >
                  {showValues && (
                    <LabelList dataKey={key} position="top" fill="#333333" />
                  )}
                </Line>
              ))}
            </LineChart>
          </>
        );
        break;
        
      case 'area':
        chartComponent = (
          <>
            {ChartTitle}
            <AreaChart 
              width={chartWidth}
              height={chartHeight}
              data={chartData} 
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              {dataKeys.map((key, i) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId={stacked ? "1" : undefined}
                  stroke={chartData[0]?.colors?.[key] || colorPalette[i % colorPalette.length]}
                  fill={chartData[0]?.colors?.[key] || colorPalette[i % colorPalette.length]}
                  fillOpacity={0.6}
                >
                  {showValues && (
                    <LabelList dataKey={key} position="top" fill="#333333" />
                  )}
                </Area>
              ))}
            </AreaChart>
          </>
        );
        break;
        
      case 'pie':
        chartComponent = (
          <>
            {ChartTitle}
            <PieChart
              width={chartWidth}
              height={chartHeight}
            >
              <Tooltip />
              {/* Position the legend on the right side with smaller font */}
              {showLegend && (
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ 
                    fontSize: '0.75rem', 
                    fontFamily: fonts.bodyFont || 'inherit',
                    lineHeight: '1.2em'
                  }}
                  formatter={(value, entry: any) => {
                    // Use any type for entry to avoid TypeScript errors
                    const percent = entry.payload?.payload?.percent || 0;
                    return `${value} (${(percent * 100).toFixed(0)}%)`;
                  }}
                />
              )}
              <Pie
                data={chartData}
                dataKey={dataKeys[0] || 'value'} // Ensure we have a valid dataKey
                nameKey="name"
                cx="40%"  // Shifted left to make room for legend
                cy="50%"
                outerRadius={90}  // Slightly smaller to fit better
                fill={primaryColor}
                labelLine={false}  // No label lines on the chart itself
                label={false}      // No labels on the chart itself
                // Add percent value to each data point for the legend
                isAnimationActive={options?.animation !== false}
              >
                {chartData.map((entry, index) => {
                  // Handle different data formats for pie charts
                  let value = 0;
                  let name = '';
                  
                  if (typeof entry === 'object' && entry !== null) {
                    // Standard format with name and value
                    if ('name' in entry && dataKeys.length > 0) {
                      name = entry.name || `Item ${index + 1}`;
                      value = entry[dataKeys[0]] || entry.value || 0;
                    }
                    // Format with category and value
                    else if ('category' in entry && ('value' in entry)) {
                      name = entry.category || `Item ${index + 1}`;
                      value = entry.value || 0;
                    }
                    // Format with phase and value
                    else if ('phase' in entry && ('value' in entry)) {
                      name = entry.phase || `Item ${index + 1}`;
                      value = entry.value || 0;
                    }
                    // Fallback
                    else {
                      name = `Item ${index + 1}`;
                      value = 1;
                    }
                  }
                  
                  // Calculate percent for each slice
                  const total = chartData.reduce((sum, item) => {
                    if (typeof item === 'object' && item !== null) {
                      if (dataKeys.length > 0 && dataKeys[0] in item) {
                        return sum + (item[dataKeys[0]] || 0);
                      } else if ('value' in item) {
                        return sum + (item.value || 0);
                      }
                    }
                    return sum + 0;
                  }, 0);
                  
                  const percent = total > 0 ? value / total : 0;
                  
                  // Add percent and name to the entry for use in the legend
                  entry.percent = percent;
                  if (!entry.name && name) {
                    entry.name = name;
                  }
                  
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color || colorPalette[index % colorPalette.length]} 
                    />
                  );
                })}
              </Pie>
            </PieChart>
          </>
        );
        break;
      
      case 'scatter':
        chartComponent = (
          <>
            {ChartTitle}
            <ScatterChart 
              width={chartWidth}
              height={chartHeight}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="x" type="number" name="x" />
              <YAxis dataKey="y" type="number" name="y" />
              {chartData[0].z && <ZAxis dataKey="z" range={[50, 500]} name="z" />}
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              {showLegend && <Legend />}
              <Scatter 
                name={options?.title || "Scatter Data"} 
                data={chartData} 
                fill={primaryColor}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || colorPalette[index % colorPalette.length]} 
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </>
        );
        break;
        
      case 'radar':
        chartComponent = (
          <>
            {ChartTitle}
            <RadarChart 
              width={chartWidth}
              height={chartHeight}
              cx="50%" 
              cy="50%" 
              outerRadius={100} 
              data={chartData}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
              {dataKeys.map((key, i) => (
                <Radar
                  key={key}
                  name={key}
                  dataKey={key}
                  stroke={colorPalette[i % colorPalette.length]}
                  fill={colorPalette[i % colorPalette.length]}
                  fillOpacity={0.6}
                />
              ))}
              <Tooltip />
              {showLegend && <Legend />}
            </RadarChart>
          </>
        );
        break;
        
      case 'radialBar':
        chartComponent = (
          <>
            {ChartTitle}
            <RadialBarChart 
              width={chartWidth}
              height={chartHeight}
              cx="50%" 
              cy="50%" 
              innerRadius={20} 
              outerRadius={140} 
              barSize={10} 
              data={chartData}
            >
              <RadialBar
                background
                dataKey={dataKeys[0]}
                label={{ position: 'insideStart', fill: '#fff' }}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || colorPalette[index % colorPalette.length]} 
                  />
                ))}
              </RadialBar>
              <Tooltip />
              {showLegend && <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />}
            </RadialBarChart>
          </>
        );
        break;
      
      case 'composed':
        chartComponent = (
          <>
            {ChartTitle}
            <ComposedChart 
              width={chartWidth}
              height={chartHeight}
              data={chartData} 
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              {dataKeys.map((key, i) => {
                // Determine the component type based on the key name or metadata
                const compType = chartData[0]?.types?.[key] || 
                                  (key.includes('bar') ? 'bar' : 
                                   key.includes('line') ? 'line' : 
                                   key.includes('area') ? 'area' : 
                                   i % 3 === 0 ? 'bar' : i % 3 === 1 ? 'line' : 'area');
                
                switch(compType) {
                  case 'bar':
                    return (
                      <Bar
                        key={key}
                        dataKey={key}
                        fill={chartData[0]?.colors?.[key] || colorPalette[i % colorPalette.length]}
                        stackId={stacked && compType === 'bar' ? "stack" : undefined}
                      >
                        {showValues && (
                          <LabelList dataKey={key} position="top" fill="#333333" />
                        )}
                      </Bar>
                    );
                  case 'line':
                    return (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={chartData[0]?.colors?.[key] || colorPalette[i % colorPalette.length]}
                        activeDot={{ r: 6 }}
                      >
                        {showValues && (
                          <LabelList dataKey={key} position="top" fill="#333333" />
                        )}
                      </Line>
                    );
                  case 'area':
                    return (
                      <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stackId={stacked && compType === 'area' ? "1" : undefined}
                        stroke={chartData[0]?.colors?.[key] || colorPalette[i % colorPalette.length]}
                        fill={chartData[0]?.colors?.[key] || colorPalette[i % colorPalette.length]}
                        fillOpacity={0.6}
                      >
                        {showValues && (
                          <LabelList dataKey={key} position="top" fill="#333333" />
                        )}
                      </Area>
                    );
                  default:
                    return null;
                }
              })}
            </ComposedChart>
          </>
        );
        break;
        
      case 'treemap':
        chartComponent = (
          <>
            {ChartTitle}
            <Treemap
              width={chartWidth}
              height={chartHeight}
              data={chartData}
              dataKey="value"
              aspectRatio={4/3}
              stroke="#fff"
              fill={primaryColor}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || colorPalette[index % colorPalette.length]} 
                />
              ))}
            </Treemap>
          </>
        );
        break;
        
      default:
        // Fallback to bar chart for unknown types
        chartComponent = (
          <>
            {ChartTitle}
            <BarChart 
              width={chartWidth}
              height={chartHeight}
              data={chartData} 
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              {dataKeys.map((key, i) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  fill={chartData[0]?.colors?.[key] || colorPalette[i % colorPalette.length]} 
                  stackId={stacked ? "stack" : undefined}
                >
                  {showValues && (
                    <LabelList dataKey={key} position="top" fill="#333333" />
                  )}
                </Bar>
              ))}
            </BarChart>
          </>
        );
    }

    // Log debug information to console only (not visible in UI)
    console.log("Rendering chart with data:", chartData);
    console.log("Chart type:", chartType);
    console.log("Chart keys:", dataKeys);
    
    // Add a visualization caption if provided in the chart data
    const visualizationCaption = chartData[0]?.visualization || '';
    
    return (
      <div className="chart-container my-4">
        {/* Add a fixed height to the container to ensure the chart renders */}
        <div style={{ width: '100%', height: `${chartHeight}px`, position: 'relative' }}>
          {/* Render the chart directly without ResponsiveContainer */}
          {chartComponent}
        </div>
        
        {/* Only show visualization caption if it exists */}
        {visualizationCaption && (
          <div className="visualization-caption text-sm text-center text-gray-600 mt-2 italic">
            {visualizationCaption}
          </div>
        )}
      </div>
    );
  } catch (error: unknown) { // Type error as unknown
    const errorMessage = error instanceof Error ? error.message : String(error); // Check type
    console.error("Error rendering chart:", errorMessage, "Data:", data);
    // Return a helpful error message with examples
    return (
      <div className="chart-error p-4 border border-red-300 rounded bg-red-50 my-4">
        <p className="text-red-600 font-semibold">Chart rendering error</p>
        <p className="text-sm text-red-500">{errorMessage}</p> {/* Use checked message */}
        <div className="mt-2 text-xs">Chart data format should be valid JSON. Example:</div>
        <pre className="mt-1 p-2 bg-gray-100 text-xs overflow-auto max-h-32 text-gray-800">
{`[
  {"name": "Category A", "value": 30},
  {"name": "Category B", "value": 45},
  {"name": "Category C", "value": 25}
]`}
        </pre>
        <div className="mt-2 text-xs font-medium">Original content:</div>
        <pre className="mt-1 p-2 bg-gray-100 text-xs overflow-auto max-h-32 text-gray-600">
          {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }
};
