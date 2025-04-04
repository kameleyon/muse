// src/features/analytics/components/UsageChart.tsx
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import tailwindConfig from '../../../../tailwind.config.js'; // Adjust path as needed

// Access Tailwind theme colors directly from config
const themeColors = (tailwindConfig?.theme?.colors ?? {}) as any; // Use 'as any' for simplicity, refine type if needed

// Placeholder data (replace with actual data fetching)
const data = [
  { name: 'Jan', usage: 400, limit: 1000 },
  { name: 'Feb', usage: 300, limit: 1000 },
  { name: 'Mar', usage: 500, limit: 1000 },
  { name: 'Apr', usage: 450, limit: 1000 },
  { name: 'May', usage: 600, limit: 1000 },
  { name: 'Jun', usage: 550, limit: 1000 },
];

interface UsageChartProps {
  title?: string;
}

export const UsageChart: React.FC<UsageChartProps> = ({ title = "Monthly Usage" }) => {
  // Extract specific colors from the resolved theme, providing fallbacks
  const primaryColor = themeColors?.primary?.DEFAULT || '#ae5630';
  const secondaryColor = themeColors?.secondary?.DEFAULT || '#232321';
  const neutralMedium = themeColors?.neutral?.medium || '#3d3d3a';
  const neutralLight = themeColors?.neutral?.light || '#edeae2';
  const neutralDark = themeColors?.neutral?.dark || '#30302e';
  const neutralWhite = themeColors?.neutral?.white || '#faf9f5';


  return (
    <div className="usage-chart p-4 bg-neutral-white rounded-lg shadow-card">
      <h3 className="text-lg font-heading font-semibold text-secondary mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={neutralLight} />
          <XAxis dataKey="name" stroke={neutralMedium} fontSize={12} />
          <YAxis stroke={neutralMedium} fontSize={12} />
          <Tooltip
            contentStyle={{
                backgroundColor: neutralDark,
                borderColor: neutralMedium,
                color: neutralWhite,
                borderRadius: '0.375rem', // md
            }}
            itemStyle={{ color: neutralLight }}
            cursor={{ fill: 'rgba(174, 86, 48, 0.1)' }} // Light terracotta fill on hover
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Line
            type="monotone"
            dataKey="usage"
            stroke={primaryColor} // Use primary theme color (terracotta)
            strokeWidth={2}
            activeDot={{ r: 6, fill: primaryColor }}
            dot={{ r: 4, fill: primaryColor }}
            name="Your Usage"
          />
           <Line
            type="monotone"
            dataKey="limit"
            stroke={secondaryColor} // Use secondary theme color (nearly black)
            strokeWidth={1}
            strokeDasharray="5 5"
            activeDot={false}
            dot={false}
            name="Usage Limit"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;
