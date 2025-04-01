import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChartRenderer } from '@/components/ChartRenderer';
import { enhanceMarkdownWithCharts, extractChartData } from '@/utils/chartUtils';
import { safeJsonParse, convertToChartData, validateChartData } from '@/utils/jsonUtils';

interface MarkdownVisualizerProps {
  content: string;
  enhanceVisuals?: boolean;
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    highlight?: string;
    background?: string;
  };
  fonts?: {
    headingFont?: string;
    bodyFont?: string;
  };
  options?: {
    showCharts?: boolean;
    showTables?: boolean;
    showDiagrams?: boolean;
    chartHeight?: number;
    animateCharts?: boolean;
  };
}

/**
 * MarkdownVisualizer - Advanced Markdown renderer with rich visualization capabilities
 * Renders markdown content with enhanced support for charts, tables, and diagrams
 */
export const MarkdownVisualizer: React.FC<MarkdownVisualizerProps> = ({
  content,
  enhanceVisuals = true,
  brandColors = {
    primary: '#8884d8',
    secondary: '#82ca9d',
    accent: '#ffc658',
    highlight: '#ff7300',
    background: '#ffffff'
  },
  fonts = {
    headingFont: 'system-ui, sans-serif',
    bodyFont: 'system-ui, sans-serif'
  },
  options = {
    showCharts: true,
    showTables: true,
    showDiagrams: true,
    chartHeight: 300,
    animateCharts: true
  }
}) => {
  // Process and enhance the markdown content if requested
  const processedContent = enhanceVisuals ? enhanceMarkdownWithCharts(content) : content;
  
  // CSS Custom Properties for styling
  const cssVars = {
    '--primary-color': brandColors.primary,
    '--secondary-color': brandColors.secondary,
    '--accent-color': brandColors.accent,
    '--highlight-color': brandColors.highlight,
    '--background-color': brandColors.background,
    '--heading-font': fonts.headingFont,
    '--body-font': fonts.bodyFont,
  } as React.CSSProperties;
  
  // Configure custom renderers for ReactMarkdown
  const customComponents: Components = {
    // Headers with customized styling
    h1: ({ node, ...props }) => (
      <h1 
        style={{ 
          fontFamily: fonts.headingFont, 
          color: brandColors.primary,
          fontSize: '2rem',
          marginTop: '1.5rem',
          marginBottom: '1rem',
          borderBottom: `1px solid ${brandColors.primary}20`
        }} 
        {...props} 
      />
    ),
    h2: ({ node, ...props }) => (
      <h2 
        style={{ 
          fontFamily: fonts.headingFont, 
          color: brandColors.secondary,
          fontSize: '1.75rem',
          marginTop: '1.4rem',
          marginBottom: '0.8rem' 
        }} 
        {...props} 
      />
    ),
    h3: ({ node, ...props }) => (
      <h3 
        style={{ 
          fontFamily: fonts.headingFont, 
          color: brandColors.secondary,
          fontSize: '1.5rem',
          marginTop: '1.2rem',
          marginBottom: '0.6rem' 
        }} 
        {...props} 
      />
    ),
    h4: ({ node, ...props }) => (
      <h4
        style={{
          fontFamily: fonts.headingFont,
          color: brandColors.accent,
          fontSize: '1.25rem',
          marginTop: '1rem',
          marginBottom: '0.5rem'
        }}
        {...props}
      />
    ),
    // Text styling
    p: ({ node, ...props }) => (
      <p 
        style={{ 
          fontFamily: fonts.bodyFont, 
          lineHeight: 1.6,
          marginBottom: '1rem',
          color: '#333333' 
        }} 
        {...props} 
      />
    ),
    strong: ({ node, ...props }) => (
      <strong 
        style={{ 
          color: brandColors.primary,
          fontWeight: 600
        }} 
        {...props} 
      />
    ),
    em: ({ node, ...props }) => (
      <em 
        style={{ 
          color: brandColors.secondary 
        }} 
        {...props} 
      />
    ),
    // Lists
    ul: ({ node, ...props }) => (
      <ul 
        style={{ 
          paddingLeft: '1.5rem',
          marginBottom: '1rem',
          listStyleType: 'disc' 
        }} 
        {...props} 
      />
    ),
    ol: ({ node, ...props }) => (
      <ol 
        style={{ 
          paddingLeft: '1.5rem',
          marginBottom: '1rem',
          listStyleType: 'decimal' 
        }} 
        {...props} 
      />
    ),
    li: ({ node, ...props }) => (
      <li 
        style={{ 
          fontFamily: fonts.bodyFont,
          marginBottom: '0.25rem' 
        }} 
        {...props} 
      />
    ),
    // Tables with enhanced styling
    table: ({ node, ...props }) => (
      <div className="table-container" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table 
          style={{ 
            width: '100%',
            borderCollapse: 'collapse',
            border: `1px solid ${brandColors.primary}30`,
            fontSize: '0.9rem'
          }} 
          {...props} 
        />
      </div>
    ),
    thead: ({ node, ...props }) => (
      <thead 
        style={{ 
          backgroundColor: `${brandColors.primary}15`,
          fontFamily: fonts.headingFont,
          fontWeight: 600
        }} 
        {...props} 
      />
    ),
    th: ({ node, ...props }) => (
      <th 
        style={{ 
          padding: '0.75rem',
          borderBottom: `2px solid ${brandColors.primary}30`,
          textAlign: 'left',
          color: brandColors.primary
        }} 
        {...props} 
      />
    ),
    td: ({ node, ...props }) => (
      <td 
        style={{ 
          padding: '0.75rem',
          borderBottom: `1px solid ${brandColors.primary}20`,
          borderRight: `1px solid ${brandColors.primary}10`
        }} 
        {...props} 
      />
    ),
    tr: ({ node, ...props }) => {
      // TODO: Consider adding zebra striping via CSS if needed
      return (
        <tr
          // Removed background color logic based on index
          {...props}
        />
      );
    },
    // Links
    a: ({ node, ...props }) => (
      <a 
        style={{ 
          color: brandColors.accent,
          textDecoration: 'none',
          borderBottom: `1px dotted ${brandColors.accent}` 
        }} 
        {...props} 
      />
    ),
    // Code blocks and chart rendering
    code: ({ node, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const codeContent = String(children).replace(/\n$/, '');
      
      // Special handling for chart code blocks
      if (match && match[1] === 'chart' && options.showCharts) {
        try {
          // First, try to parse using our enhanced JSON utilities
          const chartData = convertToChartData(codeContent);
          
          // Ensure we have valid data
          if (!chartData || chartData.length === 0) {
            throw new Error("Could not generate valid chart data");
          }
          
          // Validate and fix the chart data structure
          let safeData = validateChartData(chartData);
          
          // Determine if this is already in the enhanced format with type and options
          let chartType;
          let chartLayout;
          let chartStacked = false;
          let chartOptions = {
            animation: options.animateCharts,
            aspectRatio: options.chartHeight ? options.chartHeight / 300 : 1,
            showValues: true,
            showGrid: true,
            showLegend: true
          };
          
          // Check if this is the enhanced format with configuration
          if (chartData[0] && chartData[0].data && Array.isArray(chartData[0].data)) {
            // It's the enhanced format
            safeData = validateChartData(chartData[0].data);
            chartType = chartData[0].type;
            chartLayout = chartData[0].layout;
            chartStacked = chartData[0].stacked;
            chartOptions = { ...chartOptions, ...(chartData[0].options || {}) };
          } else {
            // Auto-detect chart type based on data structure
            const keys = Object.keys(safeData[0]).filter(k => k !== 'name' && k !== 'color');
            
            if (keys.length === 1 && keys[0] === 'value') {
              chartType = 'pie';
            } else if (keys.includes('x') && keys.includes('y')) {
              chartType = 'scatter';
            } else if (
              (typeof safeData[0].name === 'string' && 
              /^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}|^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/.test(safeData[0].name)) ||
              keys.length > 2
            ) {
              chartType = 'line';
            } else if (keys.length >= 4 && safeData.length <= 8) {
              chartType = 'radar';
            } else {
              chartType = 'bar';
            }
          }
          
          return (
            <ChartRenderer 
              data={safeData}
              type={chartType}
              layout={chartLayout}
              stacked={chartStacked}
              colors={brandColors}
              options={chartOptions}
            />
          );
        } catch (error) {
          console.error("Failed to parse chart data:", error);
          
          // Create a fallback chart with error message
          const fallbackData = [
            { name: "Error", value: 100 },
            { name: "Example", value: 50 }
          ];
          
          // Show error message but still render a chart
          return (
            <div className="chart-error-container">
              <div className="chart-error p-3 border border-red-300 rounded bg-red-50 mb-2">
                <div className="text-red-600 font-semibold text-sm">Chart data format error</div>
                <div className="text-xs text-red-500 mb-1">{error instanceof Error ? error.message : String(error)}</div>
                <details className="text-xs">
                  <summary className="cursor-pointer font-medium text-gray-700">View error details</summary>
                  <div className="mt-1 p-2 bg-gray-100 rounded text-gray-600 overflow-auto max-h-24">
                    {codeContent}
                  </div>
                </details>
              </div>
              
              {/* Render a fallback chart anyway */}
              <div className="mt-2">
                <ChartRenderer 
                  data={fallbackData}
                  type="bar"
                  colors={{
                    ...brandColors,
                    primary: '#d97706', // Amber color for error state
                  }}
                  options={{
                    animation: false,
                    aspectRatio: 0.5, // Shorter height for error chart
                    showValues: true,
                    title: "Error Parsing Chart Data",
                    subTitle: "Please check your JSON format"
                  }}
                />
              </div>
              
              <div className="mt-2 p-3 border border-amber-200 rounded bg-amber-50">
                <div className="text-amber-700 font-medium text-xs mb-1">Correct format example:</div>
                <pre className="text-xs overflow-auto max-h-24 bg-white p-2 rounded text-gray-800">
{`\`\`\`chart
[
  {"name": "Category A", "value": 30},
  {"name": "Category B", "value": 45},
  {"name": "Category C", "value": 25}
]
\`\`\``}
                </pre>
              </div>
            </div>
          );
        }
      }
      
      // Special handling for diagram code blocks (using a placeholder until actual implementation)
      if (match && match[1] === 'diagram' && options.showDiagrams) {
        return (
          <div className="diagram-container p-4 border rounded my-4" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="text-center mb-2 font-semibold" style={{ color: brandColors.primary }}>
              Diagram Visualization
            </div>
            <div className="diagram-placeholder p-8 border-dashed border-2 rounded text-center" style={{ borderColor: `${brandColors.primary}50` }}>
              {codeContent}
            </div>
          </div>
        );
      }
      
      // Regular code blocks
      if (match) {
        return (
          <pre style={{ 
            backgroundColor: '#f5f5f5',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            border: `1px solid ${brandColors.primary}20`
          }}>
            <code className={className} {...props}>{children}</code>
          </pre>
        );
      }
      
      // Inline code
      return (
        <code 
          style={{ 
            backgroundColor: `${brandColors.primary}10`,
            padding: '0.2rem 0.4rem',
            borderRadius: '3px',
            fontSize: '0.85em',
            fontFamily: 'monospace'
          }} 
          {...props}
        >
          {children}
        </code>
      );
    },
    // Blockquotes
    blockquote: ({ node, ...props }) => (
      <blockquote 
        style={{ 
          borderLeft: `4px solid ${brandColors.accent}`,
          paddingLeft: '1rem',
          marginLeft: '0',
          marginRight: '0',
          marginBottom: '1rem',
          fontStyle: 'italic',
          color: '#555555'
        }} 
        {...props} 
      />
    ),
    // Horizontal rule
    hr: ({ node, ...props }) => (
      <hr 
        style={{ 
          border: 'none',
          height: '1px',
          backgroundColor: `${brandColors.primary}30`,
          margin: '1.5rem 0'
        }} 
        {...props} 
      />
    ),
  };

  return (
    <div className="markdown-visualizer" style={cssVars}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={customComponents}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownVisualizer;
