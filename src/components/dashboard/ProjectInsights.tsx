import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { FolderOpen, FileText, Users, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { StatItem } from './DashboardStats';

interface ProjectInsightsProps {
  stats: StatItem[];
}

const ProjectInsights: React.FC<ProjectInsightsProps> = ({ stats }) => {
  // Animation variants
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

  // Helper function to get the appropriate icon
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FolderOpen':
        return <FolderOpen size={24} className="text-primary" />;
      case 'FileText':
        return <FileText size={24} className="text-primary" />;
      case 'Users':
        return <Users size={24} className="text-primary" />;
      default:
        return <FileText size={24} className="text-primary" />;
    }
  };

  // Helper function to get trend indicator
  const getTrendIndicator = (change: string) => {
    if (change.includes('+')) {
      return <TrendingUp size={16} className="text-green-500 ml-1" />;
    } else if (change.includes('-')) {
      return <TrendingDown size={16} className="text-red-500 ml-1" />;
    }
    return null;
  };

  // Calculate completion rate (example calculation)
  const completedProjects = stats.find(stat => stat.title === 'Completed Projects')?.value || 0;
  const totalProjects = stats.find(stat => stat.title === 'Total Projects')?.value || 1; // Avoid division by zero
  const completionRate = Math.round((completedProjects / totalProjects) * 100);

  // Create a new stat for completion rate
  const completionRateStat = {
    title: 'Completion Rate',
    value: completionRate,
    change: `${completionRate > 50 ? '+' : '-'}${Math.abs(completionRate - 50)}% from average`,
    icon: 'CheckCircle',
  };

  // Create a new array with the original stats plus the completion rate
  const enhancedStats = [
    stats.find(stat => stat.title === 'Active Projects') || stats[0],
    completionRateStat,
    stats.find(stat => stat.title === 'Team Members') || stats[3],
    {
      title: 'Content Types',
      value: 4, // This would ideally come from actual data
      change: 'No change',
      icon: 'FileText',
    },
  ];

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow bg-white border border-neutral-light/30 rounded-xl overflow-hidden mb-6">
      <div className="p-4 border-b border-neutral-light/40 bg-gradient-to-r from-primary/10 to-transparent">
        <h2 className="text-xl font-bold font-heading text-secondary mb-0 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Project Insights
        </h2>
      </div>
      
      <div className="p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-4"
        >
          {enhancedStats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card 
                variant="outline" 
                padding="sm" 
                className="bg-gradient-to-br from-white to-neutral-light/10 hover:shadow-md transition-all duration-300 border border-neutral-light/30 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 z-0"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-white shadow-sm border border-neutral-light/30">
                      {stat.icon === 'CheckCircle' ? (
                        <CheckCircle size={24} className="text-primary" />
                      ) : (
                        getIcon(stat.icon)
                      )}
                    </div>
                    <div className="text-right">
                      <h3 className="text-2xl font-bold font-heading text-secondary">
                        {stat.title === 'Completion Rate' ? `${stat.value}%` : stat.value}
                      </h3>
                      <p className="text-sm text-neutral-medium">{stat.title}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-end">
                    <p className="text-xs text-neutral-medium mr-1">{stat.change}</p>
                    {getTrendIndicator(stat.change)}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Card>
  );
};

export default ProjectInsights;
