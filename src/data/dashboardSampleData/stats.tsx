import React from 'react';
// Import the StatItem type definition (which now expects icon: string)
import { StatItem } from '@/components/dashboard/DashboardStats';

// No need to import Lucide icons here anymore

export const dashboardStats: StatItem[] = [
  {
    title: 'Total Projects',
    value: 12,
    change: '+2 from last month',
    icon: 'FolderOpen', // Use string identifier
  },
  {
    title: 'Active Projects',
    value: 3,
    change: 'No change',
    icon: 'FileText', // Use string identifier
  },
  {
    title: 'Completed Projects',
    value: 9,
    change: '+1 this week',
    icon: 'FileText', // Use string identifier
  },
  {
    title: 'Team Members',
    value: 5,
    change: '+2 new members',
    icon: 'Users', // Use string identifier
  },
];