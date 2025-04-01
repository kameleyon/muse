import React, { useState } from 'react';
import { ChartRenderer } from '@/components/ChartRenderer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const ChartTest: React.FC = () => {
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'radar'>('bar');
  
  // Sample data for different chart types
  const chartData = {
    bar: [
      { name: 'Category A', value: 400 },
      { name: 'Category B', value: 300 },
      { name: 'Category C', value: 200 },
      { name: 'Category D', value: 278 },
      { name: 'Category E', value: 189 }
    ],
    line: [
      { name: 'Jan', value: 400, trend: 240 },
      { name: 'Feb', value: 300, trend: 139 },
      { name: 'Mar', value: 200, trend: 980 },
      { name: 'Apr', value: 278, trend: 390 },
      { name: 'May', value: 189, trend: 480 },
      { name: 'Jun', value: 239, trend: 380 },
      { name: 'Jul', value: 349, trend: 430 }
    ],
    pie: [
      { name: 'Group A', value: 400 },
      { name: 'Group B', value: 300 },
      { name: 'Group C', value: 300 },
      { name: 'Group D', value: 200 }
    ],
    area: [
      { name: 'Q1', series1: 4000, series2: 2400 },
      { name: 'Q2', series1: 3000, series2: 1398 },
      { name: 'Q3', series1: 2000, series2: 9800 },
      { name: 'Q4', series1: 2780, series2: 3908 }
    ],
    scatter: [
      { x: 100, y: 200, z: 200, name: 'Point A' },
      { x: 120, y: 100, z: 260, name: 'Point B' },
      { x: 170, y: 300, z: 400, name: 'Point C' },
      { x: 140, y: 250, z: 280, name: 'Point D' },
      { x: 150, y: 400, z: 500, name: 'Point E' },
      { x: 110, y: 280, z: 200, name: 'Point F' }
    ],
    radar: [
      { name: 'Metric A', product1: 120, product2: 110, product3: 140 },
      { name: 'Metric B', product1: 98, product2: 130, product3: 100 },
      { name: 'Metric C', product1: 86, product2: 130, product3: 90 },
      { name: 'Metric D', product1: 99, product2: 100, product3: 120 },
      { name: 'Metric E', product1: 85, product2: 90, product3: 130 }
    ]
  };

  // Brand colors for the charts
  const brandColors = {
    primary: '#8884d8',
    secondary: '#82ca9d',
    accent: '#ffc658',
    highlight: '#ff7300',
    background: '#ffffff'
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chart Renderer Test Page</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select Chart Type</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(chartData) as Array<keyof typeof chartData>).map((type) => (
            <Button
              key={type}
              variant={selectedChartType === type ? 'primary' : 'outline'}
              onClick={() => setSelectedChartType(type as any)}
              className="capitalize"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>
      
      <Card className="p-4 mb-8">
        <h2 className="text-xl font-semibold mb-4">Chart Preview</h2>
        <div className="h-[400px] w-full">
          <ChartRenderer
            data={chartData[selectedChartType]}
            type={selectedChartType}
            colors={brandColors}
            options={{
              showValues: true,
              showGrid: true,
              showLegend: true,
              aspectRatio: 1.5,
              animation: true,
              title: `${selectedChartType.charAt(0).toUpperCase() + selectedChartType.slice(1)} Chart Example`,
              subTitle: "Testing chart rendering capabilities"
            }}
          />
        </div>
      </Card>
      
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Chart Data</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[300px] text-sm">
          {JSON.stringify(chartData[selectedChartType], null, 2)}
        </pre>
      </Card>
    </div>
  );
};

export default ChartTest;
