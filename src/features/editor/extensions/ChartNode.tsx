import React, { useEffect, useRef, useState } from 'react';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { ChartRenderer } from '@/components/ChartRenderer';
import html2canvas from 'html2canvas';

const ChartNode: React.FC<NodeViewProps> = ({ node }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartImage, setChartImage] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(true);

  // Parse chart data from the node attributes
  const chartData = (() => {
    try {
      return JSON.parse(node.attrs.chartData);
    } catch (e) {
      console.error('Failed to parse chart data:', e);
      return [{ name: 'Error', value: 100 }];
    }
  })();

  const chartType = node.attrs.chartType || 'bar';

  // Convert the chart to an image after it's rendered
  useEffect(() => {
    if (chartRef.current && isRendering) {
      // Small delay to ensure chart is fully rendered
      const timer = setTimeout(() => {
        html2canvas(chartRef.current as HTMLElement, {
          backgroundColor: null,
          scale: 2, // Higher resolution
        }).then(canvas => {
          const dataUrl = canvas.toDataURL('image/png');
          setChartImage(dataUrl);
          setIsRendering(false);
        }).catch(err => {
          console.error('Failed to convert chart to image:', err);
          setIsRendering(false);
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [chartRef, isRendering]);

  // Define brand colors for the chart
  const brandColors = {
    primary: '#8884d8',
    secondary: '#82ca9d',
    accent: '#ffc658',
    highlight: '#ff7300',
  };

  // Define fonts for the chart
  const fonts = {
    headingFont: 'system-ui, sans-serif',
    bodyFont: 'system-ui, sans-serif',
  };

  return (
    <NodeViewWrapper className="chart-node-wrapper">
      {isRendering ? (
        <div ref={chartRef} className="chart-renderer" style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <ChartRenderer
            data={chartData}
            type={chartType}
            colors={brandColors}
            fonts={fonts}
            options={{
              showLegend: true,
              showValues: true,
              animation: false,
            }}
          />
        </div>
      ) : (
        <div className="chart-image-container" style={{ width: '100%', textAlign: 'center' }}>
          {chartImage && (
            <img 
              src={chartImage} 
              alt={`${chartType} chart`} 
              style={{ 
                maxWidth: '100%', 
                height: 'auto',
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }} 
            />
          )}
        </div>
      )}
    </NodeViewWrapper>
  );
};

export default ChartNode;
