import React, { useMemo, useState, useEffect } from 'react';
import { useTypewriterEffect } from '@/lib/pitchPrompt'; // Import the typewriter effect
import { Card } from '@/components/ui/Card';
import { MarkdownVisualizer } from '@/components/content/visualization/MarkdownVisualizer';
import { generateExampleChartData, recommendChartType } from '@/utils/chartUtils';

// Define Props for GenerationPreview
interface GenerationPreviewProps {
  content?: string;
  templateId?: string;
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
  previewSpeed?: number;
  options?: {
    enhanceVisuals?: boolean;
    showCharts?: boolean; 
    showTables?: boolean;
    showDiagrams?: boolean;
    chartHeight?: number;
    animateCharts?: boolean;
  };
}

const GenerationPreview: React.FC<GenerationPreviewProps> = ({
  content = '',
  templateId = 'default',
  brandColors = {
    primary: '#ae5630',
    secondary: '#232321',
    accent: '#9d4e2c',
    highlight: '#ff7300',
    background: '#ffffff'
  },
  fonts = {
    headingFont: 'Comfortaa, sans-serif',
    bodyFont: 'Questrial, sans-serif'
  },
  previewSpeed = 3,
  options = {
    enhanceVisuals: true,
    showCharts: true,
    showTables: true,
    showDiagrams: true,
    chartHeight: 300,
    animateCharts: true
  }
}) => {
  // Generate placeholder content when empty
  const [placeholderContent, setPlaceholderContent] = useState<string>('');

  // Apply template-specific styling
  const getTemplateStyles = () => {
    return {
      '--primary-color': brandColors.primary,
      '--secondary-color': brandColors.secondary,
      '--accent-color': brandColors.accent,
      '--highlight-color': brandColors.highlight,
      '--background-color': brandColors.background,
      '--heading-font': fonts.headingFont,
      '--body-font': fonts.bodyFont,
    } as React.CSSProperties;
  };

  // Generate example content with chart when no content is provided
  useEffect(() => {
    if (!content) {
      // Generate example chart data
      const chartType = Math.random() > 0.5 ? 'bar' : 'line';
      const chartData = generateExampleChartData(chartType);
      
      setPlaceholderContent(`
# Real-Time Preview

This is a preview of your generated content. Click "Start Content Generation" to begin, or explore the visualization capabilities below.

## Sample Chart
\`\`\`chart
${JSON.stringify(chartData, null, 2)}
\`\`\`

## Features
- **Rich Charts**: Line, bar, pie, area, radar, and more
- **Beautiful Tables**: Automatically styled to match your brand
- **Smart Diagrams**: Visualize processes and relationships
- **Responsive Design**: Looks great on any device
- **Theme Consistency**: Matches your brand identity

Click "Start Content Generation" to create your own content with these visualizations!
      `);
    }
  }, [content]);

  // Apply the typewriter effect with the specified speed
  const displayContent = useTypewriterEffect(content || placeholderContent, previewSpeed);
  
  // Add debugging for chart content
  React.useEffect(() => {
    if (displayContent && displayContent.includes('```chart')) {
      console.log("GenerationPreview: Chart content detected in displayContent");
      const chartBlocks = displayContent.match(/```chart[\s\S]*?```/g);
      if (chartBlocks) {
        console.log(`GenerationPreview: Found ${chartBlocks.length} chart blocks`);
        chartBlocks.forEach((block, index) => {
          console.log(`GenerationPreview: Chart block ${index + 1}:`, block);
        });
      }
    }
  }, [displayContent]);
  
  return (
    <Card className="p-4 border border-neutral-light bg-white shadow-md h-[850px] flex flex-col">
      <h4 className="font-semibold text-neutral-dark mb-4 text-center text-sm flex-shrink-0">
        Real-Time Preview
      </h4>
      <div
        className={`flex-grow overflow-y-auto text-sm text-neutral-dark bg-white/50 p-6 rounded custom-scrollbar template-${templateId} whitespace-pre-wrap`}
        style={{ overflowWrap: 'break-word', ...getTemplateStyles() }}
      >
        {displayContent ? (
          <>
            <MarkdownVisualizer 
              content={displayContent}
              enhanceVisuals={options.enhanceVisuals}
              brandColors={brandColors}
              fonts={fonts}
              options={{
                showCharts: options.showCharts,
                showTables: options.showTables,
                showDiagrams: options.showDiagrams,
                chartHeight: options.chartHeight,
                animateCharts: options.animateCharts
              }}
            />
          </>
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
