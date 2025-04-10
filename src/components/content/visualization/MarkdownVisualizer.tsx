import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChartRenderer } from '@/components/ChartRenderer';
import { enhanceMarkdownWithCharts, extractChartData } from '@/utils/chartUtils';
import { safeJsonParse, convertToChartData, validateChartData } from '@/utils/jsonUtils';

// Define allowed chart types for TypeScript safety
type ChartType = 'bar' | 'line' | 'area' | 'scatter' | 'radar' | 'pie' | 'radialBar' | 'composed' | 'treemap' | 'sankey';

interface MarkdownVisualizerProps {
  content: string;
  enhanceVisuals?: boolean;
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    highlight?: string;
    background?: string;
    logoUrl?: string; // URL to the custom brand logo
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

// Default brand colors - used for fallbacks in PDF rendering
const DEFAULT_BRAND_COLORS = {
  primary: '#ae5630',
  secondary: '#232321',
  accent: '#9d4e2c',
  highlight: '#9d4e2c',
  background: '#ffffff'
};

// Default fonts - used for fallbacks in PDF rendering
const DEFAULT_FONTS = {
  headingFont: 'Comfortaa, sans-serif',
  bodyFont: 'Questrial, sans-serif'
};

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
  let processedContent = content;
  
  if (enhanceVisuals) {
    try {
      // First, try to detect and wrap any standalone JSON blocks in the content
      // Look for JSON-like patterns that aren't already in code blocks
      processedContent = processedContent.replace(/(\[{.*?}\])/gs, (match) => {
        // Skip if it's already inside a code block
        if (match.includes('```') || match.startsWith('`') || match.endsWith('`')) {
          return match;
        }
        
        // Check if it looks like chart data
        if (match.includes('"name"') && match.includes('"value"')) {
          return '```chart\n' + match + '\n```';
        }
        
        return match;
      });
      
      // Also look for JSON objects with a data property
      processedContent = processedContent.replace(/({.*?"data":\s*\[.*?\].*?})/gs, (match) => {
        // Skip if it's already inside a code block
        if (match.includes('```') || match.startsWith('`') || match.endsWith('`')) {
          return match;
        }
        
        // Check if it looks like chart data
        if (match.includes('"data"') && (match.includes('"name"') || match.includes('"type"'))) {
          return '```chart\n' + match + '\n```';
        }
        
        return match;
      });
      
      // Handle graph diagrams that aren't in code blocks
      processedContent = processedContent.replace(/(graph\s+TB\s+[\s\S]*?[A-Z]\s+-->\s+[A-Z][\s\S]*?)(?=\n\n|\n#|\n\*\*|$)/gs, (match) => {
        // Skip if it's already inside a code block
        if (match.includes('```') || match.startsWith('`') || match.endsWith('`')) {
          return match;
        }
        
        // Wrap it in a mermaid code block
        return '```graph TB\n' + match + '\n```';
      });
      
      // Process the content with the chart enhancer, but catch any errors
      try {
        processedContent = enhanceMarkdownWithCharts(processedContent);
      } catch (error) {
        console.error("Error enhancing markdown with charts:", error);
        // Continue with the original content if enhancement fails
      }
    } catch (error) {
      console.error("Error processing markdown content:", error);
      // Continue with the original content if processing fails
    }
  }
  
  // CSS Custom Properties for styling with fallbacks for PDF export
  const cssVars = {
    '--primary-color': brandColors.primary || DEFAULT_BRAND_COLORS.primary,
    '--secondary-color': brandColors.secondary || DEFAULT_BRAND_COLORS.secondary,
    '--accent-color': brandColors.accent || DEFAULT_BRAND_COLORS.accent,
    '--highlight-color': brandColors.highlight || DEFAULT_BRAND_COLORS.highlight,
    '--background-color': brandColors.background || DEFAULT_BRAND_COLORS.background,
    '--heading-font': fonts.headingFont || DEFAULT_FONTS.headingFont,
    '--body-font': fonts.bodyFont || DEFAULT_FONTS.bodyFont,
  } as React.CSSProperties;
  
