import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { FolderOpen, FileText, Users, LucideProps } from 'lucide-react'; // Import icons

// Map string identifiers to icon components
const iconMap: { [key: string]: React.ElementType<LucideProps> } = {
  FolderOpen,
  FileText,
  Users,
};

export interface StatItem {
  title: string;
  value: number;
  change: string;
  icon: string; // String identifier
}

interface DashboardStatsProps {
  stats: StatItem[];
  // Restore the viewType and onViewTypeChange props
  viewType: 'month' | 'week' | 'year';
  onViewTypeChange: (type: 'month' | 'week' | 'year') => void;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  viewType, // Restored props
  onViewTypeChange // Restored props
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

  // Helper function to render the icon
  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    // Define default props for the icons
    const iconProps: LucideProps = { size: 20, color: "#3d3d3a" };
    return IconComponent ? <IconComponent {...iconProps} /> : null; // Render with props
  };

  return (
    <div className=" py-6 ">
      {/* Note: View type buttons are already in Dashboard.tsx, so no need to duplicate them here */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="bg-white/80">
              <div className="p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-xl bg-neutral-light/20 mr-4">
                    {renderIcon(stat.icon)} {/* Render icon dynamically */}
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
