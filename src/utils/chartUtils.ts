/**
 * Chart Utilities for MagicMuse
 * Provides helper functions for chart data generation, transformation, and formatting
 */

// Function to extract chart data from code blocks in Markdown
export const extractChartData = (markdown: string): { charts: any[] } => {
  const chartRegex = /```chart\s+([\s\S]*?)```/g;
  const charts = [...markdown.matchAll(chartRegex)].map(match => {
    try {
      return JSON.parse(match[1].trim());
    } catch (e) {
      console.error("Failed to parse chart data:", e);
      return null;
    }
  }).filter(Boolean);
  
  return { charts };
};

// Function to transform tabular data to chart-ready format
export const tableToChartData = (tableData: any[]): any[] => {
  if (!tableData || !tableData.length) return [];
  
  // Get all column names
  const keys = Object.keys(tableData[0]);
  
  // Simple heuristic to detect proper structure for transformation
  if (keys.length < 2) return tableData;
  
  // Assume first column is categories/labels
  const categoryKey = keys[0];
  const valueKeys = keys.slice(1);
  
  // Check if we should treat this as time-series data
  const isTimeSeries = 
    typeof tableData[0][categoryKey] === 'string' && 
    /^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}|^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/.test(tableData[0][categoryKey]);
  
  // If data appears to be already in chart format, return as is
  if (tableData[0].name !== undefined || (tableData[0].x !== undefined && tableData[0].y !== undefined)) {
    return tableData;
  }
  
  // Transform table to chart data
  return tableData.map(row => {
    const chartPoint: Record<string, any> = {
      name: row[categoryKey]
    };
    
    valueKeys.forEach(key => {
      // Convert string numbers to actual numbers
      const value = row[key];
      chartPoint[key] = typeof value === 'string' && !isNaN(parseFloat(value)) ? 
        parseFloat(value) : value;
    });
    
    return chartPoint;
  });
};

// Generate intelligent chart type recommendation based on data structure
export const recommendChartType = (data: any[]): string => {
  if (!data || !data.length) return 'bar';
  
  const keys = Object.keys(data[0]).filter(k => k !== 'name' && k !== 'color');
  
  // Pie chart for single value
  if (keys.length === 1 && (keys[0] === 'value' || data.length <= 6)) {
    return 'pie';
  }
  
  // Scatter plot for x,y coordinates
  if (keys.includes('x') && keys.includes('y')) {
    return 'scatter';
  }
  
  // Line chart for time series
  if (typeof data[0].name === 'string' && 
     /^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}|^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/.test(data[0].name)) {
    return 'line';
  }
  
  // Radar chart for comparison across multiple metrics
  if (keys.length >= 4 && data.length <= 8) {
    return 'radar';
  }
  
  // Area chart for showing trends over time with multiple series
  if (keys.length > 1 && data.length >= 5) {
    return 'area';
  }
  
  // Default to bar chart
  return 'bar';
};

