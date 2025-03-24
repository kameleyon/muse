import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

interface StatItem {
  title: string;
  value: number;
  change: string;
  icon: React.ReactNode;
}

interface DashboardStatsProps {
  stats: StatItem[];
  viewType: 'month' | 'week' | 'year';
  onViewTypeChange: (type: 'month' | 'week' | 'year') => void;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  stats, 
  viewType,
  onViewTypeChange
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="bg-neutral-white rounded-lg p-6 border border-neutral-light/40 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold font-heading text-secondary">Statistics</h2>
        <div className="flex gap-2 bg-neutral-light/30 rounded-md p-1">
          <button
            onClick={() => onViewTypeChange('month')}
            className={`px-3 py-1 text-sm rounded-md ${viewType === 'month' ? 'bg-neutral-white text-primary' : 'text-neutral-medium'}`}
          >
            Month
          </button>
          <button
            onClick={() => onViewTypeChange('week')}
            className={`px-3 py-1 text-sm rounded-md ${viewType === 'week' ? 'bg-neutral-white text-primary' : 'text-neutral-medium'}`}
          >
            Week
          </button>
          <button
            onClick={() => onViewTypeChange('year')}
            className={`px-3 py-1 text-sm rounded-md ${viewType === 'year' ? 'bg-neutral-white text-primary' : 'text-neutral-medium'}`}
          >
            Year
          </button>
        </div>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card>
              <div className="p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-md bg-neutral-light/20 mr-4">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-medium mb-1">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold font-heading text-secondary">{stat.value}</h3>
                    <p className="text-xs text-neutral-medium">{stat.change}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DashboardStats;
