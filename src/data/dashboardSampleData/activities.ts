import { ActivityType } from '@/components/dashboard/RecentActivity'; // Assuming type is exported

// Define the interfaces based on the component props
interface ActivityItem {
  id: string;
  type: ActivityType;
  timestamp: string;
  title?: string;
  amount?: string;
}

export const recentActivities: ActivityItem[] = [
  { id: 'act1', type: 'project_created' as ActivityType, title: 'New Project Created', timestamp: new Date().toISOString() },
  { id: 'act2', type: 'template_used' as ActivityType, title: 'Character Template', timestamp: new Date().toISOString() },
  { id: 'act3', type: 'tokens_purchased' as ActivityType, amount: '1000 tokens', timestamp: new Date().toISOString() },
  { id: 'act4', type: 'team_joined' as ActivityType, title: 'Writing Team', timestamp: new Date().toISOString() },
  { id: 'act5', type: 'project_created' as ActivityType, title: 'Sci-Fi Story Outline', timestamp: new Date(Date.now() - 86400000).toISOString() }
];