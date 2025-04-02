import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

interface AnalyticsMetric {
  label: string;
  value: number;
  change: number;
  unit?: string;
}

interface AnalyticsDashboardProps {
  trafficMetrics: AnalyticsMetric[] | null;
  engagementMetrics: AnalyticsMetric[] | null;
  conversionMetrics: AnalyticsMetric[] | null;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  trafficMetrics,
  engagementMetrics,
  conversionMetrics
}) => {
  const [activeTab, setActiveTab] = useState('traffic');
  const [timeRange, setTimeRange] = useState('7d');
  
  // Default metrics if not provided
  const defaultTrafficMetrics: AnalyticsMetric[] = [
    { label: 'Page Views', value: 2547, change: 12.5 },
    { label: 'Unique Visitors', value: 1823, change: 8.3 },
    { label: 'Avg. Session Duration', value: 3.25, change: -2.1, unit: 'min' },
    { label: 'Bounce Rate', value: 42.8, change: -5.3, unit: '%' }
  ];
  
  const defaultEngagementMetrics: AnalyticsMetric[] = [
    { label: 'Social Shares', value: 147, change: 32.4 },
    { label: 'Comments', value: 28, change: 16.7 },
    { label: 'Scroll Depth', value: 68, change: 4.2, unit: '%' },
    { label: 'Click-through Rate', value: 3.4, change: 0.8, unit: '%' }
  ];
  
  const defaultConversionMetrics: AnalyticsMetric[] = [
    { label: 'Newsletter Signups', value: 53, change: 18.9 },
    { label: 'Lead Magnet Downloads', value: 87, change: 22.5 },
    { label: 'Product Page Views', value: 124, change: 15.8 },
    { label: 'Attributed Revenue', value: 1250, change: 35.2, unit: '$' }
  ];
  
  // Use provided metrics or defaults
  const traffic = trafficMetrics || defaultTrafficMetrics;
  const engagement = engagementMetrics || defaultEngagementMetrics;
  const conversion = conversionMetrics || defaultConversionMetrics;
  
  // Get all metrics based on active tab
  const getActiveMetrics = () => {
    switch(activeTab) {
      case 'traffic': return traffic;
      case 'engagement': return engagement;
      case 'conversion': return conversion;
      default: return traffic;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold font-heading text-secondary">Content Analytics</h3>
        
        <div className="flex items-center gap-2">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="conversion">Conversions</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {getActiveMetrics().map((metric, index) => (
              <div 
                key={index}
                className="bg-neutral-light/10 p-3 rounded-md"
              >
                <div className="text-xs text-neutral-muted mb-1">{metric.label}</div>
                <div className="flex justify-between items-baseline">
                  <div className="text-xl font-bold text-primary">
                    {metric.value.toLocaleString()}{metric.unit || ''}
                  </div>
                  <div className={`text-xs font-medium ${
                    metric.change > 0 
                      ? 'text-green-500' 
                      : metric.change < 0 
                      ? 'text-red-500' 
                      : 'text-neutral-muted'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-neutral-dark">Performance Over Time</h4>
              <Select defaultValue="line">
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="aspect-[16/9] bg-neutral-light/10 rounded-md flex items-center justify-center p-6">
              <div className="text-center text-neutral-muted">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm">Performance chart visualization</p>
                <p className="text-xs mt-1">Showing {activeTab} metrics over the selected time period</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-neutral-dark mb-3">
                {activeTab === 'traffic' ? 'Traffic Sources' : 
                 activeTab === 'engagement' ? 'Engagement by Channel' : 
                 'Conversion by Source'}
              </h4>
              <div className="bg-neutral-light/10 rounded-md aspect-square flex items-center justify-center p-6">
                <div className="text-center text-neutral-muted">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  <p className="text-sm">Pie chart visualization</p>
                  <p className="text-xs mt-1">Showing breakdown by source</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-neutral-dark mb-3">
                {activeTab === 'traffic' ? 'Geographic Distribution' : 
                 activeTab === 'engagement' ? 'Content Engagement Heatmap' : 
                 'Conversion Funnel'}
              </h4>
              <div className="bg-neutral-light/10 rounded-md aspect-square flex items-center justify-center p-6">
                <div className="text-center text-neutral-muted">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {activeTab === 'traffic' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : activeTab === 'engagement' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18" />
                    )}
                  </svg>
                  <p className="text-sm">
                    {activeTab === 'traffic' ? 'Map visualization' : 
                     activeTab === 'engagement' ? 'Heatmap visualization' : 
                     'Funnel visualization'}
                  </p>
                  <p className="text-xs mt-1">
                    {activeTab === 'traffic' ? 'Showing visitor locations' : 
                     activeTab === 'engagement' ? 'Showing engagement hotspots' : 
                     'Showing conversion steps'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AnalyticsDashboard;
