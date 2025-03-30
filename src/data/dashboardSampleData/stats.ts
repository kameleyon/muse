// Import the StatItem type definition
import { StatItem } from '@/components/dashboard/DashboardStats';

// Plain TS version without JSX - using string identifiers for icons
export const dashboardStats: StatItem[] = [
  {
    title: 'Total Projects',
    value: 12,
    change: '+2 from last month',
    icon: 'FolderOpen',
  },
  {
    title: 'Active Projects',
    value: 3,
    change: 'No change',
    icon: 'FileText',
  },
  {
    title: 'Completed Projects',
    value: 9,
    change: '+1 this week',
    icon: 'FileText',
  },
  {
    title: 'Team Members',
    value: 5,
    change: '+2 new members',
    icon: 'Users',
  },
];