// Generate a color palette from theme colors
export const generateColorPalette = (
  primary: string = '#8884d8', 
  secondary: string = '#82ca9d', 
  accent: string = '#ffc658',
  count: number = 10
): string[] => {
  const baseColors = [primary, secondary, accent];
  
  // For small counts, just return the base colors
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  const palette: string[] = [...baseColors];
  
  // Generate additional colors by varying lightness and saturation
  for (let i = 0; i < count - baseColors.length; i++) {
    const baseColor = baseColors[i % baseColors.length];
    // Simple technique to modify colors - in a real app this would be more sophisticated
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    
    // Vary the color slightly
    const variation = (i % 3 === 0) ? 30 : (i % 3 === 1) ? -30 : 0;
    
    const nr = Math.min(255, Math.max(0, r + variation));
    const ng = Math.min(255, Math.max(0, g + variation));
    const nb = Math.min(255, Math.max(0, b + variation));
    
    const newColor = `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
    palette.push(newColor);
  }
  
  return palette;
};

// Helper function to safely parse JSON with proper error handling
const safeJsonParse = (jsonStr: string): any => {
  try {
    // First attempt - standard parse
    return JSON.parse(jsonStr);
  } catch (e) {
    try {
      // Second attempt - fix common JSON formatting issues
      // Replace single quotes with double quotes
      let fixedJson = jsonStr.replace(/'/g, '"');
      
      // Fix property names that are not quoted
      fixedJson = fixedJson.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
      
      // Remove trailing commas before closing brackets
      fixedJson = fixedJson.replace(/,(\s*[\]}])/g, '$1');
      
      return JSON.parse(fixedJson);
    } catch (e2) {
      // If both attempts fail, log error and return null
      console.error("Failed to parse JSON even after fixing:", e2);
      return null;
    }
  }
};

// Process markdown content to automatically extract and enhance chart data
export const enhanceMarkdownWithCharts = (markdown: string): string => {
  let enhancedMarkdown = markdown;
  
  try {
    // First, replace explicit chart code blocks with enhanced versions
    enhancedMarkdown = enhancedMarkdown.replace(/```chart\s+([\s\S]*?)```/g, (match, chartData) => {
      try {
        // Use safe JSON parsing to handle common formatting issues
        const data = safeJsonParse(chartData.trim());
        
        if (!data || (Array.isArray(data) && data.length === 0)) {
          return match; // Return original if not valid chart data
        }
        
        // If it's already in the enhanced format, return as is with proper formatting
        if (data && typeof data === 'object' && data.data && data.type) {
          return '```chart\n' + JSON.stringify(data, null, 2) + '\n```';
        }
        
        // If it's not an array, return original
        if (!Array.isArray(data)) {
          return match;
        }
        
        // Detect the best chart type
        const recommendedType = recommendChartType(data);
        
        // Add metadata to the chart data to hint at the type
        const enhancedData = {
          data,
          type: recommendedType,
          options: {
            showValues: data.length <= 10, // Show values for small datasets
            showGrid: true,
            showLegend: true
          }
        };
        
        // Return the enhanced chart code block
        return '```chart\n' + JSON.stringify(enhancedData, null, 2) + '\n```';
      } catch (e) {
        console.error("Failed to enhance chart data:", e);
        // Create a valid chart block with fallback data
        const fallbackData = [
          { name: "Error", value: 100 },
          { name: "Parsing Failed", value: 50 }
        ];
        
        const fallbackChart = {
          data: fallbackData,
          type: "bar",
          options: {
            showValues: true,
            showGrid: true,
            showLegend: true
          }
        };
        
        return '```chart\n' + JSON.stringify(fallbackChart, null, 2) + '\n```';
      }
    });
    
    // Then, look for JSON code blocks that might be chart data
    enhancedMarkdown = enhancedMarkdown.replace(/```json\s+([\s\S]*?)```/g, (match, jsonData) => {
      try {
        // Check if this looks like chart data
        if (jsonData.includes('"name"') && (jsonData.includes('"value"') || jsonData.includes('"data"'))) {
          const data = safeJsonParse(jsonData.trim());
          
          if (!data) {
            return match; // Return original if parsing failed
          }
          
          // If it's already in the enhanced format, return as is
          if (data && typeof data === 'object' && data.data && data.type) {
            return '```chart\n' + JSON.stringify(data, null, 2) + '\n```';
          }
          
          // If it's an array of objects with name/value pairs, treat as chart data
          if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
            // Check if it has name/value properties
            const hasNameValue = data[0].name !== undefined && 
                               (data[0].value !== undefined || 
                                Object.keys(data[0]).some(key => key !== 'name' && typeof data[0][key] === 'number'));
            
            if (hasNameValue) {
              // Detect the best chart type
              const recommendedType = recommendChartType(data);
              
              // Add metadata to the chart data to hint at the type
              const enhancedData = {
                data,
                type: recommendedType,
                options: {
                  showValues: data.length <= 10, // Show values for small datasets
                  showGrid: true,
                  showLegend: true
                }
              };
              
              // Convert to chart code block
              return '```chart\n' + JSON.stringify(enhancedData, null, 2) + '\n```';
            }
          }
        }
        
        return match; // Return original if not chart data
      } catch (e) {
        console.error("Failed to enhance JSON data:", e);
        return match; // Return original on error
      }
    });
    
    // Finally, look for plain JSON arrays in the text (not in code blocks)
    enhancedMarkdown = enhancedMarkdown.replace(/(\[[\s\S]*?\])/g, (match, jsonData) => {
      // Skip if it's already inside a code block
      if (match.includes('```') || match.includes('`')) {
        return match;
      }
      
      try {
        // Try to parse as JSON
        const data = safeJsonParse(jsonData.trim());
        
        if (!data) {
          return match; // Return original if parsing failed
        }
        
        // If it's an array of objects with name/value pairs, treat as chart data
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
          // Check if it has name/value properties
          const hasNameValue = data[0].name !== undefined && 
                             (data[0].value !== undefined || 
                              Object.keys(data[0]).some(key => key !== 'name' && typeof data[0][key] === 'number'));
          
          if (hasNameValue) {
            // Detect the best chart type
            const recommendedType = recommendChartType(data);
            
            // Add metadata to the chart data to hint at the type
            const enhancedData = {
              data,
              type: recommendedType,
              options: {
                showValues: data.length <= 10, // Show values for small datasets
                showGrid: true,
                showLegend: true
              }
            };
            
            // Convert to chart code block
            return '```chart\n' + JSON.stringify(enhancedData, null, 2) + '\n```';
          }
        }
        
        return match; // Return original if not chart data
      } catch (e) {
        // Not valid JSON, return original
        return match;
      }
    });
    
    return enhancedMarkdown;
  } catch (e) {
    console.error("Critical error in enhanceMarkdownWithCharts:", e);
    // Return original markdown on critical error
    return markdown;
  }
};

// Generate example chart data for various chart types
export const generateExampleChartData = (type: string = 'bar'): any => {
  switch (type) {
    case 'bar':
      return [
        { name: 'Category A', value: 400 },
        { name: 'Category B', value: 300 },
        { name: 'Category C', value: 200 },
        { name: 'Category D', value: 278 },
        { name: 'Category E', value: 189 }
      ];
      
    case 'line':
      return [
        { name: 'Jan', value: 400, trend: 240 },
        { name: 'Feb', value: 300, trend: 139 },
        { name: 'Mar', value: 200, trend: 980 },
        { name: 'Apr', value: 278, trend: 390 },
        { name: 'May', value: 189, trend: 480 },
        { name: 'Jun', value: 239, trend: 380 },
        { name: 'Jul', value: 349, trend: 430 }
      ];
      
    case 'pie':
      return [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 }
      ];
      
    case 'area':
      return [
        { name: 'Q1', series1: 4000, series2: 2400 },
        { name: 'Q2', series1: 3000, series2: 1398 },
        { name: 'Q3', series1: 2000, series2: 9800 },
        { name: 'Q4', series1: 2780, series2: 3908 }
      ];
      
    case 'radar':
      return [
        { name: 'Metric A', product1: 120, product2: 110, product3: 140 },
        { name: 'Metric B', product1: 98, product2: 130, product3: 100 },
        { name: 'Metric C', product1: 86, product2: 130, product3: 90 },
        { name: 'Metric D', product1: 99, product2: 100, product3: 120 },
        { name: 'Metric E', product1: 85, product2: 90, product3: 130 }
      ];
      
    case 'scatter':
      return [
        { x: 100, y: 200, z: 200, name: 'Point A' },
        { x: 120, y: 100, z: 260, name: 'Point B' },
        { x: 170, y: 300, z: 400, name: 'Point C' },
        { x: 140, y: 250, z: 280, name: 'Point D' },
        { x: 150, y: 400, z: 500, name: 'Point E' },
        { x: 110, y: 280, z: 200, name: 'Point F' }
      ];
      
    default:
      return generateExampleChartData('bar');
  }
};

// Convert various data formats (CSV, JSON, etc.) to chart-ready data
export const convertDataToChartFormat = (data: string, format: string = 'auto'): any[] => {
  if (!data) return [];
  
  let chartData: any[] = [];
  
  // Try to auto-detect the format if not specified
  if (format === 'auto') {
    if (data.trim().startsWith('[') || data.trim().startsWith('{')) {
      format = 'json';
    } else if (data.includes(',') && data.includes('\n')) {
      format = 'csv';
    } else {
      format = 'tsv'; // Default to TSV for other tabular formats
    }
  }
  
  try {
    switch (format.toLowerCase()) {
      case 'json':
        let parsedData: any;
        try {
          parsedData = safeJsonParse(data);
        } catch (e) {
          console.error("Failed to parse JSON data:", e);
          return []; // Return empty on parse error
        }

        if (!parsedData) {
          return []; // Return empty if parsing failed
        }

        // Check if parsedData is an array directly
        if (Array.isArray(parsedData)) {
          chartData = parsedData;
        } 
        // Check if it's an object containing a 'data' array property
        else if (typeof parsedData === 'object' && parsedData !== null && parsedData.data && Array.isArray(parsedData.data)) {
          chartData = parsedData.data;
        } 
        // Handle cases where the JSON is valid but not the expected format
        else {
          console.warn("Parsed JSON data is not in a recognized chart format (array or {data: array}).");
          // Return empty if it's not directly usable as chart data array.
          chartData = []; 
        }
        break;
        
      case 'csv':
        const lines = data.trim().split('\n');
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
        break;
        
      case 'tsv':
        const tsvLines = data.trim().split('\n');
        const tsvHeaders = tsvLines[0].split('\t').map(h => h.trim());
        
        chartData = tsvLines.slice(1).map(line => {
          const values = line.split('\t').map(v => v.trim());
          const row: Record<string, any> = {};
          
          tsvHeaders.forEach((header, i) => {
            // Try to convert numeric values
            const value = values[i];
            const numValue = parseFloat(value);
            row[header] = isNaN(numValue) ? value : numValue;
          });
          
          return row;
        });
        break;
        
      default:
        return [];
    }
    
    return chartData;
  } catch (e) {
    console.error("Failed to convert data:", e);
    return [];
  }
};
