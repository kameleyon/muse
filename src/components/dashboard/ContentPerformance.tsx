import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, TrendingUp, BarChart2, PieChart as PieChartIcon, Filter } from 'lucide-react';

interface ContentPerformanceProps {
  monthlyData: Array<{ name: string; documents: number; edits: number }>;
  weeklyData: Array<{ name: string; documents: number; edits: number }>;
  contentTypeData: Array<{ name: string; value: number }>;
  chartColors: string[];
}

const ContentPerformance: React.FC<ContentPerformanceProps> = ({
  monthlyData,
  weeklyData,
  contentTypeData,
  chartColors
}) => {
  const [viewType, setViewType] = useState<'month' | 'week' | 'year'>('month');
  const [chartType, setChartType] = useState<'area' | 'bar' | 'pie'>('area');

  // Get the appropriate data based on the view type
  const getChartData = () => {
    return viewType === 'week' ? weeklyData : monthlyData;
  };

  // Render the appropriate chart based on the chart type
  const renderChart = () => {
    const data = getChartData();

    switch (chartType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorDocuments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ae5630" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ae5630" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorEdits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6d371f" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6d371f" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#bcb7af" opacity={0.3} />
              <XAxis dataKey="name" stroke="#3d3d3a" />
              <YAxis stroke="#3d3d3a" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#faf9f5', 
                  borderColor: '#bcb7af',
                  borderRadius: '0.375rem'
                }} 
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="documents" 
                stroke="#ae5630" 
                fillOpacity={1} 
                fill="url(#colorDocuments)" 
                name="Documents"
              />
              <Area 
                type="monotone" 
                dataKey="edits" 
                stroke="#6d371f" 
                fillOpacity={1} 
                fill="url(#colorEdits)" 
                name="Edits"
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#bcb7af" opacity={0.3} />
              <XAxis dataKey="name" stroke="#3d3d3a" />
              <YAxis stroke="#3d3d3a" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#faf9f5', 
                  borderColor: '#bcb7af',
                  borderRadius: '0.375rem'
                }} 
              />
              <Legend />
              <Bar dataKey="documents" name="Documents" fill="#ae5630" radius={[4, 4, 0, 0]} />
              <Bar dataKey="edits" name="Edits" fill="#6d371f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={contentTypeData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {contentTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#faf9f5',
                  borderColor: '#bcb7af',
                  borderRadius: '0.375rem'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow bg-white border border-neutral-light/30 rounded-xl overflow-hidden mb-6">
      <CardHeader className="border-b border-neutral-light/40 pb-4">
        <div className="bg-gradient-to-r from-primary/10 to-transparent rounded-xl p-2">
          <CardTitle className="text-xl font-bold font-heading text-secondary flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-primary" />
            Content Performance
          </CardTitle>
        </div>
        <div className="flex justify-end mt-2">
          <div className="flex space-x-4">
            <div className="flex space-x-2">
              <button 
                onClick={() => setChartType('area')}
                className={`p-1 rounded-full focus:outline-none`}
              >
                <TrendingUp size={20} className={chartType === 'area' ? 'text-primary' : 'text-neutral-medium'} />
              </button>
              <button 
                onClick={() => setChartType('bar')}
                className={`p-1 rounded-full focus:outline-none`}
              >
                <BarChart2 size={20} className={chartType === 'bar' ? 'text-primary' : 'text-neutral-medium'} />
              </button>
              <button 
                onClick={() => setChartType('pie')}
                className={`p-1 rounded-full focus:outline-none`}
              >
                <PieChartIcon size={20} className={chartType === 'pie' ? 'text-primary' : 'text-neutral-medium'} />
              </button>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setViewType('month')}
                className={`p-1 rounded-full focus:outline-none`}
              >
                <Calendar size={20} className={viewType === 'month' ? 'text-primary' : 'text-neutral-medium'} />
              </button>
              <button 
                onClick={() => setViewType('week')}
                className={`p-1 rounded-full focus:outline-none`}
              >
                <Clock size={20} className={viewType === 'week' ? 'text-primary' : 'text-neutral-medium'} />
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="bg-gradient-to-br from-white to-neutral-light/10 rounded-xl p-4 border border-neutral-light/30 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 z-0"></div>
          <div className="relative z-10">
            {renderChart()}
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-neutral-medium flex items-center">
            <div className="p-1 rounded-full bg-white shadow-sm border border-neutral-light/30 mr-2">
              <Clock className="h-3 w-3 text-primary" />
            </div>
            {viewType === 'week' ? 'Weekly' : 'Monthly'} content creation activity
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="border border-neutral-light/30 hover:bg-primary/5 flex items-center gap-1"
          >
            <Filter size={14} />
            Filter Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentPerformance;