  // Configure custom renderers for ReactMarkdown
  const customComponents: Components = {
    // Handle images specially - especially for logo rendering
    img: ({ node, src, alt, ...props }) => {
      // Replace logo placeholder with the actual brand logo if available
      if (src === '/logo-placeholder.svg' || src === 'logo-placeholder.svg' || alt === 'Logo') {
        // Check if we're in a pitch deck context with a custom logo
        if (brandColors.logoUrl) {
          // Return the custom logo with appropriate styling
          return (
            <img 
              src={brandColors.logoUrl} 
              alt="Company Logo" 
              style={{ 
                maxWidth: '250px', 
                maxHeight: '120px',
                margin: '0 auto',
                display: 'block'
              }} 
              {...props} 
            />
          );
        } else {
          // No logo uploaded, don't show any placeholder
          return (
            <span style={{display: 'none'}}></span> // Empty span to avoid breaking layout but not show placeholder
          );
        }
      }
      
      // Regular image handling
      return <img src={src} alt={alt} {...props} />;
    },
    
    // Headers with customized styling
    h1: ({ node, ...props }) => (
      <h1 
        style={{ 
          fontFamily: fonts.headingFont || DEFAULT_FONTS.headingFont, 
          color: brandColors.primary || DEFAULT_BRAND_COLORS.primary,
          fontSize: '2rem',
          marginTop: '1.5rem',
          marginBottom: '1rem',
          borderBottom: `1px solid ${brandColors.primary || DEFAULT_BRAND_COLORS.primary}20`
        }} 
        {...props} 
      />
    ),
    h2: ({ node, ...props }) => (
      <h2 
        style={{ 
          fontFamily: fonts.headingFont || DEFAULT_FONTS.headingFont, 
          color: brandColors.secondary || DEFAULT_BRAND_COLORS.secondary,
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
          fontFamily: fonts.headingFont || DEFAULT_FONTS.headingFont, 
          color: brandColors.secondary || DEFAULT_BRAND_COLORS.secondary,
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
          fontFamily: fonts.headingFont || DEFAULT_FONTS.headingFont,
          color: brandColors.accent || DEFAULT_BRAND_COLORS.accent,
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
          fontFamily: fonts.bodyFont || DEFAULT_FONTS.bodyFont, 
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
          color: brandColors.primary || DEFAULT_BRAND_COLORS.primary,
          fontWeight: 600
        }} 
        {...props} 
      />
    ),
    em: ({ node, ...props }) => (
      <em 
        style={{ 
          color: brandColors.secondary || DEFAULT_BRAND_COLORS.secondary 
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
          fontFamily: fonts.bodyFont || DEFAULT_FONTS.bodyFont,
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
            border: `1px solid ${brandColors.primary || DEFAULT_BRAND_COLORS.primary}30`,
            fontSize: '0.9rem'
          }} 
          {...props} 
        />
      </div>
    ),
    thead: ({ node, ...props }) => (
      <thead 
        style={{ 
          backgroundColor: `${brandColors.primary || DEFAULT_BRAND_COLORS.primary}15`,
          fontFamily: fonts.headingFont || DEFAULT_FONTS.headingFont,
          fontWeight: 600
        }} 
        {...props} 
      />
    ),
    th: ({ node, ...props }) => (
      <th 
        style={{ 
          padding: '0.75rem',
          borderBottom: `2px solid ${brandColors.primary || DEFAULT_BRAND_COLORS.primary}30`,
          textAlign: 'left',
          color: brandColors.primary || DEFAULT_BRAND_COLORS.primary
        }} 
        {...props} 
      />
    ),
    td: ({ node, ...props }) => (
      <td 
        style={{ 
          padding: '0.75rem',
          borderBottom: `1px solid ${brandColors.primary || DEFAULT_BRAND_COLORS.primary}20`,
          borderRight: `1px solid ${brandColors.primary || DEFAULT_BRAND_COLORS.primary}10`
        }} 
        {...props} 
      />
    ),
    tr: ({ node, ...props }) => {
      return (
        <tr
          {...props}
        />
      );
    },
    // Links
    a: ({ node, ...props }) => (
      <a 
        style={{ 
          color: brandColors.accent || DEFAULT_BRAND_COLORS.accent,
          textDecoration: 'none',
          borderBottom: `1px dotted ${brandColors.accent || DEFAULT_BRAND_COLORS.accent}` 
        }} 
        {...props} 
      />
    ),
    // Code blocks and chart rendering
    code: ({ node, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const codeContent = String(children).replace(/\n$/, '');
      
      // Improved handling for chart and graph code blocks
      if ((match && (match[1] === 'chart' || match[1] === 'json' || match[1] === 'graph') && options.showCharts) || 
          (!match && codeContent.includes('"name"') && codeContent.includes('"value"') && options.showCharts) ||
          (!match && codeContent.includes('[{') && codeContent.includes('}]') && options.showCharts)) {
        
        // If this is a Mermaid graph TB diagram
        if (match && match[1] === 'graph' || (codeContent.trim().startsWith('graph TB') || codeContent.trim().startsWith('graph TD'))) {
          return (
            <div className="diagram-container p-4 border rounded my-4" style={{ 
              backgroundColor: '#f9f9f9',
              borderColor: `${brandColors.primary || DEFAULT_BRAND_COLORS.primary}30`
            }}>
              <div className="text-center mb-3 font-semibold" style={{ 
                color: brandColors.primary || DEFAULT_BRAND_COLORS.primary,
                borderBottom: `1px solid ${brandColors.primary || DEFAULT_BRAND_COLORS.primary}30`,
                paddingBottom: '8px'
              }}>
                Business Model Diagram
              </div>
              <div className="diagram-content p-4 border rounded bg-white" style={{ 
                fontFamily: 'monospace',
                fontSize: '13px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                textAlign: 'left',
                overflow: 'auto'
              }}>
                {codeContent}
              </div>
            </div>
          );
        }
        
        // For regular chart data, try to render with chart renderer
        console.log("MarkdownVisualizer: Processing chart code block");
        try {
          // Try to parse chart data safely with error handling
          let safeData = [];
          // Define the chart type with proper typing
          let chartType: ChartType = 'bar';
          let chartLayout;
          let chartStacked = false;
          let chartOptions = {
            animation: options.animateCharts,
            aspectRatio: options.chartHeight ? options.chartHeight / 300 : 1,
            showValues: true,
            showGrid: true,
            showLegend: true,
            width: 600,
            height: options.chartHeight || 350
          };
          
          try {
            // Enhanced cleaning function for chart data
            const cleanChartData = (content: string): string => {
              let cleaned = content.trim();
              
              // Handle nested code blocks by finding the outermost JSON object
              const jsonPattern = /\{[\s\S]*\}/;
              const jsonMatch = cleaned.match(jsonPattern);
              if (jsonMatch && jsonMatch[0]) {
                cleaned = jsonMatch[0];
              } else {
                // If no JSON object found, try standard cleaning
                // 1. Remove opening fence with language
                cleaned = cleaned.replace(/^```(?:chart|json|graph)?[ \t]*\r?\n?/, '');
                // 2. Remove any backticks at the beginning of the string
                cleaned = cleaned.replace(/^`+/, '');
                // 3. Remove closing fence
                cleaned = cleaned.replace(/\r?\n?```$/, '');
                // 4. Remove any trailing backticks
                cleaned = cleaned.replace(/`+$/, '');
                // 5. Remove any nested markdown code blocks
                cleaned = cleaned.replace(/```(?:json|chart|graph)?[\s\S]*?```/g, '');
                // 6. Remove any remaining backticks
                cleaned = cleaned.replace(/`/g, '');
              }
              
              // Final trim to clean whitespace
              return cleaned.trim();
            };
            
            // Clean the data before parsing
            const jsonString = cleanChartData(codeContent);
            console.log("Cleaned chart data:", jsonString.substring(0, 50) + "...");
            
            // Parse the cleaned JSON string with error handling
            let parsedData;
            try {
              parsedData = JSON.parse(jsonString);
            } catch (parseError) {
              console.error("JSON parse error:", parseError);
              throw parseError; // Re-throw to be caught by the outer try-catch
            }
            
            if (parsedData && typeof parsedData === 'object') {
              // If it has a data property and type, it's enhanced format
              if (parsedData.data && Array.isArray(parsedData.data) && parsedData.type) {
                safeData = parsedData.data;
                // Ensure type is one of the valid chart types
                if (['bar', 'line', 'area', 'scatter', 'radar', 'pie', 'radialBar', 'composed', 'treemap', 'sankey'].includes(parsedData.type)) {
                  chartType = parsedData.type as ChartType;
                }
                chartLayout = parsedData.layout;
                chartStacked = parsedData.stacked;
                chartOptions = { ...chartOptions, ...(parsedData.options || {}) };
              } 
              // Simple array of objects with name/value
              else if (Array.isArray(parsedData) && parsedData.length > 0) {
                safeData = parsedData;
                // Auto-detect chart type
                const keys = Object.keys(safeData[0]).filter(k => k !== 'name' && k !== 'color');
                
                // Check if data looks like time series
                const isTimeSeries = typeof safeData[0].name === 'string' && 
                  /^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}|^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/.test(safeData[0].name);
                
                // Set chart type with proper typing
                if (keys.includes('x') && keys.includes('y')) {
                  chartType = 'scatter';
                } else if (isTimeSeries || keys.length > 2) {
                  chartType = 'line';
                } else if (keys.length >= 4 && safeData.length <= 8) {
                  chartType = 'radar';
                } else {
                  chartType = 'bar';
                }
              }
            }
          } catch (parseError) {
            console.error("Failed to parse chart data:", parseError);
            // Use fallback data
            safeData = [
              { name: "Error", value: 100 },
              { name: "Please check format", value: 50 }
            ];
          }
          
          // Apply brand colors with fallbacks for PDF export
          const enhancedColors = {
            primary: brandColors.primary || DEFAULT_BRAND_COLORS.primary,
            secondary: brandColors.secondary || DEFAULT_BRAND_COLORS.secondary,
            accent: brandColors.accent || DEFAULT_BRAND_COLORS.accent,
            highlight: brandColors.highlight || DEFAULT_BRAND_COLORS.highlight,
            background: brandColors.background || DEFAULT_BRAND_COLORS.background
          };
          
          return (
            <div className="chart-container" style={{
              margin: '20px 0',
              padding: '10px',
              backgroundColor: '#f9f9f9',
              borderRadius: '6px',
              border: `1px solid ${enhancedColors.primary}20`
            }}>
              <ChartRenderer 
                data={safeData}
                type={chartType}
                layout={chartLayout}
                stacked={chartStacked}
                colors={enhancedColors}
                fonts={{
                  headingFont: fonts.headingFont || DEFAULT_FONTS.headingFont,
                  bodyFont: fonts.bodyFont || DEFAULT_FONTS.bodyFont
                }}
                options={chartOptions}
              />
            </div>
          );
        } catch (error) {
          console.error("Chart renderer error:", error);
          
          // Create a fallback display for chart data
          return (
            <div className="chart-error-container p-4 border rounded my-4" style={{ backgroundColor: '#f8f9fa' }}>
              <div className="text-center mb-2 font-semibold" style={{ color: brandColors.primary || DEFAULT_BRAND_COLORS.primary }}>
                Chart Data
              </div>
              <div className="chart-content p-4 border rounded bg-white" style={{ 
                fontFamily: 'monospace',
                fontSize: '13px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                textAlign: 'left',
                overflow: 'auto'
              }}>
                {codeContent}
              </div>
            </div>
          );
        }
      }
      
      // Enhanced handling for diagram code blocks
      if (match && match[1] === 'diagram' && options.showDiagrams) {
        return (
          <div className="diagram-container p-4 border rounded my-4" style={{ 
            backgroundColor: '#f9f9f9',
            borderColor: `${brandColors.primary || DEFAULT_BRAND_COLORS.primary}30`
          }}>
            <div className="text-center mb-3 font-semibold" style={{ 
              color: brandColors.primary || DEFAULT_BRAND_COLORS.primary,
              borderBottom: `1px solid ${brandColors.primary || DEFAULT_BRAND_COLORS.primary}30`,
              paddingBottom: '8px'
            }}>
              Diagram
            </div>
            <div className="diagram-content p-4 border rounded bg-white" style={{ 
              fontFamily: 'monospace',
              fontSize: '13px',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              textAlign: 'left',
              overflow: 'auto'
            }}>
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
            border: `1px solid ${brandColors.primary || DEFAULT_BRAND_COLORS.primary}20`
          }}>
            <code className={className} {...props}>{children}</code>
          </pre>
        );
      }
      
      // Inline code
      return (
        <code 
          style={{ 
            backgroundColor: `${brandColors.primary || DEFAULT_BRAND_COLORS.primary}10`,
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
          borderLeft: `4px solid ${brandColors.accent || DEFAULT_BRAND_COLORS.accent}`,
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
          backgroundColor: `${brandColors.primary || DEFAULT_BRAND_COLORS.primary}30`,
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
