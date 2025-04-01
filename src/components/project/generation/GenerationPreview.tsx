import React, { useMemo, useState, useEffect } from 'react';
import { useTypewriterEffect } from '@/lib/pitchPrompt'; // Import the typewriter effect
import { Card } from '@/components/ui/Card';
import ReactMarkdown, { Components } from 'react-markdown'; // Import Components type
import remarkGfm from 'remark-gfm';
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
  ResponsiveContainer
} from 'recharts';

/**
 * Chart component that renders chart data from code blocks
 * This directly renders the chart instead of showing the JSON
 */
interface ChartComponentProps {
  data: string | any[];
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}
const ChartComponent: React.FC<ChartComponentProps> = ({ data, brandColors }) => {
  const primaryColor = brandColors?.primary || '#ae5630';
  const secondaryColor = brandColors?.secondary || '#232321';
  const accentColor = brandColors?.accent || '#9d4e2c';
  
  try {
    // Clean and parse the data
    const cleanData = typeof data === 'string' 
      ? data.replace(/```chart\s+|```/g, '').trim()
      : JSON.stringify(data);
      
    let chartData = JSON.parse(cleanData);
    
    if (!Array.isArray(chartData)) {
      throw new Error("Chart data must be an array");
    }
    
    // Get all the keys except 'name' to determine data series
    const keys = Object.keys(chartData[0] || {}).filter(k => k !== 'name');
    
    // Determine the chart type based on the data structure
    let chartType = 'bar'; // Default
    
    // If there's only one data key and it has 'value' in the name, use pie chart
    if (keys.length === 1 && keys[0] === 'value') {
      chartType = 'pie';
    }
    // If there are multiple data series, use a line chart 
    else if (keys.length > 1) {
      chartType = 'line';
    }
    
    // Render the appropriate chart based on the detected type
    switch (chartType) {
      case 'pie':
        return (
          <div className="chart-container my-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill={primaryColor}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'line':
        return (
          <div className="chart-container my-4">
            <ResponsiveContainer width="100%" height={300}>
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
            </ResponsiveContainer>
          </div>
        );
        
      case 'bar':
      default:
        return (
          <div className="chart-container my-4">
            <ResponsiveContainer width="100%" height={300}>
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
            </ResponsiveContainer>
          </div>
        );
    }
  } catch (error: unknown) { // Type error as unknown
    const errorMessage = error instanceof Error ? error.message : String(error); // Check type
    console.error("Error rendering chart:", errorMessage, "Data:", data);
    return (
      <div className="chart-error p-3 my-4 border border-red-300 rounded bg-red-50">
        <p className="font-medium text-red-700">Chart rendering error</p>
        <p className="text-sm text-red-600">{errorMessage}</p> {/* Use checked message */}
      </div>
    );
  }
};

// Define Props for GenerationPreview
interface GenerationPreviewProps {
  content?: string;
  templateId?: string;
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  fonts?: {
    headingFont?: string;
    bodyFont?: string;
  };
}

const GenerationPreview: React.FC<GenerationPreviewProps> = ({
  content = '',
  templateId = 'default',
  brandColors = {
    primary: '#ae5630',
    secondary: '#232321',
    accent: '#9d4e2c'
  },
  fonts = {
    headingFont: 'Comfortaa, sans-serif',
    bodyFont: 'Questrial, sans-serif'
  }
}) => {
  // Apply template-specific styling
  const getTemplateStyles = () => {
    return {
      '--primary-color': brandColors.primary,
      '--secondary-color': brandColors.secondary,
      '--accent-color': brandColors.accent,
      '--heading-font': fonts.headingFont,
      '--body-font': fonts.bodyFont,
    } as React.CSSProperties;
  };

  // Custom components for markdown rendering with template styles
  // Use imported Components type
  const markdownComponents: Components = useMemo(() => ({
    // Ensure 'node' is optional in all overrides
    h1: ({ node, ...props }: { node?: any; [key: string]: any }) => <h1 style={{ fontFamily: fonts.headingFont, color: brandColors.primary, fontSize: '1.8rem', paddingBottom: '0.5rem', marginTop: '2rem', marginBottom: '1.5rem' }} {...props} />,
    h2: ({ node, ...props }: { node?: any; [key: string]: any }) => <h2 style={{ fontFamily: fonts.headingFont, color: brandColors.secondary, fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1.5rem' }} {...props} />,
    h3: ({ node, ...props }: { node?: any; [key: string]: any }) => <h3 style={{ fontFamily: fonts.headingFont, color: brandColors.secondary, fontSize: '1.25rem', marginTop: '1.25rem', marginBottom: '0.5rem' }} {...props} />,
    p: ({ node, ...props }: { node?: any; [key: string]: any }) => <p style={{ fontFamily: fonts.bodyFont, marginBottom: '0.75rem', lineHeight: '1.6', fontSize: '0.95rem' }} {...props} />,
    ul: ({ node, ...props }: { node?: any; [key: string]: any }) => <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }} {...props} />,
    li: ({ node, ...props }: { node?: any; [key: string]: any }) => <li style={{ fontFamily: fonts.bodyFont, marginBottom: '0.25rem', fontSize: '0.95rem' }} {...props} />,
    // Make node optional in 'a' tag override as well
    a: ({ node, ...props }: { node?: any } & React.ComponentPropsWithoutRef<'a'>) => <a style={{ color: brandColors.accent, textDecoration: 'none' }} {...props} />,

    // Enhanced code block handling with chart rendering
    code: ({ node, className, children, ...props }: { node?: any; className?: string; children?: React.ReactNode; [key: string]: any }) => {
      const match = /language-(\w+)/.exec(className || '');
      const codeContent = String(children).replace(/\n$/, '');

      // If it's a chart code block, render the chart
      if (match && match[1] === 'chart') {
        // Pass optional props safely
        return <ChartComponent data={codeContent} brandColors={brandColors ?? {}} />;
      }

      // For other code blocks, render normally
      return <code className={className} {...props}>{children}</code>;
    },

    // Handle pre blocks
    pre: ({ node, children, ...props }: { node?: any; children?: React.ReactNode; [key: string]: any }) => {
      // Check if the child is a chart code element
      const isChartBlock = React.Children.toArray(children).some((child: React.ReactNode) => {
        if (React.isValidElement(child)) {
          const className = child.props.className || '';
          return className.includes('language-chart');
        }
        return false;
      });

      // If this is a chart block, don't render the pre wrapper
      if (isChartBlock) {
        return <>{children}</>;
      }

      // Otherwise render normally
      return <pre style={{ backgroundColor: '#f7f7f7', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.85rem', fontFamily: 'monospace', marginBottom: '1rem' }} {...props}>{children}</pre>;
    }

  }), [brandColors, fonts]);

  // Apply the typewriter effect with a faster speed for demos
  const displayContent = useTypewriterEffect(content, 3);
  
  return (
    <Card className="p-4 border border-neutral-light bg-white shadow-md h-[850px] flex flex-col">
      <h4 className="font-semibold text-neutral-dark mb-4 text-center text-sm flex-shrink-0">
        Real-Time Preview
      </h4>
      <div
        className={`flex-grow overflow-y-auto text-sm text-neutral-dark bg-white/50 p-4 rounded custom-scrollbar template-${templateId} whitespace-pre-wrap`}
        style={{ overflowWrap: 'break-word', ...getTemplateStyles() }}
      >
        {content ? (
          <ReactMarkdown
             remarkPlugins={[remarkGfm]}
             components={markdownComponents}
           >
             {displayContent}
           </ReactMarkdown>
        ) : (
          <p className="text-neutral-medium italic text-center mt-10">
            Click "Start Content Generation" to begin...
          </p>
        )}
      </div>
    </Card>
  );
};

export default GenerationPreview;
