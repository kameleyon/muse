import React from 'react';
import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  Area,
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell // Moved import to top
} from 'recharts';

// Define Props interface
interface ChartRendererProps {
  data: string | any[]; // Allow string (JSON) or already parsed array
  type?: 'bar' | 'line' | 'pie' | 'area';
  colors?: { // Make colors prop optional, but properties optional if object exists
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

/**
 * Enhanced ChartRenderer component that automatically detects and renders the appropriate
 * chart type based on the data structure.
 */
export const ChartRenderer: React.FC<ChartRendererProps> = ({ data, type, colors = {} }) => {
  // Set default colors using optional chaining and defaults
  const primaryColor = colors?.primary || '#8884d8';
  const secondaryColor = colors?.secondary || '#82ca9d';
  const accentColor = colors?.accent || '#ffc658';

  try {
    // Parse the data if it's a string (from a code block)
    let chartData;
    if (typeof data === 'string') {
      // Clean up the string from possible code block formatting
      const cleanData = data.replace(/```chart\s+|```/g, '').trim();
      chartData = JSON.parse(cleanData);
    } else {
      chartData = data;
    }
    
    // Validate the data
    if (!Array.isArray(chartData)) {
      throw new Error("Chart data must be an array");
    }
    
    if (chartData.length === 0) {
      return (
        <div className="text-gray-500 p-4 border rounded my-4">
          No data available for chart.
        </div>
      );
    }

    // Get all data keys except 'name' to determine data series
    const keys = Object.keys(chartData[0]).filter(k => k !== 'name');
    
    // Auto-detect chart type if not explicitly provided
    let chartType = type || 'bar'; // Default to bar chart
    
    // Use pie chart if there's just a 'value' property
    if (keys.length === 1 && keys[0] === 'value') {
      chartType = 'pie';
    }
    // Use line chart for multiple data series
    else if (keys.length > 1) {
      chartType = 'line';
    }
    
    // Render the appropriate chart based on the type
    let chartComponent = null;
    
    switch (chartType) {
      case 'bar':
        chartComponent = (
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {keys.map((key, i) => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={[primaryColor, secondaryColor, accentColor][i % 3]} 
              />
            ))}
          </BarChart>
        );
        break;
        
      case 'line':
        chartComponent = (
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {keys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={[primaryColor, secondaryColor, accentColor][i % 3]}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );
        break;
        
      case 'area':
        chartComponent = (
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {keys.map((key, i) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={[primaryColor, secondaryColor, accentColor][i % 3]}
                fill={[primaryColor, secondaryColor, accentColor][i % 3]}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        );
        break;
        
      case 'pie':
        chartComponent = (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={chartData}
              dataKey={keys[0]}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill={primaryColor}
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index % 3 === 0 ? primaryColor : index % 3 === 1 ? secondaryColor : accentColor} 
                />
              ))}
            </Pie>
          </PieChart>
        );
        break;
        
      default:
        // Fallback to bar chart for unknown types
        chartComponent = (
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {keys.map((key, i) => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={[primaryColor, secondaryColor, accentColor][i % 3]} 
              />
            ))}
          </BarChart>
        );
    }

    return (
      <div className="chart-container my-4">
        <ResponsiveContainer width="100%" height={300}>
          {chartComponent}
        </ResponsiveContainer>
      </div>
    );
  } catch (error: unknown) { // Type error as unknown
    const errorMessage = error instanceof Error ? error.message : String(error); // Check type
    console.error("Error rendering chart:", errorMessage, "Data:", data);
    // Return a helpful error message
    return (
      <div className="chart-error p-4 border border-red-300 rounded bg-red-50 my-4">
        <p className="text-red-600 font-semibold">Chart rendering error</p>
        <p className="text-sm text-red-500">{errorMessage}</p> {/* Use checked message */}
        <pre className="mt-2 p-2 bg-gray-100 text-xs overflow-auto max-h-20">
          {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }
};

// Removed duplicate Cell import and redundant default export
