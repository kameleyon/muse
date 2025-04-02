import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { useTypewriterEffect } from '@/lib/pitchPrompt';
import { MarkdownVisualizer } from '@/components/content/visualization/MarkdownVisualizer';
import { generateExampleChartData, recommendChartType } from '@/utils/chartUtils';

interface GeneratePreviewProps {
  content?: string;
  previewSpeed?: number;
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
  options?: {
    enhanceVisuals?: boolean;
    showTypewriterEffect?: boolean;
    showCharts?: boolean;
    showTables?: boolean;
    showDiagrams?: boolean;
    chartHeight?: number;
    animateCharts?: boolean;
  };
}

/**
 * Enhanced GeneratePreview component with advanced visualization capabilities
 * Provides real-time preview of content with visual elements like charts and diagrams
 */
const GeneratePreview: React.FC<GeneratePreviewProps> = ({
  content = '',
  previewSpeed = 5,
  templateId = 'default',
  brandColors = {
    primary: '#ae5630',
    secondary: '#232321',
    accent: '#9d4e2c',
    highlight: '#e67e22',
    background: '#ffffff'
  },
  fonts = {
    headingFont: 'Comfortaa, sans-serif',
    bodyFont: 'Questrial, sans-serif'
  },
  options = {
    enhanceVisuals: true,
    showTypewriterEffect: true,
    showCharts: true,
    showTables: true,
    showDiagrams: true,
    chartHeight: 300,
    animateCharts: true
  }
}) => {
  // Apply typewriter effect if requested
  const displayedContent = options.showTypewriterEffect 
    ? useTypewriterEffect(content, previewSpeed) 
    : content;

  // Generate placeholder content when empty
  const [placeholderContent, setPlaceholderContent] = useState<string>('');

  // Generate placeholder content with chart example when no content is provided
  useEffect(() => {
    if (!content) {
      // Generate example chart data
      const chartType = Math.random() > 0.5 ? 'bar' : 'line';
      const chartData = generateExampleChartData(chartType);
      
      setPlaceholderContent(`
# Real-Time Preview

This is a preview of your generated content. Click "Start Content Generation" to begin, or explore the visualization capabilities below.

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

  // Determine the content to display
  const contentToDisplay = content ? displayedContent : placeholderContent;

  // CSS styles specific to the template
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

  return (
    <Card className="p-4 border border-neutral-light bg-white shadow-md h-[850px] flex flex-col">
      <h4 className="font-semibold text-neutral-dark mb-4 text-center text-sm flex-shrink-0">
        Real-Time Preview
      </h4>
      <div
        className={`flex-grow overflow-y-auto text-sm text-neutral-dark bg-white/50 p-4 rounded custom-scrollbar template-${templateId} whitespace-pre-wrap`}
        style={{ overflowWrap: 'break-word', ...getTemplateStyles() }}
      >
        <MarkdownVisualizer 
          content={contentToDisplay}
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
      </div>
    </Card>
  );
};

export default GeneratePreview;
