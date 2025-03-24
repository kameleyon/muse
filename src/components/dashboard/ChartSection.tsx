import React from 'react';

interface ChartSectionProps {
  viewType: 'month' | 'week' | 'year';
}

const ChartSection: React.FC<ChartSectionProps> = ({ viewType }) => {
  // Sample data for the charts
  const getContentData = () => {
    switch (viewType) {
      case 'week':
        return [
          { name: 'Mon', value: 2 },
          { name: 'Tue', value: 3 },
          { name: 'Wed', value: 1 },
          { name: 'Thu', value: 4 },
          { name: 'Fri', value: 3 },
          { name: 'Sat', value: 0 },
          { name: 'Sun', value: 1 },
        ];
      case 'year':
        return [
          { name: 'Jan', value: 4 },
          { name: 'Feb', value: 3 },
          { name: 'Mar', value: 5 },
          { name: 'Apr', value: 7 },
          { name: 'May', value: 2 },
          { name: 'Jun', value: 6 },
          { name: 'Jul', value: 8 },
          { name: 'Aug', value: 9 },
          { name: 'Sep', value: 6 },
          { name: 'Oct', value: 4 },
          { name: 'Nov', value: 7 },
          { name: 'Dec', value: 5 },
        ];
      default:
        return [
          { name: 'Jan', value: 4 },
          { name: 'Feb', value: 3 },
          { name: 'Mar', value: 5 },
          { name: 'Apr', value: 7 },
          { name: 'May', value: 2 },
          { name: 'Jun', value: 6 },
          { name: 'Jul', value: 8 },
        ];
    }
  };

  const typeData = [
    { name: 'Blog Posts', value: 8 },
    { name: 'Social Media', value: 15 },
    { name: 'Email', value: 5 },
    { name: 'Scripts', value: 2 },
    { name: 'Stories', value: 4 },
  ];

  const contentData = getContentData();
  const maxValue = Math.max(...contentData.map(item => item.value));
  const maxTypeValue = Math.max(...typeData.map(item => item.value));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Content Creation Over Time Chart */}
      <div className="bg-white/10 rounded-xl p-6 border border-neutral-light/40 shadow-md">
        <h2 className="text-xl font-bold font-heading text-secondary mb-4">Content Creation</h2>
        
        <div className="mt-6">
          <div className="flex items-end space-x-2 h-64 relative mb-4 pb-6 border-b border-neutral-light/40">
            {contentData.map((item, index) => {
              const height = (item.value / maxValue) * 100;
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-primary/80 rounded-t-md transition-all duration-300"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs mt-2 text-neutral-medium rotate-45 absolute -bottom-1">{item.name}</span>
                </div>
              );
            })}
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-neutral-medium">
              <span>{maxValue}</span>
              <span>{Math.round(maxValue / 2)}</span>
              <span>0</span>
            </div>
          </div>
          <div className="flex justify-between mt-8">
            <span className="text-sm text-neutral-medium">Content Created by {viewType}</span>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-sm bg-primary mr-1"></div>
              <span className="text-xs text-neutral-medium">Documents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Types Distribution Chart */}
      <div className="bg-white/10 rounded-xl p-6 border border-neutral-light/40 shadow-md">
        <h2 className="text-xl font-bold font-heading text-secondary mb-4">Content Types</h2>
        
        <div className="mt-6">
          <div className="space-y-4">
            {typeData.map((item, index) => {
              const width = (item.value / maxTypeValue) * 100;
              return (
                <div key={index} className="flex items-center">
                  <span className="w-24 text-sm text-neutral-medium mr-2">{item.name}</span>
                  <div className="flex-1 h-6 bg-neutral-light/30 rounded-md overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-md transition-all duration-300"
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">{item.value}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-sm bg-primary mr-1"></div>
              <span className="text-xs text-neutral-medium">Count</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
