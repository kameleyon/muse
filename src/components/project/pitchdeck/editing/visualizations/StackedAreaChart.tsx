import React, { useEffect, useRef } from 'react';

interface DataPoint {
  year: string;
  total: number;
  segment1: number;
}

interface StackedAreaChartProps {
  title: string;
  data: DataPoint[];
  xAxisLabel: string;
  yAxisLabel: string;
  cagr: string;
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const StackedAreaChart: React.FC<StackedAreaChartProps> = ({
  title,
  data,
  xAxisLabel,
  yAxisLabel,
  cagr,
  brandColors
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions with device pixel ratio for sharpness
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Chart dimensions
    const width = rect.width;
    const height = rect.height;
    const margin = {
      top: 30,
      right: 20,
      bottom: 50,
      left: 60
    };
    
    // Chart area dimensions
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw title
    ctx.textAlign = 'center';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = brandColors.primary;
    ctx.fillText(title, width / 2, margin.top / 2);
    
    // Get min/max values for scales
    const maxValue = Math.max(...data.map(d => d.total)) * 1.1; // Add 10% padding
    const years = data.map(d => d.year);
    
    // Draw y-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, height - margin.bottom);
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw y-axis ticks and labels
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const y = margin.top + (chartHeight / yTicks) * i;
      const value = maxValue - (maxValue / yTicks) * i;
      
      // Draw tick
      ctx.beginPath();
      ctx.moveTo(margin.left - 5, y);
      ctx.lineTo(margin.left, y);
      ctx.strokeStyle = '#aaa';
      ctx.stroke();
      
      // Draw gridline
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + chartWidth, y);
      ctx.strokeStyle = '#eee';
      ctx.stroke();
      
      // Draw label
      ctx.textAlign = 'right';
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#666';
      ctx.fillText(`$${value.toFixed(0)}B`, margin.left - 8, y + 4);
    }
    
    // Draw x-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, height - margin.bottom);
    ctx.lineTo(margin.left + chartWidth, height - margin.bottom);
    ctx.strokeStyle = '#aaa';
    ctx.stroke();
    
    // Draw x-axis ticks and labels
    const xStep = chartWidth / (years.length - 1);
    years.forEach((year, i) => {
      const x = margin.left + xStep * i;
      
      // Draw tick
      ctx.beginPath();
      ctx.moveTo(x, height - margin.bottom);
      ctx.lineTo(x, height - margin.bottom + 5);
      ctx.strokeStyle = '#aaa';
      ctx.stroke();
      
      // Draw label
      ctx.textAlign = 'center';
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#666';
      ctx.fillText(year, x, height - margin.bottom + 18);
    });
    
    // Draw x-axis label
    ctx.textAlign = 'center';
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#666';
    ctx.fillText(xAxisLabel, width / 2, height - 10);
    
    // Draw y-axis label
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#666';
    ctx.fillText(yAxisLabel, 0, 0);
    ctx.restore();
    
    // Draw total area
    const totalPoints = data.map((d, i) => {
      const x = margin.left + xStep * i;
      const y = margin.top + chartHeight - (d.total / maxValue) * chartHeight;
      return { x, y };
    });
    
    // Draw segment1 area
    const segment1Points = data.map((d, i) => {
      const x = margin.left + xStep * i;
      const y = margin.top + chartHeight - (d.segment1 / maxValue) * chartHeight;
      return { x, y };
    });
    
    // Draw total area
    ctx.beginPath();
    ctx.moveTo(totalPoints[0].x, height - margin.bottom);
    totalPoints.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(totalPoints[totalPoints.length - 1].x, height - margin.bottom);
    ctx.closePath();
    ctx.fillStyle = `${brandColors.primary}40`;
    ctx.fill();
    
    // Draw total line
    ctx.beginPath();
    totalPoints.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.strokeStyle = brandColors.primary;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw segment1 area
    ctx.beginPath();
    ctx.moveTo(segment1Points[0].x, height - margin.bottom);
    segment1Points.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(segment1Points[segment1Points.length - 1].x, height - margin.bottom);
    ctx.closePath();
    ctx.fillStyle = `${brandColors.secondary}50`;
    ctx.fill();
    
    // Draw segment1 line
    ctx.beginPath();
    segment1Points.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.strokeStyle = brandColors.secondary;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add data points to total line
    totalPoints.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = brandColors.primary;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    
    // Add CAGR annotation
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = brandColors.accent;
    ctx.textAlign = 'right';
    ctx.fillText(`CAGR: ${cagr}`, width - margin.right, margin.top + 20);
    
    // Add legend
    const legendX = width - 150;
    const legendY = height - 35;
    
    // Total legend
    ctx.beginPath();
    ctx.rect(legendX, legendY, 12, 12);
    ctx.fillStyle = `${brandColors.primary}40`;
    ctx.fill();
    ctx.strokeStyle = brandColors.primary;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'left';
    ctx.fillText('Overall Market', legendX + 18, legendY + 10);
    
    // Segment legend
    ctx.beginPath();
    ctx.rect(legendX, legendY + 18, 12, 12);
    ctx.fillStyle = `${brandColors.secondary}50`;
    ctx.fill();
    ctx.strokeStyle = brandColors.secondary;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'left';
    ctx.fillText('AI-Powered Learning', legendX + 18, legendY + 28);
    
  }, [data, title, xAxisLabel, yAxisLabel, cagr, brandColors]);
  
  return (
    <div className="stacked-area-chart-container w-full border border-neutral-light rounded-lg overflow-hidden bg-white shadow-sm">
      <canvas 
        ref={canvasRef} 
        className="w-full" 
        style={{ height: '320px' }}
      />
    </div>
  );
};

export default StackedAreaChart;